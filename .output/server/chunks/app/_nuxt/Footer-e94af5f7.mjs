import _sfc_main$7 from './Container-7e0e11f5.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-b5b10036.mjs';
import { _ as __nuxt_component_1$1 } from './nuxt-img-34aa9a4a.mjs';
import { useSSRContext, defineComponent, ref, createElementBlock, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, Transition } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { Bars2Icon, SunIcon, MoonIcon } from '@heroicons/vue/20/solid';
import { B as componentName, m as useState } from '../server.mjs';

const _sfc_main$6 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$2;
  const _component_NuxtImg = __nuxt_component_1$1;
  _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
    to: "/",
    class: "group flex items-center gap-4 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 focus:outline-none focus-visible:ring-offset-2 ring-offset-zinc-900 focus:rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="rounded-full border-2 border-white dark:border-zinc-400 shadow-md group-hover:shadow-xl transition-shadow duration-100 shrink-0"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_NuxtImg, {
          class: "inline-block h-14 w-14 rounded-full",
          src: "/img/green.webp",
          alt: "Ciprian Radulescu",
          format: "webp",
          width: "100",
          height: "100"
        }, null, _parent2, _scopeId));
        _push2(`</div><span class="uppercase tracking-widest hidden md:inline-flex shrink-1 sr-only"${_scopeId}>Oscar Mattern</span>`);
      } else {
        return [
          createVNode("div", { class: "rounded-full border-2 border-white dark:border-zinc-400 shadow-md group-hover:shadow-xl transition-shadow duration-100 shrink-0" }, [
            createVNode(_component_NuxtImg, {
              class: "inline-block h-14 w-14 rounded-full",
              src: "/img/green.webp",
              alt: "Ciprian Radulescu",
              format: "webp",
              width: "100",
              height: "100"
            })
          ]),
          createVNode("span", { class: "uppercase tracking-widest hidden md:inline-flex shrink-1 sr-only" }, "Oscar Mattern")
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Logo.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "NavLinks",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-4" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.links, (link, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: [
            _ctx.$route.path === link.to ? "text-gradient" : "text-zinc-700 dark:text-zinc-400",
            "px-2 hover:text-zinc-900 dark:hover:text-zinc-200"
          ],
          key: `navlinks-${index}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NavLinks.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "NavLinksMobile",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(unref(Menu), mergeProps({
        as: "div",
        class: "inline-block text-left z-10"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(unref(MenuButton), { class: "border rounded-full px-2 py-2 text-zinc-500 border-zinc-500 hover:bg-white hover:text-zinc-900 hover:border-zinc-900 active:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-700 focus-visible:ring-opacity-75" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="sr-only"${_scopeId2}>Menu</span>`);
                  _push3(ssrRenderComponent(unref(Bars2Icon), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("span", { class: "sr-only" }, "Menu"),
                    createVNode(unref(Bars2Icon), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(MenuItems), { class: "absolute right-0 mt-4 w-56 origin-top-right divide-y divide-zinc-100 dark:divide-zinc-700 rounded-xl bg-white dark:bg-black shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-5 focus:outline-none" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="px-2 py-2 w-full"${_scopeId2}><!--[-->`);
                  ssrRenderList(_ctx.links, (link, index) => {
                    _push3(ssrRenderComponent(unref(MenuItem), { key: index }, {
                      default: withCtx(({ close }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            class: [
                              _ctx.$route.path === link.to ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200" : "text-zinc-900 dark:text-zinc-200",
                              "group block w-full items-center rounded-xl text-sm"
                            ],
                            to: link.to
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span class="truncate px-4 py-2 block"${_scopeId4}>${ssrInterpolate(link.name)}</span>`);
                              } else {
                                return [
                                  createVNode("span", {
                                    onClick: close,
                                    class: "truncate px-4 py-2 block"
                                  }, toDisplayString(link.name), 9, ["onClick"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              class: [
                                _ctx.$route.path === link.to ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200" : "text-zinc-900 dark:text-zinc-200",
                                "group block w-full items-center rounded-xl text-sm"
                              ],
                              to: link.to
                            }, {
                              default: withCtx(() => [
                                createVNode("span", {
                                  onClick: close,
                                  class: "truncate px-4 py-2 block"
                                }, toDisplayString(link.name), 9, ["onClick"])
                              ]),
                              _: 2
                            }, 1032, ["class", "to"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", { class: "px-2 py-2 w-full" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.links, (link, index) => {
                        return openBlock(), createBlock(unref(MenuItem), { key: index }, {
                          default: withCtx(({ close }) => [
                            createVNode(_component_NuxtLink, {
                              class: [
                                _ctx.$route.path === link.to ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200" : "text-zinc-900 dark:text-zinc-200",
                                "group block w-full items-center rounded-xl text-sm"
                              ],
                              to: link.to
                            }, {
                              default: withCtx(() => [
                                createVNode("span", {
                                  onClick: close,
                                  class: "truncate px-4 py-2 block"
                                }, toDisplayString(link.name), 9, ["onClick"])
                              ]),
                              _: 2
                            }, 1032, ["class", "to"])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", null, [
                createVNode(unref(MenuButton), { class: "border rounded-full px-2 py-2 text-zinc-500 border-zinc-500 hover:bg-white hover:text-zinc-900 hover:border-zinc-900 active:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-700 focus-visible:ring-opacity-75" }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "sr-only" }, "Menu"),
                    createVNode(unref(Bars2Icon), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })
              ]),
              createVNode(Transition, {
                "enter-active-class": "transition duration-100 ease-out",
                "enter-from-class": "transform scale-95 opacity-0",
                "enter-to-class": "transform scale-100 opacity-100",
                "leave-active-class": "transition duration-75 ease-in",
                "leave-from-class": "transform scale-100 opacity-100",
                "leave-to-class": "transform scale-95 opacity-0"
              }, {
                default: withCtx(() => [
                  createVNode(unref(MenuItems), { class: "absolute right-0 mt-4 w-56 origin-top-right divide-y divide-zinc-100 dark:divide-zinc-700 rounded-xl bg-white dark:bg-black shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-5 focus:outline-none" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "px-2 py-2 w-full" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(_ctx.links, (link, index) => {
                          return openBlock(), createBlock(unref(MenuItem), { key: index }, {
                            default: withCtx(({ close }) => [
                              createVNode(_component_NuxtLink, {
                                class: [
                                  _ctx.$route.path === link.to ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200" : "text-zinc-900 dark:text-zinc-200",
                                  "group block w-full items-center rounded-xl text-sm"
                                ],
                                to: link.to
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", {
                                    onClick: close,
                                    class: "truncate px-4 py-2 block"
                                  }, toDisplayString(link.name), 9, ["onClick"])
                                ]),
                                _: 2
                              }, 1032, ["class", "to"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NavLinksMobile.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0$1 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main$3 = {
  name: componentName,
  props: {
    placeholder: String,
    tag: {
      type: String,
      default: "span"
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ClientOnly = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_ClientOnly, mergeProps({
    placeholder: $props.placeholder,
    "placeholder-tag": $props.tag
  }, _attrs), {}, _parent));
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]);
const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ColorModeSwitch",
  __ssrInlineRender: true,
  setup(__props) {
    const colorMode = useColorMode();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ColorScheme = __nuxt_component_0;
      _push(`<button${ssrRenderAttrs(mergeProps({
        "aria-label": "Color Mode",
        class: "border rounded-full px-2 py-2 text-zinc-500 border-zinc-500 hover:bg-white hover:text-zinc-900 hover:border-zinc-900 active:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-700 focus-visible:ring-opacity-75"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ColorScheme, { placeholder: "..." }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(colorMode).value === "dark") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(SunIcon), {
                name: "dark-mode",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(`<span class="sr-only"${_scopeId}>Dark Mode</span><!--]-->`);
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(MoonIcon), {
                name: "light-mode",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(`<span class="sr-only"${_scopeId}>Light Mode</span><!--]-->`);
            }
          } else {
            return [
              unref(colorMode).value === "dark" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createVNode(unref(SunIcon), {
                  name: "dark-mode",
                  class: "w-4 h-4"
                }),
                createVNode("span", { class: "sr-only" }, "Dark Mode")
              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                createVNode(unref(MoonIcon), {
                  name: "light-mode",
                  class: "w-4 h-4"
                }),
                createVNode("span", { class: "sr-only" }, "Light Mode")
              ], 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ColorModeSwitch.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const links = [
      { name: "Home", to: "/" },
      { name: "Galleries", to: "/galleries" },
      { name: "Stories", to: "/stories" },
      { name: "Hire me", to: "/hire-me" }
    ];
    const showHeader = ref(true);
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = _sfc_main$7;
      const _component_Logo = __nuxt_component_1;
      const _component_NavLinks = _sfc_main$5;
      const _component_NavLinksMobile = _sfc_main$4;
      const _component_ColorModeSwitch = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          unref(showHeader) ? "translate-y-0" : "-translate-y-full",
          "transform-gpu transition-transform duration-500 sticky top-0 z-50"
        ]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Container, { class: "pt-4 lg:pt-10" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`<div class="border border-zinc-300/50 dark:border-zinc-900/60 rounded-full pl-2 lg:pl-4 pr-2 py-2 backdrop-blur-lg bg-zinc-100/50 dark:bg-zinc-800/50"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="hidden lg:block"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NavLinks, { links }, null, _parent2, _scopeId));
            _push2(`</div><div class="lg:hidden"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NavLinksMobile, { links }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_ColorModeSwitch, null, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode(_component_Logo),
                createVNode("div", { class: "border border-zinc-300/50 dark:border-zinc-900/60 rounded-full pl-2 lg:pl-4 pr-2 py-2 backdrop-blur-lg bg-zinc-100/50 dark:bg-zinc-800/50" }, [
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    createVNode("div", { class: "hidden lg:block" }, [
                      createVNode(_component_NavLinks, { links })
                    ]),
                    createVNode("div", { class: "lg:hidden" }, [
                      createVNode(_component_NavLinksMobile, { links })
                    ]),
                    createVNode(_component_ColorModeSwitch)
                  ])
                ])
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Container = _sfc_main$7;
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(ssrRenderComponent(_component_Container, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="dark:text-zinc-500 pb-16 mt-16"${_scopeId}><div class="text-center"${_scopeId}><p class="text-sm"${_scopeId}>\xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} `);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "text-zinc-500 hover:text-zinc-400"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Fixed Focused Designs`);
            } else {
              return [
                createTextVNode("Fixed Focused Designs")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`, All rights reserved.</p></div></div>`);
      } else {
        return [
          createVNode("div", { class: "dark:text-zinc-500 pb-16 mt-16" }, [
            createVNode("div", { class: "text-center" }, [
              createVNode("p", { class: "text-sm" }, [
                createTextVNode("\xA9 " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " ", 1),
                createVNode(_component_NuxtLink, {
                  to: "/",
                  class: "text-zinc-500 hover:text-zinc-400"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Fixed Focused Designs")
                  ]),
                  _: 1
                }),
                createTextVNode(", All rights reserved.")
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _sfc_main$1 as _, __nuxt_component_3 as a };
//# sourceMappingURL=Footer-e94af5f7.mjs.map
