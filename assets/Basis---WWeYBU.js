import{V as o}from"./vector2d-Djg1LsDx.js";import{C as f}from"./Canvas-1nIGdNzG.js";import{_ as g,f as m,o as x,c as v,F as I,p as B,a as S,b as h}from"./index-s2wsuPQw.js";const _=a=>(B("data-v-d9e61ad2"),a=a(),S(),a),b=_(()=>h("h3",null,"向量乘法的基础使用",-1)),C=_(()=>h("canvas",{width:"512",height:"512"},null,-1)),L={__name:"Basis",setup(a){let n=null;m(()=>{const t=document.querySelector("canvas"),e=t.getContext("2d");n=new f(e),n.drawAxis(),l();const s=t.getBoundingClientRect(),c=s.left,r=s.top;t.addEventListener("click",p=>{e.clearRect(-t.width/2,-t.height/2,t.width,t.height),n.drawAxis(),l();const i=p.clientX-c-t.width/2,d=t.height/2-(p.clientY-r);console.log(c,r,i,d);const u=new o(i,d),w=new o(0,1).dot(u.normalize())>=Math.cos(Math.PI/6);n.drawText(w?"点在夹角内":"不在夹角内",-100,100,"orange"),e.beginPath(),e.arc(i,d,4,0,Math.PI*2),e.fillStyle="purple",e.fill()})});function l(t){const e=new o(0,0),s=new o(-128,256),c=new o(128,256);n.drawLine(e,s,"blue"),n.drawLine(e,c,"blue")}return(t,e)=>(x(),v(I,null,[b,C],64))}},R=g(L,[["__scopeId","data-v-d9e61ad2"]]);export{R as default};
