import{_ as g,r as l,o as T,w as F,a as f,c as h,b as e,F as y,d as S,e as c,v as i,n as A,t as B,p as D,f as I}from"./index-a4tGsWeP.js";const k=s=>(D("data-v-9e591593"),s=s(),I(),s),R=k(()=>e("h3",null,"动画的三种形式",-1)),q=["onClick"],x={style:{position:"relative"}},C=k(()=>e("div",{class:"fixed-frame"},null,-1)),$=[C],O={style:{position:"relative"}},W={style:{position:"relative"}},z={__name:"ThreeWays",setup(s){const w=[{name:"固定帧动画"},{name:"非固定帧动画-增量动画"},{name:"非固定帧动画-时序动画"}],t=l(2),u=l(null),d=l(null);T(()=>{_(t.value),F(t,()=>{_(t.value)})});const _=v=>{switch(v){case 0:break;case 1:let m=0;requestAnimationFrame(function r(){u.value.style.transform=`rotate(${m++}deg)`,requestAnimationFrame(r)});break;case 2:let p=function(){a=a===null?Date.now():a;const r=(Date.now()-a)/n,b=o+r*360;d.value.style.transform=`rotate(${b}deg)`,requestAnimationFrame(p)};const o=0,n=2e3;let a=null;p();break}};return(v,m)=>(f(),h(y,null,[R,e("div",null,[(f(),h(y,null,S(w,(o,n)=>e("span",{class:A(["filter-type",{active:t.value===n}]),onClick:a=>t.value=n},B(o.name),11,q)),64))]),c(e("div",x,$,512),[[i,t.value===0]]),c(e("div",O,[e("div",{class:"increase-frame",ref_key:"increaseRef",ref:u},null,512)],512),[[i,t.value===1]]),c(e("div",W,[e("div",{class:"increase-frame",ref_key:"timeOrderRef",ref:d},null,512)],512),[[i,t.value===2]])],64))}},L=g(z,[["__scopeId","data-v-9e591593"]]);export{L as default};