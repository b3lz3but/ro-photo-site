import { defineComponent, resolveDirective, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDirectiveProps, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PageHeader",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    orientation: {
      type: String,
      required: false,
      default: "left"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_parallax = resolveDirective("parallax");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose relative pt-14 pb-10 lg:mt-32 lg:pb-24" }, _attrs))}><div${ssrRenderAttrs(mergeProps({
        class: ["absolute top-0 left-0 pointer-events-none w-full text-clip overflow-hidden", [__props.orientation === "center" ? "flex justify-center" : ""]],
        "data-rellax-speed": "4"
      }, ssrGetDirectiveProps(_ctx, _directive_parallax)))}><span class="text-[9rem] lg:text-[10rem] font-display text-zinc-900 dark:text-zinc-50 opacity-2 truncate">${ssrInterpolate(__props.title)}</span></div><div>`);
      if (__props.orientation === "left") {
        _push(`<!--[--><div class="max-w-xl"><h1 class="font-thin font-display text-5xl text-gradient leading-tighter w-max max-w-full">${ssrInterpolate(__props.title)}</h1></div><div class="max-w-2xl"><p class="mt-6 lg:mt-9 dark:text-zinc-500">`);
        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
          _push(`${ssrInterpolate(__props.description)}`);
        }, _push, _parent);
        _push(`</p></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (__props.orientation === "center") {
        _push(`<!--[--><div class="max-w-xl mx-auto flex justify-center"><h1 class="font-thin font-display text-5xl text-gradient leading-tighter text-center w-max">${ssrInterpolate(__props.title)}</h1></div><div class="max-w-2xl mx-auto"><p class="mt-6 lg:mt-9 dark:text-zinc-500 text-center">`);
        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
          _push(`${ssrInterpolate(__props.description)}`);
        }, _push, _parent);
        _push(`</p></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/PageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=PageHeader-c6881326.mjs.map
