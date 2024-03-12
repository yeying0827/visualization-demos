import{_ as j,f as D,o as G,c as H,F as J,p as K,a as L,b as Q}from"./index-s2wsuPQw.js";function O(r,e){return r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=e[4],r[4]=e[5],r[5]=e[6],r[6]=e[8],r[7]=e[9],r[8]=e[10],r}function R(r,e){let t=e[0],s=e[1],l=e[2],c=e[3],i=t+t,n=s+s,h=l+l,a=t*i,y=s*i,b=s*n,p=l*i,d=l*n,f=l*h,m=c*i,x=c*n,_=c*h;return r[0]=1-b-f,r[3]=y-_,r[6]=p+x,r[1]=y+_,r[4]=1-a-f,r[7]=d-m,r[2]=p-x,r[5]=d+m,r[8]=1-a-b,r}function T(r,e){return r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=e[3],r[4]=e[4],r[5]=e[5],r[6]=e[6],r[7]=e[7],r[8]=e[8],r}function U(r,e,t,s,l,c,i,n,h,a){return r[0]=e,r[1]=t,r[2]=s,r[3]=l,r[4]=c,r[5]=i,r[6]=n,r[7]=h,r[8]=a,r}function W(r){return r[0]=1,r[1]=0,r[2]=0,r[3]=0,r[4]=1,r[5]=0,r[6]=0,r[7]=0,r[8]=1,r}function X(r,e){let t=e[0],s=e[1],l=e[2],c=e[3],i=e[4],n=e[5],h=e[6],a=e[7],y=e[8],b=y*i-n*a,p=-y*c+n*h,d=a*c-i*h,f=t*b+s*p+l*d;return f?(f=1/f,r[0]=b*f,r[1]=(-y*s+l*a)*f,r[2]=(n*s-l*i)*f,r[3]=p*f,r[4]=(y*t-l*h)*f,r[5]=(-n*t+l*c)*f,r[6]=d*f,r[7]=(-a*t+s*h)*f,r[8]=(i*t-s*c)*f,r):null}function V(r,e,t){let s=e[0],l=e[1],c=e[2],i=e[3],n=e[4],h=e[5],a=e[6],y=e[7],b=e[8],p=t[0],d=t[1],f=t[2],m=t[3],x=t[4],_=t[5],w=t[6],z=t[7],S=t[8];return r[0]=p*s+d*i+f*a,r[1]=p*l+d*n+f*y,r[2]=p*c+d*h+f*b,r[3]=m*s+x*i+_*a,r[4]=m*l+x*n+_*y,r[5]=m*c+x*h+_*b,r[6]=w*s+z*i+S*a,r[7]=w*l+z*n+S*y,r[8]=w*c+z*h+S*b,r}function Y(r,e,t){let s=e[0],l=e[1],c=e[2],i=e[3],n=e[4],h=e[5],a=e[6],y=e[7],b=e[8],p=t[0],d=t[1];return r[0]=s,r[1]=l,r[2]=c,r[3]=i,r[4]=n,r[5]=h,r[6]=p*s+d*i+a,r[7]=p*l+d*n+y,r[8]=p*c+d*h+b,r}function Z(r,e,t){let s=e[0],l=e[1],c=e[2],i=e[3],n=e[4],h=e[5],a=e[6],y=e[7],b=e[8],p=Math.sin(t),d=Math.cos(t);return r[0]=d*s+p*i,r[1]=d*l+p*n,r[2]=d*c+p*h,r[3]=d*i-p*s,r[4]=d*n-p*l,r[5]=d*h-p*c,r[6]=a,r[7]=y,r[8]=b,r}function q(r,e,t){let s=t[0],l=t[1];return r[0]=s*e[0],r[1]=s*e[1],r[2]=s*e[2],r[3]=l*e[3],r[4]=l*e[4],r[5]=l*e[5],r[6]=e[6],r[7]=e[7],r[8]=e[8],r}function v(r,e){let t=e[0],s=e[1],l=e[2],c=e[3],i=e[4],n=e[5],h=e[6],a=e[7],y=e[8],b=e[9],p=e[10],d=e[11],f=e[12],m=e[13],x=e[14],_=e[15],w=t*n-s*i,z=t*h-l*i,S=t*a-c*i,E=s*h-l*n,B=s*a-c*n,g=l*a-c*h,C=y*m-b*f,F=y*x-p*f,$=y*_-d*f,N=b*x-p*m,I=b*_-d*m,k=p*_-d*x,M=w*k-z*I+S*N+E*$-B*F+g*C;return M?(M=1/M,r[0]=(n*k-h*I+a*N)*M,r[1]=(h*$-i*k-a*F)*M,r[2]=(i*I-n*$+a*C)*M,r[3]=(l*I-s*k-c*N)*M,r[4]=(t*k-l*$+c*F)*M,r[5]=(s*$-t*I-c*C)*M,r[6]=(m*g-x*B+_*E)*M,r[7]=(x*S-f*g-_*z)*M,r[8]=(f*B-m*S+_*w)*M,r):null}class P extends Array{constructor(e=1,t=0,s=0,l=0,c=1,i=0,n=0,h=0,a=1){return super(e,t,s,l,c,i,n,h,a),this}set(e,t,s,l,c,i,n,h,a){return e.length?this.copy(e):(U(this,e,t,s,l,c,i,n,h,a),this)}translate(e,t=this){return Y(this,t,e),this}rotate(e,t=this){return Z(this,t,e),this}scale(e,t=this){return q(this,t,e),this}multiply(e,t){return t?V(this,e,t):V(this,this,e),this}identity(){return W(this),this}copy(e){return T(this,e),this}fromMatrix4(e){return O(this,e),this}fromQuaternion(e){return R(this,e),this}fromBasis(e,t,s){return this.set(e[0],e[1],e[2],t[0],t[1],t[2],s[0],s[1],s[2]),this}inverse(e=this){return X(this,e),this}getNormalMatrix(e){return v(this,e),this}}const A=r=>(K("data-v-16dc7802"),r=r(),L(),r),o=A(()=>Q("h3",null,"CSS仿射变换",-1)),u=A(()=>Q("div",{class:"block separate"},"我使用分开写",-1)),ee=A(()=>Q("div",{class:"block combine"},"我使用matrix合并写",-1)),re={__name:"CSS",setup(r){const e=Math.PI/6;let t=new P(Math.cos(e),-Math.sin(e),0,Math.sin(e),Math.cos(e),0,0,0,1),s=new P(1,0,100,0,1,50,0,0,1),l=new P(1.5,0,0,0,1.5,0,0,0,1);const c=[t,s,l].reduce((i,n)=>n.multiply(i));return D(()=>{const i=document.querySelector(".combine"),n=c.slice(0,6);i.style.setProperty("--trans",`matrix(
  ${n[0]},${n[3]},
  ${n[1]},${n[4]},
  ${n[2]},${n[5]}
  )`)}),(i,n)=>(G(),H(J,null,[o,u,ee],64))}},se=j(re,[["__scopeId","data-v-16dc7802"]]);export{se as default};
