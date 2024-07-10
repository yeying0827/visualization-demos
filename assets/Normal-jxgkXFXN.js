import{G as c}from"./gl-renderer--j5iNyII.js";import{a as v,f as g}from"./3d-_0_kXk_T.js";import{n as f}from"./Mat3Func-BobKkriz.js";import{r as u,o as p,a as d,c as h,b as s,F as _}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";import"./Mat4Func-Daqwyn3W.js";import"./Vec3Func-Lanfgsq-.js";const x=s("h3",null,"法向量的使用：点光源光照效果",-1),C=`
  attribute vec3 a_vertexPosition; // 1:把顶点从vec2扩展到vec3
  attribute vec4 color; // 四维向量
  attribute vec3 normal; // 4:法向量

  varying vec4 vColor;
  varying float vCos; // 点光源与法线的夹角余弦
  uniform mat4 projectionMatrix; // 2:投影矩阵-变换坐标系
  uniform mat4 modelMatrix; // 3:模型矩阵-使几何体旋转等变换
  uniform mat3 normalMatrix; // 4:法向量矩阵（模型矩阵的逆转置矩阵）

  const vec3 lightPosition = vec3(1, 0, 0); // 点光源坐标

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    vec4 pos = modelMatrix * vec4(a_vertexPosition, 1.0);
    vec3 invLight = lightPosition - pos.xyz;
    vec3 norm = normalize(normalMatrix * normal); // 法向量矩阵 乘以 法向量 => 变换后的法向量
    vCos = max(dot(normalize(invLight), norm), 0.0); // （归一化后的）光源向量与法向量的点积
    gl_Position = projectionMatrix * pos;
  }
`,M=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 lightColor;

  varying vec4 vColor;
  varying float vCos;

  void main() {
    gl_FragColor.rgb = vColor.rgb + vCos * lightColor.a * lightColor.rgb; // 叠加光照
    gl_FragColor.a = vColor.a;
  }
`,B={__name:"Normal",setup(y){const t=u(null);let o;return p(()=>{o=new c(t.value,{depth:!0});const r=v(.5,1,30,[0,0,1,1],[.5,.5,.5,1]),e=o.compileSync(M,C);o.useProgram(e),o.setMeshData([{positions:r.positions,attributes:{color:r.color,normal:r.normal},cells:r.cells}]),o.uniforms.projectionMatrix=[1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1],o.uniforms.lightColor=[1,0,0,.8];let i=0,a=0,n=0;function l(){i+=.003,a+=.005,n+=.007;const m=g(i,a,n);o.uniforms.modelMatrix=m,o.uniforms.normalMatrix=f([],m),requestAnimationFrame(l)}l(),o.render()}),(r,e)=>(d(),h(_,null,[x,s("canvas",{width:"512",height:"512",ref_key:"glRef",ref:t},null,512)],64))}};export{B as default};
