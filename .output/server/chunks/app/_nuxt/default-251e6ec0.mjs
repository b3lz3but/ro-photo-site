import _sfc_main$1 from './Container-7e0e11f5.mjs';
import { _ as __nuxt_component_1 } from './nuxt-img-34aa9a4a.mjs';
import { _ as _sfc_main$1$1, a as __nuxt_component_3 } from './Footer-e94af5f7.mjs';
import { useSSRContext, mergeProps, withCtx, createVNode, renderSlot } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';
import '../server.mjs';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'ipx';
import 'unified';
import 'mdast-util-to-string';
import 'micromark';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'micromark-util-sanitize-uri';
import 'slugify';
import 'remark-parse';
import 'remark-rehype';
import 'remark-mdc';
import 'hast-util-to-string';
import 'github-slugger';
import 'detab';
import 'remark-emoji';
import 'remark-gfm';
import 'rehype-external-links';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'rellax';
import './nuxt-link-b5b10036.mjs';
import '@headlessui/vue';
import '@heroicons/vue/20/solid';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Container = _sfc_main$1;
  const _component_NuxtImg = __nuxt_component_1;
  const _component_Header = _sfc_main$1$1;
  const _component_Footer = __nuxt_component_3;
  _push(`<article${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-stretch" }, _attrs))}><div class="fixed inset-0 flex justify-center sm:px-8"><div class="flex w-full max-w-7xl lg:px-8"><div class="w-full bg-white ring-1 ring-zinc-200/50 dark:bg-zinc-900 dark:ring-zinc-500/20"></div></div></div>`);
  _push(ssrRenderComponent(_component_Container, { class: "relative" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="absolute top-0 right-0"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_NuxtImg, {
          src: "img/bg-glow.png",
          "aria-hidden": "true",
          class: "w-[44rem]",
          format: "webp",
          width: "944",
          height: "586"
        }, null, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "absolute top-0 right-0" }, [
            createVNode(_component_NuxtImg, {
              src: "img/bg-glow.png",
              "aria-hidden": "true",
              class: "w-[44rem]",
              format: "webp",
              width: "944",
              height: "586"
            })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_Header, null, null, _parent));
  _push(`<main class="maya-prose">`);
  _push(ssrRenderComponent(_component_Container, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
  _push(`</main>`);
  _push(ssrRenderComponent(_component_Footer, { class: "mt-auto" }, null, _parent));
  _push(`</article>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-251e6ec0.mjs.map
