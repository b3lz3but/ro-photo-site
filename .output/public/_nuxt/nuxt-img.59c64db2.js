import{f as y,k as a,aq as o,g as h,r as f,u as S,M as b,n as z}from"./entry.92fb77ed.js";const w=()=>y().$img,k={src:{type:String,required:!0},format:{type:String,default:void 0},quality:{type:[Number,String],default:void 0},background:{type:String,default:void 0},fit:{type:String,default:void 0},modifiers:{type:Object,default:void 0},preset:{type:String,default:void 0},provider:{type:String,default:void 0},sizes:{type:[Object,String],default:void 0},preload:{type:Boolean,default:void 0},width:{type:[String,Number],default:void 0},height:{type:[String,Number],default:void 0},alt:{type:String,default:void 0},referrerpolicy:{type:String,default:void 0},usemap:{type:String,default:void 0},longdesc:{type:String,default:void 0},ismap:{type:Boolean,default:void 0},loading:{type:String,default:void 0},crossorigin:{type:[Boolean,String],default:void 0,validator:e=>["anonymous","use-credentials","",!0,!1].includes(e)},decoding:{type:String,default:void 0,validator:e=>["async","auto","sync"].includes(e)}},p=e=>{const l=a(()=>({provider:e.provider,preset:e.preset})),n=a(()=>({width:o(e.width),height:o(e.height),alt:e.alt,referrerpolicy:e.referrerpolicy,usemap:e.usemap,longdesc:e.longdesc,ismap:e.ismap,crossorigin:e.crossorigin===!0?"anonymous":e.crossorigin||void 0,loading:e.loading,decoding:e.decoding})),i=a(()=>({...e.modifiers,width:o(e.width),height:o(e.height),format:e.format,quality:e.quality,background:e.background,fit:e.fit}));return{options:l,attrs:n,modifiers:i}},q={...k,placeholder:{type:[Boolean,String,Number,Array],default:void 0}},_=h({name:"NuxtImg",props:q,emits:["load"],setup:(e,l)=>{const n=w(),i=p(e),v=f(!1),r=a(()=>n.getSizes(e.src,{...i.options.value,sizes:e.sizes,modifiers:{...i.modifiers.value,width:o(e.width),height:o(e.height)}})),m=a(()=>{const t=i.attrs.value;return e.sizes&&(t.sizes=r.value.sizes,t.srcset=r.value.srcset),t}),d=a(()=>{let t=e.placeholder;if(t===""&&(t=!0),!t||v.value)return!1;if(typeof t=="string")return t;const s=Array.isArray(t)?t:typeof t=="number"?[t,t]:[10,10];return n(e.src,{...i.modifiers.value,width:s[0],height:s[1],quality:s[2]||50},i.options.value)}),u=a(()=>e.sizes?r.value.src:n(e.src,i.modifiers.value,i.options.value)),c=a(()=>d.value?d.value:u.value);if(e.preload){const t=Object.values(r.value).every(s=>s);S({link:[{rel:"preload",as:"image",...t?{href:r.value.src,imagesizes:r.value.sizes,imagesrcset:r.value.srcset}:{href:c.value}}]})}const g=f();return b(()=>{if(d.value){const t=new Image;t.src=u.value,t.onload=s=>{g.value.src=u.value,v.value=!0,l.emit("load",s)}}else g.value.onload=t=>{l.emit("load",t)}}),()=>z("img",{ref:g,key:c.value,src:c.value,...m.value,...l.attrs})}});export{_};