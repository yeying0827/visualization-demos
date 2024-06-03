import{_ as S,y as h,f as I,z as U,G as l,o as n,c as p,b as t,F as i,u as w,S as $,R as v,A as G,t as E,p as L,a as R}from"./index-8v8F2D54.js";const g=r=>(L("data-v-de61f960"),r=r(),R(),r),B=g(()=>t("h3",null,"Practice",-1)),z=["onClick"],D=g(()=>t("p",null,"CSS",-1)),X=g(()=>t("div",{class:"conic"},null,-1)),f=`
  vec2 polar(vec2 st) {
    return vec2(length(st), atan(st.y, st.x));
  }
`,c=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,A={__name:"Practice",setup(r){const y=[{name:"苹果"},{name:"葫芦"},{name:"角向渐变"},{name:"剪纸图案"}],e=h(3),a=h(null),b=` // 苹果
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${f}

  void main() {
    // float u_k = 3.0; // 三片花瓣
    float u_k = 1.3; // 横放的苹果

    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    st.y += 3.14 / 2.0;
    // atan 的返回值是：从第一到第二象限为 0~PI，从第三到第四象限为 -PI~0
    // 旋转极坐标后要保证函数定义域的一致性
    if (st.y > 3.14) st.y -= 3.14 * 2.0;
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

  ${f}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    st.y += 3.14 / 2.0;
    if (st.y > 3.14) st.y -= 3.14 * 2.0;
    float d = u_scale * 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x + u_offset;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,k=`// 角向渐变
  #ifdef GL_ES
  precision highp float;
  #endif

  ${f}

  varying vec2 vUv;

  void main() {
    vec2 st = vUv;
    // 直角坐标系下操作
    st.x = 1.0 - st.x; // 将X坐标沿x=0.5翻转
    st = st - vec2(0.5);
    // 极坐标系下操作
    st = polar(st);
    st.y -= 3.14 / 2.0; // 将角度旋转90度
    // 以上操作完成后，直角坐标系的X轴变为Y轴，Y轴变为X轴
    float d = smoothstep(st.x, st.x + 0.01, 0.2); // st.x：半径；st.x > 0.2时，d为0
    // 将角度范围转换到0到2PI之间
    if(st.y < 0.0) st.y += 2.0 * 3.14;
    // 计算p，角度归一化后的值
    float p = st.y / (2.0 * 3.14);
    if (p < 0.45) {
      // 0-0.45时，从红色线性过渡到绿色
      gl_FragColor.rgb = d * mix(vec3(1.0, 0, 0), vec3(0, 0.5, 0), p / 0.45);
    } else {
      // >0.45，从绿色过渡到蓝色
      gl_FragColor.rgb = d * mix(vec3(0, 0.5, 0), vec3(0, 0, 1.0), (p - 0.45) / (1.0 - 0.45));
    }
    gl_FragColor.a = smoothstep(st.x, st.x + 0.01, 0.2); // 0-透明 1-不透明；st.x > 0.2时，a为0
  }
`,x=`
  #ifdef GL_ES
  precision highp float;
  #endif

  #define PI 3.1415926

  varying vec2 vUv;

  ${f}

  ${v.base}
  ${v.polygon}
  ${v.star}

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      ) *
      43758.5453123
    );
  }

  void main() {
    vec2 st = vUv * 10.0;
    vec2 ipos = floor(st); // integer
    vec2 fpos = fract(st); // fraction

    float r = random(ipos);

    float d = 0.0;
    if(r < 0.14) { // 四边形
      fpos = fpos - vec2(0.5);
       float d = polygon_distance2(
          fpos,
          4,
          vec2(0.0, 0.4)
       );
       gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
       gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.28) { // 四片花瓣
      float u_k = 4.0;

      fpos = fpos - vec2(0.5);
      fpos = polar(fpos);
      d = 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else if (r < 0.42) { // 苹果
      float u_k = 1.3;

      fpos = fpos - vec2(0.5, 0.7);
      fpos = polar(fpos);
      fpos.y += 3.14 / 2.0;
      // atan 的返回值是：从第一到第二象限为 0~PI，从第三到第四象限为 -PI~0
      // 旋转极坐标后要保证函数定义域的一致性
      if (fpos.y > 3.14) fpos.y -= 3.14 * 2.0;
      float d = 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else if (r < 0.56) { // 六边形
       fpos = fpos - vec2(0.5);
       float d = polygon_distance2(
          fpos,
          6,
          vec2(0.0, 0.4)
       );
       gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
       gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.70) { // 五角星
      fpos = fpos - vec2(0.5);
      float d = star_distance(
        fpos,
        5,
        vec2(0.15, 0.2)
      );
      gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.84) { // 葫芦
      float u_k = 1.7;
      float u_scale = 0.5;
      float u_offset = 0.2;

      fpos = fpos - vec2(0.5);
      fpos = polar(fpos);
      fpos.y += 3.14 / 2.0;
      if (fpos.y > 3.14) fpos.y -= 3.14 * 2.0;
      float d = u_scale * 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x + u_offset;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else { // 花苞
      float u_k = 5.0;
      float u_scale = 0.13;
      float u_offset = 0.2;

      fpos = fpos - vec2(0.5);
      fpos = polar(fpos);
      float d = smoothstep(-0.3, 1.0, u_scale * 0.5 * cos(fpos.y * u_k) + u_offset) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    }
  }
`;let o,s;I(()=>{_(e.value),d(),U(e,()=>{_(e.value),d()})});let F=null;const _=u=>{switch(clearInterval(F),u){case 0:o=new l(a.value),s=o.compileSync(b,c),o.useProgram(s);break;case 1:o=new l(a.value),s=o.compileSync(C,c),o.useProgram(s),o.uniforms.u_k=1.7,o.uniforms.u_scale=.5,o.uniforms.u_offset=.2;break;case 2:o=new l(a.value),s=o.compileSync(k,c),o.useProgram(s);break;case 3:o=new l(a.value),s=o.compileSync(x,c),o.useProgram(s);break}},d=()=>{o.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),o.render()};return(u,M)=>(n(),p(i,null,[B,t("div",null,[(n(),p(i,null,w(y,(P,m)=>t("span",{class:G(["filter-type",{active:e.value===m}]),onClick:N=>e.value=m},E(P.name),11,z)),64))]),e.value===2?(n(),p(i,{key:0},[D,X],64)):$("",!0),t("canvas",{ref_key:"glRef",ref:a,width:"512",height:"512"},null,512)],64))}},V=S(A,[["__scopeId","data-v-de61f960"]]);export{V as default};
