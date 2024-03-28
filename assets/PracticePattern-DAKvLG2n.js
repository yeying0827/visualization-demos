import{_ as S,k as h,f as U,G as C,l as D,o as y,c as b,b as u,F as w,g as F,n as M,t as Y,p as G,a as I}from"./index-jvjASubQ.js";const X=v=>(G("data-v-e2db7b04"),v=v(),I(),v),z=X(()=>u("h3",null,"课后练习",-1)),H=["onClick"],P=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1.0, 1.0);
  }
`,R=`
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform int rows;

  // hsv -> rgb
  // 参数的取值范围都是 (0, 1)
  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  // 伪随机数
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233)))
                  * 43758.5453123);
  }

  void main() {
    // vec2 st = vec2(random(floor(vUv * float(rows))));
    // gl_FragColor.rgb = vec3(st, 1.0);
    // gl_FragColor.a = 1.0;

    gl_FragColor.rgb = hsv2rgb(vec3(random(floor(vUv * float(rows))), 0.5, 1.0));
    gl_FragColor.a = 1.0;
  }
`,B=`
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define PI 3.14159265358979323846

  varying vec2 vUv;
  uniform int rows;
  uniform float k;

  // 伪随机数
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233)))
                  * 43758.5453123);
  }

  vec2 truchetPattern(in vec2 _st, in float _index) {
    _index = fract((_index - 0.5) * 2.0);
    if (_index > 0.75) {
      _st = vec2(1.0) - _st; // 类似于取补码
    } else if (_index > 0.5) {
      _st = vec2(1.0 - _st.x, _st.y); // x取补码，y取原码
    } else if (_index > 0.25) {
      _st = 1.0 - vec2(1.0 - _st.x, _st.y);
    }
    return _st;
  }

  void main() {
    // 效果：迷宫
    vec2 st = vUv * float(rows);
    vec2 ipos = floor(st); // integer
    vec2 fpos = fract(st); // fraction

    vec2 tile = truchetPattern(fpos, random(ipos) * k);
    float color = 0.0;

    color = smoothstep(tile.x - 0.3, tile.x, tile.y) -
            smoothstep(tile.x, tile.x + 0.3, tile.y);

    gl_FragColor = vec4(vec3(color), 1.0);
  }
`,A=`
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;
  uniform int rows;

  void main() {
    vec2 st = fract(vUv * float(rows));

    float d1 = step(st.x, 0.9);
    float d2 = step(0.1, st.y);

    gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1*d2);
    gl_FragColor.a = 1.0;
  }
`,N=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  uniform int scale;
  uniform vec2 offset;

  mat3 translateMatrix = mat3( // 平移矩阵
    1.0, 0.0, 0.0, // 第一列
    0.0, 1.0, 0.0, // 第二列
    offset.x, offset.y, 1.0 // 第三列
  );

  mat3 scaleMatrix = mat3( // 缩放矩阵
    float(scale), 0.0, 0.0,
    0.0, float(scale), 0.0,
    0.0, 0.0, 1.0
  );

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    vec3 pos = scaleMatrix * translateMatrix * vec3(a_vertexPosition, 1.0);
    gl_Position = vec4(pos, 1.0);
  }
`,T={__name:"PracticePattern",setup(v){const E=[{name:"彩色方块"},{name:"真·随机迷宫图案"},{name:"网格背景缩放移动（平移和缩放）"}],i=h(0),o=h(null);let e,a;const r={},s={};U(()=>{e=new C(o.value),m(i.value),d(),D(i,()=>{m(i.value),d()})});const m=t=>{switch(L(),t){case 0:a=e.compileSync(R,P),e.useProgram(a),e.uniforms.rows=10;break;case 1:a=e.compileSync(B,P),e.useProgram(a),e.uniforms.rows=10,e.uniforms.k=Math.random()+1;break;case 2:a=e.compileSync(A,N),e.useProgram(a),e.uniforms.scale=1,e.uniforms.offset=[0,0],e.uniforms.rows=64,s.x=0,s.y=0,k();break}},d=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()},_=t=>{t.preventDefault(),t.wheelDeltaY>0?e.uniforms.scale<=50&&(e.uniforms.scale+=1):e.uniforms.scale>1&&(e.uniforms.scale-=1)},g=t=>{t.preventDefault(),r.x=t.offsetX,r.y=t.offsetY,o.value.addEventListener("mousemove",p)},p=t=>{t.preventDefault();const{offsetX:l,offsetY:c}=t,n=(l-r.x)/o.value.width,f=(r.y-c)/o.value.height;e.uniforms.offset=[n+s.x,f+s.y]},x=t=>{t.preventDefault();const{offsetX:l,offsetY:c}=t,n=(l-r.x)/o.value.width,f=(r.y-c)/o.value.height;s.x=n+s.x,s.y=f+s.y,o.value.removeEventListener("mousemove",p)},k=()=>{o.value.addEventListener("mousewheel",_),o.value.addEventListener("mousedown",g),o.value.addEventListener("mouseup",x)},L=()=>{o.value.removeEventListener("mousewheel",_),o.value.removeEventListener("mousedown",g),o.value.removeEventListener("mouseup",x)};return(t,l)=>(y(),b(w,null,[z,u("div",null,[(y(),b(w,null,F(E,(c,n)=>u("span",{class:M(["pattern-type",{active:i.value===n}]),onClick:f=>i.value=n},Y(c.name),11,H)),64))]),u("canvas",{width:"1024",height:"1024",ref_key:"patternPracticeRef",ref:o},null,512)],64))}},$=S(T,[["__scopeId","data-v-e2db7b04"]]);export{$ as default};
