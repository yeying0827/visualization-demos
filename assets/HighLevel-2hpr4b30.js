import{_ as h,f as i,C as u,g as w,h as v,s as I,V as s,i as m,o as f,c as g,F as x,p as S,a as M,b as d}from"./index-bF0I-6KF.js";const l=t=>(S("data-v-d1953500"),t=t(),M(),t),b=l(()=>d("h3",null,"封装高阶参数方程绘图模块",-1)),k=l(()=>d("canvas",{width:"512",height:"512"},null,-1)),B={__name:"HighLevel",setup(t){return i(()=>{const a=document.querySelector("canvas").getContext("2d");new u(a).drawAxis("#ddd"),w(-5.5,5.5).draw(a),v(0,50,500,5).draw(a,{strokeStyle:"blue"}),I(0,Math.PI*2,50,150).draw(a,{strokeStyle:"red"});const _=new s(0,0),o=new s(100,0);o.rotate(.75);const c=new s(150,0);c.rotate(-.75);const n=new s(200,0),e=30;for(let r=0;r<e;r++)o.rotate(2/e*Math.PI),c.rotate(2/e*Math.PI),n.rotate(2/e*Math.PI),m(0,1,100,[_,o,c,n]).draw(a)}),(p,a)=>(f(),g(x,null,[b,k],64))}},C=h(B,[["__scopeId","data-v-d1953500"]]);export{C as default};
