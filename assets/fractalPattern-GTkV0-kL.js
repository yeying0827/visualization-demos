import{_ as i,f as s,G as n,o as l,c as v,F as f,p as u,a as d,b as c}from"./index-g0v-nOv3.js";const r=t=>(u("data-v-138bd513"),t=t(),d(),t),g=r(()=>c("h3",null,"分形图案",-1)),p=r(()=>c("canvas",{width:"512",height:"512",id:"fractal"},null,-1)),_=`
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec2 vUv;
  uniform vec2 center;
  uniform float scale;
  uniform int iterations;

  vec2 f(vec2 z, vec2 c) {
    return mat2(z, -z.y, z.x) * z + c;
  }

  // vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
  //   float x = 1.0 / 3.0;
  //   if (t < x) return mix(c1, c2, t/x);
  //   else if (t < 2.0 * x) return mix(c2, c3, (t - x)/x);
  //   else if (t < 3.0 * x) return mix(c3, c4, (t - 2.0*x)/x);
  //   return c4;
  // }

  void main() {
    vec2 uv = vUv;
    // 设置初始的z和c，然后执行迭代。
    vec2 c = center + 4.0 * (uv - vec2(0.5)) / scale;
    vec2 z = vec2(0.0);

    bool escaped = false;
    int j;
    // 给一个足够精度的最大迭代次数：65536
    for (int i = 0; i < 65536; i ++) {
      if (i > iterations) break;
      j = i;
      z = f(z, c);
      if (length(z) > 2.0) { // 如果z的模大于2，就结束计算；否则就继续迭代，直到达到循环次数
        escaped = true;
        break;
      }
    }

    // gl_FragColor.rgb = escaped ? vec3(float(j)) / float(iterations) : vec3(0.0);
    gl_FragColor.rgb = escaped ? vec3(float(j)) / sqrt(float(iterations)) : vec3(0.0);
    // gl_FragColor.rgb = escaped ? vec3(float(j)) + float(iterations) : vec3(0.0);
    // gl_FragColor.rgb = escaped ? vec3(float(j)) * float(iterations) : vec3(0.0);
    // gl_FragColor.rgb = escaped ? vec3(1.0) : vec3(0.0);

    // 配合update()动态变化看效果
    // gl_FragColor.rgb = escaped ? max(1.0, log(scale)) * palette(float(j)/ float(iterations), vec3(0.02, 0.02, 0.03), vec3(0.1, 0.2, 0.3), vec3(0.0, 0.3, 0.2), vec3(0.0, 0.5, 0.8))
    //          : vec3(0.0);
    gl_FragColor.a = 1.0;
  }
`,m=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,x={__name:"fractalPattern",setup(t){return s(()=>{const a=document.querySelector("#fractal"),e=new n(a),o=e.compileSync(_,m);e.useProgram(o),e.uniforms.center=[0,0],e.uniforms.scale=1,e.uniforms.iterations=256,e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()}),(a,e)=>(l(),v(f,null,[g,p],64))}},z=i(x,[["__scopeId","data-v-138bd513"]]);export{z as default};
