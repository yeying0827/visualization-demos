import{y as g,f as u,G as v,o as m,c as p,b as l,F as b,R as d,T as h,U as _}from"./index-3qJZoPZt.js";const x=l("h3",null,"辉光效果（使用Tone Mapping方法）：对特定元素进行高斯模糊",-1),i=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,F=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv; // 当前片元映射的纹理坐标
  uniform sampler2D tMap;
  uniform int axis; // 标记对哪个坐标轴进行高斯模糊的处理
  uniform float filter; // 将颜色亮度大于 filter 值的片元过滤出来添加高斯模糊

  void main() {
    vec4 color = texture2D(tMap, vUv);

    float brightness = dot(
      color.rgb,
      vec3(0.2126, 0.7152, 0.0722)
    );
    brightness = step(filter, brightness);

    // 高斯矩阵的权重值
    float weight[5];
    weight[0] = 0.227027;
    weight[1] = 0.1945946;
    weight[2] = 0.1216216;
    weight[3] = 0.054054;
    weight[4] = 0.016216;

    // 每一个相邻像素的坐标间隔，这里的512可以用实际的Canvas像素宽代替
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

    gl_FragColor.rgb = brightness * result.rgb;
    gl_FragColor.a = color.a;
  }
`,M=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D tMap;
  uniform sampler2D tSource;

  varying vec2 vUv;

  void main() {
    vec3 color = texture2D(tSource, vUv).rgb;
    vec3 bloomColor = texture2D(tMap, vUv).rgb;
    color += bloomColor;
    // tone mapping 色调映射
    float exposure = 2.0;
    float gamma = 1.3;
    vec3 result = vec3(1.0) - exp(-color * exposure);
    // also gamma correct while we're at it
    if (length(bloomColor) > 0.0) {
      result = pow(result, vec3(1.0 / gamma));
    }
    gl_FragColor.rgb = result;
    gl_FragColor.a = 1.0;
  }
`,U={__name:"Tone",setup(w){const n=g(null),f=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${d.base}

  ${h.random2d}

  ${_.hsb}

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
`;return u(()=>{const e=new v(n.value),t=e.compileSync(f,i);e.useProgram(t),e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]);const a=e.createFBO(),r=e.createFBO(),o=e.createFBO();e.bindFBO(a),e.render();const s=e.compileSync(F,i),c=e.compileSync(M,i);e.useProgram(s),e.setMeshData(t.meshData),e.bindFBO(o),e.uniforms.tMap=a.texture,e.uniforms.axis=0,e.uniforms.filter=.7,e.render(),e.useProgram(s),e.bindFBO(r),e.uniforms.tMap=o.texture,e.uniforms.axis=1,e.uniforms.filter=0,e.render(),e.useProgram(s),e.bindFBO(o),e.uniforms.tMap=r.texture,e.uniforms.axis=0,e.uniforms.filter=0,e.render(),e.useProgram(s),e.bindFBO(r),e.uniforms.tMap=o.texture,e.uniforms.axis=1,e.uniforms.filter=0,e.render(),e.useProgram(c),e.setMeshData(t.meshData),e.bindFBO(null),e.uniforms.tSource=a.texture,e.uniforms.tMap=r.texture,e.render()}),(e,t)=>(m(),p(b,null,[x,l("canvas",{height:"512",width:"512",ref_key:"glRef",ref:n},null,512)],64))}};export{U as default};
