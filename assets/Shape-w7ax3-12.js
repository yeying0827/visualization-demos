import{_ as g,f as M,o as p,c as f,F as S,p as w,a as m,b as o}from"./index-s2wsuPQw.js";const c=h=>(w("data-v-55f4e945"),h=h(),m(),h),x=c(()=>o("h3",null,"使用Canvas绘制一个正方形",-1)),P=c(()=>o("canvas",{width:"512",height:"512"},null,-1)),y=c(()=>o("h3",null,"使用Canvas绘制三角形",-1)),C=c(()=>o("canvas",{width:"512",height:"512",id:"triangle"},null,-1)),T=c(()=>o("h3",null,"使用Canvas绘制椭圆",-1)),I=c(()=>o("canvas",{width:"512",height:"512",id:"ellipse"},null,-1)),b=c(()=>o("h3",null,"使用Canvas绘制五角星",-1)),q=c(()=>o("canvas",{width:"512",height:"512",id:"star"},null,-1)),k={__name:"Shape",setup(h){M(()=>{d(),_(),u(),v()});function d(){const t=document.querySelector("canvas").getContext("2d"),e=[100,100];t.fillStyle="red",t.beginPath(),t.save(),t.translate(-.5*e[0],-.5*e[1]),t.rect(.5*t.canvas.width,.5*t.canvas.height,...e),t.restore(),t.rect(.5*t.canvas.width,.5*t.canvas.height,...e),t.fill()}function _(){const t=document.querySelector("#triangle").getContext("2d"),e=200;t.fillStyle="red",t.beginPath(),t.save(),t.translate(.5*t.canvas.width,.5*t.canvas.height),t.moveTo(0,e*Math.cos(60)/2),t.lineTo(100,-e*Math.cos(60)/2),t.lineTo(-100,-e*Math.cos(60)/2),t.fill(),t.restore()}function u(){const n=document.querySelector("#ellipse"),t=n.getContext("2d");t.fillStyle="orange",t.beginPath(),t.ellipse(.5*n.width,.5*n.height,200,150,0,0,2*Math.PI),t.fill()}function v(){const n=document.querySelector("#star"),t=n.getContext("2d"),e=250,s=130,a=i=>i*Math.PI/180,r=[[0,-e],[e*Math.cos(a(18)),-e*Math.sin(a(18))],[e*Math.sin(a(36)),e*Math.cos(a(36))],[-e*Math.sin(a(36)),e*Math.cos(a(36))],[-e*Math.cos(a(18)),-e*Math.sin(a(18))]],l=[[s*Math.sin(a(36)),-s*Math.cos(a(36))],[s*Math.cos(a(18)),s*Math.sin(a(18))],[0,s],[-s*Math.cos(a(18)),s*Math.sin(a(18))],[-s*Math.sin(a(36)),-s*Math.cos(a(36))]];t.fillStyle="red",t.beginPath(),t.translate(.5*n.width,.5*n.height),t.moveTo(...r[0]),t.lineTo(...l[0]);for(let i=1;i<5;i++)t.lineTo(...r[i]),l[i].length>0&&t.lineTo(...l[i]);t.closePath(),t.stroke()}return(n,t)=>(p(),f(S,null,[x,P,y,C,T,I,b,q],64))}},E=g(k,[["__scopeId","data-v-55f4e945"]]);export{E as default};
