import{G as c}from"./gl-renderer--j5iNyII.js";import{d as l,n as v,c as g}from"./glslFunc-l-MaHrBn.js";import{r as u,o as m,a as d,c as p,b as a,F as _}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const h=a("h3",null,"使用后期处理通道增强图像",-1),s=`
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

  varying vec2 vUv; // 当前片元映射的纹理坐标
  uniform sampler2D tMap;
  uniform int axis; // 标记对哪个坐标轴进行高斯模糊的处理

  void main() {
    vec4 color = texture2D(tMap, vUv);

    // 高斯矩阵的权重值
    float weight[5];
    weight[0] = 0.227027;
    weight[1] = 0.1945946;
    weight[2] = 0.1216216;
    weight[3] = 0.054054;
    weight[4] = 0.016216;

    // 每一个相邻像素的坐标间隔
    float tex_offset = 1.0 / 512.0;
    vec3 result = color.rgb;
    result *= weight[0];
    for (int i = 1; i < 5; ++ i) {
      float f = float(i);
      if (axis == 0) { // X轴的高斯模糊
        result += texture2D(tMap, vUv + vec2(tex_offset * f, 0.0)).rgb * weight[i];
        result += texture2D(tMap, vUv - vec2(tex_offset * f, 0.0)).rgb * weight[i];
      } else { // Y轴的高斯模糊
        result += texture2D(tMap, vUv + vec2(0.0, tex_offset * f)).rgb * weight[i];
        result += texture2D(tMap, vUv - vec2(0.0, tex_offset * f)).rgb * weight[i];
      }
    }

    gl_FragColor.rgb = result.rgb;
    gl_FragColor.a = color.a;
  }
`,D={__name:"DemoPPS",setup(x){const i=u(null),n=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${l.base}

  ${v.random2d}

  ${g.hsb}

  void main() {
    vec2 st = vUv;
    st *= 10.0;
    vec2 i_st = floor(st);
    vec2 f_st = 2.0 * fract(st) - vec2(1);
    float r = random(i_st);
    float sign = 2.0 * step(0.5, r) - 1.0;

    float d = triangle_distance(
      f_st,
      vec2(-1),
      vec2(1),
      sign * vec2(1, -1)
    );
    gl_FragColor.rgb = (smoothstep(-0.85, -0.6, d) - smoothstep(0.0, 0.05, d)) * hsb2rgb(vec3(r + 1.2, 0.5, r));
    gl_FragColor.a = 1.0;
  }
`;return m(()=>{const e=new c(i.value),o=e.compileSync(n,s);e.useProgram(o),e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]);const t=e.createFBO(),r=e.createFBO();e.bindFBO(t),e.render();const f=e.compileSync(b,s);e.useProgram(f),e.setMeshData(o.meshData),e.bindFBO(r),e.uniforms.tMap=t.texture,e.uniforms.axis=0,e.render(),e.bindFBO(t),e.uniforms.tMap=r.texture,e.uniforms.axis=1,e.render(),e.bindFBO(r),e.uniforms.tMap=t.texture,e.uniforms.axis=0,e.render(),e.bindFBO(null),e.uniforms.tMap=r.texture,e.uniforms.axis=1,e.render()}),(e,o)=>(d(),p(_,null,[h,a("canvas",{ref_key:"glRef",ref:i,width:"512",height:"512"},null,512)],64))}};export{D as default};
