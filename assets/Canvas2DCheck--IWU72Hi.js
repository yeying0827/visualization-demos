import{V as h}from"./vector2d-Djg1LsDx.js";import{C as y}from"./Canvas-1nIGdNzG.js";import{e as C,i as c}from"./polygon-JGRpudzN.js";import{_ as P,o as S,a as x,c as w,F as D,p as I,f as k,b as i}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const r=s=>(I("data-v-1d600fd3"),s=s(),k(),s),B=r(()=>i("h3",null,"Canvas2D判断边界",-1)),b=r(()=>i("canvas",{width:"512",height:"512"},null,-1)),V={__name:"Canvas2DCheck",setup(s){return S(()=>{const t=document.querySelector("canvas"),l=t.getContext("2d"),e=new y(l),o=[[-.7,.5],[-.4,.3],[-.25,.71],[-.1,.56],[-.1,.13],[.4,.21],[0,-.6],[-.3,-.3],[-.6,-.3],[-.45,0]].map(n=>[n[0]*256,n[1]*256]),f=o.flat(),p=C(f);e.fillPolygon(o),e.fillPolygon([[100,100],[100,200],[150,200]],{fillStyle:"blue"});const{left:d,top:m}=t.getBoundingClientRect();t.addEventListener("mousemove",n=>{const{x:u,y:_}=n,g=u-d,v=_-m;l.clearRect(-256,-256,512,512);const a=new h(g-t.width/2,t.height/2-v);c({vertices:[[100,100],[100,200],[150,200]],cells:[0,1,2]},a)||c({vertices:o,cells:p},a)?(e.fillPolygon(o,{fillStyle:"green"}),e.fillPolygon([[100,100],[100,200],[150,200]],{fillStyle:"orange"})):(e.fillPolygon(o),e.fillPolygon([[100,100],[100,200],[150,200]],{fillStyle:"blue"}))})}),(t,l)=>(x(),w(D,null,[B,b],64))}},M=P(V,[["__scopeId","data-v-1d600fd3"]]);export{M as default};
