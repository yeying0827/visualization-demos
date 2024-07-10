import{G as a}from"./gl-renderer--j5iNyII.js";import{b as n}from"./bird-8CKaPD3o.js";import{r as v,o as s,a as f,c as m}from"./index-a4tGsWeP.js";import"./_commonjsHelpers-5-cIlDoe.js";const u=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,c=`
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
      // 第0帧：[2/272, 88/272] 约等于 [0.007,0.323]
      // 第1帧：[90/272, 176/272] 约等于 [0.330,0.647]
      // 第2帧：[178/272, 264/272] 约等于 [0.654,0.970]
      uv.x = mix(vFrames[i].x, vFrames[i].y, vUv.x) / fWidth; // vUv 到 uv的映射
      if(float(i) == mod(float(frameIndex), 3.0)) break; // frameIndex除3的余数：0-循环一次；1-循环两次；2-循环三次。（渲染第几帧）
    }

    vec4 color = texture2D(tMap, uv); // 按照uv坐标取色值

    gl_FragColor = color;
  }
`,_={__name:"FixedFrame",setup(l){const i=v(null);let e,o;return s(()=>{e=new a(i.value),o=e.compileSync(c,u),e.useProgram(o),async function(){e.uniforms.tMap=await e.loadTexture(n),e.uniforms.vFrames=[2,88,90,176,178,264],e.uniforms.fWidth=272,e.uniforms.frameIndex=0,setInterval(()=>{e.uniforms.frameIndex++},200);const r=43/i.value.width,t=30/i.value.height;e.setMeshData([{positions:[[-r,-t],[-r,t],[r,t],[r,-t]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()}()}),(r,t)=>(f(),m("canvas",{width:"512",height:"512",ref_key:"glRef",ref:i},null,512))}};export{_ as default};
