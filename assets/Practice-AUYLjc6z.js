import{_ as R,k as _,y as S,f as z,q as B,o as C,c as E,b as u,z as M,F,m as P,p as b,a as j,s as q}from"./index-pk9eWFZd.js";const H=s=>(b("data-v-684c4159"),s=s(),j(),s),L=H(()=>u("h3",null,"课后练习：局部放大器",-1)),N={__name:"Practice",setup(s){const n=_(null),a=_(null),x=_(null);let e=40,t=5;const h=S({left:0,top:0});return z(()=>{const w=n.value.getContext("2d"),m=a.value.getContext("2d");(async function(){const i=await B(P);n.value.width=i.width,n.value.height=i.height,w.drawImage(i,0,0);const{top:y,left:k,width:V,height:X}=n.value.getBoundingClientRect();a.value.width=e*t,a.value.height=e*t;const D=I=>{const l={x:Math.floor(I.pageX-k),y:Math.floor(I.pageY-y)},r=q(i,[l.x-e/2,l.y-e/2,e,e]),o=m.createImageData(a.value.width,a.value.height);let c=0;for(let d=0;d<e*t;d+=t)for(let f=0;f<e*t;f+=t){for(let p=d;p<d+t;p++)for(let v=f;v<f+t;v++){const g=(p*e*t+v)*4;o.data[g]=r.data[c],o.data[g+1]=r.data[c+1],o.data[g+2]=r.data[c+2],o.data[g+3]=r.data[c+3]}c+=4}m.putImageData(o,0,0),h.top=l.y-e*t/2+"px",h.left=l.x-e*t/2+"px"};(()=>{x.value.addEventListener("mousemove",D)})()})()}),(w,m)=>(C(),E(F,null,[L,u("div",{class:"canvas-container",ref_key:"containerRef",ref:x},[u("canvas",{ref_key:"canvasRef",ref:n,width:"0",height:"0"},null,512),u("canvas",{ref_key:"magnifier",ref:a,width:"0",height:"0",id:"magnifier",style:M(h)},null,4)],512)],64))}},G=R(N,[["__scopeId","data-v-684c4159"]]);export{G as default};