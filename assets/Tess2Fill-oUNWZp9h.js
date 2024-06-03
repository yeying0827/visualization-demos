import{_ as v,f as g,W as d,k as h,V as m,o as f,c as w,F as b,p as x,a as y,b as a}from"./index-8v8F2D54.js";const r=o=>(x("data-v-bde585d7"),o=o(),y(),o),C=r(()=>a("h3",null,"使用Tess2",-1)),F=r(()=>a("canvas",{height:"512",width:"512",id:"ellipse"},null,-1)),I=r(()=>a("canvas",{height:"512",width:"512",id:"five"},null,-1)),S={__name:"Tess2Fill",setup(o){return g(()=>{const t=`
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
  `;let c=document.querySelector("#ellipse"),l=c.getContext("webgl"),n=new d(l,t,s);const p={vertices:h(0,0,.5,1)};n.drawPolygonTess2(p.vertices,{color:[.5,.8,.5,1]}),c=document.querySelector("#five"),l=c.getContext("webgl"),n=new d(l,t,s);const e=[new m(0,1)];for(let i=1;i<=4;i++){const u=e[0].copy().rotate(i*Math.PI*.4);e.push(u)}const _={vertices:[e[0],e[2],e[4],e[1],e[3]]};n.drawPolygonTess2(_.vertices,{color:[.5,.8,.5,1]})}),(t,s)=>(f(),w(b,null,[C,F,I],64))}},P=v(S,[["__scopeId","data-v-bde585d7"]]);export{P as default};
