import{m as y}from"./Mat4Func-Daqwyn3W.js";import{j as E,b as v,k as L}from"./Vec3Func-Lanfgsq-.js";function j(m=1,i=[[1,0,0,1]]){const t=.5*m,e=[[-t,-t,-t],[-t,t,-t],[t,t,-t],[t,-t,-t],[-t,-t,t],[-t,t,t],[t,t,t],[t,-t,t]],o=[],c=[],h=[];let a=0,n=0;const u=i.length;function r(l,d,g,s){[l,d,g,s].forEach(p=>{o.push(e[p]),c.push(i[a%u])}),h.push([0,1,2].map(p=>p+n),[0,2,3].map(p=>p+n)),a++,n+=4}return r(1,0,3,2),r(4,5,6,7),r(2,3,7,6),r(5,4,0,1),r(3,0,4,7),r(6,5,1,2),{positions:o,color:c,cells:h}}function k(m=1,i=1,t=1,e=[[1,0,0,1]]){const o=.5*m,c=.5*i,h=.5*t,a=[[-o,-c,-h],[-o,c,-h],[o,c,-h],[o,-c,-h],[-o,-c,h],[-o,c,h],[o,c,h],[o,-c,h]],n=[],u=[],r=[];let l=0,d=0;const g=e.length;function s(p,x,f,M){[p,x,f,M].forEach(I=>{n.push(a[I]),u.push(e[l%g])}),r.push([0,1,2].map(I=>I+d),[0,2,3].map(I=>I+d)),l++,d+=4}return s(1,0,3,2),s(4,5,6,7),s(2,3,7,6),s(5,4,0,1),s(3,0,4,7),s(6,5,1,2),{positions:n,color:u,cells:r}}function w(m=1,i=[[1,0,0,1]]){const t=.5*m,e=[[-t,-t,t],[-t,t,-t],[t,-t,-t],[t,t,t]],o=[],c=[],h=[],a=[];let n=0,u=0;const r=i.length,l=[],d=[];function g(s,p,x){[s,p,x].forEach(M=>{o.push(e[M]),c.push(i[n%r])}),h.push([0,1,2].map(M=>M+u)),n++,u+=3;const f=[];E(f,v(l,e[p],e[s]),v(d,e[x],e[s])),L(f,f),a.push(f,f,f)}return g(0,1,2),g(0,1,3),g(0,3,2),g(3,2,1),{positions:o,color:c,cells:h,normal:a}}function P(m=1,i=1,t=30,e=[0,0,1,1],o=[1,0,0,1]){const c=[],h=[],a=[],n=[[0,0]],u=.5*i,r=[];for(let s=0;s<=t;s++){const p=Math.PI*2*s/t,x=[m*Math.cos(p),m*Math.sin(p)];n.push(x)}c.push(...n.map(([s,p])=>[s,p,-u])),r.push(...n.map(()=>[0,0,-1]));for(let s=1;s<n.length-1;s++)h.push([0,s,s+1]);h.push([0,n.length-1,1]);let l=c.length;c.push(...n.map(([s,p])=>[s,p,u])),r.push(...n.map(()=>[0,0,1]));for(let s=1;s<n.length-1;s++)h.push([l,l+s,l+s+1]);h.push([l,l+n.length-1,l+1]),a.push(...c.map(()=>e));const d=[],g=[];l=c.length;for(let s=1;s<n.length;s++){const p=[...n[s],u],x=[...n[s],-u],f=s<n.length-1?s+1:1,M=[...n[f],-u],I=[...n[f],u];c.push(p,x,M,I);const b=[];E(b,v(d,x,p),v(g,M,p)),L(b,b),r.push(b,b,b,b),a.push(o,o,o,o),h.push([l,l+1,l+2],[l,l+2,l+3]),l+=4}return{positions:c,cells:h,color:a,normal:r}}function R(m,i,t){let e=Math.cos(m),o=Math.sin(m);const c=[1,0,0,0,0,e,o,0,0,-o,e,0,0,0,0,1];e=Math.cos(i),o=Math.sin(i);const h=[e,0,o,0,0,1,0,0,-o,0,e,0,0,0,0,1];e=Math.cos(t),o=Math.sin(t);const a=[e,o,0,0,-o,e,0,0,0,0,1,0,0,0,0,1],n=[];return y(n,c,h),y(n,n,a),n}export{P as a,k as b,j as c,R as f,w as r};
