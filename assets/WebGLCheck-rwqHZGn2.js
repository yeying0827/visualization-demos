import{_ as L,f as k,W as f,m,V as w,n as S,k as F,o as M,c as W,q,F as B,p as G,a as E,b as c}from"./index-bF0I-6KF.js";const r=l=>(G("data-v-6270ea0b"),l=l(),E(),l),N=r(()=>c("h3",null,"WebGLCheck判断边界",-1)),V=r(()=>c("canvas",{height:"512",width:"512"},null,-1)),A=r(()=>c("canvas",{height:"512",width:"512",id:"ellipse"},null,-1)),O=r(()=>c("canvas",{height:"512",width:"512",id:"five"},null,-1)),D={__name:"WebGLCheck",setup(l){return k(()=>{let n=document.querySelector("canvas"),p=n.getContext("webgl");const g=`
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
  `;let u=new f(p,g,d);const e={vertices:q((t,s)=>s*Math.cos(t)**3,(t,s)=>s*Math.sin(t)**3)(0,Math.PI*2,50,1).points};e.points=e.vertices.flat(),e.triangles=m(e.points),u.drawPolygon(e.points,e.triangles);const{left:b,top:C}=n.getBoundingClientRect();n.addEventListener("mousemove",t=>{const{x:s,y:P}=t,y=s-b,x=P-C,I=new w((y-n.width/2)/256,(n.height/2-x)/256);S({vertices:e.vertices,cells:e.triangles},I)?u.drawPolygon(e.points,e.triangles,[["uColor",[0,.5,0,1],"4fv"]]):u.drawPolygon(e.points,e.triangles)});let v=document.querySelector("#ellipse"),h=v.getContext("webgl"),_=new f(h,g,d);const i={vertices:F(0,0,.5,1)};i.points=i.vertices.flat(),i.triangles=m(i.points),_.drawPolygon(i.points,i.triangles,[["uColor",[.5,.8,.5,1],"4fv"]]),v=document.querySelector("#five"),h=v.getContext("webgl"),_=new f(h,g,d);const o=[new w(0,1)];for(let t=1;t<=4;t++){const s=o[0].copy().rotate(t*Math.PI*.4);o.push(s)}const a={vertices:[o[0],o[2],o[4],o[1],o[3]]};a.points=a.vertices.flat(),a.triangles=m(a.points),_.drawPolygon(a.points,a.triangles,[["uColor",[.5,.5,.8,1],"4fv"]],p.LINE_LOOP)}),(n,p)=>(M(),W(B,null,[N,V,A,O],64))}},X=L(D,[["__scopeId","data-v-6270ea0b"]]);export{X as default};
