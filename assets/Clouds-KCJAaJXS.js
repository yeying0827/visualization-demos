import{G as _}from"./gl-renderer--j5iNyII.js";import{_ as h,r as m,o as x,w as y,a as f,c as d,b as i,F as g,d as C,n as S,t as T,p as w,f as F}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const I=a=>(w("data-v-657094b9"),a=a(),F(),a),k=I(()=>i("h3",null,"云雾效果",-1)),A=["onClick"],p=`
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
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Function from Inigo Quiles
  vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(
      abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
      0.0,
      1.0
    );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  #define OCTAVES 6
  float mist(vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = 0.5;

    // 叠加6次
    for(int i = 0; i < OCTAVES; i ++) {
      // 每次范围扩大一倍，权重减半
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // 配合色相的变化

  void main() {
    vec2 st = vUv;
    st.x += 0.1 * uTime;
    gl_FragColor.rgb = hsb2rgb(vec3(mist(st), 1.0, 1.0));
    gl_FragColor.a = 1.0;
  }
`,G=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123); // x和y：-1~1
  }

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1

    return mix(
      mix(
        dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }

  // Function from Inigo Quiles
  vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(
      abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
      0.0,
      1.0
    );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  #define OCTAVES 6
  float mist(vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = 0.5;

    // 叠加6次
    for(int i = 0; i < OCTAVES; i ++) {
      // 每次范围扩大一倍，权重减半
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // 配合色相的变化

  void main() {
    vec2 st = vUv;
    st.x += 0.1 * uTime;
    gl_FragColor.rgb = hsb2rgb(vec3(mist(st), 1.0, 1.0));
    gl_FragColor.a = 1.0;
  }
`,P={__name:"Clouds",setup(a){const b=[{name:"插值噪声"},{name:"梯度噪声"}],t=m(0),s=m(null);let e,r;x(()=>{e=new _(s.value),c(t.value),n(),y(t,()=>{c(t.value),n()})});const c=v=>{switch(v){case 0:r=e.compileSync(E,p),e.useProgram(r);break;case 1:r=e.compileSync(G,p),e.useProgram(r);break}e.uniforms.uTime=0,requestAnimationFrame(function l(o){e.uniforms.uTime=.001*o,requestAnimationFrame(l)})},n=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(v,l)=>(f(),d(g,null,[k,i("div",null,[(f(),d(g,null,C(b,(o,u)=>i("span",{class:S(["filter-type",{active:t.value===u}]),onClick:U=>t.value=u},T(o.name),11,A)),64))]),i("canvas",{ref_key:"glRef",ref:s,width:"512",height:"512"},null,512)],64))}},O=h(P,[["__scopeId","data-v-657094b9"]]);export{O as default};
