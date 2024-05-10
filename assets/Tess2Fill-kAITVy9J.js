import{_ as v,f as m,W as p,V as g,o as h,c as f,F as w,p as b,a as x,b as r}from"./index-g0v-nOv3.js";import{e as y}from"./parametric-nO2vAiAA.js";const a=o=>(b("data-v-bde585d7"),o=o(),x(),o),C=a(()=>r("h3",null,"使用Tess2",-1)),F=a(()=>r("canvas",{height:"512",width:"512",id:"ellipse"},null,-1)),I=a(()=>r("canvas",{height:"512",width:"512",id:"five"},null,-1)),S={__name:"Tess2Fill",setup(o){return m(()=>{const t=`
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 1.0, 1.0);
    }
    `,s=`
    precision mediump float;
    uniform vec4 uColor; // 片段着色器

    void main() {
      gl_FragColor = uColor;
    }
  `;let c=document.querySelector("#ellipse"),l=c.getContext("webgl"),n=new p(l,t,s);const d={vertices:y(0,0,.5,1)};n.drawPolygonTess2(d.vertices,{color:[.5,.8,.5,1]}),c=document.querySelector("#five"),l=c.getContext("webgl"),n=new p(l,t,s);const e=[new g(0,1)];for(let i=1;i<=4;i++){const u=e[0].copy().rotate(i*Math.PI*.4);e.push(u)}const _={vertices:[e[0],e[2],e[4],e[1],e[3]]};n.drawPolygonTess2(_.vertices,{color:[.5,.8,.5,1]})}),(t,s)=>(h(),f(w,null,[C,F,I],64))}},B=v(S,[["__scopeId","data-v-bde585d7"]]);export{B as default};
