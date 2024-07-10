import{G as F}from"./gl-renderer--j5iNyII.js";import{A as k}from"./animation-hjFUvrA4.js";import{b as w,c as T}from"./glslFunc-l-MaHrBn.js";import{_ as z,r as f,o as E,w as U,a as g,c as d,b as c,F as _,d as G,n as L,t as M,p as A,f as D}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const B=t=>(A("data-v-8e8d76bd"),t=t(),D(),t),I=B(()=>c("h3",null,"在着色器中实现缓动函数",-1)),R=["onClick"],$=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  uniform vec2 translation;

  void main() {
    gl_PointSize = 1.0;
    mat3 transformMatrix = mat3(
      1, 0, 0,
      0, 1, 0,
      translation, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`,b=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 color;

  void main() {
    gl_FragColor = color;
  }
`,q=`
  attribute vec2 a_vertexPosition;
  uniform vec4 uFromTo;
  uniform float uTime;

  float easing(in float p) {
    // return smoothstep(0.0, 1.0, p);
    // return clamp(p * p, 0.0, 1.0); // 匀加速

    return clamp(p * (2.0 - p), 0.0, 1.0); // 0->1->0 // 先减速后加速

    // if(p < 1.0) return clamp(p * (2.0 - p), 0.0, 1.0);
    // else return 1.0;
  }

  void main() {
    gl_PointSize = 1.0;
    vec2 from = uFromTo.xy;
    vec2 to = uFromTo.zw;
    float p = easing(uTime / 2.0);
    vec2 translation = mix(from, to, p);
    mat3 transformMatrix = mat3(
      1, 0, 0,
      0, 1, 0,
      translation, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`,V=`
  attribute vec2 a_vertexPosition;
  attribute vec4 color;

  varying vec4 vColor;

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,N=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`,j=`
  #ifdef GL_ES
  precision highp float;
  #endif

  float easing(in float p) {
    return smoothstep(0.0, 1.0, p);
    // return clamp(p * p, 0.0, 1.0);
    // return clamp(p * (2.0 - p), 0.0, 1.0);
  }

  varying vec2 vUv;
  uniform vec4 fromColor;
  uniform vec4 toColor;

  void main() {
    float d = easing(vUv.x);
    gl_FragColor = mix(fromColor, toColor, d);
  }
`,h=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,H={__name:"Easing",setup(t){const x=[{name:"匀速运动-Animator"},{name:"缓动函数-Vertex Shader"},{name:"线性插值-Fragment Shader"},{name:"非线性插值-Fragment Shader"},{name:"非线性插值-bezier"}],e=f(4),l=f(null),P=`
  #ifdef GL_ES
  precision highp float;
  #endif

  float easing(in float p) {
    return smoothstep(0.0, 1.0, p);
    // return clamp(p * p, 0.0, 1.0);
    // return clamp(p * (2.0 - p), 0.0, 1.0);
  }
  ${w.cubic_bezier}
  ${T.hsb}

  varying vec2 vUv;

  void main() {
    // float d = easing(vUv.x);
    // float d = vUv.x;
    float d = cubic_bezier(vUv.x, 0.5, -1.5, 0.5, 2.5);
    gl_FragColor.rgb = hsb2rgb(vec3(d, 1.0, 1.0));
    gl_FragColor.a = 1.0;
  }
`;let o;E(()=>{o=new F(l.value),m(e.value),l.value.addEventListener("click",()=>{m(e.value)}),U(e,()=>{m(e.value)})});const m=a=>{switch(a){case 0:const n=o.compileSync(b,$);o.useProgram(n),o.uniforms.color=[1,0,0,1],o.uniforms.translation=[-.5,0],new k({duration:2e3}).animate(o,({target:v,timing:u})=>{v.uniforms.translation=[-.5*(1-u.p)+.5*u.p,0]}),r({positions:[[-.25,-.25],[-.25,.25],[.25,.25],[.25,-.25]]}),o.render();break;case 1:const i=o.compileSync(b,q);o.useProgram(i),o.uniforms.uTime=0,o.uniforms.uFromTo=[-.5,0,.5,0],o.uniforms.color=[1,0,0,1];let s=null;requestAnimationFrame(function v(){s=s||Date.now(),o.uniforms.uTime=(Date.now()-s)/1e3,requestAnimationFrame(v)}),r({positions:[[-.25,-.25],[-.25,.25],[.25,.25],[.25,-.25]]}),o.render();break;case 2:const S=o.compileSync(N,V);o.useProgram(S),r({positions:[[-.5,-.25],[-.5,.25],[.5,.25],[.5,-.25]],attributes:{color:[[1,0,0,1],[1,0,0,1],[0,.5,0,1],[0,.5,0,1]]}}),o.render();break;case 3:const C=o.compileSync(j,h);o.useProgram(C),r({positions:[[-.5,-.25],[-.5,.25],[.5,.25],[.5,-.25]]}),o.uniforms.fromColor=[1,0,0,1],o.uniforms.toColor=[0,.5,0,1],o.render();break;case 4:const y=o.compileSync(P,h);o.useProgram(y),r({positions:[[-.5,-.25],[-.5,.25],[.5,.25],[.5,-.25]]}),o.render();break}},r=({positions:a=[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:n={}})=>{o.setMeshData([{positions:a,attributes:{uv:[[0,0],[0,1],[1,1],[1,0]],...n},cells:[[0,1,2],[2,0,3]]}])};return(a,n)=>(g(),d(_,null,[I,c("div",null,[(g(),d(_,null,G(x,(p,i)=>c("span",{class:L(["filter-type",{active:e.value===i}]),onClick:s=>e.value=i},M(p.name),11,R)),64))]),c("canvas",{width:"512",height:"512",ref_key:"glRef",ref:l,style:{"background-color":"#eee"}},null,512)],64))}},X=z(H,[["__scopeId","data-v-8e8d76bd"]]);export{X as default};
