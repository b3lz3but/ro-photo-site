import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-24" }, _attrs))}><div class="text-center">`);
  ssrRenderSlot(_ctx.$slots, "title", {}, null, _push, _parent);
  _push(`</div><div class="not-prose -mt-8 sm:-mx-4 sm:columns-2 sm:text-[0]">`);
  ssrRenderSlot(_ctx.$slots, "items", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/SectionTestimonials.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SectionTestimonials = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { SectionTestimonials as default };
//# sourceMappingURL=SectionTestimonials-07b1a51e.mjs.map
