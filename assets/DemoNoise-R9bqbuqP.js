import{G as x}from"./gl-renderer--j5iNyII.js";import{n as o}from"./glslFunc-l-MaHrBn.js";import{_ as k,r as g,o as T,w as P,a as u,c as p,b as c,F as _,d as E,n as G,t as $,p as w,f as A}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const L=s=>(w("data-v-72ca4804"),s=s(),A(),s),N=L(()=>c("h3",null,"使用噪声生成纹理",-1)),I=["onClick"],i=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,D={__name:"DemoNoise",setup(s){const b=[{name:"插值噪声Value Noise一维"},{name:"插值噪声Value Noise二维"},{name:"梯度噪声Gradient Noise"},{name:"云雾效果"},{name:"Simplex Noise"},{name:"网格噪声"}],t=g(5),l=g(null),h=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${o.random}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // d直接等于随机函数返回值，这样d不连续
    // float d = random(i); // 取出10个不同的'd'值(0~1)
    float d = mix(random(i), random(i+1.0), f); // 取出10个不同的'd'值(0~1)

    // st.y: -5 ~ +5
    // 1. d < st.y - 0.1 或 d > st.y + 0.1，值为0，为黑色（st.y > d+0.1 或 st.y < d-0.1）
    // 2. st.y - 0.1 < d < st.y + 0.1 时, 值为0->1->0，为黑到白再到黑的过渡色
    gl_FragColor.rgb = (smoothstep(st.y - 0.10, st.y, d) - smoothstep(st.y, st.y + 0.10, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,y=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${o.random2d}
  ${o.noise_value}

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(noise(st));
    gl_FragColor.a = 1.0;
  }
`,S=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${o.noise_gradient}

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
  }
`,F=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  ${o.random2d}
  ${o.noise_value}

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
`,C=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${o.noise_simplex}

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
  }
`,U=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  ${o.random2vec}

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j));
        vec2 p = random2vec(i_st + neighbor); // 特征点
        p = 0.5 + 0.5 * sin(uTime + 6.2831*p);
        d = min(d, distance(f_st, neighbor + p));
      }
    }


    gl_FragColor.rgb = vec3(d) + step(d, 0.03);
    gl_FragColor.a = 1.0;
  }
`;let e,a;T(()=>{e=new x(l.value),v(t.value),m(),P(t,()=>{v(t.value),m()})});const v=d=>{switch(d){case 0:a=e.compileSync(h,i),e.useProgram(a);break;case 1:a=e.compileSync(y,i),e.useProgram(a);break;case 2:a=e.compileSync(S,i),e.useProgram(a);break;case 3:a=e.compileSync(F,i),e.useProgram(a),e.uniforms.uTime=0,requestAnimationFrame(function n(r){e.uniforms.uTime=.001*r,requestAnimationFrame(n)});break;case 4:a=e.compileSync(C,i),e.useProgram(a);break;case 5:a=e.compileSync(U,i),e.useProgram(a),e.uniforms.uTime=0,requestAnimationFrame(function n(r){e.uniforms.uTime=.001*r,requestAnimationFrame(n)});break}},m=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(d,n)=>(u(),p(_,null,[N,c("div",null,[(u(),p(_,null,E(b,(r,f)=>c("span",{class:G(["filter-type",{active:t.value===f}]),onClick:V=>t.value=f},$(r.name),11,I)),64))]),c("canvas",{ref_key:"glRef",ref:l,width:"512",height:"512"},null,512)],64))}},z=k(D,[["__scopeId","data-v-72ca4804"]]);export{z as default};
