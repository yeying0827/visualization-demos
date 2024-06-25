import{_ as y,y as v,f as F,G as P,z as S,o as l,c as u,b as c,F as d,u as k,T as A,U as M,X as U,A as w,t as q,p as C,a as I}from"./index-Yh4SR2m9.js";const G=n=>(C("data-v-8e832fe4"),n=n(),I(),n),z=G(()=>c("h3",null,"非固定帧动画",-1)),B=["onClick"],p=`
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
`,E=`
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
`,L={__name:"NonfixedFrame",setup(n){const h=[{name:"顶点着色器"},{name:"顶点着色器-Animator"},{name:"片元着色器-基础"},{name:"片元着色器-重复"}],e=v(2),m=v(null),b=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float rotation;

  ${A.random2d}
  ${M.hsb}

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
`;let o,a;F(()=>{o=new P(m.value),f(e.value),S(e,()=>{f(e.value)})});const f=s=>{switch(s){case 0:a=o.compileSync(_,p),o.useProgram(a),o.uniforms.rotation=0,requestAnimationFrame(function t(){o.uniforms.rotation+=.05,requestAnimationFrame(t)}),r({positions:[[-.5,-.5],[-.5,.5],[.5,.5],[.5,-.5]]});break;case 1:a=o.compileSync(_,p),o.useProgram(a),o.uniforms.rotation=0,new U({duration:2e3,iterations:1/0}).animate(o,({target:t,timing:i})=>{t.uniforms.rotation=i.p*2*Math.PI}),r({positions:[[-.5,-.5],[-.5,.5],[.5,.5],[.5,-.5]]});break;case 2:a=o.compileSync(E,g),o.useProgram(a),o.uniforms.color=[1,0,0,1],o.uniforms.rotation=0,requestAnimationFrame(function t(){o.uniforms.rotation+=.05,requestAnimationFrame(t)}),r({});break;case 3:a=o.compileSync(b,g),o.useProgram(a),o.uniforms.color=[1,0,0,1],o.uniforms.rotation=0,requestAnimationFrame(function t(){o.uniforms.rotation+=.05,requestAnimationFrame(t)}),r({});break}},r=({positions:s=[[-1,-1],[-1,1],[1,1],[1,-1]]})=>{o.setMeshData([{positions:s,attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),o.render()};return(s,x)=>(l(),u(d,null,[z,c("div",null,[(l(),u(d,null,k(h,(t,i)=>c("span",{class:w(["filter-type",{active:e.value===i}]),onClick:R=>e.value=i},q(t.name),11,B)),64))]),c("canvas",{width:"512",height:"512",ref_key:"glRef",ref:m},null,512)],64))}},N=y(L,[["__scopeId","data-v-8e832fe4"]]);export{N as default};
