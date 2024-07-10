import{G as I}from"./gl-renderer--j5iNyII.js";import{n as u,c as L}from"./glslFunc-l-MaHrBn.js";import{_ as $,r as y,o as G,w as R,a as B,c as D,b as g,F as k,d as X,n as Y,t as q,p as z,f as A}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const K=c=>(z("data-v-ee03f3e3"),c=c(),A(),c),N=K(()=>g("h3",null,"课后练习",-1)),V=["onClick"],x=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,j={__name:"Practice",setup(c){const O=[{name:"烟雾效果（+风向风速）"},{name:"烟雾效果（随鼠标移动）"},{name:"探照灯"}],i=y(0),o=y(null),P=`
  #ifdef GL_ES
  precision highp float;
  #endif

  #define PI 3.1415926

  varying vec2 vUv;
  uniform sampler2D tMap; // 用于后期处理
  uniform float uTime; // 控制图像随时间变化

  ${u.random2d}
  ${u.noise_gradient}

  void main() {
    vec3 smoke = vec3(0);
    if (uTime <= 0.0) { // 判断是第一次还是后续的叠加过程
      vec2 st = vUv - vec2(0.5);
      float d = length(st);
      // smoke = vec3(step(d, 0.05));
      smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
    }

    vec2 st = vUv;
    // st.y -= 0.001; // 取当前纹理坐标稍微下方一点的像素点

    vec3 diffuse = texture2D(tMap, st).rgb;
    float offset = 1.0 / 256.0;

    // float rx = noise(vec2(5.0 * uTime));
    float rx = random(vec2(10.0 + (2.0 * step(1.0, uTime) - 1.0) * floor(uTime / 1.0)) );
    float ry = noise(vec2(rx));
    float kx = sin(2.0 * PI * rx);
    // float ky = sin(2.0 * PI * ry);
    float ky = 0.5 * sin(2.0 * PI * ry) + 0.5;
    float vx = 1.0;
    float vy = 5.0;
    vec2 wind = vec2(kx * vx, ky * vy);
    float dl = 0.0, dr = 0.0, du = 0.0, dd = 0.0;
    if (wind.x > 0.0) dl = wind.x;
    else dr = -wind.x;
    if (wind.y > 0.0) du = wind.y;
    else dd = -wind.y;

    vec4 left  = texture2D(tMap, st + vec2(-offset, 0.0));
    vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
    vec4 up    = texture2D(tMap, st + vec2(0.0, -offset));
    vec4 down  = texture2D(tMap, st + vec2(0.0, offset));

    // 参考网友
    // https://github.com/IDonotK/graphics/blob/master/homework/h17/index1.html
    float rand = 5.0 * noise(st + 5.0 * uTime);
    float diff = 10.0 * 0.016 * (
      (1.0 + rand + dl) * left.r +
      (1.0 - rand + dr) * right.r +
      (1.0 + dd) * down.r +
      (1.0 + du) * up.r -
      (4.0 + dl + dr + dd + du) * diffuse.r
    );

    // 自己瞎写
    // float rand = 5.0 * noise(st + 5.0 * uTime);
    // float dir = 0.5 * random(st + 0.5 * uTime); // direction
    // float s = 20.0 * random(st + 1.2 * uTime); // speed
    // float diff = s * 0.016 * (
    //   (1.0 - rand + dir) * left.r +
    //   (1.0 + rand - dir) * right.r +
    //   1.001 * down.r +
    //   2.0 * up.r -
    //   5.0 * diffuse.r
    // );

    gl_FragColor.rgb = (diffuse + diff) + smoke;
    gl_FragColor.a = 1.0;
  }
`,T=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;
  uniform float isMouseDown;
  uniform vec2 mousePos;

  float PI = 3.141592653;

  ${u.random2d}

  ${u.noise_gradient}

  void main() {
    vec3 smoke = vec3(0);
    if (isMouseDown > 0.0) { // 鼠标点击标记
      vec2 st = vUv - mousePos;
      float d = length(st);
      smoke = vec3(step(d, 0.025));
    }

    vec2 st = vUv;

    float offset = 1.0 / 256.0;
    vec3 diffuse = texture2D(tMap, st).rgb;

    vec4 left = texture2D(tMap, st + vec2(-offset, 0.0));
    vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
    vec4 up = texture2D(tMap, st + vec2(0.0, -offset));
    vec4 down = texture2D(tMap, st + vec2(0.0, offset));

    float rand = noise(st + 5.0 * uTime);
    float diff = 8.0 * 0.016 * (
      (1.0 + rand) * left.r +
      (1.0 - rand) * right.r +
      down.r +
      3.0 * up.r -
      6.0 * diffuse.r
    );

    float minimum = 0.003;
    if(diff >= -minimum && diff < 0.0) {
      diff = -minimum;
    }

    gl_FragColor.rgb = (diffuse + diff) + smoke;
    gl_FragColor.a = 1.0;
  }
`,S=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform int stage;
  uniform vec2 u_mouse;
  uniform sampler2D tSource;

  ${u.random2d}

  ${L.hsb}

  void main() {
    vec2 st = vUv * 10.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    vec3 color = vec3(.0);
    if (stage == 0) {
      color = hsb2rgb(vec3(random(i_st), 1, 1));
      float d_grid = (step(0.05, f_st.x) - step(0.95, f_st.x)) * (step(0.05, f_st.y) - step(0.95, f_st.y));
      color *= mix(vec3(0.0), color, d_grid);
    } else if (stage == 1) {
      color = vec3(.0);
    } else if (stage == 2) {
      float d = distance(vUv, u_mouse);
      color = ((1.0 - smoothstep(0.15, 0.25, d)) * texture2D(tSource, vUv)).rgb;
      // if(length(color) > 0.0) color *= 0.88;
    }

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
  }
`;let e;G(()=>{e=new I(o.value),w(i.value),d(),R(i,()=>{w(i.value)})});const w=l=>{switch(l){case 0:const F=e.compileSync(P,x);e.useProgram(F),d(),function(){const t=b();function r(n){e.bindFBO(null),e.uniforms.uTime=n/1e3,e.uniforms.tMap=t.texture,e.render(),e.bindFBO(t.writeFBO),e.uniforms.tMap=t.texture,t.swap(),e.render(),requestAnimationFrame(r)}r(0)}();break;case 1:const h=e.compileSync(T,x);e.useProgram(h),d(),function(){const t=b(),{width:r,height:n}=o.value,v=o.value.getBoundingClientRect();let a=!1,p=[0,0];const f=s=>{const C=(s.clientX-v.left)/r,E=(n-(s.clientY-v.top))/n;p=[C,E]};o.value.addEventListener("mousedown",s=>{f(s),o.value.addEventListener("mousemove",f),a=!0}),o.value.addEventListener("mouseup",s=>{a=!1,o.value.removeEventListener("mousemove",f)}),e.uniforms.isMouseDown=0,e.uniforms.mousePos=[0,0];function M(s){a?(e.uniforms.mousePos=p,e.uniforms.isMouseDown||(e.uniforms.isMouseDown=1)):e.uniforms.isMouseDown&&(e.uniforms.isMouseDown=0),e.bindFBO(null),e.uniforms.uTime=s/1e3,e.uniforms.tMap=t.texture,e.render(),e.bindFBO(t.writeFBO),e.uniforms.tMap=t.texture,e.render(),t.swap(),requestAnimationFrame(M)}M(0)}();break;case 2:const m=e.compileSync(S,x);e.useProgram(m),d(),e.uniforms.stage=0,e.render();const _=e.createFBO();e.bindFBO(_),e.render(),e.bindFBO(null),e.uniforms.stage=1,e.render();const U=t=>{const{offsetX:r,offsetY:n}=t,{width:v,height:a}=o.value.getBoundingClientRect(),p=r/v,f=1-n/a;e.uniforms.u_mouse=[p,f],e.uniforms.stage=2,e.uniforms.tSource=_.texture,e.render()};(()=>{e.bindFBO(null),o.value.addEventListener("mousemove",U)})();break}},b=()=>({readFBO:e.createFBO(),writeFBO:e.createFBO(),get texture(){return this.readFBO.texture},swap(){const l=this.writeFBO;this.writeFBO=this.readFBO,this.readFBO=l}}),d=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}])};return(l,F)=>(B(),D(k,null,[N,g("div",null,[(B(),D(k,null,X(O,(h,m)=>g("span",{class:Y(["filter-type",{active:i.value===m}]),onClick:_=>i.value=m},q(h.name),11,V)),64))]),g("canvas",{width:"512",height:"512",ref_key:"glRef",ref:o},null,512)],64))}},ee=$(j,[["__scopeId","data-v-ee03f3e3"]]);export{ee as default};
