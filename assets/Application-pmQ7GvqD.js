import{G as h}from"./gl-renderer--j5iNyII.js";import{_ as x,r as f,o as b,w as y,a as u,c as d,b as s,F as p,d as A,n as S,t as k,p as F,f as w}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const C=a=>(F("data-v-b7c3e129"),a=a(),w(),a),T=C(()=>s("h3",null,"应用",-1)),U=["onClick"],g=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,P=` // 类似水滴滚过物体表面
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }

  highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    // vec2 st = (vUv - vec2(0.5)) * 20.0;
    vec2 st = mix(vec2(-10, -10), vec2(10, 10), vUv);
    float d = distance(st, vec2(0)); // 与点(0,0)的距离
    d *= noise(uTime + st); // 乘以噪声（0~1），得到新的距离值
    d = smoothstep(0.0, 1.0, d) - step(1.0, d); // d大于1的为0，黑色
    gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`,B=`// 类似木头的条纹
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }

  highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float lines(in vec2 pos, float b) {
    float scale = 10.0;
    pos *= scale;
    return smoothstep(
      0.0,
      0.5 + b * 0.5,
      abs(sin(pos.x * 3.1415) + b * 2.0) * 0.5
    );
  }

  vec2 rotate(vec2 v0, float ang) {
    float sinA = sin(ang);
    float cosA = cos(ang);
    mat3 m = mat3(
      cosA,  -sinA, 0,
      sinA,  cosA,  0,
      0,     0,     1
    );
    return (m * vec3(v0, 1.0)).xy;
  }

  void main() {
    vec2 st = vUv.yx * vec2(10.0, 3.0); // xy互换并缩放
    st = rotate(st, noise(st)); // 旋转一个角度

    float d = lines(st, 0.5); // 0-1 平滑过渡

    gl_FragColor.rgb = 1.0 - vec3(d);
    gl_FragColor.a = 1.0;
  }
`,G={__name:"Application",setup(a){const _=[{name:"类似水滴滚过物体表面"},{name:"类似木头的条纹"}],t=f(1),r=f(null);let e,o;b(()=>{e=new h(r.value),i(t.value),c(),y(t,()=>{i(t.value),c()})});const i=v=>{switch(v){case 0:o=e.compileSync(P,g),e.useProgram(o),e.uniforms.uTime=0,requestAnimationFrame(function l(n){e.uniforms.uTime=n/1e3,requestAnimationFrame(l)});break;case 1:o=e.compileSync(B,g),e.useProgram(o);break}},c=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(v,l)=>(u(),d(p,null,[T,s("div",null,[(u(),d(p,null,A(_,(n,m)=>s("span",{class:S(["filter-type",{active:t.value===m}]),onClick:I=>t.value=m},k(n.name),11,U)),64))]),s("canvas",{ref_key:"glRef",ref:r,width:"512",height:"512"},null,512)],64))}},L=x(G,[["__scopeId","data-v-b7c3e129"]]);export{L as default};
