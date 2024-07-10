import{G as c}from"./gl-renderer--j5iNyII.js";import{_ as n,r as i,o as l,a as v,c as p,b as t,F as _,p as d,f as u}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const o=s=>(d("data-v-eea3bac4"),s=s(),u(),s),g=o(()=>t("h3",null,"角向渐变",-1)),f=o(()=>t("p",null,"CSS",-1)),m=o(()=>t("div",{class:"conic"},null,-1)),h=o(()=>t("p",null,"WebGL",-1)),x=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,b=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  vec2 polar(vec2 st){
    return vec2(length(st), atan(st.y, st.x));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
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
`,y={__name:"ConicGradients",setup(s){const a=i(null);return l(()=>{const e=new c(a.value),r=e.compileSync(b,x);e.useProgram(r),e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()}),(e,r)=>(v(),p(_,null,[g,f,m,h,t("canvas",{width:"512",height:"512",ref_key:"glRef",ref:a},null,512)],64))}},P=n(y,[["__scopeId","data-v-eea3bac4"]]);export{P as default};
