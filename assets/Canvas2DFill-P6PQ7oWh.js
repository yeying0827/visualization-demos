import{_,f as i,C as v,V as u,o as h,c as f,F as m,p as y,a as g,b as n}from"./index-bF0I-6KF.js";const c=t=>(y("data-v-1ab72571"),t=t(),g(),t),C=c(()=>n("h3",null,"Canvas2D填充多边形",-1)),S=c(()=>n("canvas",{height:"512",width:"512"},null,-1)),b={__name:"Canvas2DFill",setup(t){return i(()=>{const a=document.querySelector("canvas").getContext("2d"),o=new v(a),e=[new u(0,100)];for(let s=1;s<=4;s++){const d=e[0].copy().rotate(s*Math.PI*.4);e.push(d)}const r=[...e];a.save(),a.translate(-128,0),o.fillPolygon(r,{fillStyle:"black",rule:"evenodd"}),a.restore();const p=[e[0],e[2],e[4],e[1],e[3]];a.save(),a.translate(128,0),o.fillPolygon(p,{fillStyle:"black",rule:"evenodd"}),a.restore()}),(l,a)=>(h(),f(m,null,[C,S],64))}},D=_(b,[["__scopeId","data-v-1ab72571"]]);export{D as default};
