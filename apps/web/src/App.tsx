import {
  capabilitySlices,
  catalogDigest,
  releaseManifest,
  type HealthSnapshot,
} from '@tickdeck/contracts';
import { Activity, Box, ShieldCheck } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ThemeControl } from '@/components/theme-control';

type ShellData = Readonly<{
  health: HealthSnapshot;
  surfaceIds: readonly string[];
}>;

const workerHealthCodes = new Set<HealthSnapshot['worker']['code']>([
  'WORKER_HEALTHY',
  'WORKER_UNAVAILABLE',
  'WORKER_AUTH_REJECTED',
  'WORKER_PROTOCOL_MISMATCH',
  'WORKER_CATALOG_MISMATCH',
]);

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function exactStringArray(value: unknown, expected: readonly string[]): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'string') &&
    JSON.stringify(value) === JSON.stringify(expected)
  );
}

export function parseShellData(
  healthStatus: number,
  healthValue: unknown,
  manifestValue: unknown,
): ShellData | undefined {
  if (!isRecord(healthValue) || !isRecord(healthValue.worker)) return undefined;
  const workerCode = healthValue.worker.code;
  if (
    healthValue.schemaVersion !== releaseManifest.schemaVersion ||
    healthValue.stage !== releaseManifest.stage ||
    healthValue.catalogDigest !== catalogDigest ||
    (healthValue.code !== 'TICKDECK_HEALTHY' && healthValue.code !== 'TICKDECK_DEGRADED') ||
    typeof workerCode !== 'string' ||
    !workerHealthCodes.has(workerCode as HealthSnapshot['worker']['code']) ||
    (healthStatus === 200 &&
      (healthValue.code !== 'TICKDECK_HEALTHY' || workerCode !== 'WORKER_HEALTHY')) ||
    (healthStatus === 503 &&
      (healthValue.code !== 'TICKDECK_DEGRADED' || workerCode === 'WORKER_HEALTHY')) ||
    (healthStatus !== 200 && healthStatus !== 503)
  ) {
    return undefined;
  }

  if (!isRecord(manifestValue) || !isRecord(manifestValue.slices)) return undefined;
  const webSlice = manifestValue.slices.web;
  if (
    !isRecord(webSlice) ||
    manifestValue.schemaVersion !== releaseManifest.schemaVersion ||
    manifestValue.stage !== releaseManifest.stage ||
    manifestValue.catalogDigest !== catalogDigest ||
    webSlice.name !== 'web' ||
    webSlice.catalogDigest !== catalogDigest ||
    !exactStringArray(webSlice.surfaceIds, capabilitySlices.web.surfaceIds)
  ) {
    return undefined;
  }

  return {
    health: healthValue as HealthSnapshot,
    surfaceIds: webSlice.surfaceIds,
  };
}

export function App() {
  const { t } = useTranslation();
  const [data, setData] = React.useState<ShellData | undefined>();
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch('/api/v1/health', { signal: controller.signal }),
      fetch('/api/v1/capability-manifest', { signal: controller.signal }),
    ])
      .then(async ([healthResponse, manifestResponse]) => {
        if (![200, 503].includes(healthResponse.status) || !manifestResponse.ok)
          throw new Error('SHELL_SNAPSHOT_UNAVAILABLE');
        const [health, manifest] = await Promise.all([
          healthResponse.json() as Promise<unknown>,
          manifestResponse.json() as Promise<unknown>,
        ]);
        const parsed = parseShellData(healthResponse.status, health, manifest);
        if (!parsed) throw new Error('SHELL_SNAPSHOT_INVALID');
        setFailed(false);
        setData(parsed);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setData(undefined);
          setFailed(true);
        }
      });
    return () => controller.abort();
  }, []);

  const healthCode = data?.health.code;
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">{t('stage')}</p>
          <h1>{t('appName')}</h1>
        </div>
        <ThemeControl />
      </header>

      <div className="app-body">
        <nav aria-label={t('nav.runtimeHealth')} className="navigation-rail">
          <a href="#runtime-health" aria-current="page" aria-label={t('nav.runtimeHealth')}>
            <Activity aria-hidden="true" />
          </a>
        </nav>

        <main id="runtime-health" tabIndex={-1}>
          <section aria-labelledby="health-heading" className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">S0-V</p>
                <h2 id="health-heading">{t('health.title')}</h2>
              </div>
              <span
                className="status-badge"
                data-state={
                  healthCode === 'TICKDECK_HEALTHY'
                    ? 'healthy'
                    : healthCode === 'TICKDECK_DEGRADED'
                      ? 'degraded'
                      : 'unknown'
                }
              >
                <ShieldCheck aria-hidden="true" />
                {failed
                  ? t('health.unavailable')
                  : healthCode
                    ? t(`health.${healthCode}`)
                    : t('health.loading')}
              </span>
            </div>
            {data ? (
              <dl className="health-grid">
                <div>
                  <dt>{t('labels.server')}</dt>
                  <dd>{data.health.code}</dd>
                </div>
                <div>
                  <dt>{t('labels.worker')}</dt>
                  <dd>{data.health.worker.code}</dd>
                </div>
                <div>
                  <dt>{t('labels.stage')}</dt>
                  <dd>{data.health.stage}</dd>
                </div>
              </dl>
            ) : null}
          </section>

          <section aria-labelledby="manifest-heading" className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t('labels.releaseManifest')}</p>
                <h2 id="manifest-heading">{t('manifest.title')}</h2>
              </div>
              <Box aria-hidden="true" />
            </div>
            <dl className="manifest-list">
              <div>
                <dt>{t('manifest.digest')}</dt>
                <dd className="numeric">
                  {failed
                    ? t('manifest.unavailable')
                    : (data?.health.catalogDigest ?? t('manifest.loading'))}
                </dd>
              </div>
              <div>
                <dt>{t('manifest.surfaces')}</dt>
                <dd>
                  {failed
                    ? t('manifest.unavailable')
                    : (data?.surfaceIds.join(' · ') ?? t('manifest.loading'))}
                </dd>
              </div>
            </dl>
          </section>

          <p className="boundary-note">{t('boundary')}</p>
        </main>
      </div>
    </div>
  );
}

export default App;
