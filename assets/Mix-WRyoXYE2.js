import{l as h,g,a as x,t as D}from"./ImageHandler-5dxAiF35.js";import{t as B,b as C,a as S,s as M,g as F}from"./color-matrix-ThnoXl7S.js";import{g as d}from"./girl2-nbmzVAOj.js";import{_ as R,r as m,o as T,w as z,a as p,c as _,b as c,F as v,d as E,n as L,t as N,p as V,f as $}from"./index-a4tGsWeP.js";const j=s=>(V("data-v-02ad5247"),s=s(),$(),s),q=j(()=>c("h3",null,"叠加使用：普通滤镜+高斯模糊",-1)),A=["onClick"],G={__name:"Mix",setup(s){const f=[{name:"原图"},{name:"滤镜：高斯模糊+灰度化+增强饱和度、对比度、亮度"}],e=m(1),t=m(null);let r;T(()=>{r=t.value.getContext("2d"),l(e.value),z(e,()=>{l(e.value)})});const l=i=>{switch(i){case 0:console.log("case 0"),async function(){const o=await h(d),a=g(o);t.value.width=a.width,t.value.height=a.height,r.putImageData(a,0,0)}();break;case 1:console.log("case 1"),async function(){const o=await h(d),a=g(o),{width:n,height:u,data:w}=a;x(w,n,u),D(a,({r:b,g:k,b:I,a:y})=>B([b,k,I,y],F(.5),M(1.2),S(1.1),C(1.2))),t.value.width=a.width,t.value.height=a.height,r.putImageData(a,0,0)}();break}};return(i,o)=>(p(),_(v,null,[q,c("div",null,[(p(),_(v,null,E(f,(a,n)=>c("span",{class:L(["filter-type",{active:e.value===n}]),onClick:u=>e.value=n},N(a.name),11,A)),64))]),c("canvas",{ref_key:"canvasRef",ref:t,width:"0",height:"0"},null,512)],64))}},P=R(G,[["__scopeId","data-v-02ad5247"]]);export{P as default};