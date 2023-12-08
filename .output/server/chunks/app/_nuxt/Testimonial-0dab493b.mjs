import { _ as __nuxt_component_1 } from './nuxt-img-34aa9a4a.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "Testimonial",
  __ssrInlineRender: true,
  props: {
    quote: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    image: {
      type: Object,
      required: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtImg = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pt-8 sm:inline-block sm:w-full sm:px-4" }, _attrs))}><figure class="rounded-2xl bg-zinc-50 dark:bg-zinc-800/5 p-6 text-sm leading-6 dark:border dark:border-zinc-800/50"><blockquote class="text-zinc-900 dark:text-zinc-400"><p>\u201C${ssrInterpolate(__props.quote)}\u201D</p></blockquote><figcaption class="mt-6 flex items-center gap-x-4">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        class: "h-10 w-10 rounded-full bg-zinc-50 dark:bg-zinc-800 object-cover",
        src: ((_a = __props.image) == null ? void 0 : _a.src) ? __props.image.src : "/img/placeholder.jpg",
        alt: ((_b = __props.image) == null ? void 0 : _b.alt) ? __props.image.alt : "Placeholder",
        width: ((_c = __props.image) == null ? void 0 : _c.width) ? __props.image.width : 80,
        height: ((_d = __props.image) == null ? void 0 : _d.height) ? __props.image.height : 80
      }, null, _parent));
      _push(`<div class="font-semibold text-zinc-900 dark:text-zinc-300">${ssrInterpolate(__props.name)}</div></figcaption></figure></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/Testimonial.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Testimonial-0dab493b.mjs.map
