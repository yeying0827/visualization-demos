import{C as r}from"./Canvas-1nIGdNzG.js";import{p as c}from"./parametric-fwIjZpvY.js";import{r as l,o as m,a as d,c as f,b as o,F as u}from"./index-a4tGsWeP.js";const _=o("h3",null,"使用Canvas",-1),M={__name:"DemoPolar2D",setup(h){const t=l(null);m(()=>{const a=t.value.getContext("2d");new r(a).drawAxis("#ddd"),s(0,Math.PI,100,200,5).draw(a,{strokeStyle:"blue"})});const s=c((a,e,n)=>e*Math.cos(n*a),a=>a,(a,e)=>[a*Math.cos(e),a*Math.sin(e)]);return(a,e)=>(d(),f(u,null,[_,o("canvas",{ref_key:"canvasRef",ref:t,height:"512",width:"512"},null,512)],64))}};export{M as default};