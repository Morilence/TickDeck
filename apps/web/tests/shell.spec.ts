import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';

async function focusMetrics(page: Page, theme: 'light' | 'dark') {
  await page.getByRole('radio', { name: theme === 'light' ? '浅色' : '深色' }).click();
  await expect(page.locator('html')).toHaveClass(new RegExp(theme, 'u'));
  const target = page.getByRole('radio', { name: theme === 'light' ? '浅色' : '深色' });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(target).toBeFocused();
  return target.evaluate((element) => {
    const style = getComputedStyle(element);
    let backgroundElement: Element | null = element.parentElement;
    let backgroundColor = 'rgba(0, 0, 0, 0)';
    while (backgroundElement) {
      backgroundColor = getComputedStyle(backgroundElement).backgroundColor;
      if (!/^rgba?\(0, 0, 0(?:, 0)?\)$/u.test(backgroundColor)) break;
      backgroundElement = backgroundElement.parentElement;
    }
    const luminance = (color: string) => {
      const oklch = color.match(/^oklch\(([\d.]+)\s+0(?:\.0+)?\s+0/u);
      if (oklch) return Number(oklch[1]) ** 3;
      const rgb = color.match(/^rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/u);
      if (!rgb) throw new Error(`unsupported computed color: ${color}`);
      const channels = rgb.slice(1, 4).map((channel) => {
        const value = Number(channel) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      const coefficients = [0.2126, 0.7152, 0.0722];
      return channels.reduce(
        (total, channel, index) => total + channel * (coefficients[index] ?? 0),
        0,
      );
    };
    const foreground = luminance(style.outlineColor);
    const background = luminance(backgroundColor);
    return {
      backgroundColor,
      contrast:
        (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
      offset: style.outlineOffset,
      outlineColor: style.outlineColor,
      width: style.outlineWidth,
    };
  });
}

async function runBrowserAxe(page: Page) {
  return page.evaluate(async () => {
    const browserAxe = (
      window as unknown as {
        axe: {
          run: (
            context: Document,
            options?: Readonly<Record<string, unknown>>,
          ) => Promise<{
            incomplete: readonly { id: string }[];
            violations: readonly { id: string }[];
          }>;
        };
      }
    ).axe;
    const full = await browserAxe.run(document);
    const contrast = await browserAxe.run(document, {
      runOnly: { type: 'rule', values: ['color-contrast'] },
    });
    return {
      contrastIncomplete: contrast.incomplete.map((item) => item.id),
      contrastViolations: contrast.violations.map((item) => item.id),
      violations: full.violations.map((item) => item.id),
    };
  });
}

test('opens the Fastify same-origin shell and reports authenticated Worker health', async ({
  page,
}) => {
  await page.goto('/?lang=zh-CN');
  await expect(page.getByRole('heading', { name: '运行与健康' })).toBeVisible();
  await expect(page.getByText('TICKDECK_HEALTHY')).toBeVisible();
  const response = await page.request.get('/api/v1/health');
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({
    schemaVersion: '1.0.0',
    worker: { code: 'WORKER_HEALTHY' },
  });
});

test('supports keyboard theme control and never mounts future navigation', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await page.addScriptTag({ content: axe.source });
  for (const theme of ['light', 'dark'] as const) {
    const metrics = await focusMetrics(page, theme);
    expect(metrics.width).toBe('2px');
    expect(metrics.offset).toBe('2px');
    expect(metrics.outlineColor).not.toBe(metrics.backgroundColor);
    expect(metrics.contrast).toBeGreaterThanOrEqual(3);
    const results = await runBrowserAxe(page);
    expect(results.violations).toEqual([]);
    expect(results.contrastViolations).toEqual([]);
    expect(results.contrastIncomplete).toEqual([]);
  }
  const dark = page.getByRole('radio', { name: '深色' });
  await dark.focus();
  await expect(dark).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveClass(/dark/u);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([
    'tickdeck.theme-preference.v1',
  ]);
  const navigation = page.getByRole('navigation');
  const links = navigation.getByRole('link');
  await expect(links).toHaveCount(1);
  await expect(links).toHaveAttribute('href', '#runtime-health');
  await expect(links).toHaveAccessibleName('运行与健康');
});
