import{_ as h,f as g,W as M,o as x,c as P,F as w,p as b,a as F,b as m}from"./index-Yh4SR2m9.js";const f=e=>(b("data-v-391a0353"),e=e(),F(),e),y=f(()=>m("h3",null,"例子：粒子动画",-1)),I=f(()=>m("canvas",{width:"512",height:"512"},null,-1)),A={__name:"GrainAnimation",setup(e){let o;const l=new Float32Array([-1,-1,0,1,1,-1]);let s=[];g(()=>{const a=document.querySelector("canvas").getContext("webgl"),r=`
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
  `;o=new M(a,r,n),o.createWebGLProgram(),o.bufferPosition(l),o.readPosition(),requestAnimationFrame(_)});function _(){const{gl:t}=o;for(let a=0;a<5*Math.random();a++)s.push(p());t.clear(t.COLOR_BUFFER_BIT),s.forEach(a=>{a.u_time=(performance.now()-a.startTime)/1e3,d(a),t.drawArrays(t.TRIANGLES,0,l.length/2)}),s=s.filter(a=>a.u_time<=a.u_duration),requestAnimationFrame(_)}function d({u_color:t,u_rotation:a,u_scale:r,u_time:n,u_duration:c,u_dir:i}){const u=[["u_color",t,"4fv"],["u_rotation",a,"1f"],["u_scale",r,"1f"],["u_time",n,"1f"],["u_duration",c,"1f"],["u_dir",i,"2fv"]];o.setUniforms(u)}function p(){const t=[Math.random(),Math.random(),Math.random(),1],a=Math.random()*Math.PI,r=Math.random()*.05+.03,n=0,c=3,i=Math.random()*Math.PI*2,u=[Math.cos(i),Math.sin(i)],v=performance.now();return{u_color:t,u_rotation:a,u_scale:r,u_time:n,u_duration:c,u_dir:u,startTime:v}}return(t,a)=>(x(),P(w,null,[y,I],64))}},B=h(A,[["__scopeId","data-v-391a0353"]]);export{B as default};
