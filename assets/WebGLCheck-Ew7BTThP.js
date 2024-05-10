import{e as L,d as S}from"./parametric-nO2vAiAA.js";import{_ as k,f as F,W as _,g as m,V as w,i as M,o as W,c as B,F as G,p as q,a as E,b as r}from"./index-g0v-nOv3.js";const c=l=>(q("data-v-6270ea0b"),l=l(),E(),l),N=c(()=>r("h3",null,"WebGLCheck判断边界",-1)),V=c(()=>r("canvas",{height:"512",width:"512"},null,-1)),A=c(()=>r("canvas",{height:"512",width:"512",id:"ellipse"},null,-1)),O=c(()=>r("canvas",{height:"512",width:"512",id:"five"},null,-1)),D={__name:"WebGLCheck",setup(l){return F(()=>{let n=document.querySelector("canvas"),p=n.getContext("webgl");const g=`
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
  `;let u=new _(p,g,d);const e={vertices:S((t,s)=>s*Math.cos(t)**3,(t,s)=>s*Math.sin(t)**3)(0,Math.PI*2,50,1).points};e.points=e.vertices.flat(),e.triangles=m(e.points),u.drawPolygon(e.points,e.triangles);const{left:b,top:C}=n.getBoundingClientRect();n.addEventListener("mousemove",t=>{const{x:s,y:P}=t,y=s-b,x=P-C,I=new w((y-n.width/2)/256,(n.height/2-x)/256);M({vertices:e.vertices,cells:e.triangles},I)?u.drawPolygon(e.points,e.triangles,[["uColor",[0,.5,0,1],"4fv"]]):u.drawPolygon(e.points,e.triangles)});let v=document.querySelector("#ellipse"),h=v.getContext("webgl"),f=new _(h,g,d);const i={vertices:L(0,0,.5,1)};i.points=i.vertices.flat(),i.triangles=m(i.points),f.drawPolygon(i.points,i.triangles,[["uColor",[.5,.8,.5,1],"4fv"]]),v=document.querySelector("#five"),h=v.getContext("webgl"),f=new _(h,g,d);const o=[new w(0,1)];for(let t=1;t<=4;t++){const s=o[0].copy().rotate(t*Math.PI*.4);o.push(s)}const a={vertices:[o[0],o[2],o[4],o[1],o[3]]};a.points=a.vertices.flat(),a.triangles=m(a.points),f.drawPolygon(a.points,a.triangles,[["uColor",[.5,.5,.8,1],"4fv"]],p.LINE_LOOP)}),(n,p)=>(W(),B(G,null,[N,V,A,O],64))}},Y=k(D,[["__scopeId","data-v-6270ea0b"]]);export{Y as default};
