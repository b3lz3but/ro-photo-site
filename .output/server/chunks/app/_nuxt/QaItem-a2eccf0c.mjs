import __nuxt_component_1 from './Icon-5c53eef7.mjs';
import { defineComponent, unref, mergeProps, withCtx, createVNode, renderSlot, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
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
import './config-e4771c30.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './_plugin-vue_export-helper-cc2b3d55.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QaItem",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      _push(ssrRenderComponent(unref(Disclosure), mergeProps({
        as: "div",
        class: "pt-6"
      }, _attrs), {
        default: withCtx(({ open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<dt${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DisclosureButton), { class: "flex w-full items-start justify-between text-left text-zinc-900 dark:text-zinc-200" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-base font-semibold leading-7"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "question", {}, null, _push3, _parent3, _scopeId2);
                  _push3(`</span><span class="ml-6 flex h-7 items-center"${_scopeId2}>`);
                  if (!open) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "heroicons:plus-small",
                      class: "h-6 w-6"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "heroicons:minus-small",
                      class: "h-6 w-6"
                    }, null, _parent3, _scopeId2));
                  }
                  _push3(`</span>`);
                } else {
                  return [
                    createVNode("span", { class: "text-base font-semibold leading-7" }, [
                      renderSlot(_ctx.$slots, "question")
                    ]),
                    createVNode("span", { class: "ml-6 flex h-7 items-center" }, [
                      !open ? (openBlock(), createBlock(_component_Icon, {
                        key: 0,
                        name: "heroicons:plus-small",
                        class: "h-6 w-6"
                      })) : (openBlock(), createBlock(_component_Icon, {
                        key: 1,
                        name: "heroicons:minus-small",
                        class: "h-6 w-6"
                      }))
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</dt>`);
            _push2(ssrRenderComponent(unref(DisclosurePanel), {
              as: "dd",
              class: "mt-2 pr-12"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-base leading-7 text-zinc-600 dark:text-zinc-500"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "answer", {}, null, _push3, _parent3, _scopeId2);
                  _push3(`</p>`);
                } else {
                  return [
                    createVNode("p", { class: "text-base leading-7 text-zinc-600 dark:text-zinc-500" }, [
                      renderSlot(_ctx.$slots, "answer")
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("dt", null, [
                createVNode(unref(DisclosureButton), { class: "flex w-full items-start justify-between text-left text-zinc-900 dark:text-zinc-200" }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "text-base font-semibold leading-7" }, [
                      renderSlot(_ctx.$slots, "question")
                    ]),
                    createVNode("span", { class: "ml-6 flex h-7 items-center" }, [
                      !open ? (openBlock(), createBlock(_component_Icon, {
                        key: 0,
                        name: "heroicons:plus-small",
                        class: "h-6 w-6"
                      })) : (openBlock(), createBlock(_component_Icon, {
                        key: 1,
                        name: "heroicons:minus-small",
                        class: "h-6 w-6"
                      }))
                    ])
                  ]),
                  _: 2
                }, 1024)
              ]),
              createVNode(unref(DisclosurePanel), {
                as: "dd",
                class: "mt-2 pr-12"
              }, {
                default: withCtx(() => [
                  createVNode("p", { class: "text-base leading-7 text-zinc-600 dark:text-zinc-500" }, [
                    renderSlot(_ctx.$slots, "answer")
                  ])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/QaItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=QaItem-a2eccf0c.mjs.map
