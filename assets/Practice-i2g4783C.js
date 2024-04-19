import{_ as E,l as D,f as F,G,m as L,q as b,C as T,o as S,c as k,b as M,F as P,h as B,n as R,t as X,p as j,a as I}from"./index-2p43lkDg.js";const Y="/visualization-demos/assets/room-1qJhwPTE.jpeg";function z(e,o){const t=[],a=e[0],r=e[1],u=e[2],g=e[3],x=e[4],h=e[5],_=e[6],m=e[7],l=e[8],p=e[9],v=e[10],d=e[11],f=e[12],y=e[13],w=e[14],C=e[15];let n=o[0],i=o[1],s=o[2],c=o[3];return t[0]=n*a+i*x+s*l+c*f,t[1]=n*r+i*h+s*p+c*y,t[2]=n*u+i*_+s*v+c*w,t[3]=n*g+i*m+s*d+c*C,n=o[4],i=o[5],s=o[6],c=o[7],t[4]=n*a+i*x+s*l+c*f,t[5]=n*r+i*h+s*p+c*y,t[6]=n*u+i*_+s*v+c*w,t[7]=n*g+i*m+s*d+c*C,n=o[8],i=o[9],s=o[10],c=o[11],t[8]=n*a+i*x+s*l+c*f,t[9]=n*r+i*h+s*p+c*y,t[10]=n*u+i*_+s*v+c*w,t[11]=n*g+i*m+s*d+c*C,n=o[12],i=o[13],s=o[14],c=o[15],t[12]=n*a+i*x+s*l+c*f,t[13]=n*r+i*h+s*p+c*y,t[14]=n*u+i*_+s*v+c*w,t[15]=n*g+i*m+s*d+c*C,t}function A(e){const o=e.reduce((t,a,r)=>{const u=Math.floor(r/4);return t.length===u?t[t.length]=[a]:t[t.length-1].push(a),t},[]);for(let t=0;t<o.length;t++)for(let a=t+1;a<o.length;a++){let r=o[t][a];o[t][a]=o[a][t],o[a][t]=r}return o.flat()}function q({r:e=1,g:o=1,b:t=1}){return[e,0,0,0,0,o,0,0,0,0,t,0,0,0,0,1]}function H(e){return[e,0,0,0,0,e,0,0,0,0,e,0,0,0,0,1]}function J(e){const o=.2126*(1-e),t=.7152*(1-e),a=.0722*(1-e);return[o+e,t,a,0,o,t+e,a,0,o,t,a+e,0,0,0,0,1]}const N=e=>(j("data-v-f4754700"),e=e(),I(),e),W=N(()=>M("h3",null,"课后练习（WebGL）",-1)),$=["onClick"],U=`
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
`,V={__name:"Practice",setup(e){const o=[{name:"颜色滤镜函数"},{name:"平滑效果滤镜"},{name:'局部"马赛克"'}],t=D(0),a=D(null);let r,u;F(()=>{r=new G(a.value),g(t.value),x(),L(t,()=>{g(t.value),x()})});const g=async m=>{let l;switch(m){case 0:u=r.compileSync(K,U),r.useProgram(u),l=await r.loadTexture(b),r.uniforms.tMap=l;let v=[q({r:1.2}),H(1.2),J(1.2)].reduce((y,w)=>z(y,w));v=A(v),r.uniforms.colorMatrix=v;break;case 1:u=r.compileSync(O,U),r.useProgram(u),l=await r.loadTexture(b),r.uniforms.tMap=l;const d=T(3);r.uniforms.matrix=d.matrix,r.uniforms.sum=d.sum,r.uniforms.radius=3;break;case 2:u=r.compileSync(Q,U),r.useProgram(u),l=await r.loadTexture(Y),r.uniforms.tMap=l;const f=100;r.uniforms.radiusX=f/a.value.width,r.uniforms.radiusY=f/a.value.height,r.uniforms.center=[-2,-2],_();break}},x=()=>{r.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),r.render()},h=m=>{m.preventDefault();const{width:l,height:p}=a.value.getBoundingClientRect(),{offsetX:v,offsetY:d}=m,f=[];f[0]=v/l,f[1]=(p-d)/p,r.uniforms.center=f},_=()=>{a.value.addEventListener("click",h)};return(m,l)=>(S(),k(P,null,[W,M("div",null,[(S(),k(P,null,B(o,(p,v)=>M("span",{class:R(["filter-type",{active:t.value===v}]),onClick:d=>t.value=v},X(p.name),11,$)),64))]),M("canvas",{ref_key:"canvasRef",ref:a,width:"1000",height:"554"},null,512)],64))}},tt=E(V,[["__scopeId","data-v-f4754700"]]);export{tt as default};
