import{C as p}from"./Canvas-1nIGdNzG.js";import{_,o as h,a as m,c as f,F as i,p as u,f as B,b as n}from"./index-a4tGsWeP.js";import{V as M}from"./Vec3-_qq2UqqK.js";import"./Vec3Func-Lanfgsq-.js";const s=t=>(u("data-v-964e790e"),t=t(),B(),t),v=s(()=>n("h3",null,"RGB和RGBA",-1)),g=s(()=>n("canvas",{width:"512",height:"512"},null,-1)),x={__name:"RGB",setup(t){h(()=>{const o=document.querySelector("canvas").getContext("2d");new p(o);for(let e=0;e<3;e++){const d=r();for(let a=0;a<5;a++){const c=d.clone().scale(.5+.25*a);o.fillStyle=`rgb(${Math.floor(c[0]*256)}, ${Math.floor(c[1]*256)}, ${Math.floor(c[2]*256)})`,o.beginPath(),o.arc((a-2)*60,(e-1)*60,20,0,Math.PI*2),o.fill()}}});function r(){return new M(.5*Math.random(),.5*Math.random(),.5*Math.random())}return(l,o)=>(m(),f(i,null,[v,g],64))}},w=_(x,[["__scopeId","data-v-964e790e"]]);export{w as default};
