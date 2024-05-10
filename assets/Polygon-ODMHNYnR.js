import{_ as y,f as P,W as b,o as M,c as A}from"./index-j31-AAIX.js";const C={width:"512",height:"512"},S={__name:"Polygon",setup(k){return P(()=>{const c=document.querySelector("canvas").getContext("webgl"),m=`
    attribute vec2 position;

    void main() {
      gl_PointSize = 1.0;
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `,d=`
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,f=new b(c,m,d);function h(a,i,r,l,p){const _=Math.sin,g=Math.cos,x=Math.PI/p,n=[],w=2*p;for(let t=0;t<w;t++){const o=t*x;if(t&1){const e=a+l*g(o),s=i+l*_(o);n.push(e,s)}else{const e=a+r*g(o),s=i+r*_(o);n.push(e,s)}}return new Float32Array(n)}const v=h(0,0,.3,.6,6);f.drawSimple(v)}),(u,c)=>(M(),A("canvas",C))}},F=y(S,[["__scopeId","data-v-20f14387"]]);export{F as default};
