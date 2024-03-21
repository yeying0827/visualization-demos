import{e as L,d as S}from"./parametric-nO2vAiAA.js";import{V as w}from"./vector2d-Djg1LsDx.js";import{e as m,i as k}from"./polygon-bEkpc2Au.js";import{W as _}from"./WebGL--Xk5Jn9d.js";import{_ as F,f as M,o as W,c as B,F as G,p as q,a as E,b as l}from"./index-oy9D8ZzD.js";const c=r=>(q("data-v-6270ea0b"),r=r(),E(),r),N=c(()=>l("h3",null,"WebGLCheck判断边界",-1)),V=c(()=>l("canvas",{height:"512",width:"512"},null,-1)),A=c(()=>l("canvas",{height:"512",width:"512",id:"ellipse"},null,-1)),O=c(()=>l("canvas",{height:"512",width:"512",id:"five"},null,-1)),D={__name:"WebGLCheck",setup(r){return M(()=>{let n=document.querySelector("canvas"),p=n.getContext("webgl");const g=`
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 1.0, 1.0);
    }
    `,d=`
    precision mediump float;
    uniform vec4 uColor; // 片段着色器

    void main() {
      gl_FragColor = uColor;
    }
  `;let u=new _(p,g,d);const t={vertices:S((e,s)=>s*Math.cos(e)**3,(e,s)=>s*Math.sin(e)**3)(0,Math.PI*2,50,1).points};t.points=t.vertices.flat(),t.triangles=m(t.points),u.drawPolygon(t.points,t.triangles);const{left:b,top:C}=n.getBoundingClientRect();n.addEventListener("mousemove",e=>{const{x:s,y:P}=e,y=s-b,x=P-C,I=new w((y-n.width/2)/256,(n.height/2-x)/256);k({vertices:t.vertices,cells:t.triangles},I)?u.drawPolygon(t.points,t.triangles,[["uColor",[0,.5,0,1],"4fv"]]):u.drawPolygon(t.points,t.triangles)});let v=document.querySelector("#ellipse"),h=v.getContext("webgl"),f=new _(h,g,d);const i={vertices:L(0,0,.5,1)};i.points=i.vertices.flat(),i.triangles=m(i.points),f.drawPolygon(i.points,i.triangles,[["uColor",[.5,.8,.5,1],"4fv"]]),v=document.querySelector("#five"),h=v.getContext("webgl"),f=new _(h,g,d);const o=[new w(0,1)];for(let e=1;e<=4;e++){const s=o[0].copy().rotate(e*Math.PI*.4);o.push(s)}const a={vertices:[o[0],o[2],o[4],o[1],o[3]]};a.points=a.vertices.flat(),a.triangles=m(a.points),f.drawPolygon(a.points,a.triangles,[["uColor",[.5,.5,.8,1],"4fv"]],p.LINE_LOOP)}),(n,p)=>(W(),B(G,null,[N,V,A,O],64))}},H=F(D,[["__scopeId","data-v-6270ea0b"]]);export{H as default};
