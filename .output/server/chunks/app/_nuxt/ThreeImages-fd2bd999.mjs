import { _ as __nuxt_component_1 } from './nuxt-img-34aa9a4a.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ThreeImages",
  __ssrInlineRender: true,
  props: {
    src1: {},
    alt1: {},
    src2: {},
    alt2: {},
    src3: {},
    alt3: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose pb-8 grid lg:grid-cols-3 gap-3 lg:gap-6 aspect-[1] sm:aspect-[4/3] lg:aspect-[4/3] lg:-mr-12 lg:-ml-12" }, _attrs))}><div class="col-span-2 row-span-2 dark:bg-gray-800 rounded-md lg:rounded-xl overflow-hidden">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: _ctx.src1,
        alt: _ctx.alt1,
        loading: "lazy",
        class: "h-full w-full object-cover object-center",
        sizes: "sm:100vw md:50vw"
      }, null, _parent));
      _push(`</div><div class="col-span-1 dark:bg-gray-800 rounded-md lg:rounded-xl overflow-hidden">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: _ctx.src2,
        alt: _ctx.alt2,
        loading: "lazy",
        class: "h-full w-full object-cover object-center",
        sizes: "sm:100vw md:30vw"
      }, null, _parent));
      _push(`</div><div class="col-span-1 dark:bg-gray-800 rounded-md lg:rounded-xl overflow-hidden">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: _ctx.src3,
        alt: _ctx.alt3,
        loading: "lazy",
        class: "h-full w-full object-cover object-center",
        sizes: "sm:100vw md:30vw"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/ThreeImages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ThreeImages-fd2bd999.mjs.map
