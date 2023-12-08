import _sfc_main$1 from './StoryListItem-c1455add.mjs';
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
  __name: "StoriesList",
  __ssrInlineRender: true,
  props: {
    path: {
      type: String,
      default: "stories"
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { data: _stories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "stories",
      async () => await queryContent(withTrailingSlash(props.path)).sort({ date: -1 }).find()
    )), __temp = await __temp, __restore(), __temp);
    const stories = computed(() => _stories.value || []);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_StoryListItem = _sfc_main$1;
      if ((_a = unref(stories)) == null ? void 0 : _a.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, _attrs))}><!--[-->`);
        ssrRenderList(unref(stories), (story) => {
          _push(ssrRenderComponent(_component_StoryListItem, {
            key: story._path,
            story
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)}><p class="">No Stories found.</p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/StoriesList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=StoriesList-1e2b91f5.mjs.map
