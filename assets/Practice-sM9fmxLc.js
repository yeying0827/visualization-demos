import{_ as C,r as d,o as E,w as R,a as y,c as b,b as n,F as M,d as U,e as P,v as w,n as A,t as I,p as L,f as z}from"./index-a4tGsWeP.js";import{G as k}from"./gl-renderer--j5iNyII.js";import{A as _}from"./animation-hjFUvrA4.js";import{B as p}from"./index-deXAAbbq.js";import"./_commonjsHelpers-5-cIlDoe.js";const G="/visualization-demos/assets/kiminonamaiwa-OMNvAnTT.jpg",j=i=>(L("data-v-1071cf3c"),i=i(),z(),i),N=j(()=>n("h3",null,"课后练习",-1)),X=["onClick"],Y=`
  attribute vec2 a_vertexPosition;
  uniform vec2 scale;

  void main() {
    float scaleX = scale.x;
    float scaleY = scale.y;
    mat3 transformMatrix = mat3(
      scaleX, 0, 0,
      0, scaleY, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`,g=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 color;

  void main() {
    gl_FragColor = color;
  }
`,q=`
  attribute vec2 a_vertexPosition;
  uniform vec2 rad;

  void main() {
    float x_rad = rad.x;
    float y_rad = rad.y;
    mat3 transformMatrix = mat3(
      1.0, tan(y_rad), 0,
      tan(x_rad), 1.0, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`,O=`
  attribute vec2 a_vertexPosition;
  uniform float rotation;
  uniform vec2 scale;
  uniform vec2 translation;
  uniform vec2 rad;

  void main() {
    float x_scale = scale.x;
    float y_scale = scale.y;
    mat3 scaleMatrix = mat3( // 缩放矩阵
      x_scale, 0, 0,
      0, y_scale, 0,
      0, 0, 1
    );
    float c = cos(rotation);
    float s = sin(rotation);
    mat3 rotationMatrix = mat3( // 旋转矩阵
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
    mat3 translationMatrix = mat3( // 平移矩阵
      1, 0, 0,
      0, 1, 0,
      translation, 1
    );

    float x_rad = rad.x;
    float y_rad = rad.y;
    mat3 skewMatrix = mat3( // 扭曲矩阵
      1.0, tan(y_rad), 0,
      tan(x_rad), 1.0, 0,
      0, 0, 1
    );
    vec3 pos = skewMatrix * scaleMatrix * rotationMatrix * translationMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`,V=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;

    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,$=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform float uTime;
  uniform sampler2D tMap;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv * vec2(100.0); //vec2(576.0, 324.0);
    vec2 i_st = floor(st);

    // float d = (distance(vUv, vec2(0.5)));
    float d = (distance(i_st, 0.5 * vec2(100.0)));

    vec4 color = texture2D(tMap, vUv);

    float a = mix(0.0, 1.0, d / uTime * 100.0);


    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = a;
  }
`,H={__name:"Practice",setup(i){const S=[{name:"缩放"},{name:"扭曲"},{name:"组合"},{name:"粒子爆炸?"}],e=d(3),v=d(null),u=d(null);let a,o,x=null;E(()=>{a=new k(v.value),o=new k(u.value),s(e.value),R(e,()=>{s(e.value)}),v.value.addEventListener("click",()=>s(e.value)),u.value.addEventListener("click",()=>s(e.value))});const s=c=>{switch(c){case 0:const l=a.compileSync(g,Y);a.useProgram(l),a.uniforms.scale=[0,0],a.uniforms.color=[1,0,0,1],new _({duration:2e3,easing:p(.5,-1.5,.5,2.5)}).animate(a,({target:r,timing:{p:t}})=>{a.uniforms.scale=[t,t]}),f({positions:[[-.5,-.5],[-.5,.5],[.5,.5],[.5,-.5]]}),a.render();break;case 1:const m=a.compileSync(g,q);a.useProgram(m),a.uniforms.rad=[0,0],a.uniforms.color=[1,0,0,1],new _({duration:2e3,easing:p(.5,-1.5,.5,2.5)}).animate(a,({target:r,timing:{p:t}})=>{a.uniforms.rad=[t,t]}),f({positions:[[-.25,-.25],[-.25,.25],[.25,.25],[.25,-.25]]}),a.render();break;case 2:const T=a.compileSync(g,O);a.useProgram(T),a.uniforms.rotation=0,a.uniforms.scale=[0,0],a.uniforms.color=[1,0,0,1],a.uniforms.translation=[-.5,0],a.uniforms.rad=[0,0],new _({duration:2e3,easing:p(.5,-1.5,.5,2.5)}).animate(a,({target:r,timing:{p:t}})=>{r.uniforms.scale=[t,t],r.uniforms.rotation=t*2*Math.PI,r.uniforms.translation=[-.5*(1-t)+.5*t,0],a.uniforms.rad=[t,t]}),f({positions:[[-.25,-.25],[-.25,.25],[.25,.25],[.25,-.25]]}),a.render();break;case 3:const B=o.compileSync($,V);o.useProgram(B),async function(){const r=await o.loadTexture(G);o.uniforms.tMap=r,cancelAnimationFrame(x);const t=D=>{o.uniforms.uTime=D*4,x=requestAnimationFrame(t)};t(0),o.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),o.render()}()}},f=({positions:c=[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:l={}})=>{a.setMeshData([{positions:c,attributes:{uv:[[0,0],[0,1],[1,1],[1,0]],...l},cells:[[0,1,2],[2,0,3]]}])};return(c,l)=>(y(),b(M,null,[N,n("div",null,[(y(),b(M,null,U(S,(h,m)=>n("span",{class:A(["filter-type",{active:e.value===m}]),onClick:F=>e.value=m},I(h.name),11,X)),64))]),P(n("canvas",{width:"512",height:"512",ref_key:"glRef",ref:v},null,512),[[w,e.value!==3]]),P(n("canvas",{width:"1152",height:"648",ref_key:"bloomRef",ref:u},null,512),[[w,e.value===3]])],64))}},ta=C(H,[["__scopeId","data-v-1071cf3c"]]);export{ta as default};
