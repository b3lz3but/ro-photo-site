import { L as klona, M as defuFn } from '../../nitro/node-server.mjs';
import { d as useNuxtApp } from '../server.mjs';

const inlineConfig = {
  "nuxt": {
    "buildId": "afacb272-5cc0-44cf-ae2e-3c17e8429c7d"
  }
};
const __appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = klona(__appConfig);
  }
  return nuxtApp._appConfig;
}

export { useAppConfig as u };
//# sourceMappingURL=config-446a303e.mjs.map
