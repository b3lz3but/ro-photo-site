import _sfc_main$1 from './AwardsItem-f8eab22b.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AwardsList",
  __ssrInlineRender: true,
  props: {
    titleText: {
      type: String,
      required: false
    },
    awards: {
      type: Array,
      required: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AwardsItem = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-prose flex flex-col gap-4 lg:w-1/2" }, _attrs))}><h3 class="uppercase tracking-widest font-light text-zinc-900 dark:text-orange-600">${ssrInterpolate(__props.titleText)}</h3><ul class="space-y-4"><!--[-->`);
      ssrRenderList(__props.awards, (item, index) => {
        _push(ssrRenderComponent(_component_AwardsItem, {
          key: index,
          title: item.title,
          year: item.year,
          description: item.description
        }, null, _parent));
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/AwardsList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=AwardsList-58e0d170.mjs.map
