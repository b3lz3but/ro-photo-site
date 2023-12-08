import { L as klona, M as defuFn } from '../../nitro/node-server.mjs';
import { d as useNuxtApp } from '../server.mjs';

const inlineConfig = {
  "nuxt": {
    "buildId": "1877e29f-88ea-4f5c-adc0-ac980d72bd8f"
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
//# sourceMappingURL=config-e4771c30.mjs.map
