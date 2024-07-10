import{G as i}from"./gl-renderer--j5iNyII.js";import{r as c,o,a as r,c as l,b as t,F as d}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const v=t("h3",null,"绘制三角形",-1),_=t("p",null,"点到线段的距离",-1),f=`
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

  // 点到直线的距离
  float line_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    return cross(p, normalize(ab)).z;
  }

  // 点到线段的距离
  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    float d = abs(cross(p, normalize(ab)).z);
    float proj = dot(p, ab) / l;
    if (proj >= 0.0 && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
  }

  // 点与三角形的距离
  float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, a);

    if (d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0
      || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0) { // 在三角形内部
      return -min(abs(d1), min(abs(d2), abs(d3))); // 负数
    }

    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a)));
  }

  void main() {
    float d = triangle_distance(
      vUv,
      vec2(0.3),
      vec2(0.5, 0.7),
      vec2(0.7, 0.3)
    );

    d = fract(20.0 * d);
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);

    gl_FragColor.a = 1.0;
  }
`,z={__name:"DemoShape",setup(m){const a=c(null);let e,n;o(()=>{e=new i(a.value),n=e.compileSync(b,f),e.useProgram(n),s()});const s=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()};return(p,g)=>(r(),l(d,null,[v,_,t("canvas",{ref_key:"glRef",ref:a,width:"512",height:"512"},null,512)],64))}};export{z as default};