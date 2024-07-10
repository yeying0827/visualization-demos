import{G as F}from"./gl-renderer--j5iNyII.js";import{d as E}from"./ImageHandler-5dxAiF35.js";import{g as D}from"./girl1-zwAbMbEm.js";import{r as G}from"./room-kw1AW3rD.js";import{_ as L,r as b,o as B,w as R,a as S,c as k,b as C,F as P,d as T,n as X,t as I,p as Y,f as j}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";function A(o,e){const t=[],a=o[0],r=o[1],u=o[2],g=o[3],x=o[4],h=o[5],_=o[6],m=o[7],l=o[8],p=o[9],v=o[10],d=o[11],f=o[12],y=o[13],w=o[14],M=o[15];let n=e[0],i=e[1],s=e[2],c=e[3];return t[0]=n*a+i*x+s*l+c*f,t[1]=n*r+i*h+s*p+c*y,t[2]=n*u+i*_+s*v+c*w,t[3]=n*g+i*m+s*d+c*M,n=e[4],i=e[5],s=e[6],c=e[7],t[4]=n*a+i*x+s*l+c*f,t[5]=n*r+i*h+s*p+c*y,t[6]=n*u+i*_+s*v+c*w,t[7]=n*g+i*m+s*d+c*M,n=e[8],i=e[9],s=e[10],c=e[11],t[8]=n*a+i*x+s*l+c*f,t[9]=n*r+i*h+s*p+c*y,t[10]=n*u+i*_+s*v+c*w,t[11]=n*g+i*m+s*d+c*M,n=e[12],i=e[13],s=e[14],c=e[15],t[12]=n*a+i*x+s*l+c*f,t[13]=n*r+i*h+s*p+c*y,t[14]=n*u+i*_+s*v+c*w,t[15]=n*g+i*m+s*d+c*M,t}function z(o){const e=o.reduce((t,a,r)=>{const u=Math.floor(r/4);return t.length===u?t[t.length]=[a]:t[t.length-1].push(a),t},[]);for(let t=0;t<e.length;t++)for(let a=t+1;a<e.length;a++){let r=e[t][a];e[t][a]=e[a][t],e[a][t]=r}return e.flat()}function H({r:o=1,g:e=1,b:t=1}){return[o,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1]}function N(o){return[o,0,0,0,0,o,0,0,0,0,o,0,0,0,0,1]}function W(o){const e=.2126*(1-o),t=.7152*(1-o),a=.0722*(1-o);return[e+o,t,a,0,e,t+o,a,0,e,t,a+o,0,0,0,0,1]}const $=o=>(Y("data-v-f4754700"),o=o(),j(),o),q=$(()=>C("h3",null,"课后练习（WebGL）",-1)),J=["onClick"],U=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,K=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv; // 由顶点着色器传来的uv属性
  uniform sampler2D tMap;
  uniform mat4 colorMatrix;

  void main() {
    vec4 color = texture2D(tMap, vUv); // 从纹理中提取颜色，vUv是纹理坐标
    gl_FragColor = colorMatrix * vec4(color.rgb, 1.0); // 颜色变换
    gl_FragColor.a = color.a;
  }
`,O=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float matrix[7];
  uniform float sum;
  uniform sampler2D tMap;

  void main() {
    vec2 st = vUv * vec2(1000, 554);
    const int r = 3;

    vec4 tmpColor1;
    for(int i = -r; i <= r; i ++) {
      tmpColor1 += matrix[i + r] * texture2D(tMap, vec2((st.x + float(i)) / 1000.0, vUv.y));
    }
    tmpColor1 = tmpColor1 / sum;

    vec4 tmpColor2;
    for(int i = -r; i <= r; i ++) {
      if (i == 0) tmpColor2 += matrix[i + r] * tmpColor1;
      else tmpColor2 += matrix[i + r] * texture2D(tMap, vec2(vUv.x, (st.y + float(i))/ 554.0));
    }
    tmpColor2 = tmpColor2 / sum;

    gl_FragColor = tmpColor2;
  }
`,Q=`
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D tMap;
  uniform vec2 center;
  uniform float radiusX;
  uniform float radiusY;
  varying vec2 vUv;

  void main() {
    // 中心点坐标
    float x0 = center.x;
    float y0 = center.y;

    vec2 st = vUv * vec2(50, 27.7);
    // vec2 st = vUv * vec2(100, 55.4);
    vec2 uv = floor(st);

    vec4 color;
    // if (pow(abs(vUv.x - x0), 2.0) / pow(0.05, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(0.09, 2.0) <= 1.0) {
    // if (pow(abs(vUv.x - x0), 2.0) / pow(0.08, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(0.15, 2.0) <= 1.0) {
    if (pow(abs(vUv.x - x0), 2.0) / pow(radiusX, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(radiusY, 2.0) <= 1.0) {
      color = texture2D(tMap, vec2(uv.x / 50.0, uv.y / 27.7));
      // color = texture2D(tMap, vec2(uv.x / 100.0, uv.y / 55.4));
    } else {
      color = texture2D(tMap, vUv);
    }

    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a;
  }
`,V={__name:"Practice",setup(o){const e=[{name:"颜色滤镜函数"},{name:"平滑效果滤镜"},{name:'局部"马赛克"'}],t=b(0),a=b(null);let r,u;B(()=>{r=new F(a.value),g(t.value),x(),R(t,()=>{g(t.value),x()})});const g=async m=>{let l;switch(m){case 0:u=r.compileSync(K,U),r.useProgram(u),l=await r.loadTexture(D),r.uniforms.tMap=l;let v=[H({r:1.2}),N(1.2),W(1.2)].reduce((y,w)=>A(y,w));v=z(v),r.uniforms.colorMatrix=v;break;case 1:u=r.compileSync(O,U),r.useProgram(u),l=await r.loadTexture(D),r.uniforms.tMap=l;const d=E(3);r.uniforms.matrix=d.matrix,r.uniforms.sum=d.sum,r.uniforms.radius=3;break;case 2:u=r.compileSync(Q,U),r.useProgram(u),l=await r.loadTexture(G),r.uniforms.tMap=l;const f=100;r.uniforms.radiusX=f/a.value.width,r.uniforms.radiusY=f/a.value.height,r.uniforms.center=[-2,-2],_();break}},x=()=>{r.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),r.render()},h=m=>{m.preventDefault();const{width:l,height:p}=a.value.getBoundingClientRect(),{offsetX:v,offsetY:d}=m,f=[];f[0]=v/l,f[1]=(p-d)/p,r.uniforms.center=f},_=()=>{a.value.addEventListener("click",h)};return(m,l)=>(S(),k(P,null,[q,C("div",null,[(S(),k(P,null,T(e,(p,v)=>C("span",{class:X(["filter-type",{active:t.value===v}]),onClick:d=>t.value=v},I(p.name),11,J)),64))]),C("canvas",{ref_key:"canvasRef",ref:a,width:"1000",height:"554"},null,512)],64))}},nt=L(V,[["__scopeId","data-v-f4754700"]]);export{nt as default};
