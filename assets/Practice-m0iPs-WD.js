import{A as m}from"./animation-hjFUvrA4.js";import{_ as p,r as d,o as f,a as v,c as g,b as s,t as h,F as b,p as w,f as k}from"./index-a4tGsWeP.js";const x=n=>(w("data-v-113a7500"),n=n(),k(),n),y=x(()=>s("h3",null,"课后练习",-1)),I={class:"container"},S={__name:"Practice",setup(n){const u=d(null),e=d(200);return f(()=>{let t=1e3,l=.5;const _=u.value;document.addEventListener("click",()=>{e.value=200,t=1e3,async function(){for(;t>16;)console.log(t),await new m({duration:t,easing:a=>a**2}).animate({el:_,start:e.value,end:0},({target:{el:a,start:c,end:i},timing:{p:o}})=>{const r=c*(1-o)+i*o;a.style.bottom=`${r}px`}),e.value=Math.floor(e.value*l),await new m({duration:t,easing:a=>a*(2-a)}).animate({el:_,start:0,end:e.value},({target:{el:a,start:c,end:i},timing:{p:o}})=>{const r=c*(1-o)+i*o;a.style.bottom=`${r}px`}),t=(t**2*l)**.5}()})}),(t,l)=>(v(),g(b,null,[y,s("p",null,h(e.value),1),s("div",I,[s("div",{class:"block",ref_key:"ballRef",ref:u},null,512)])],64))}},M=p(S,[["__scopeId","data-v-113a7500"]]);export{M as default};
