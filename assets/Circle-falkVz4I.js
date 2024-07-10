import{_ as w,r as v,o as F,w as S,a as p,c as h,b as t,F as _,d as U,e as b,v as x,n as k,t as R,p as T,f as P}from"./index-a4tGsWeP.js";import{G as i}from"./gl-renderer--j5iNyII.js";import{g as D}from"./girl1-zwAbMbEm.js";import"./_commonjsHelpers-5-cIlDoe.js";const y=r=>(T("data-v-6ce3414a"),r=r(),P(),r),G=y(()=>t("h3",null,"绘制圆形",-1)),E=y(()=>t("p",null,"根据点坐标到圆心的距离来生成颜色",-1)),L=["onClick"],l=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,M=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    // distance函数：vUv和纹理坐标中心vec2(0.5)的距离
    float d = distance(vUv, vec2(0.5));
    // d越小，色值越接近黑色
    gl_FragColor.rgb = d * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,z=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
     // 距离大于0.2时，step结果为0（黑色）；否则为1（白色）
    gl_FragColor.rgb = step(d, 0.2) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,B=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));

    // float smoothstep(float edge0, float edge1, float x);
    // 参数说明：
    // - edge0：定义平滑区域的开始边缘。
    // - edge1：定义平滑区域的结束边缘。
    // - x：要测试的值。
    // 当\`x\`在\`edge0\`和\`edge1\`之间时，函数返回一个在0和1之间的平滑插值。
    // 如果\`x\`小于\`edge0\`，返回值是0；如果\`x\`大于\`edge1\`，返回值是1。
    // 这个函数通常用于在两个值之间创建一个平滑的过渡，例如在渲染中的纹理混合、颜色渐变或者边缘检测中。

    // ??? https://zhuanlan.zhihu.com/p/170493708
    // 当t1小于t2时: x小于t1返回0，当x大于t2返回1
    // 当t1大于t2时: x大于t1返回0，当x小于t2返回1 ✅
    // d大于0.205 ==> 0 黑色 ； d小于0.2 ==> 1 白色
    gl_FragColor.rgb = smoothstep(0.2 + 0.005, 0.2, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,I=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  uniform sampler2D tMap;
  uniform vec2 uResolution;
  uniform float uTime;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      ) *
      43758.5453123
    );
  }

  void main() {
    vec2 uv = vUv;
    uv.y *= uResolution.y / uResolution.x; // y坐标乘以一个系数
    vec2 st = uv * 100.0; // 横纵坐标值放大100倍
    float d = distance(fract(st), vec2(0.5)); // 与对应网格中心点的距离
    float p = uTime + random(floor(st)); // 随机值
    float shading = 0.5 + 0.5 * sin(p); // 随机值为0的情况下：'0.5 - 1 - 0.5 - 0 - 0.5' 循环
    d = smoothstep(d, d + 0.01, shading); // 0~1
    vec4 color = texture2D(tMap, vUv); // 按纹理坐标取色值

    // T clamp(T x, float a,float b)    min(max(x, a), b)
    // float b = -0.2;
    // gl_FragColor.rgb = color.rgb * clamp(0.5, 1.3, b);

    // 在1.3 和 d + 1.0 * shading 之间变化
    // gl_FragColor.rgb = color.rgb * clamp(0.5, 1.3, d + 1.0 * shading);
    gl_FragColor.rgb = color.rgb * min(1.3, d + shading);
    gl_FragColor.a = color.a;
  }
`,A={__name:"Circle",setup(r){const C=[{name:"模糊的圆"},{name:"清晰的圆1（step）"},{name:"清晰的圆2（smoothstep）"},{name:"渐显渐隐效果"}],o=v(2),n=v(null),d=v(null);let e,a;F(()=>{g(o.value),u(),S(o,()=>{g(o.value),u()})});const g=f=>{switch(f){case 0:e=new i(n.value),a=e.compileSync(M,l),e.useProgram(a);break;case 1:e=new i(n.value),a=e.compileSync(z,l),e.useProgram(a);break;case 2:e=new i(n.value),a=e.compileSync(B,l),e.useProgram(a);break;case 3:e=new i(d.value),async function(){a=e.compileSync(I,l),e.useProgram(a);const m=await e.loadTexture(D);e.uniforms.tMap=m,e.uniforms.uTime=0,requestAnimationFrame(function c(s){e.uniforms.uTime=s/2e3,requestAnimationFrame(c)}),e.uniforms.uResolution=[1e3,554]}();break}},u=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(f,m)=>(p(),h(_,null,[G,E,t("div",null,[(p(),h(_,null,U(C,(c,s)=>t("span",{class:k(["filter-type",{active:o.value===s}]),onClick:q=>o.value=s},R(c.name),11,L)),64))]),b(t("canvas",{ref_key:"glRef",ref:n,width:"512",height:"512"},null,512),[[x,o.value!==3]]),b(t("canvas",{ref_key:"girlRef",ref:d,width:"1000",height:"554"},null,512),[[x,o.value===3]])],64))}},H=w(A,[["__scopeId","data-v-6ce3414a"]]);export{H as default};
