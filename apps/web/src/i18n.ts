import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  'zh-CN': {
    translation: {
      appName: 'TickDeck',
      stage: 'S0-V 项目壳',
      nav: { runtimeHealth: '运行与健康' },
      labels: { server: '服务端', worker: '工作进程', stage: '阶段', releaseManifest: '发布清单' },
      health: {
        title: '运行与健康',
        loading: '正在读取本机运行状态…',
        TICKDECK_HEALTHY: '共同产品壳运行正常',
        TICKDECK_DEGRADED: '产品壳已降级；Worker 未通过启动校验',
        WORKER_HEALTHY: 'Worker 已认证，且没有业务处理器',
        unavailable: '无法读取健康快照',
      },
      manifest: {
        title: '当前阶段投影',
        digest: '目录摘要',
        surfaces: '已实现表面',
        loading: '正在读取…',
        unavailable: '无法验证',
      },
      theme: { label: '主题', light: '浅色', dark: '深色', system: '跟随系统' },
      boundary: '仅显示当前 Story 已实现的壳层；未注册后续产品能力。',
    },
  },
  'en-US': {
    translation: {
      appName: 'TickDeck',
      stage: 'S0-V project shell',
      nav: { runtimeHealth: 'Runtime & Health' },
      labels: {
        server: 'Server',
        worker: 'Worker',
        stage: 'Stage',
        releaseManifest: 'Release Manifest',
      },
      health: {
        title: 'Runtime & Health',
        loading: 'Reading local runtime state…',
        TICKDECK_HEALTHY: 'The shared product shell is healthy',
        TICKDECK_DEGRADED: 'The shell is degraded; Worker startup validation failed',
        WORKER_HEALTHY: 'Worker is authenticated and has no business handlers',
        unavailable: 'The health snapshot is unavailable',
      },
      manifest: {
        title: 'Current stage projection',
        digest: 'Catalog digest',
        surfaces: 'Built surfaces',
        loading: 'Loading…',
        unavailable: 'Unverified',
      },
      theme: { label: 'Theme', light: 'Light', dark: 'Dark', system: 'System' },
      boundary: 'Only this Story shell is shown; future product capabilities are not registered.',
    },
  },
  'en-x-pseudo': {
    translation: {
      appName: '[ŢîçķĐëçķ—ëxţëñđëđ]',
      stage: '[S0-V prõjëçţ şhëļļ—ëxţëñđëđ]',
      nav: { runtimeHealth: '[Rûñţîmë åñđ hëåļţh—ëxţëñđëđ]' },
      labels: {
        server: '[Şërvër—ëxţëñđëđ]',
        worker: '[Ŵõrķër—ëxţëñđëđ]',
        stage: '[Şţåĝë—ëxţëñđëđ]',
        releaseManifest: '[Rëļëåşë Måñîfëşţ—ëxţëñđëđ]',
      },
      health: {
        title: '[Rûñţîmë åñđ hëåļţh—ëxţëñđëđ]',
        loading: '[Rëåđîñĝ ļõçåļ rûñţîmë şţåţë—ëxţëñđëđ…]',
        TICKDECK_HEALTHY: '[Ţhë şhårëđ prõđûçţ şhëļļ îş hëåļţhÿ—ëxţëñđëđ]',
        TICKDECK_DEGRADED: '[Ţhë şhëļļ îş đëĝråđëđ—ëxţëñđëđ]',
        WORKER_HEALTHY: '[Ŵõrķër îş åûţhëñţîçåţëđ åñđ ëmpţÿ—ëxţëñđëđ]',
        unavailable: '[Ţhë hëåļţh şñåpşhõţ îş ûñåvåîļåbļë—ëxţëñđëđ]',
      },
      manifest: {
        title: '[Çûrrëñţ şţåĝë prõjëçţîõñ—ëxţëñđëđ]',
        digest: '[Çåţåļõĝ đîĝëşţ—ëxţëñđëđ]',
        surfaces: '[Bûîļţ şûrfåçëş—ëxţëñđëđ]',
        loading: '[Ļõåđîñĝ—ëxţëñđëđ…]',
        unavailable: '[Ûñvërîfîëđ—ëxţëñđëđ]',
      },
      theme: {
        label: '[Ţhëmë—ëxţëñđëđ]',
        light: '[Ļîĝhţ—ëxţëñđëđ]',
        dark: '[Đårķ—ëxţëñđëđ]',
        system: '[Fõļļõŵ şÿşţëm—ëxţëñđëđ]',
      },
      boundary:
        '[Õñļÿ ţhîş Şţõrÿ şhëļļ îş şhõŵñ; fûţûrë çåpåbîļîţîëş årë ñõţ rëĝîşţërëđ—ëxţëñđëđ.]',
    },
  },
} as const;

const supported = ['zh-CN', 'en-US', 'pseudo-long'] as const;
export type ShellLanguage = (typeof supported)[number];
const requested = new URLSearchParams(window.location.search).get('lang') ?? navigator.language;
const language: ShellLanguage = supported.includes(requested as ShellLanguage)
  ? (requested as ShellLanguage)
  : 'zh-CN';
const resourceLanguage = (value: ShellLanguage) =>
  value === 'pseudo-long' ? 'en-x-pseudo' : value;

void i18n.use(initReactI18next).init({
  resources,
  lng: resourceLanguage(language),
  load: 'currentOnly',
  fallbackLng: 'zh-CN',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = language;

export async function setShellLanguage(nextLanguage: ShellLanguage): Promise<void> {
  await i18n.changeLanguage(resourceLanguage(nextLanguage));
  document.documentElement.lang = nextLanguage;
}

export { i18n };
