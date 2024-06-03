import{y as i,f as l,G as u,o as g,c as f,b as o,F as d}from"./index-8v8F2D54.js";const m=o("h3",null,"HSV色轮",-1),_=o("p",null,"WebGL",-1),h=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,p=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec2 uMouse;

  vec2 polar(vec2 st){
    return vec2(length(st), atan(st.y, st.x));
  }

  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(
      abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
      0.0,
      1.0
    );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = smoothstep(st.x, st.x + 0.01, 0.2);
    if(st.y < 0.0) st.y += 2.0 * 3.14;
    float p = st.y / (2.0 * 3.14);
    gl_FragColor.rgb = d * hsv2rgb(vec3(p, uMouse.x, uMouse.y));
    // gl_FragColor.rgb = d * hsv2rgb(vec3(p, 1.0, 1.0));
    gl_FragColor.a = 1.0;
  }
`,y={__name:"ColorWheel",setup(b){const t=i(null);return l(()=>{const e=new u(t.value),s=e.compileSync(p,h);e.useProgram(s),e.uniforms.uMouse=[0,0],e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render(),t.value.addEventListener("mousemove",n=>{const{offsetX:a,offsetY:c}=n,{width:v,height:r}=t.value.getBoundingClientRect();e.uniforms.uMouse=[a/v,(r-c)/r]})}),(e,s)=>(g(),f(d,null,[m,_,o("canvas",{width:"512",height:"512",ref_key:"glRef",ref:t},null,512)],64))}};export{y as default};
