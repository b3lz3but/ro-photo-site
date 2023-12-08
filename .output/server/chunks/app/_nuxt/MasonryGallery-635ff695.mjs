import { useSSRContext, defineComponent, mergeProps, withCtx, createVNode, toRefs, ref, watch, unref, useSlots, onUnmounted, nextTick } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_1 } from './nuxt-img-34aa9a4a.mjs';
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

const _sfc_main$2 = {
  __name: "PhotoSwipe",
  __ssrInlineRender: true,
  setup(__props) {
    const gallery = ref(null);
    const slots = useSlots();
    const children = slots.default() ? slots.default()[0].children : false;
    children ? children[0].type : false;
    onUnmounted(() => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "gallery",
        ref: gallery
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PhotoSwipe.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main$2;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MasonryWall",
  __ssrInlineRender: true,
  props: {
    items: {},
    columnWidth: { default: 400 },
    gap: { default: 0 },
    rtl: { type: Boolean, default: false },
    ssrColumns: { default: 0 },
    scrollContainer: { default: null }
  },
  emits: ["redraw", "redrawSkip"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { columnWidth, items, gap, rtl, ssrColumns, scrollContainer } = toRefs(props);
    const columns = ref([]);
    const wall = ref();
    function columnCount() {
      const count = Math.floor(
        (wall.value.getBoundingClientRect().width + gap.value) / (columnWidth.value + gap.value)
      );
      return count > 0 ? count : 1;
    }
    function createColumns(count) {
      return [...new Array(count)].map(() => []);
    }
    if (ssrColumns.value > 0) {
      const newColumns = createColumns(ssrColumns.value);
      items.value.forEach(
        (_, i) => newColumns[i % ssrColumns.value].push(i)
      );
      columns.value = newColumns;
    }
    async function fillColumns(itemIndex) {
      if (itemIndex >= items.value.length) {
        return;
      }
      await nextTick();
      const columnDivs = [...wall.value.children];
      if (rtl.value) {
        columnDivs.reverse();
      }
      const target = columnDivs.reduce(
        (prev, curr) => curr.getBoundingClientRect().height < prev.getBoundingClientRect().height ? curr : prev
      );
      columns.value[+target.dataset.index].push(itemIndex);
      await fillColumns(itemIndex + 1);
    }
    async function redraw(force = false) {
      if (columns.value.length === columnCount() && !force) {
        emit("redrawSkip");
        return;
      }
      columns.value = createColumns(columnCount());
      const scrollTarget = scrollContainer == null ? void 0 : scrollContainer.value;
      const scrollY = scrollTarget ? scrollTarget.scrollTop : window.scrollY;
      await fillColumns(0);
      scrollTarget ? scrollTarget.scrollBy({ top: scrollY - scrollTarget.scrollTop }) : window.scrollTo({ top: scrollY });
      emit("redraw");
    }
    typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver(() => redraw());
    watch([items, rtl], () => redraw(true));
    watch([columnWidth, gap], () => redraw());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "wall",
        ref: wall,
        class: "masonry-wall",
        style: { display: "flex", gap: `${unref(gap)}px` }
      }, _attrs))}><!--[-->`);
      ssrRenderList(columns.value, (column, columnIndex) => {
        _push(`<div class="masonry-column"${ssrRenderAttr("data-index", columnIndex)} style="${ssrRenderStyle({
          display: "flex",
          "flex-basis": "0px",
          "flex-direction": "column",
          "flex-grow": 1,
          gap: `${unref(gap)}px`,
          height: ["-webkit-max-content", "-moz-max-content", "max-content"],
          "min-width": 0
        })}"><!--[-->`);
        ssrRenderList(column, (itemIndex) => {
          _push(`<div class="masonry-item">`);
          ssrRenderSlot(_ctx.$slots, "default", {
            item: unref(items)[itemIndex],
            index: itemIndex
          }, () => {
            _push(`${ssrInterpolate(unref(items)[itemIndex])}`);
          }, _push, _parent);
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MasonryWall.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MasonryGallery",
  __ssrInlineRender: true,
  props: {
    images: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PhotoSwipe = __nuxt_component_0;
      const _component_MasonryWall = _sfc_main$1;
      const _component_NuxtImg = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PhotoSwipe, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_MasonryWall, {
              items: _ctx.images,
              "ssr-columns": 1,
              "column-width": 300,
              gap: 32,
              class: "grid grid-cols-2 lg:grid-cols-3 gap-8"
            }, {
              default: withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<a class="photoswipe-item rounded-xl overflow-hidden block dark:bg-zinc-800 bg-zinc-200"${ssrRenderAttr("href", _ctx.$img(item.src, { width: 1600 }))} data-cropped="true"${ssrRenderAttr("data-pswp-width", item.width)}${ssrRenderAttr("data-pswp-height", item.height)}${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_NuxtImg, {
                    src: item.src,
                    alt: "Some image",
                    sizes: "sm:90vw md:50vw lg:30vw",
                    class: "w-full h-full object-cover object-center",
                    width: item.width,
                    height: item.height,
                    loading: "lazy"
                  }, null, _parent3, _scopeId2));
                  _push3(`</a>`);
                } else {
                  return [
                    createVNode("a", {
                      class: "photoswipe-item rounded-xl overflow-hidden block dark:bg-zinc-800 bg-zinc-200",
                      href: _ctx.$img(item.src, { width: 1600 }),
                      "data-cropped": "true",
                      "data-pswp-width": item.width,
                      "data-pswp-height": item.height
                    }, [
                      createVNode(_component_NuxtImg, {
                        src: item.src,
                        alt: "Some image",
                        sizes: "sm:90vw md:50vw lg:30vw",
                        class: "w-full h-full object-cover object-center",
                        width: item.width,
                        height: item.height,
                        loading: "lazy"
                      }, null, 8, ["src", "width", "height"])
                    ], 8, ["href", "data-pswp-width", "data-pswp-height"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_component_MasonryWall, {
                  items: _ctx.images,
                  "ssr-columns": 1,
                  "column-width": 300,
                  gap: 32,
                  class: "grid grid-cols-2 lg:grid-cols-3 gap-8"
                }, {
                  default: withCtx(({ item }) => [
                    createVNode("a", {
                      class: "photoswipe-item rounded-xl overflow-hidden block dark:bg-zinc-800 bg-zinc-200",
                      href: _ctx.$img(item.src, { width: 1600 }),
                      "data-cropped": "true",
                      "data-pswp-width": item.width,
                      "data-pswp-height": item.height
                    }, [
                      createVNode(_component_NuxtImg, {
                        src: item.src,
                        alt: "Some image",
                        sizes: "sm:90vw md:50vw lg:30vw",
                        class: "w-full h-full object-cover object-center",
                        width: item.width,
                        height: item.height,
                        loading: "lazy"
                      }, null, 8, ["src", "width", "height"])
                    ], 8, ["href", "data-pswp-width", "data-pswp-height"])
                  ]),
                  _: 1
                }, 8, ["items"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/MasonryGallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MasonryGallery-635ff695.mjs.map
