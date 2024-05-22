import{_ as r,f as d,m as _,W as p,o as u,c as g,F as v,p as m,a as b,b as s}from"./index-bF0I-6KF.js";const a=e=>(m("data-v-e42de7e6"),e=e(),b(),e),f=a(()=>s("h3",null,"WebGL填充多边形",-1)),h=a(()=>s("canvas",{height:"512",width:"512"},null,-1)),w={__name:"WebGLFill",setup(e){return d(()=>{const t=document.querySelector("canvas").getContext("webgl"),o=[[-.7,.5],[-.4,.3],[-.25,.71],[-.1,.56],[-.1,.13],[.4,.21],[0,-.6],[-.3,-.3],[-.6,-.3],[-.45,0]].flat(),c=_(o),i=`
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `,l=`
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;new p(t,i,l).drawPolygon(o,c,void 0,t.LINE_STRIP)}),(n,t)=>(u(),g(v,null,[f,h],64))}},L=r(w,[["__scopeId","data-v-e42de7e6"]]);export{L as default};
