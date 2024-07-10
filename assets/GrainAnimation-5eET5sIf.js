import{W as h}from"./WebGL--ZG1Z5xu.js";import{_ as g,o as M,a as x,c as P,F as w,p as b,f as F,b as _}from"./index-a4tGsWeP.js";import"./polygon-JGRpudzN.js";import"./vector2d-Djg1LsDx.js";import"./_commonjsHelpers-5-cIlDoe.js";const f=e=>(b("data-v-391a0353"),e=e(),F(),e),y=f(()=>_("h3",null,"例子：粒子动画",-1)),I=f(()=>_("canvas",{width:"512",height:"512"},null,-1)),A={__name:"GrainAnimation",setup(e){let o;const m=new Float32Array([-1,-1,0,1,1,-1]);let i=[];M(()=>{const t=document.querySelector("canvas").getContext("webgl"),r=`
    attribute vec2 position;

    uniform float u_rotation;
    uniform float u_scale;
    uniform float u_time;
    uniform float u_duration;
    uniform vec2 u_dir;

    varying float vP;

    void main() {
      float p = min(1.0, u_time / u_duration); // 当前动画进度，取值区间[0,1]。防止精度误差导致的进度越界
      float rad = u_duration + 3.14 * 10.0 * p; // 旋转角度：初始角度加上10π，表示在动画过程中会绕自身旋转5周
      float scale = u_scale * p * (2.0 - p); // 缩放比例：初始缩放比例乘以一个系数。p * (2.0 - p)是一个缓动函数，作用是：让scale的变化量随着时间推移逐渐减小
      float x_rad = 3.14 * p * (2.0 - p);
      float y_rad = 3.14 * p * p;

      vec2 offset = 2.0 * u_dir * p * p; // u_dir是单位向量，2.0表示它的最大移动距离为2。p * p也是一个缓动函数，作用：让位移的变化量随着时间增加而增大

      // 三个齐次矩阵
      // 矩阵的元素按照自上而下再自左向右传入作为参数
      // glsl中默认矩阵以列主序：先列后行
      mat3 translateMatrix = mat3( // 平移矩阵
        1.0, 0.0, 0.0, // 第一列
        0.0, 1.0, 0.0, // 第二列
        offset.x, offset.y, 1.0 // 第三列
      );
      mat3 rotateMatrix = mat3( // 旋转矩阵
        cos(rad), sin(rad), 0.0,
        -sin(rad), cos(rad), 0.0,
        0.0, 0.0, 1.0
      );
      mat3 scaleMatrix = mat3( // 缩放矩阵
        scale, 0.0, 0.0,
        0.0, scale, 0.0,
        0.0, 0.0, 1.0
      );
      mat3 skewMatrix = mat3( // 扭曲矩阵：倾斜
        1.0, tan(y_rad), 0.0,
        tan(x_rad), 1.0, 0.0,
        0.0, 0.0, 1.0
      );

      gl_PointSize = 1.0;
      // 完成对顶点的线性变换
      // 三角形会向着特定的方向旋转、移动和缩放
      vec3 pos = skewMatrix * translateMatrix * rotateMatrix * scaleMatrix * vec3(position, 1.0);
      gl_Position = vec4(pos, 1.0);

      vP = p;
    }
  `,n=`
    precision mediump float;

    uniform vec4 u_color;

    varying float vP;

    void main() {
      gl_FragColor.rgb = u_color.rgb;
      gl_FragColor.a = (1.0 - vP) * u_color.a; // 让alpha值随着vP值变化；实现粒子的淡出效果
    }
  `;o=new h(t,r,n),o.createWebGLProgram(),o.bufferPosition(m),o.readPosition(),requestAnimationFrame(l)});function l(){const{gl:a}=o;for(let t=0;t<5*Math.random();t++)i.push(p());a.clear(a.COLOR_BUFFER_BIT),i.forEach(t=>{t.u_time=(performance.now()-t.startTime)/1e3,d(t),a.drawArrays(a.TRIANGLES,0,m.length/2)}),i=i.filter(t=>t.u_time<=t.u_duration),requestAnimationFrame(l)}function d({u_color:a,u_rotation:t,u_scale:r,u_time:n,u_duration:c,u_dir:s}){const u=[["u_color",a,"4fv"],["u_rotation",t,"1f"],["u_scale",r,"1f"],["u_time",n,"1f"],["u_duration",c,"1f"],["u_dir",s,"2fv"]];o.setUniforms(u)}function p(){const a=[Math.random(),Math.random(),Math.random(),1],t=Math.random()*Math.PI,r=Math.random()*.05+.03,n=0,c=3,s=Math.random()*Math.PI*2,u=[Math.cos(s),Math.sin(s)],v=performance.now();return{u_color:a,u_rotation:t,u_scale:r,u_time:n,u_duration:c,u_dir:u,startTime:v}}return(a,t)=>(x(),P(w,null,[y,I],64))}},C=g(A,[["__scopeId","data-v-391a0353"]]);export{C as default};
