import{G as h}from"./gl-renderer--j5iNyII.js";import{_ as b,r as m,o as y,w as x,a as _,c as g,b as r,F as p,d as S,n as F,t as k,p as C,f as j}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const U=a=>(C("data-v-3bcd5414"),a=a(),j(),a),w=U(()=>r("h3",null,"网格噪声",-1)),G=["onClick"],i=`
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

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    vec2 p = random2(i_st); // 特征点
    d = distance(f_st, p);

    gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`,T=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j)); // 坐标x和y：-1~1
        vec2 p = random2(i_st + neighbor); // 9个随机特征点在自身网格内的坐标（坐标x和y：0~1）
        // 当前点和9个随机特征点 最近的距离
        d = min(d, distance(f_st, neighbor + p)); // f_st（当前片元在自身网格内的坐标），neighbor+p（特征点相对片元所在网格的坐标，坐标X和Y：-1~2）
      }
    }

    gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`,B=`
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
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j)); // 坐标x和y：-1~1
        vec2 p = random2(i_st + neighbor); // 9个随机特征点在自身网格内的坐标（坐标x和y：0~1）
        p = 0.5 + 0.5 * sin(uTime + 6.2831 * p); // 随时间动态变化（0~1）
        // 当前点和9个特征点 最近的距离
        d = min(d, distance(f_st, neighbor + p)); // neighbor+p（坐标X和Y：-1~2）
      }
    }

    gl_FragColor.rgb = vec3(d) + step(d, 0.03); // 显示特征点
    gl_FragColor.a = 1.0;
  }
`,E={__name:"Grid",setup(a){const u=[{name:"基础使用"},{name:"生物细胞"},{name:"生物细胞（动态）"}],o=m(2),n=m(null);let e,t;y(()=>{e=new h(n.value),c(o.value),v(),x(o,()=>{c(o.value),v()})});const c=l=>{switch(l){case 0:t=e.compileSync(P,i),e.useProgram(t);break;case 1:t=e.compileSync(T,i),e.useProgram(t);break;case 2:t=e.compileSync(B,i),e.useProgram(t),e.uniforms.uTime=0,requestAnimationFrame(function d(s){e.uniforms.uTime=.001*s,requestAnimationFrame(d)});break}},v=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(l,d)=>(_(),g(p,null,[w,r("div",null,[(_(),g(p,null,S(u,(s,f)=>r("span",{class:F(["filter-type",{active:o.value===f}]),onClick:I=>o.value=f},k(s.name),11,G)),64))]),r("canvas",{ref_key:"glRef",ref:n,width:"512",height:"512"},null,512)],64))}},D=b(E,[["__scopeId","data-v-3bcd5414"]]);export{D as default};
