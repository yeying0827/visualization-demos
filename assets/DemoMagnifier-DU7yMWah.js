import{l as M,g as R}from"./ImageHandler-5dxAiF35.js";import{g as B}from"./girl1-zwAbMbEm.js";import{_ as E,r as f,g as z,o as b,a as j,c as S,b as y,h as I}from"./index-a4tGsWeP.js";const e=40,a=5,H={__name:"DemoMagnifier",setup(L){const n=f(null),t=f(null),p=f(null),m=z({left:0,top:0}),_=f(0);return b(()=>{const x=n.value.getContext("2d"),u=t.value.getContext("2d");(async function(){const o=await M(B);n.value.width=o.width,n.value.height=o.height,x.drawImage(o,0,0);const{left:D,top:k}=n.value.getBoundingClientRect();_.value=o.width,t.value.width=e*a,t.value.height=e*a;const C=w=>{const r={x:Math.floor(w.pageX-D),y:Math.floor(w.pageY-k)};m.left=r.x-e*a/2+"px",m.top=r.y-e*a/2+"px";const c=R(o,[r.x-e/2,r.y-e/2,e,e]),i=u.createImageData(t.value.width,t.value.height);let s=0;for(let l=0;l<e*a;l+=a)for(let d=0;d<e*a;d+=a){for(let v=l;v<l+a;v++)for(let h=d;h<d+a;h++){const g=(v*e*a+h)*4;i.data[g]=c.data[s],i.data[g+1]=c.data[s+1],i.data[g+2]=c.data[s+2],i.data[g+3]=c.data[s+3]}s+=4}u.putImageData(i,0,0)};(()=>{p.value.addEventListener("mousemove",C)})()})()}),(x,u)=>(j(),S("div",{class:"canvas-container",ref_key:"canvasContainerRef",ref:p,style:I({width:_.value+"px"})},[y("canvas",{ref_key:"canvasRef",ref:n,width:"0",height:"0"},null,512),y("canvas",{ref_key:"magnifier",ref:t,width:"0",height:"0",id:"magnifier",style:I(m)},null,4)],4))}},Y=E(H,[["__scopeId","data-v-e422ba8e"]]);export{Y as default};
