import { _ as __nuxt_component_0 } from './nuxt-link-b5b10036.mjs';
import { _ as __nuxt_component_1 } from './nuxt-img-34aa9a4a.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import '../server.mjs';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'rellax';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GalleryListItem",
  __ssrInlineRender: true,
  props: {
    gallery: {
      type: Object,
      required: true,
      validator: (value) => {
        if ((value == null ? void 0 : value._path) && value.title) {
          return true;
        }
        return false;
      }
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: __props.gallery._path,
        class: "group"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            _push2(`<div class="relative w-full overflow-hidden rounded-lg aspect-[3/2] md:aspect-[2/3] dark:bg-zinc-800"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtImg, {
              src: ((_a = __props.gallery.cover) == null ? void 0 : _a.src) || "img/placeholder.jpg",
              alt: ((_b = __props.gallery.cover) == null ? void 0 : _b.alt) || __props.gallery.title,
              width: (_c = __props.gallery.cover) == null ? void 0 : _c.width,
              height: (_d = __props.gallery.cover) == null ? void 0 : _d.height,
              class: "h-full w-full object-cover object-center group-hover:opacity-75",
              sizes: "sm:100vw md:50vw lg:30vw",
              loading: "lazy",
              placeholder: ""
            }, null, _parent2, _scopeId));
            if ((_f = (_e = __props.gallery) == null ? void 0 : _e.images) == null ? void 0 : _f.length) {
              _push2(`<div class="absolute bottom-0 w-full p-4 grid grid-cols-4 gap-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.gallery.images.slice(0, 4), (thumbnail, index) => {
                _push2(`<div class="col-span-1 aspect-square w-full rounded-lg overflow-hidden group-hover:opacity-75 dark:bg-zinc-800"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtImg, {
                  src: thumbnail.src,
                  alt: "thumbnail.alt",
                  class: "h-full w-full object-cover object-center",
                  loading: "lazy",
                  sizes: "sm:70px md:75px",
                  placeholder: ""
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="mt-4 flex items-center justify-between text-base font-medium dark:text-zinc-200"${_scopeId}><h3${_scopeId}>${ssrInterpolate(__props.gallery.title)}</h3></div>`);
          } else {
            return [
              createVNode("div", { class: "relative w-full overflow-hidden rounded-lg aspect-[3/2] md:aspect-[2/3] dark:bg-zinc-800" }, [
                createVNode(_component_NuxtImg, {
                  src: ((_g = __props.gallery.cover) == null ? void 0 : _g.src) || "img/placeholder.jpg",
                  alt: ((_h = __props.gallery.cover) == null ? void 0 : _h.alt) || __props.gallery.title,
                  width: (_i = __props.gallery.cover) == null ? void 0 : _i.width,
                  height: (_j = __props.gallery.cover) == null ? void 0 : _j.height,
                  class: "h-full w-full object-cover object-center group-hover:opacity-75",
                  sizes: "sm:100vw md:50vw lg:30vw",
                  loading: "lazy",
                  placeholder: ""
                }, null, 8, ["src", "alt", "width", "height"]),
                ((_l = (_k = __props.gallery) == null ? void 0 : _k.images) == null ? void 0 : _l.length) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "absolute bottom-0 w-full p-4 grid grid-cols-4 gap-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.gallery.images.slice(0, 4), (thumbnail, index) => {
                    return openBlock(), createBlock("div", {
                      key: index,
                      class: "col-span-1 aspect-square w-full rounded-lg overflow-hidden group-hover:opacity-75 dark:bg-zinc-800"
                    }, [
                      createVNode(_component_NuxtImg, {
                        src: thumbnail.src,
                        alt: "thumbnail.alt",
                        class: "h-full w-full object-cover object-center",
                        loading: "lazy",
                        sizes: "sm:70px md:75px",
                        placeholder: ""
                      }, null, 8, ["src"])
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "mt-4 flex items-center justify-between text-base font-medium dark:text-zinc-200" }, [
                createVNode("h3", null, toDisplayString(__props.gallery.title), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/GalleryListItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=GalleryListItem-be2256ff.mjs.map
