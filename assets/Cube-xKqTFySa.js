import{G as c}from"./gl-renderer--j5iNyII.js";import{c as m,f as u}from"./3d-_0_kXk_T.js";import{r as f,o as p,a as v,c as d,b as s,F as _}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";import"./Mat4Func-Daqwyn3W.js";import"./Vec3Func-Lanfgsq-.js";const g=s("h3",null,"用WebGL绘制三维立方体",-1),x=`
  attribute vec3 a_vertexPosition; // 1:把顶点从vec2扩展到vec3
  attribute vec4 color; // 四维向量

  varying vec4 vColor;
  uniform mat4 projectionMatrix; // 2:投影矩阵-变换坐标系
  uniform mat4 modelMatrix; // 3:模型矩阵-使几何体旋转

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);
  }
`,h=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`,R={__name:"Cube",setup(M){const t=f(null);let o;return p(()=>{o=new c(t.value,{depth:!0});const e=m(1,[[1,0,0,1],[0,.5,0,1],[0,0,1,1]]),r=o.compileSync(h,x);o.useProgram(r),o.setMeshData([{positions:e.positions,attributes:{color:e.color},cells:e.cells}]),o.uniforms.projectionMatrix=[1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1];let i=0,n=0,a=0;function l(){i+=.003,n+=.005,a+=.007,o.uniforms.modelMatrix=u(i,n,a),requestAnimationFrame(l)}l(),o.render()}),(e,r)=>(v(),d(_,null,[g,s("canvas",{width:"512",height:"512",ref_key:"glRef",ref:t},null,512)],64))}};export{R as default};
