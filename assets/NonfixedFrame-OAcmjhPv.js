import{G as y}from"./gl-renderer--j5iNyII.js";import{A as F}from"./animation-hjFUvrA4.js";import{n as P,c as S}from"./glslFunc-l-MaHrBn.js";import{_ as k,r as v,o as A,w as M,a as l,c as u,b as c,F as p,d as w,n as U,t as q,p as C,f as I}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const G=r=>(C("data-v-8e832fe4"),r=r(),I(),r),B=G(()=>c("h3",null,"非固定帧动画",-1)),E=["onClick"],d=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  uniform float rotation;

  void main() {
    gl_PointSize = 1.0;
    float c = cos(rotation);
    float s = sin(rotation);
    mat3 transformMatrix = mat3(
      c,  s, 0,
      -s, c, 0,
      0,  0, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1); // 映射新的坐标
    gl_Position = vec4(pos, 1);
  }
`,_=`
  #ifdef GL_ES
  precision highp float;
  #endif

  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`,g=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,L=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec4 color;
  uniform float rotation;

  void main() {
    vec2 st = 2.0 * (vUv - vec2(0.5));
    float c = cos(rotation);
    float s = sin(rotation);
    mat3 transformMatrix = mat3(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(st, 1.0); // 坐标系旋转
    float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x)); // abs(x)<0.5 d1=1
    float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y)); // abs(y)<0.5 d2=1
    gl_FragColor = d1 * d2 * color;
  }
`,R={__name:"NonfixedFrame",setup(r){const h=[{name:"顶点着色器"},{name:"顶点着色器-Animator"},{name:"片元着色器-基础"},{name:"片元着色器-重复"}],e=v(2),m=v(null),b=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float rotation;

  ${P.random2d}
  ${S.hsb}

  void main() {
    vec2 f_uv = fract(vUv * 10.0);
    vec2 i_uv = floor(vUv * 10.0);
    vec2 st = 2.0 * (f_uv - vec2(0.5));
    float c = 0.7 * cos(rotation);
    float s = 0.7 * sin(rotation);
    mat3 transformMatrix = mat3(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(st, 1.0);
    float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x));
    float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y));
    gl_FragColor = d1 * d2 * vec4(hsb2rgb(vec3(random(i_uv), 1.0, 1.0)), 1.0);
  }
`;let o,a;A(()=>{o=new y(m.value),f(e.value),M(e,()=>{f(e.value)})});const f=i=>{switch(i){case 0:a=o.compileSync(_,d),o.useProgram(a),o.uniforms.rotation=0,requestAnimationFrame(function t(){o.uniforms.rotation+=.05,requestAnimationFrame(t)}),n({positions:[[-.5,-.5],[-.5,.5],[.5,.5],[.5,-.5]]});break;case 1:a=o.compileSync(_,d),o.useProgram(a),o.uniforms.rotation=0,new F({duration:2e3,iterations:1/0}).animate(o,({target:t,timing:s})=>{t.uniforms.rotation=s.p*2*Math.PI}),n({positions:[[-.5,-.5],[-.5,.5],[.5,.5],[.5,-.5]]});break;case 2:a=o.compileSync(L,g),o.useProgram(a),o.uniforms.color=[1,0,0,1],o.uniforms.rotation=0,requestAnimationFrame(function t(){o.uniforms.rotation+=.05,requestAnimationFrame(t)}),n({});break;case 3:a=o.compileSync(b,g),o.useProgram(a),o.uniforms.color=[1,0,0,1],o.uniforms.rotation=0,requestAnimationFrame(function t(){o.uniforms.rotation+=.05,requestAnimationFrame(t)}),n({});break}},n=({positions:i=[[-1,-1],[-1,1],[1,1],[1,-1]]})=>{o.setMeshData([{positions:i,attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),o.render()};return(i,x)=>(l(),u(p,null,[B,c("div",null,[(l(),u(p,null,w(h,(t,s)=>c("span",{class:U(["filter-type",{active:e.value===s}]),onClick:z=>e.value=s},q(t.name),11,E)),64))]),c("canvas",{width:"512",height:"512",ref_key:"glRef",ref:m},null,512)],64))}},j=k(R,[["__scopeId","data-v-8e832fe4"]]);export{j as default};
