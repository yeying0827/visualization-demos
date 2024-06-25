import{y as f,f as c,G as u,o as v,c as l,b as i,F as d,T as m}from"./index-Yh4SR2m9.js";const p=i("h3",null,"烟雾效果",-1),g=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,F={__name:"Smoke",setup(_){const s=f(null),n=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap; // 用于后期处理
  uniform float uTime; // 控制图像随时间变化

  ${m.noise_gradient}

  void main() {
    vec3 smoke = vec3(0);
    if (uTime <= 0.0) { // 判断是第一次还是后续的叠加过程
      vec2 st = vUv - vec2(0.5);
      float d = length(st);
      smoke = vec3(step(d, 0.05));
      // smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
    }

    vec2 st = vUv;
    // st.y -= 0.001; // 取当前纹理坐标稍微下方一点的像素点

    vec3 diffuse = texture2D(tMap, st).rgb;
    float offset = 1.0 / 256.0;

    vec4 left  = texture2D(tMap, st + vec2(-offset, 0.0));
    vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
    vec4 up    = texture2D(tMap, st + vec2(0.0, -offset));
    vec4 down  = texture2D(tMap, st + vec2(0.0, offset));

    float rand = noise(st + 5.0 * uTime); // -1~1
    float diff = 8.0 * 0.016 * (
      (1.0 + rand) * left.r +
      (1.0 - rand) * right.r +
      down.r +
      2.0 * up.r -
      5.0 * diffuse.r
    );

    gl_FragColor.rgb = (diffuse + diff) + smoke;
    gl_FragColor.a = 1.0;
  }
`;return c(()=>{const e=new u(s.value),o=e.compileSync(n,g);e.useProgram(o),e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]);const t={readFBO:e.createFBO(),writeFBO:e.createFBO(),get texture(){return this.readFBO.texture},swap(){const r=this.writeFBO;this.writeFBO=this.readFBO,this.readFBO=r}};function a(r){e.bindFBO(null),e.uniforms.uTime=r/1e3,e.uniforms.tMap=t.texture,e.render(),e.bindFBO(t.writeFBO),e.uniforms.tMap=t.texture,t.swap(),e.render(),requestAnimationFrame(a)}a(0)}),(e,o)=>(v(),l(d,null,[p,i("canvas",{width:"512",height:"512",ref_key:"glRef",ref:s},null,512)],64))}};export{F as default};
