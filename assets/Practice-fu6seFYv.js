import{G as F}from"./gl-renderer--j5iNyII.js";import{n as j}from"./Mat3Func-BobKkriz.js";import{r as f,b as w,f as d}from"./3d-_0_kXk_T.js";import{_ as z,r as _,o as L,w as B,a as h,c as x,b as c,F as C,d as D,n as G,t as I,p as R,f as E}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";import"./Mat4Func-Daqwyn3W.js";import"./Vec3Func-Lanfgsq-.js";const T=n=>(R("data-v-c1a0f9ba"),n=n(),E(),n),q=T(()=>c("h3",null,"课后练习",-1)),A=["onClick"],b=`
  attribute vec3 a_vertexPosition;
  attribute vec4 color;

  varying vec4 vColor;
  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);
  }
`,M=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`,N=`
  attribute vec3 a_vertexPosition;
  attribute vec4 color;
  attribute vec3 normal;

  varying vec4 vColor;
  varying float vCos; // 点光源与法线的夹角余弦
  uniform mat4 projectionMatrix; // 投影矩阵
  uniform mat4 modelMatrix; // 模型矩阵
  uniform mat3 normalMatrix; // 法向量矩阵（模型矩阵的逆转置矩阵）

  const vec3 lightPosition = vec3(1, 0, 0); // 点光源坐标

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    vec4 pos = modelMatrix * vec4(a_vertexPosition, 1.0);
    vec3 invLight = lightPosition - pos.xyz;
    vec3 norm = normalize(normalMatrix * normal);
    vCos = max(dot(normalize(invLight), norm), 0.0);
    gl_Position = projectionMatrix * pos;
  }
`,V=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 lightColor;

  varying vec4 vColor;
  varying float vCos;

  void main() {
    gl_FragColor.rgb = vColor.rgb + vCos * lightColor.a * lightColor.rgb;
    gl_FragColor.a = vColor.a;
  }
`,X={__name:"Practice",setup(n){const y=[{name:"长方体"},{name:"正四面体"},{name:"正四面体（点光源）"}],e=_(0),p=_(null);let o;L(()=>{o=new F(p.value,{depth:!0}),u(e.value),B(e,()=>{u(e.value)})});const u=g=>{let a=0,t=0,r=0;function i(){a+=.003,t+=.005,r+=.007,o.uniforms.modelMatrix=d(a,t,r),requestAnimationFrame(i)}function P(){a+=.003,t+=.005,r+=.007;const s=d(a,t,r);o.uniforms.modelMatrix=s,o.uniforms.normalMatrix=j([],s),requestAnimationFrame(i)}switch(g){case 0:const s=o.compileSync(M,b);o.useProgram(s);const m=w(.3,.5,.8,[[0,.5,0,1],[1,0,0,1],[0,0,1,1]]);o.setMeshData([{positions:m.positions,attributes:{color:m.color},cells:m.cells}]),o.uniforms.projectionMatrix=[1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1],i(),o.render();break;case 1:const S=o.compileSync(M,b);o.useProgram(S);const v=f(.5,[[1,0,0,1],[0,0,1,1],[0,1,0,1],[0,.5,0,1]]);o.setMeshData([{positions:v.positions,attributes:{color:v.color},cells:v.cells}]),o.uniforms.projectionMatrix=[1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1],i(),o.render();break;case 2:const k=o.compileSync(V,N);o.useProgram(k);const l=f(.5,[[1,0,0,1],[0,0,1,1],[0,1,0,1],[.5,.5,.5,1]]);o.setMeshData([{positions:l.positions,attributes:{color:l.color,normal:l.normal},cells:l.cells}]),o.uniforms.projectionMatrix=[1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1],o.uniforms.lightColor=[1,0,0,.8],P(),o.render();break}};return(g,a)=>(h(),x(C,null,[q,c("div",null,[(h(),x(C,null,D(y,(t,r)=>c("span",{class:G(["filter-type",{active:e.value===r}]),onClick:i=>e.value=r},I(t.name),11,A)),64))]),c("canvas",{width:"512",height:"512",ref_key:"glRef",ref:p},null,512)],64))}},Q=z(X,[["__scopeId","data-v-c1a0f9ba"]]);export{Q as default};
