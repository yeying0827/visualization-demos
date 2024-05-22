import{_ as k,y as f,f as w,z as G,G as t,o as m,c as p,b as i,F as _,u as D,R as o,A as E,t as I,p as L,a as M}from"./index-bF0I-6KF.js";const T=c=>(L("data-v-09f7641e"),c=c(),M(),c),x=T(()=>i("h3",null,"课后练习",-1)),R=["onClick"],s=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,q={__name:"Practice",setup(c){const u=[{name:"正方形"},{name:"正六边形"},{name:"椭圆"},{name:"正方形环"},{name:"正六边形环"},{name:"椭圆环"},{name:"正六角星"},{name:"正六角星环"}],n=f(5),r=f(null),h=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${o.base}

  ${o.square}

  void main() {
    float d = square_distance(
      vUv,
      vec2(0.3, 0.3),
      vec2(0.3, 0.7),
      vec2(0.7, 0.7),
      vec2(0.7, 0.3)
    );
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,b=`
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${o.base}

  ${o.polygon}

  void main() {
    // float d = polygon_distance(
    //   vUv,
    //   6,
    //   vec2(0.65, 0.25), // 起始点（右下角）
    //   0.3
    // );

    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,y=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${o.ellipse}

  void main() {
    float d = ellipse_distance(
      vUv,
      vec2(0.5, 0.5),
      0.4,
      0.2
    );
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.03, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,C=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${o.base}

  ${o.square}

  void main() {
    float d = square_distance(
      vUv,
      vec2(0.3, 0.3),
      vec2(0.3, 0.7),
      vec2(0.7, 0.7),
      vec2(0.7, 0.3)
    );

    // d = fract(20.0 * abs(d));
    // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    // gl_FragColor.a = 1.0;

    // // d = fract(20.0 * abs(d)); // 内部距离近-远：黑->白(0->1)
    // d = fract(20.0 * d); // 内部距离近-远：白-> 黑(1->0)
    // gl_FragColor.rgb = vec3(d);
    // gl_FragColor.a = 1.0; // 1不透明

    gl_FragColor.rgb = vec3(0.0);
    gl_FragColor.a = 1.0 - fract(abs(d) * 64.0); // 内部距离近-远：(0->1) => 透明度：1->0(不透明->透明)
    // gl_FragColor.a = 1.0 - fract(d * 64.0); // 内部距离近-远：(1->0) => 透明度：0->1(透明->不透明)
  }
`,F=`
    #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${o.base}

  ${o.polygon}

  void main() {
    // float d = polygon_distance(
    //   vUv,
    //   6,
    //   vec2(0.65, 0.25), // 起始点（右下角）
    //   0.3
    // );

    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    d = fract(20.0 * d);
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,S=`
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${o.ellipse}

  void main() {
    float d = ellipse_distance2(
      vUv,
      vec2(0.5, 0.5),
      0.35,
      0.2
    );
    d = fract(20.0 * abs(d));
    // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);

    gl_FragColor.rgb = vec3(d);

    // gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);

    gl_FragColor.a = 1.0;
  }
`,U=`
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${o.base}

  ${o.star}

  void main() {
    float d = star_distance(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,P=`
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${o.base}

  ${o.star}

  void main() {
    float d = star_distance(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    d = fract(20.0 * abs(d));
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    // gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`;let e,a;w(()=>{l(n.value),v(),G(n,()=>{l(n.value),v()})});const l=g=>{switch(g){case 0:e=new t(r.value),a=e.compileSync(h,s),e.useProgram(a);break;case 1:e=new t(r.value),a=e.compileSync(b,s),e.useProgram(a);break;case 2:e=new t(r.value),a=e.compileSync(y,s),e.useProgram(a);break;case 3:e=new t(r.value),a=e.compileSync(C,s),e.useProgram(a);break;case 4:e=new t(r.value),a=e.compileSync(F,s),e.useProgram(a);break;case 5:e=new t(r.value),a=e.compileSync(S,s),e.useProgram(a);break;case 6:e=new t(r.value),a=e.compileSync(U,s),e.useProgram(a);break;case 7:e=new t(r.value),a=e.compileSync(P,s),e.useProgram(a);break}},v=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(g,B)=>(m(),p(_,null,[x,i("div",null,[(m(),p(_,null,D(u,($,d)=>i("span",{class:E(["filter-type",{active:n.value===d}]),onClick:z=>n.value=d},I($.name),11,R)),64))]),i("canvas",{ref_key:"glRef",ref:r,width:"512",height:"512"},null,512)],64))}},N=k(q,[["__scopeId","data-v-09f7641e"]]);export{N as default};
