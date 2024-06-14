import{y as f,f as c,G as v,o as u,c as g,b as n,F as m,R as d,T as _,U as h}from"./index-3qJZoPZt.js";const p=n("h3",null,"Blur滤镜",-1),i=`
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

    gl_FragColor.rgb = result.rgb;
    gl_FragColor.a = color.a;
  }
`,w={__name:"Blur",setup(x){const a=f(null),l=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${d.base}

  ${_.random2d}

  ${h.hsb}

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
`;return c(()=>{const e=new v(a.value),s=e.compileSync(l,i);e.useProgram(s),e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]);const t=e.createFBO(),r=e.createFBO();e.bindFBO(t),e.render();const o=e.compileSync(b,i);e.useProgram(o),e.setMeshData(s.meshData),e.bindFBO(r),e.uniforms.tMap=t.texture,e.uniforms.axis=0,e.render(),e.useProgram(o),e.bindFBO(t),e.uniforms.tMap=r.texture,e.uniforms.axis=1,e.render(),e.useProgram(o),e.bindFBO(r),e.uniforms.tMap=t.texture,e.uniforms.axis=0,e.render(),e.useProgram(o),e.bindFBO(null),e.uniforms.tMap=r.texture,e.uniforms.axis=1,e.render()}),(e,s)=>(u(),g(m,null,[p,n("canvas",{height:"512",width:"512",ref_key:"glRef",ref:a},null,512)],64))}};export{w as default};
