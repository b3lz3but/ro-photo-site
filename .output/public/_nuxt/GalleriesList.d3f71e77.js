import{_ as m}from"./GalleryListItem.vue.5459410c.js";import{u as g}from"./asyncData.d2d90703.js";import{g as u,D as y,k as f,x as n,o as s,c as t,F as h,B as k,a as B,A as w,E as x,G as v}from"./entry.92fb77ed.js";import"./nuxt-img.59c64db2.js";import"./nuxt-link.1a9f8510.js";const A={key:0,class:"not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"},C={key:1},G=B("p",{class:""}," No galleries found. ",-1),L=[G],T=u({__name:"GalleriesList",props:{path:{type:String,default:"galleries"}},async setup(l){let e,a;const i=l,{data:c}=([e,a]=y(async()=>g("galleries",async()=>await x(v(i.path)).find())),e=await e,a(),e),o=f(()=>c.value||[]);return(D,E)=>{var r;const _=m;return(r=n(o))!=null&&r.length?(s(),t("div",A,[(s(!0),t(h,null,k(n(o),(p,d)=>(s(),w(_,{key:d,gallery:p},null,8,["gallery"]))),128))])):(s(),t("div",C,L))}}});export{T as default};