import{G as g}from"./gl-renderer--j5iNyII.js";import{m as u}from"./Mat4Func-Daqwyn3W.js";import{r as x,o as M,a as y,c as b,b as p,F as C}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";function P(l=1,n=[[1,0,0,1]]){const o=.5*l,e=[[-o,-o,-o],[-o,o,-o],[o,o,-o],[o,-o,-o],[-o,-o,o],[-o,o,o],[o,o,o],[o,-o,o]],t=[],s=[],i=[];let c=0,r=0;const f=n.length;function a(h,d,v,_){[h,d,v,_].forEach(m=>{t.push(e[m]),s.push(n[c%f])}),i.push([0,1,2].map(m=>m+r),[0,2,3].map(m=>m+r)),c++,r+=4}return a(1,0,3,2),a(4,5,6,7),a(2,3,7,6),a(5,4,0,1),a(3,0,4,7),a(6,5,1,2),{positions:t,color:s,cells:i}}function D(l,n,o){let e=Math.cos(l),t=Math.sin(l);const s=[1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1];e=Math.cos(n),t=Math.sin(n);const i=[e,0,t,0,0,1,0,0,-t,0,e,0,0,0,0,1];e=Math.cos(o),t=Math.sin(o);const c=[e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1],r=[];return u(r,s,i),u(r,r,c),r}const F=p("h3",null,"使用WebGL绘制3D物体",-1),G=`
  attribute vec3 a_vertexPosition;
  attribute vec4 color;
  uniform mat4 projectionMatrix; // 投影矩阵
  uniform mat4 modelMatrix; // 模型矩阵

  varying vec4 vColor;

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1);
  }
`,R=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`,L={__name:"Demo3D",setup(l){const n=x(null);return M(()=>{const o=new g(n.value,{depth:!0}),e=o.compileSync(R,G);o.useProgram(e);const t=P(1,[[1,0,0,1],[0,.5,0,1],[0,0,1,1]]);o.setMeshData([{positions:t.positions,attributes:{color:t.color},cells:t.cells}]),o.uniforms.projectionMatrix=[1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1];let s=0,i=0,c=0;function r(){s+=.003,i+=.005,c+=.007,o.uniforms.modelMatrix=D(s,i,c),requestAnimationFrame(r)}r(),o.render()}),(o,e)=>(y(),b(C,null,[F,p("canvas",{width:"512",height:"512",ref_key:"glRef",ref:n},null,512)],64))}};export{L as default};
