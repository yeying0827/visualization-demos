import{G as u}from"./gl-renderer--j5iNyII.js";import{_ as h,r as g,o as b,w as y,a as d,c as f,b as t,F as _,d as S,n as x,t as C,p as P,f as k}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const F=r=>(P("data-v-27af4dc4"),r=r(),k(),r),U=F(()=>t("h3",null,"局部颜色控制",-1)),w=["onClick"],G=`
  attribute vec2 a_vertexPosition;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,L=`
  #ifdef GL_ES
  precision highp float;
  #endif

  void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
`,i=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,E=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    gl_FragColor.rgb = vec3(vUv.x);
    gl_FragColor.a = 1.0;
  }
`,B=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    vec2 st = vUv * 10.0;
    gl_FragColor.rgb = vec3(fract(st), 0.0); // r和g取坐标值，b为0
    gl_FragColor.a = 1.0;
  }
`,I=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    vec2 st = vUv * 10.0;
    vec2 idx = floor(st); // 横纵坐标的整数部分（网格的索引）
    vec2 grid = fract(st); // 横纵坐标的小数部分

    // 在GLSL中，mod 函数是一个取模运算符，用于计算两个数值的除法运算的余数。
    vec2 t = mod(idx, 2.0);

    // 纹理坐标，左下角(0,0)，X轴向上 Y轴向右
    if (t.x == 1.0) { // 如果X轴方向索引是奇数，坐标反转
      grid.x = 1.0 - grid.x;
    }
    if (t.y == 1.0) { // 如果Y轴方向索引是奇数，坐标反转
      grid.y = 1.0 - grid.y;
    }
    gl_FragColor.rgb = vec3(grid, 0.0);
    gl_FragColor.a = 1.0;
  }
`,R={__name:"ColorControl",setup(r){const m=[{name:"纯黑"},{name:"由黑向白过渡"},{name:"过渡效果2"},{name:"过渡效果3"}],o=g(3),n=g(null);let e,a;b(()=>{e=new u(n.value),s(o.value),c(),y(o,()=>{s(o.value),c()})});const s=l=>{switch(l){case 0:a=e.compileSync(L,G),e.useProgram(a);break;case 1:a=e.compileSync(E,i),e.useProgram(a);break;case 2:a=e.compileSync(B,i),e.useProgram(a);break;case 3:a=e.compileSync(I,i),e.useProgram(a);break}},c=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(l,z)=>(d(),f(_,null,[U,t("div",null,[(d(),f(_,null,S(m,(p,v)=>t("span",{class:x(["filter-type",{active:o.value===v}]),onClick:D=>o.value=v},C(p.name),11,w)),64))]),t("canvas",{ref_key:"glRef",ref:n,width:"512",height:"512"},null,512)],64))}},Y=h(R,[["__scopeId","data-v-27af4dc4"]]);export{Y as default};
