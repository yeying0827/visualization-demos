import{G as f}from"./gl-renderer--j5iNyII.js";import{n as c}from"./glslFunc-l-MaHrBn.js";import{r as u,o as v,a as l,c as m,b as i,F as d}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const p=i("h3",null,"烟雾效果",-1),g=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,O={__name:"Smoke",setup(_){const o=u(null),n=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap; // 用于后期处理
  uniform float uTime; // 控制图像随时间变化

  ${c.noise_gradient}

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
`;return v(()=>{const e=new f(o.value),s=e.compileSync(n,g);e.useProgram(s),e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]);const t={readFBO:e.createFBO(),writeFBO:e.createFBO(),get texture(){return this.readFBO.texture},swap(){const r=this.writeFBO;this.writeFBO=this.readFBO,this.readFBO=r}};function a(r){e.bindFBO(null),e.uniforms.uTime=r/1e3,e.uniforms.tMap=t.texture,e.render(),e.bindFBO(t.writeFBO),e.uniforms.tMap=t.texture,t.swap(),e.render(),requestAnimationFrame(a)}a(0)}),(e,s)=>(l(),m(d,null,[p,i("canvas",{width:"512",height:"512",ref_key:"glRef",ref:o},null,512)],64))}};export{O as default};
