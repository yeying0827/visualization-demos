import{_ as x,y as g,f as w,z as G,G as t,o as m,c as p,b as c,F as d,u as P,A as L,t as E,p as $,a as I}from"./index-8v8F2D54.js";const B=l=>($("data-v-ca4f877b"),l=l(),I(),l),R=B(()=>c("h3",null,"WebGL demo",-1)),z=["onClick"],s=`
  vec2 polar(vec2 st) {
    return vec2(length(st), atan(st.y, st.x));
  }
`,r=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,D={__name:"WebGL",setup(l){const h=[{name:"圆"},{name:"玫瑰"},{name:"玫瑰花瓣数动态变化"},{name:"花瓣线"},{name:"横置的葫芦"},{name:"花苞图案"}],n=g(5),a=g(null),b=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${s}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    gl_FragColor.rgb = smoothstep(st.x, st.x + 0.01, 0.2) * vec3(1.0);

    gl_FragColor.a = 1.0;
  }
`,k=` // 三瓣玫瑰线
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${s}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = 0.5 * cos(st.y * 3.0) - st.x;

    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,y=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float u_k;

  ${s}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = 0.5 * cos(st.y * u_k) - st.x;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,S=` // 花瓣线
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${s}

  void main() {
    // float u_k = 3.0; // 三片花瓣
    float u_k = 1.3; // 横放的苹果

    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,C=` // 横放的葫芦
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float u_k;
  uniform float u_scale;
  uniform float u_offset;

  ${s}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = u_scale * 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x + u_offset;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,F=`
  #ifdef GL_ES
  precision highp float;
  #endif

  ${s}

  varying vec2 vUv;
  uniform float u_k;
  uniform float u_scale;
  uniform float u_offset;

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = smoothstep(-0.3, 1.0, u_scale * 0.5 * cos(st.y * u_k) + u_offset) - st.x;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;let e,o;w(()=>{v(n.value),f(),G(n,()=>{v(n.value),f()})});let i=null;const v=u=>{switch(clearInterval(i),u){case 0:e=new t(a.value),o=e.compileSync(b,r),e.useProgram(o);break;case 1:e=new t(a.value),o=e.compileSync(k,r),e.useProgram(o);break;case 2:e=new t(a.value),o=e.compileSync(y,r),e.useProgram(o),e.uniforms.u_k=3,i=setInterval(()=>{e.uniforms.u_k+=2},200);break;case 3:e=new t(a.value),o=e.compileSync(S,r),e.useProgram(o);break;case 4:e=new t(a.value),o=e.compileSync(C,r),e.useProgram(o),e.uniforms.u_k=1.7,e.uniforms.u_scale=.5,e.uniforms.u_offset=.2;break;case 5:e=new t(a.value),o=e.compileSync(F,r),e.useProgram(o),e.uniforms.u_k=5,e.uniforms.u_scale=.2,e.uniforms.u_offset=.2;break}},f=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(u,W)=>(m(),p(d,null,[R,c("div",null,[(m(),p(d,null,P(h,(U,_)=>c("span",{class:L(["filter-type",{active:n.value===_}]),onClick:A=>n.value=_},E(U.name),11,z)),64))]),c("canvas",{ref_key:"glRef",ref:a,width:"512",height:"512"},null,512)],64))}},T=x(D,[["__scopeId","data-v-ca4f877b"]]);export{T as default};
