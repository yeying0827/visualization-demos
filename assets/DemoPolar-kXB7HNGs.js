import{G as a}from"./gl-renderer--j5iNyII.js";import{d as s}from"./glslFunc-l-MaHrBn.js";import{r as l,o as f,a as p,c}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const g=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,u={__name:"DemoPolar",setup(_){const e=l(null),r=`
  #ifdef GL_ES
  precision highp float;
  #endif

  #define PI 3.1415926

  varying vec2 vUv;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      ) *
      43758.5453123
    );
  }

  vec2 polar(vec2 st) {
    return vec2(length(st), atan(st.y, st.x));
  }

  ${s.base}
  ${s.polygon}
  ${s.star}

  void main() {

    // float u_k = 1.7;
    // float u_scale = 0.5;
    // float u_offset = 0.2;
    //
    // vec2 st = vUv - vec2(0.5);
    // st = polar(st);
    // float d = u_scale * 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x + u_offset;
    //
    // gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    // gl_FragColor.a = 1.0;

    vec2 st = vUv * 10.0;
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    float r = random(ipos);
    float d = 0.0;

    fpos = fpos - vec2(0.5);
    if (r < 0.14) {
      d = polygon_distance2(
        fpos,
        4,
        vec2(0.0, 0.4)
      );
      gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.28) {
      float u_k = 4.0;
      fpos = polar(fpos);
      d = 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else if (r < 0.42) {
      float u_k = 1.3;
      fpos = polar(fpos);
      fpos.y += PI / 2.0;
      if (fpos.y > PI) fpos.y -= PI * 2.0;
      d = 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else if (r < 0.56) {
      d = polygon_distance2(
        fpos,
        6,
        vec2(0.0, 0.4)
      );
      gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.70) {
      d = star_distance(
        fpos,
        5,
        vec2(0.15, 0.2)
      );
      gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.84) {
      float u_k = 1.7;
      float u_scale = 0.5;
      float u_offset = 0.2;

      fpos = polar(fpos);
      fpos.y += PI / 2.0;
      if (fpos.y > PI) fpos.y -= PI * 2.0;
      float d = u_scale * 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x + u_offset;

      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else {
      float u_k = 5.0;
      float u_scale = 0.13;
      float u_offset = 0.2;
      fpos = polar(fpos);
      d = smoothstep(-0.3, 1.0, u_scale * 0.5 * cos(fpos.y * u_k) + u_offset) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    }
  }
`;return f(()=>{const o=new a(e.value),t=o.compileSync(r,g);o.useProgram(t),o.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),o.render()}),(o,t)=>(p(),c("canvas",{width:"512",height:"512",ref_key:"glRef",ref:e},null,512))}};export{u as default};
