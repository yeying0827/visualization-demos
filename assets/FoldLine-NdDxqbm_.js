import{_ as y,y as v,f as _,G as h,z as x,o as d,c as m,b as r,F as g,u as b,A as S,t as F,p as C,a as k}from"./index-Yh4SR2m9.js";const U=o=>(C("data-v-bc0dd3ef"),o=o(),k(),o),P=U(()=>r("h3",null,"实现噪声函数",-1)),L=["onClick"],s=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,w=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  // 随机函数
  float random (float x) {
    return fract(sin(x * 1243758.5453123));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // d直接等于随机函数返回值，这样d不连续
    float d = random(i); // 取出10个不同的'd'值(0~1)

    // st.y: -5 ~ +5
    // 1. d < st.y - 0.1 或 d > st.y + 0.1，值为0，为黑色（st.y > d+0.1 或 st.y < d-0.1）
    // 2. st.y - 0.1 < d < st.y + 0.1 时, 值为0->1->0，为黑到白再到黑的过渡色
    gl_FragColor.rgb = (smoothstep(st.y - 0.10, st.y, d) - smoothstep(st.y, st.y + 0.10, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,G=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  // 随机函数
  float random (float x) {
    return fract(sin(x * 1243758.5453123));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
    // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。
    float d = mix(random(i), random(i + 1.0), f);

    gl_FragColor.rgb = (smoothstep(st.y - 0.10, st.y, d) - smoothstep(st.y, st.y + 0.10, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,E=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  // 随机函数
  float random (float x) {
    return fract(sin(x * 1243758.5453123));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
    // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。
    float d = mix(random(i), random(i + 1.0), smoothstep(0.0, 1.0, f));
    // float d = mix(random(i), random(i + 1.0), f * f * (3.0 - 2.0 * f));

    gl_FragColor.rgb = (smoothstep(st.y - 0.10, st.y, d) - smoothstep(st.y, st.y + 0.10, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,B=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }

  // 二维噪声，对st与方形区域的四个顶点插值
  highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(noise(st));
    gl_FragColor.a = 1.0;
  }
`,I={__name:"FoldLine",setup(o){const p=[{name:"线段"},{name:"折线"},{name:"平滑的曲线"},{name:"二维噪声"}],a=v(0),n=v(null);let t,e;_(()=>{t=new h(n.value),c(a.value),i(),x(a,()=>{c(a.value),i()})});const c=l=>{switch(l){case 0:e=t.compileSync(w,s),t.useProgram(e);break;case 1:e=t.compileSync(G,s),t.useProgram(e);break;case 2:e=t.compileSync(E,s),t.useProgram(e);break;case 3:e=t.compileSync(B,s),t.useProgram(e);break}},i=()=>{t.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),t.render()};return(l,R)=>(d(),m(g,null,[P,r("div",null,[(d(),m(g,null,b(p,(u,f)=>r("span",{class:S(["filter-type",{active:a.value===f}]),onClick:z=>a.value=f},F(u.name),11,L)),64))]),r("canvas",{ref_key:"glRef",ref:n,width:"512",height:"512"},null,512)],64))}},A=y(I,[["__scopeId","data-v-bc0dd3ef"]]);export{A as default};
