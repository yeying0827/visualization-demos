import{A as d}from"./animation-hjFUvrA4.js";import{B as k}from"./index-deXAAbbq.js";import{_ as h,r as y,o as S,a as f,c as _,b as i,F as p,d as b,n as v,t as x,p as B,f as E}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const w=l=>(B("data-v-137763f8"),l=l(),E(),l),C=w(()=>i("h3",null,"插值与缓动函数",-1)),I=["onClick"],$={style:{position:"relative"}},z={__name:"Easing",setup(l){const g=[{name:"匀速"},{name:"初速度为0的匀加速"},{name:"末速度为0的匀减速"},{name:"使用缓动函数"},{name:"贝塞尔缓动函数"},{name:"CSS3:贝塞尔缓动函数"}],t=y(0);return S(()=>{const c=document.querySelector(".block"),u=new d({duration:3e3}),m=new d({duration:3e3,easing:a=>a**2}),r=new d({duration:3e3,easing:k(.5,-1.5,.5,2.5)});document.addEventListener("click",()=>{t.value<=2?u.animate({el:c,start:100,end:400},({target:{el:a,start:n,end:s},timing:{p:e}})=>{t.value===1&&(e=e**2),t.value===2&&(e=e*(2-e));const o=n*(1-e)+s*e;a.style.left=`${o}px`}):t.value===3?m.animate({el:c,start:100,end:400},({target:{el:a,start:n,end:s},timing:{p:e}})=>{const o=n*(1-e)+s*e;a.style.left=`${o}px`}):t.value===4&&r.animate({el:c,start:100,end:400},({target:{el:a,start:n,end:s},timing:{p:e}})=>{const o=n*(1-e)+s*e;a.style.left=`${o}px`})})}),(c,u)=>(f(),_(p,null,[C,i("div",null,[(f(),_(p,null,b(g,(m,r)=>i("span",{class:v(["filter-type",{active:t.value===r}]),onClick:a=>t.value=r},x(m.name),11,I)),64))]),i("div",$,[i("div",{class:v(["block",{animate:t.value===5}])},null,2)])],64))}},D=h(z,[["__scopeId","data-v-137763f8"]]);export{D as default};
