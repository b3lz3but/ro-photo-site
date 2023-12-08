import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose lg:max-w-3xl mx-auto pt-8 lg:pt-44 content-visibility-auto contain-intrinsic-size-[auto_400px]" }, _attrs))}><div class="flex flex-col gap-9"><h1 class="text-center font-display font-light leading-snug text-3xl md:text-4xl lg:text-5xl text-zinc-700 dark:text-zinc-300">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
    _push(` Inspire Emotion and Evoke Storytelling through the Art of Photography. `);
  }, _push, _parent);
  _push(`</h1><p class="text-zinc-700 dark:text-zinc-400 text-center text-sm lg:text-base px-0 md:px-14 lg:px-24">`);
  ssrRenderSlot(_ctx.$slots, "description", {}, () => {
    _push(` Explore my photography portfolio and see the world through my creative lens. Contact me if you would like to hire me. `);
  }, _push, _parent);
  _push(`</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/HeroText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HeroText = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { HeroText as default };
//# sourceMappingURL=HeroText-884ff14d.mjs.map
