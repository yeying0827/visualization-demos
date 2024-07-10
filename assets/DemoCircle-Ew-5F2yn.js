import{W as x}from"./WebGL--ZG1Z5xu.js";import{_ as P,r as p,o as y,a as I,c as M,b as t,F as k,p as C,f as S}from"./index-a4tGsWeP.js";import"./polygon-JGRpudzN.js";import"./vector2d-Djg1LsDx.js";import"./_commonjsHelpers-5-cIlDoe.js";const o=s=>(C("data-v-1f430104"),s=s(),S(),s),D=o(()=>t("h3",null,"绘制圆形",-1)),G=o(()=>t("p",null,"WebGL",-1)),R=o(()=>t("p",null,"Canvas2D",-1)),B=o(()=>t("p",null,"SVG",-1)),T=o(()=>t("svg",{class:"svg-circle",xmlns:"http://www.w3.org/2000/svg",version:"1.1"},[t("circle",{cx:"128",cy:"128",r:"100",stroke:"orange","stroke-width":"1",fill:"transparent"})],-1)),E=60,F=`
  attribute vec2 position;
  varying vec2 vP;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(position, 1, 1);
    vP = position;
  }
`,W=`
  #define PI 3.1415926535897932384626433832795
  precision mediump float;
  varying vec2 vP;

  // hsv -> rgb
  // 参数的取值范围都是 (0, 1)
  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    float x0 = 0.0;
    float y0 = 0.0;
    float h = atan(vP.y - y0, vP.x - x0);
    h = h / (PI * 2.0); // 归一化的值
    float r = sqrt((vP.x - x0) * (vP.x - x0) + (vP.y - y0) * (vP.y - y0));
    vec3 hsv_color = vec3(h, r * 1.2, 1.0);
    vec3 rgb_color = hsv2rgb(hsv_color); // 转换为RGB颜色向量
    gl_FragColor = vec4(rgb_color, 1.0);
  }
`,z={__name:"DemoCircle",setup(s){const c=p(null),g=p(null);y(()=>{d(),u()});const d=()=>{const e=c.value.getContext("2d");e.translate(c.value.width/2,c.value.height/2),e.scale(1,-1),e.beginPath(),e.strokeStyle="orange",e.arc(0,0,100,0,Math.PI*2),e.stroke()},h=Math.PI*2;function f(e,n,a,l=0,m=Math.PI*2){const i=Math.min(h,m-l),_=[],v=Math.round(E*i/h);for(let r=0;r<=v;r++){const b=e+a*Math.cos(l+i*r/v),w=n+a*Math.sin(l+i*r/v);_.push([b,w])}return _}const u=()=>{const e=f(0,0,.8),n=g.value.getContext("webgl");new x(n,F,W).drawPolygonTess2(e)};return(e,n)=>(I(),M(k,null,[D,G,t("canvas",{ref_key:"webglRef",ref:g,width:"512",height:"512"},null,512),R,t("canvas",{ref_key:"canvas2dRef",ref:c,width:"256",height:"256"},null,512),B,T],64))}},j=P(z,[["__scopeId","data-v-1f430104"]]);export{j as default};
