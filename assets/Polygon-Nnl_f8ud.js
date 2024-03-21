import{W as y}from"./WebGL--Xk5Jn9d.js";import{_ as P,f as b,o as M,c as A}from"./index-oy9D8ZzD.js";import"./polygon-bEkpc2Au.js";import"./vector2d-Djg1LsDx.js";const C={width:"512",height:"512"},S={__name:"Polygon",setup(k){return b(()=>{const c=document.querySelector("canvas").getContext("webgl"),u=`
    attribute vec2 position;

    void main() {
      gl_PointSize = 1.0;
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `,f=`
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,d=new y(c,u,f);function h(a,r,i,l,p){const _=Math.sin,m=Math.cos,x=Math.PI/p,n=[],w=2*p;for(let o=0;o<w;o++){const t=o*x;if(o&1){const e=a+l*m(t),s=r+l*_(t);n.push(e,s)}else{const e=a+i*m(t),s=r+i*_(t);n.push(e,s)}}return new Float32Array(n)}const v=h(0,0,.3,.6,6);d.drawSimple(v)}),(g,c)=>(M(),A("canvas",C))}},q=P(S,[["__scopeId","data-v-20f14387"]]);export{q as default};
