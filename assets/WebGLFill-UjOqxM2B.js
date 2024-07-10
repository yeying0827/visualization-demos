import{W as l}from"./WebGL--ZG1Z5xu.js";import{e as p}from"./polygon-JGRpudzN.js";import{_ as d,o as _,a as m,c as u,F as g,p as v,f,b as s}from"./index-a4tGsWeP.js";import"./vector2d-Djg1LsDx.js";import"./_commonjsHelpers-5-cIlDoe.js";const a=e=>(v("data-v-e42de7e6"),e=e(),f(),e),b=a(()=>s("h3",null,"WebGL填充多边形",-1)),h=a(()=>s("canvas",{height:"512",width:"512"},null,-1)),w={__name:"WebGLFill",setup(e){return _(()=>{const t=document.querySelector("canvas").getContext("webgl"),o=[[-.7,.5],[-.4,.3],[-.25,.71],[-.1,.56],[-.1,.13],[.4,.21],[0,-.6],[-.3,-.3],[-.6,-.3],[-.45,0]].flat(),c=p(o),i=`
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `,r=`
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;new l(t,i,r).drawPolygon(o,c,void 0,t.LINE_STRIP)}),(n,t)=>(m(),u(g,null,[b,h],64))}},B=d(w,[["__scopeId","data-v-e42de7e6"]]);export{B as default};
