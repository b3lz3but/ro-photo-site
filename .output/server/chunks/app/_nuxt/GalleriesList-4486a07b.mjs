import _sfc_main$1 from './GalleryListItem-be2256ff.mjs';
import { u as useAsyncData } from './asyncData-db70e94a.mjs';
import { q as queryContent } from '../server.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { H as withTrailingSlash } from '../../nitro/node-server.mjs';
import './nuxt-link-b5b10036.mjs';
import './nuxt-img-34aa9a4a.mjs';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'rellax';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GalleriesList",
  __ssrInlineRender: true,
  props: {
    path: {
      type: String,
      default: "galleries"
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { data: _galleries } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "galleries",
      async () => await queryContent(withTrailingSlash(props.path)).find()
    )), __temp = await __temp, __restore(), __temp);
    const galleries = computed(() => _galleries.value || []);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_GalleryListItem = _sfc_main$1;
      if ((_a = unref(galleries)) == null ? void 0 : _a.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, _attrs))}><!--[-->`);
        ssrRenderList(unref(galleries), (gallery, index) => {
          _push(ssrRenderComponent(_component_GalleryListItem, {
            key: index,
            gallery
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)}><p class=""> No galleries found. </p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/GalleriesList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=GalleriesList-4486a07b.mjs.map
