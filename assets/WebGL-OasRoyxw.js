import{W as g}from"./WebGL-oARFi5Ed.js";import{a as l}from"./parametric-nO2vAiAA.js";import{e as i}from"./polygon-qTZbFtZp.js";import{_ as p,f as d,o as _,c as h,F as b,p as u,a as x,b as t}from"./index-s2wsuPQw.js";import"./vector2d-Djg1LsDx.js";const c=o=>(u("data-v-6c49090d"),o=o(),x(),o),f=c(()=>t("h3",null,"WebGL色盘",-1)),m=c(()=>t("p",null,"利用hsv和rgb互相转换的GLSL代码，实现两个色盘",-1)),y=c(()=>t("p",null,"左边：半径对应饱和度；右边：半径对应明度",-1)),P=c(()=>t("canvas",{width:"512",height:"512"},null,-1)),q=c(()=>t("p",{style:{"text-align":"left"}},"CSS实现色盘",-1)),w=c(()=>t("div",{class:"circle"},null,-1)),C=`
  attribute vec2 position;

  varying vec2 vP;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    vP = position;
  }
`,I=`
  #define PI 3.1415926535897932384626433832795
  precision mediump float;
  uniform vec2 uCenter; // 接收为圆心坐标

  varying vec2 vP;

  // rgb -> hsv
  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  // hsv -> rgb
  // 参数的取值范围都是 (0, 1)
  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    float x0 = uCenter.x;
    float y0 = uCenter.y;
    // atan函数：以弧度返回角度的反正切；
    // https://blog.csdn.net/the_2020/article/details/124892346
    // 对于具有笛卡尔坐标 (x, y) 的点，该函数返回具有极坐标 (r, θ) 的同一点的角度 θ。
    // https://blog.csdn.net/lqzer/article/details/122016178
    // atan(y, x): arc tangent, 返回弧度 [-PI, PI];
    // https://docs.gl/el3/atan
    float h = atan(vP.y - y0, vP.x - x0); // 计算弧度
    h = h / (PI * 2.0); // 将角度转为（0，1）范围
    float r = sqrt((vP.x - x0) * (vP.x - x0) + (vP.y - y0) * (vP.y - y0)); // 计算半径

    if (x0 < 0.0) { // 左边的圆：明度固定，饱和度随半径变化
      vec3 hsv_color = vec3(h, r * 2.0, 1.0);
      vec3 rgb_color = hsv2rgb(hsv_color);
      gl_FragColor = vec4(rgb_color, 1.0);
    } else { // 右边的圆：饱和度固定，明度随半径变化
      vec3 hsv_color = vec3(h, 1.0, r * 2.0);
      vec3 rgb_color = hsv2rgb(hsv_color);
      gl_FragColor = vec4(rgb_color, 1.0);
    }
  }
`,S={__name:"WebGL",setup(o){return d(()=>{const s=document.querySelector("canvas").getContext("webgl"),n=new g(s,C,I),e={vertices:l(-.5,0,.5,0,Math.PI*2)};e.points=e.vertices.flat(),e.triangles=i(e.points),n.drawPolygon(e.points,e.triangles,[["uCenter",[-.5,0],"2fv"]]),e.vertices=l(.5,0,.5,0,Math.PI*2),e.points=e.vertices.flat(),e.triangles=i(e.points),n.drawPolygon(e.points,e.triangles,[["uCenter",[.5,0],"2fv"]],void 0,!1);let a="";for(let r=0;r<=720;r++)a+=`,hsl(${r*.5}, 100%, 50%)`;document.querySelector(".circle").style.setProperty("--conicColor",a.substring(1))}),(v,s)=>(_(),h(b,null,[f,m,y,P,q,w],64))}},B=p(S,[["__scopeId","data-v-6c49090d"]]);export{B as default};
