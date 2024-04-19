import{_ as U,l as d,f as y,G as F,m as D,q as l,o as _,c as b,b as s,F as x,h as T,n as S,t as w,p as G,a as k}from"./index-2p43lkDg.js";const P="/visualization-demos/assets/cat-7zG-PGUF.jpeg",L=n=>(G("data-v-1696ca1e"),n=n(),k(),n),z=L(()=>s("h3",null,"WebGL demo",-1)),B=["onClick"],v=`
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

  varying vec2 vUv; // 由顶点着色器传来的uv属性
  uniform sampler2D tMap;

  uniform mat4 colorMatrix;

  void main() {
    // gl_FragColor = texture2D(tMap, vUv); // 从纹理中提取颜色，vUv是纹理坐标

    vec4 color = texture2D(tMap, vUv);
    gl_FragColor = colorMatrix * vec4(color.rgb, 1.0);
    gl_FragColor.a = color.a;
  }
`,I=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D tMap;
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(
              sin(
                dot(st.xy, vec2(12.9898, 78.233))
              ) *
              43758.5453123
           );
  }

  void main() {
    vec2 st = vUv * vec2(100, 55.4); // 5540个 10x10的方格。st：当前像素映射到纹理坐标中的坐标值
    vec2 uv = vUv + 1.0 - 2.0 * random(floor(st));
    // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
    // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。
    vec4 color = texture2D(tMap, mix(uv, vUv, min(uTime, 1.0)));
    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a * uTime;
  }
`,R=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform sampler2D tCat;

  void main() {
    vec4 color = texture2D(tMap, vUv);
    vec2 st = vUv * 3.0 - vec2(1.2, 0.5); // 纹理坐标缩放和平移
    vec4 cat = texture2D(tCat, st); // 取到纹理坐标上另一个位置上的色值。e.g.原来取(0.5,0.5)的纹理色值，变为取(0.3,1)的纹理色值

    gl_FragColor.rgb = cat.rgb;
    if(cat.r < 0.5 && cat.g > 0.6) {
      gl_FragColor.rgb = color.rgb;
    }
    gl_FragColor.a = color.a;
  }
`,j={__name:"WebGL",setup(n){const h=[{name:"灰度化"},{name:"粒子化"},{name:"图像合成"}],o=d(1),u=d(null);let e,t;y(()=>{e=new F(u.value),m(o.value),g(),D(o,()=>{m(o.value),g()})});const m=async f=>{let a;switch(f){case 0:t=e.compileSync(E,v),e.useProgram(t),a=await e.loadTexture(l),e.uniforms.tMap=a;const c=.2126,r=.7152,i=.0722;e.uniforms.colorMatrix=[c,c,c,0,r,r,r,0,i,i,i,0,0,0,0,1];break;case 1:t=e.compileSync(I,v),e.useProgram(t),a=await e.loadTexture(l),e.uniforms.tMap=a,e.uniforms.uTime=0,requestAnimationFrame(function C(p){e.uniforms.uTime=p/2e3,p<2e3&&requestAnimationFrame(C)});break;case 2:t=e.compileSync(R,v),e.useProgram(t),a=await e.loadTexture(l),e.uniforms.tMap=a;const M=await e.loadTexture(P);e.uniforms.tCat=M;break}},g=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(f,a)=>(_(),b(x,null,[z,s("div",null,[(_(),b(x,null,T(h,(c,r)=>s("span",{class:S(["filter-type",{active:o.value===r}]),onClick:i=>o.value=r},w(c.name),11,B)),64))]),s("canvas",{ref_key:"canvasRef",ref:u,width:"1000",height:"554"},null,512)],64))}},A=U(j,[["__scopeId","data-v-1696ca1e"]]);export{A as default};
