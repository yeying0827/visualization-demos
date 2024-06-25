import{_ as C,y as p,f as S,z as x,G as u,o as _,c as h,b as r,F as b,u as k,A as w,t as M,p as F,a as U}from"./index-Yh4SR2m9.js";const y=c=>(F("data-v-f8138d45"),c=c(),U(),c),L=y(()=>r("h3",null,"绘制线",-1)),O=y(()=>r("p",null,"点到直线（向量）的距离",-1)),E=["onClick"],d=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,P=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    vec3 line = vec3(1, 1, 0);
    // 两个向量叉积的绝对值
    // 点到直线（向量）的距离
    float d = abs(
      cross(vec3(vUv, 0), normalize(line)).z
    );

    // ??? https://zhuanlan.zhihu.com/p/170493708
    // 当t1小于t2时: x小于t1返回0，当x大于t2返回1
    // gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);

    // 当t1大于t2时: x大于t1返回0，当x小于t2返回1
    gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0);


    gl_FragColor.a = 1.0;
  }
`,B=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec2 uMouse;
  uniform vec2 uOrigin;

  void main() {
    // vec3 line = vec3(uMouse, 0); // 用向量表示所在直线
    // float d = abs(
    //   cross(vec3(vUv, 0), normalize(line)).z
    // ); // 叉积表示平行四边形面积

    // 原点变化
    vec3 line = vec3(uMouse - uOrigin, 0);
    float d = abs(
      cross(vec3(vUv - uOrigin, 0), normalize(line)).z
    );

    gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,R=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec2 uMouse;
  uniform vec2 uOrigin;

  // 点到线段的距离
  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0); // 目标线段所在向量
    vec3 p = vec3(st - a, 0); // 待检测向量
    float l = length(ab); // 向量长度
    float d = abs(
      cross(p, normalize(ab)).z
    ); // p到目标向量的距离
    float proj = dot(p, ab) / l; // p在目标向量上的投影
    if(proj >= 0.0 && proj <= l) return d; // 投影在目标线段两个端点之间
    // 在Shader中，distance函数用于计算两个点之间的欧几里得距离
    return min(distance(st, a), distance(st, b)); // p在线段左边或右边时（距离两个端点的距离）
  }

  void main() {
    float d = seg_distance(vUv, uOrigin, uMouse);
    gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`,G={__name:"Line",setup(c){const z=[{name:"斜线"},{name:"鼠标控制直线"},{name:"点到线段的距离"}],i=p(0),a=p(null);let e,n;S(()=>{g(i.value),f(),x(i,()=>{g(i.value),f()})});const g=t=>{switch(t){case 0:e=new u(a.value),n=e.compileSync(P,d),e.useProgram(n);break;case 1:e=new u(a.value),n=e.compileSync(B,d),e.useProgram(n),e.uniforms.uMouse=[-1,-1],e.uniforms.uOrigin=[0,0],m();break;case 2:e=new u(a.value),n=e.compileSync(R,d),e.useProgram(n),e.uniforms.uMouse=[-1,-1],e.uniforms.uOrigin=[0,0],m();break}},f=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()},m=()=>{a.value.addEventListener("mousemove",t=>{const{width:l,height:o}=t.target.getBoundingClientRect(),{offsetX:s,offsetY:v}=t;e.uniforms.uMouse=[s/l,(o-v)/o]}),a.value.addEventListener("click",t=>{const{width:l,height:o}=t.target.getBoundingClientRect(),{offsetX:s,offsetY:v}=t;e.uniforms.uOrigin=[s/l,(o-v)/o]})};return(t,l)=>(_(),h(b,null,[L,O,r("div",null,[(_(),h(b,null,k(z,(o,s)=>r("span",{class:w(["filter-type",{active:i.value===s}]),onClick:v=>i.value=s},M(o.name),11,E)),64))]),r("canvas",{ref_key:"glRef",ref:a,width:"512",height:"512"},null,512)],64))}},j=C(G,[["__scopeId","data-v-f8138d45"]]);export{j as default};
