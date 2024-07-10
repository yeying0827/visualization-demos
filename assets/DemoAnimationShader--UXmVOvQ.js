import{G as b}from"./gl-renderer--j5iNyII.js";import{b as y}from"./bird-8CKaPD3o.js";import{A as P}from"./animation-index-hjFUvrA4.js";import{B as S}from"./index-deXAAbbq.js";import{_ as F,r as d,o as w,w as I,a as g,c as _,b as m,F as x,d as T,n as k,t as M,p as U,f as D}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const z=r=>(U("data-v-43a92231"),r=r(),D(),r),A=z(()=>m("h3",null,"动画：Shader",-1)),B=["onClick"],C=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,E=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float fWidth;
  uniform vec2 vFrames[3]; // 3个二维向量，二维向量表示每一帧动画的图片起始x和结束x坐标
  uniform int frameIndex;

  void main() {
    vec2 uv = vUv;
    for (int i = 0; i < 3; i ++) {
      // 纹理坐标ux.x的取值范围
      uv.x = mix(vFrames[i].x, vFrames[i].y, vUv.x) / fWidth; // vUv 到 uv的映射
      if(float(i) == mod(float(frameIndex), 3.0)) break; // frameIndex除3的余数
    }

    vec4 color = texture2D(tMap, uv); // 按照uv坐标取色值

    gl_FragColor = color;
  }
`,G=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,L=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec4 color;
  uniform float rotation;

  void main() {
    vec2 st = 2.0 * (vUv - vec2(0.5));
    float c = cos(rotation);
    float s = sin(rotation);
    mat3 transformMatrix = mat3(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(st, 1.0); // 坐标系旋转
    float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x)); // abs(x)<0.5 d1=1
    float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y)); // abs(y)<0.5 d2=1
    gl_FragColor = d1 * d2 * color;
  }
`,R=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 color;

  void main() {
    gl_FragColor = color;
  }
`,W=`
  attribute vec2 a_vertexPosition;
  uniform vec4 uFromTo;
  uniform float uTime;

  float easing(in float p) {
    // return smoothstep(0.0, 1.0, p);
    // return clamp(p * p, 0.0, 1.0); // 匀加速

    return clamp(p * (2.0 - p), 0.0, 1.0); // 0->1->0 // 先减速后加速

    // if(p < 1.0) return clamp(p * (2.0 - p), 0.0, 1.0);
    // else return 1.0;
  }

  void main() {
    gl_PointSize = 1.0;
    vec2 from = uFromTo.xy;
    vec2 to = uFromTo.zw;
    float p = easing(uTime / 2.0);
    vec2 translation = mix(from, to, p);
    mat3 transformMatrix = mat3(
      1, 0, 0,
      0, 1, 0,
      translation, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`,q={__name:"DemoAnimationShader",setup(r){const h=[{name:"固定帧动画"},{name:"非固定帧动画"},{name:"缓动函数"}],a=d(2),i=d(null);let o;w(()=>{o=new b(i.value),u(a.value),I(a,()=>{u(a.value)})});const u=n=>{switch(n){case 0:const s=o.compileSync(E,C);o.useProgram(s),async function(){o.uniforms.tMap=await o.loadTexture(y),o.uniforms.vFrames=[2,88,90,176,178,264],o.uniforms.fWidth=272,o.uniforms.frameIndex=0,setInterval(()=>{o.uniforms.frameIndex++},200);const e=43/i.value.width,t=30/i.value.height;c({positions:[[-e,-t],[-e,t],[e,t],[e,-t]]}),o.render()}();break;case 1:const v=o.compileSync(L,G);o.useProgram(v),o.uniforms.rotation=0,o.uniforms.color=[1,0,0,1],new P({duration:2e3,iterations:1/0,easing:S(.76,0,.24,1)}).animate(o,({target:e,timing:t})=>{e.uniforms.rotation=t.p*2*Math.PI}),c({positions:[[-.5,-.5],[-.5,.5],[.5,.5],[.5,-.5]]}),o.render();break;case 2:const p=o.compileSync(R,W);o.useProgram(p),o.uniforms.uTime=0,o.uniforms.uFromTo=[-.5,0,.5,0],o.uniforms.color=[1,0,0,1];let f=null;requestAnimationFrame(function e(){f=f||Date.now(),o.uniforms.uTime=(Date.now()-f)/1e3,requestAnimationFrame(e)}),c({positions:[[-.25,-.25],[-.25,.25],[.25,.25],[.25,-.25]]}),o.render();break}},c=({positions:n=[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:s})=>{o.setMeshData([{positions:n,attributes:{uv:[[0,0],[0,1],[1,1],[1,0]],...s},cells:[[0,1,2],[2,0,3]]}])};return(n,s)=>(g(),_(x,null,[A,m("div",null,[(g(),_(x,null,T(h,(v,l)=>m("span",{class:k(["filter-type",{active:a.value===l}]),onClick:p=>a.value=l},M(v.name),11,B)),64))]),m("canvas",{width:"512",height:"512",ref_key:"glRef",ref:i},null,512)],64))}},K=F(q,[["__scopeId","data-v-43a92231"]]);export{K as default};
