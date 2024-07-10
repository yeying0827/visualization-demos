import{G as d}from"./gl-renderer--j5iNyII.js";import{r as m}from"./room-kw1AW3rD.js";import{r as p,o as g,a as x,c as _,b as i,F as h}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const y=i("h3",null,'WebGL局部"马赛克"',-1),b=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`,w=`
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

    vec2 st = vUv * vec2(50, 27.7); // 20 x 20
    vec2 uv = floor(st);

    vec4 color;
    // if(pow(abs(vUv.x - x0), 2.0) / pow(radiusX, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(radiusY, 2.0) <= 1.0){
    if(abs(vUv.x - x0) < radiusX && abs(vUv.y - y0) < radiusY){
      color = texture2D(tMap, vec2(uv.x / 50.0, uv.y / 27.7));
    } else {
      color = texture2D(tMap, vUv);
    }

    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a;
  }
`,k={__name:"DemoMosaic",setup(U){const t=p(null);let e,n;g(async()=>{e=new d(t.value),n=e.compileSync(w,b),e.useProgram(n);let r=await e.loadTexture(m);e.uniforms.tMap=r,e.uniforms.center=[-2,-2];const o=100;e.uniforms.radiusX=o/t.value.width,e.uniforms.radiusY=o/t.value.height,c(),u()});const c=()=>{e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()},v=r=>{r.preventDefault();const{width:o,height:s}=t.value.getBoundingClientRect(),{offsetX:l,offsetY:f}=r,a=[];a[0]=l/o,a[1]=(s-f)/s,e.uniforms.center=a},u=()=>{t.value.addEventListener("click",v)};return(r,o)=>(x(),_(h,null,[y,i("canvas",{ref_key:"canvasRef",ref:t,width:"1000",height:"554"},null,512)],64))}};export{k as default};
