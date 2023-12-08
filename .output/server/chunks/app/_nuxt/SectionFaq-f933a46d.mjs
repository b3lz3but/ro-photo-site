import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose mt-32" }, _attrs))}><div class="divide-y divide-zinc-900/10 dark:divide-zinc-100/10"><h2 class="text-2xl font-bold leading-10 tracking-tight text-zinc-900 dark:text-zinc-100">`);
  ssrRenderSlot(_ctx.$slots, "title", {}, () => {
    _push(`Frequently asked questions`);
  }, _push, _parent);
  _push(`</h2><dl class="mt-10 space-y-6 divide-y divide-zinc-900/10 dark:divide-zinc-100/10">`);
  ssrRenderSlot(_ctx.$slots, "items", {}, null, _push, _parent);
  _push(`</dl></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/SectionFaq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SectionFaq = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { SectionFaq as default };
//# sourceMappingURL=SectionFaq-f933a46d.mjs.map
