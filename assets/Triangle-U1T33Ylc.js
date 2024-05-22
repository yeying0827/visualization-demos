import{_ as g,f as h,o as v,c as u,F as f,p as m,a as S,b as s}from"./index-bF0I-6KF.js";const i=t=>(m("data-v-b036f373"),t=t(),S(),t),A=i(()=>s("h3",null,"使用WebGL绘制三角形",-1)),b=i(()=>s("canvas",{height:"512",width:"512"},null,-1)),F={__name:"Triangle",setup(t){return h(()=>{const e=document.querySelector("canvas").getContext("webgl"),_=`
    attribute vec2 position;
    varying vec3 color;

    void main() {
      gl_PointSize = 1.0;
      color = vec3(0.5 + position * 0.5, 0.0);
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `,d=`
    precision mediump float;
    varying vec3 color;

    void main() {
      // gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `,a=e.createShader(e.VERTEX_SHADER);e.shaderSource(a,_),e.compileShader(a);const r=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(r,d),e.compileShader(r);const o=e.createProgram();e.attachShader(o,a),e.attachShader(o,r),e.linkProgram(o),e.useProgram(o);const c=new Float32Array([-1,-1,0,1,1,-1]),p=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,c,e.STATIC_DRAW);const n=e.getAttribLocation(o,"position");e.vertexAttribPointer(n,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(n),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.LINE_LOOP,0,c.length/2)}),(l,e)=>(v(),u(f,null,[A,b],64))}},E=g(F,[["__scopeId","data-v-b036f373"]]);export{E as default};
