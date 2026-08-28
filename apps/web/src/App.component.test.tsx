import { releaseManifest } from '@tickdeck/contracts';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { ThemeProvider } from './components/theme-provider';
import { setShellLanguage } from './i18n';

function renderShell() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
}

const healthySnapshot = {
  schemaVersion: '1.0.0',
  code: 'TICKDECK_HEALTHY',
  stage: 'S0-V',
  catalogDigest: releaseManifest.catalogDigest,
  worker: { code: 'WORKER_HEALTHY' },
} as const;

function mockShellFetch(
  health: unknown = healthySnapshot,
  manifest: unknown = releaseManifest,
  healthStatus = 200,
) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: string | URL | Request) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const [body, status] = url.includes('/health') ? [health, healthStatus] : [manifest, 200];
      return Promise.resolve(new Response(JSON.stringify(body), { status }));
    }),
  );
}

beforeEach(async () => {
  document.documentElement.className = '';
  document.documentElement.style.colorScheme = '';
  localStorage.clear();
  await setShellLanguage('zh-CN');
  mockShellFetch();
});

describe('S0-V App Shell', () => {
  it('shows health, capability projection, and no future navigation', async () => {
    const { container } = renderShell();
    const navigation = screen.getByRole('navigation');
    const links = navigation.querySelectorAll('a');
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute('href')).toBe('#runtime-health');
    await screen.findByText('TICKDECK_HEALTHY');
    expect(screen.getByText(/app-shell/u)).toBeTruthy();
    for (const future of ['Agent', '图表', '提醒', '组合', '扩展']) {
      expect(screen.queryByText(future)).toBeNull();
    }
    expect(container.querySelector('[data-state="healthy"]')).toBeTruthy();
  });

  it('renders a valid versioned 503 as structured degraded health', async () => {
    mockShellFetch(
      {
        ...healthySnapshot,
        code: 'TICKDECK_DEGRADED',
        worker: { code: 'WORKER_UNAVAILABLE' },
      },
      releaseManifest,
      503,
    );
    const { container } = renderShell();
    await screen.findByText('TICKDECK_DEGRADED');
    expect(screen.getByText('WORKER_UNAVAILABLE')).toBeTruthy();
    expect(container.querySelector('[data-state="degraded"]')).toBeTruthy();
    expect(screen.queryByText('无法读取健康快照')).toBeNull();
  });

  it.each([
    ['malformed 2xx health', 200, { code: 'TICKDECK_HEALTHY' }, releaseManifest],
    ['503 status/code mismatch', 503, healthySnapshot, releaseManifest],
    [
      'health digest drift',
      200,
      { ...healthySnapshot, catalogDigest: 'sha256:drift' },
      releaseManifest,
    ],
    ['health stage drift', 200, { ...healthySnapshot, stage: 'S1' }, releaseManifest],
    ['manifest schema drift', 200, healthySnapshot, { ...releaseManifest, schemaVersion: '2.0.0' }],
    [
      'manifest digest drift',
      200,
      healthySnapshot,
      { ...releaseManifest, catalogDigest: 'sha256:drift' },
    ],
    [
      'web slice identity drift',
      200,
      healthySnapshot,
      {
        ...releaseManifest,
        slices: {
          ...releaseManifest.slices,
          web: { ...releaseManifest.slices.web, name: 'server' },
        },
      },
    ],
    [
      'web surface drift',
      200,
      healthySnapshot,
      {
        ...releaseManifest,
        slices: {
          ...releaseManifest.slices,
          web: { ...releaseManifest.slices.web, surfaceIds: ['app-shell'] },
        },
      },
    ],
  ])('fails closed without crashing React for %s', async (_label, status, health, manifest) => {
    mockShellFetch(health, manifest, status);
    renderShell();
    expect(await screen.findByText('无法读取健康快照')).toBeTruthy();
    expect(screen.getAllByText('无法验证')).toHaveLength(2);
    expect(screen.queryByText('TICKDECK_HEALTHY')).toBeNull();
  });

  it('fails closed when a 2xx or 503 response body is not readable JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string | URL | Request) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        return Promise.resolve(
          url.includes('/health')
            ? new Response('{not-json', { status: 503 })
            : new Response(JSON.stringify(releaseManifest), { status: 200 }),
        );
      }),
    );
    renderShell();
    expect(await screen.findByText('无法读取健康快照')).toBeTruthy();
    expect(screen.queryByText('TICKDECK_DEGRADED')).toBeNull();
  });

  it('supports light, dark, and live system theme states with keyboard radio semantics', async () => {
    let systemDark = false;
    let systemListener: (() => void) | undefined;
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return systemDark;
        },
        media: query,
        onchange: null,
        addEventListener: vi.fn((_event: string, listener: () => void) => {
          systemListener = listener;
        }),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    renderShell();
    const light = screen.getByRole('radio', { name: '浅色' });
    const dark = screen.getByRole('radio', { name: '深色' });
    const system = screen.getByRole('radio', { name: '跟随系统' });
    expect(system.getAttribute('aria-checked') ?? (system as HTMLInputElement).checked).toBe(true);
    await waitFor(() => expect(document.documentElement.classList.contains('light')).toBe(true));

    dark.focus();
    fireEvent.keyDown(dark, { code: 'Space', key: ' ' });
    dark.click();
    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true));
    expect(localStorage.getItem('tickdeck.theme-preference.v1')).toBe('dark');

    light.click();
    await waitFor(() => expect(document.documentElement.classList.contains('light')).toBe(true));
    system.click();
    expect(localStorage.getItem('tickdeck.theme-preference.v1')).toBe('system');
    expect(systemListener).toBeTypeOf('function');
    systemDark = true;
    act(() => systemListener?.());
    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true));
    expect(localStorage).toHaveLength(1);
  });

  it('keeps an in-memory theme when localStorage get/set throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    renderShell();
    screen.getByRole('radio', { name: '深色' }).click();
    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true));
  });

  it('projects English and pseudo-long language states into content and document lang', async () => {
    renderShell();
    await act(async () => {
      await setShellLanguage('en-US');
    });
    expect(await screen.findByRole('heading', { name: 'Runtime & Health' })).toBeTruthy();
    expect(screen.getByText('Release Manifest')).toBeTruthy();
    expect(document.documentElement.lang).toBe('en-US');

    await act(async () => {
      await setShellLanguage('pseudo-long');
    });
    expect(
      await screen.findByRole('heading', {
        name: '[Rûñţîmë åñđ hëåļţh—ëxţëñđëđ]',
      }),
    ).toBeTruthy();
    expect(screen.getByText('[Rëļëåşë Måñîfëşţ—ëxţëñđëđ]')).toBeTruthy();
    expect(document.documentElement.lang).toBe('pseudo-long');
  });
});
