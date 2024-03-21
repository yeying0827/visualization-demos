import"./polygon-bEkpc2Au.js";import{W as p}from"./WebGL--Xk5Jn9d.js";import{e as u}from"./parametric-nO2vAiAA.js";import{V as v}from"./vector2d-Djg1LsDx.js";import{_ as f,f as g,o as h,c as w,F as b,p as x,a as y,b as n}from"./index-oy9D8ZzD.js";const a=o=>(x("data-v-bde585d7"),o=o(),y(),o),C=a(()=>n("h3",null,"使用Tess2",-1)),F=a(()=>n("canvas",{height:"512",width:"512",id:"ellipse"},null,-1)),I=a(()=>n("canvas",{height:"512",width:"512",id:"five"},null,-1)),S={__name:"Tess2Fill",setup(o){return g(()=>{const t=`
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
  `;let r=document.querySelector("#ellipse"),i=r.getContext("webgl"),c=new p(i,t,s);const d={vertices:u(0,0,.5,1)};c.drawPolygonTess2(d.vertices,{color:[.5,.8,.5,1]}),r=document.querySelector("#five"),i=r.getContext("webgl"),c=new p(i,t,s);const e=[new v(0,1)];for(let l=1;l<=4;l++){const m=e[0].copy().rotate(l*Math.PI*.4);e.push(m)}const _={vertices:[e[0],e[2],e[4],e[1],e[3]]};c.drawPolygonTess2(_.vertices,{color:[.5,.8,.5,1]})}),(t,s)=>(h(),w(b,null,[C,F,I],64))}},q=f(S,[["__scopeId","data-v-bde585d7"]]);export{q as default};
