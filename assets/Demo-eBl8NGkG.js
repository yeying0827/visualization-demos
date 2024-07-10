import{G as x}from"./gl-renderer--j5iNyII.js";import{o as y,a as _,c as g}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const h={width:"1024",height:"1024"},L={__name:"Demo",setup(w){return y(()=>{const f=`
    attribute vec2 a_vertexPosition;
    attribute vec2 uv;
    varying vec2 vUv;

    uniform int scale; // 缩放比例
    uniform vec2 offset; // 平移的偏移量

    // 平移矩阵
    mat3 translateMatrix = mat3(
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      offset.x, offset.y, 1.0
    ); // (0,0)
    // 缩放矩阵
    mat3 scaleMatrix = mat3(
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
  `,l=`
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 vUv;
    uniform float rows;

    void main() {
      // 针对某个像素点执行
      // vUv: 一个单元的坐标，坐标的范围：正方形
      // vUv * rows：待处理的像素点  映射 纹理坐标上的位置，映射的坐标 => 计算色值

      vec2 st = fract(vUv * rows); // 像素点对应纹理坐标的小数部分
      float d1 = step(st.x, 0.9);
      float d2 = step(0.1, st.y);
      // st.x <=0.9 && st.y >=0.1 ===> d1*d2=1

      // d1=0 || d2=0     <======>    st.x>0.9 || st.y < 0.1
      gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
      gl_FragColor.a = 1.0;
    }
  `,s=document.querySelector("canvas"),e=new x(s),m=e.compileSync(l,f);e.useProgram(m),e.uniforms.rows=64,e.uniforms.scale=1,e.uniforms.offset=[0,0],e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render();const d=t=>{t.preventDefault(),t.wheelDeltaY>0?e.uniforms.scale<=50&&(e.uniforms.scale+=1,e.render()):e.uniforms.scale>2&&(e.uniforms.scale-=1)},o={},n={x:0,y:0},u=t=>{t.preventDefault(),o.x=t.offsetX,o.y=t.offsetY,s.addEventListener("mousemove",v)},v=t=>{t.preventDefault();const{offsetX:a,offsetY:r}=t,i=(a-o.x)/s.width,c=(o.y-r)/s.height;e.uniforms.offset=[i+n.x,c+n.y]},p=t=>{t.preventDefault();const{offsetX:a,offsetY:r}=t,i=(a-o.x)/s.width,c=(o.y-r)/s.height;n.x=i+n.x,n.y=c+n.y,s.removeEventListener("mousemove",v)};(()=>{s.addEventListener("mousewheel",d),s.addEventListener("mouseup",p),s.addEventListener("mousedown",u)})()}),(f,l)=>(_(),g("canvas",h))}};export{L as default};
