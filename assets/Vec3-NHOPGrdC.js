function w(r){let t=r[0],e=r[1],n=r[2];return Math.sqrt(t*t+e*e+n*n)}function d(r,t){return r[0]=t[0],r[1]=t[1],r[2]=t[2],r}function E(r,t,e,n){return r[0]=t,r[1]=e,r[2]=n,r}function o(r,t,e){return r[0]=t[0]+e[0],r[1]=t[1]+e[1],r[2]=t[2]+e[2],r}function A(r,t,e){return r[0]=t[0]-e[0],r[1]=t[1]-e[1],r[2]=t[2]-e[2],r}function I(r,t,e){return r[0]=t[0]*e[0],r[1]=t[1]*e[1],r[2]=t[2]*e[2],r}function P(r,t,e){return r[0]=t[0]/e[0],r[1]=t[1]/e[1],r[2]=t[2]/e[2],r}function x(r,t,e){return r[0]=t[0]*e,r[1]=t[1]*e,r[2]=t[2]*e,r}function V(r,t){let e=t[0]-r[0],n=t[1]-r[1],i=t[2]-r[2];return Math.sqrt(e*e+n*n+i*i)}function j(r,t){let e=t[0]-r[0],n=t[1]-r[1],i=t[2]-r[2];return e*e+n*n+i*i}function D(r){let t=r[0],e=r[1],n=r[2];return t*t+e*e+n*n}function k(r,t){return r[0]=-t[0],r[1]=-t[1],r[2]=-t[2],r}function C(r,t){return r[0]=1/t[0],r[1]=1/t[1],r[2]=1/t[2],r}function p(r,t){let e=t[0],n=t[1],i=t[2],s=e*e+n*n+i*i;return s>0&&(s=1/Math.sqrt(s)),r[0]=t[0]*s,r[1]=t[1]*s,r[2]=t[2]*s,r}function Q(r,t){return r[0]*t[0]+r[1]*t[1]+r[2]*t[2]}function L(r,t,e){let n=t[0],i=t[1],s=t[2],h=e[0],l=e[1],u=e[2];return r[0]=i*u-s*l,r[1]=s*h-n*u,r[2]=n*l-i*h,r}function F(r,t,e,n){let i=t[0],s=t[1],h=t[2];return r[0]=i+n*(e[0]-i),r[1]=s+n*(e[1]-s),r[2]=h+n*(e[2]-h),r}function G(r,t,e){let n=t[0],i=t[1],s=t[2],h=e[3]*n+e[7]*i+e[11]*s+e[15];return h=h||1,r[0]=(e[0]*n+e[4]*i+e[8]*s+e[12])/h,r[1]=(e[1]*n+e[5]*i+e[9]*s+e[13])/h,r[2]=(e[2]*n+e[6]*i+e[10]*s+e[14])/h,r}function H(r,t,e){let n=t[0],i=t[1],s=t[2],h=e[3]*n+e[7]*i+e[11]*s+e[15];return h=h||1,r[0]=(e[0]*n+e[4]*i+e[8]*s)/h,r[1]=(e[1]*n+e[5]*i+e[9]*s)/h,r[2]=(e[2]*n+e[6]*i+e[10]*s)/h,r}function J(r,t,e){let n=t[0],i=t[1],s=t[2];return r[0]=n*e[0]+i*e[3]+s*e[6],r[1]=n*e[1]+i*e[4]+s*e[7],r[2]=n*e[2]+i*e[5]+s*e[8],r}function K(r,t,e){let n=t[0],i=t[1],s=t[2],h=e[0],l=e[1],u=e[2],B=e[3],c=l*s-u*i,f=u*n-h*s,y=h*i-l*n,g=l*y-u*f,M=u*c-h*y,q=h*f-l*c,z=B*2;return c*=z,f*=z,y*=z,g*=2,M*=2,q*=2,r[0]=n+c+g,r[1]=i+f+M,r[2]=s+y+q,r}const N=function(){const r=[0,0,0],t=[0,0,0];return function(e,n){d(r,e),d(t,n),p(r,r),p(t,t);let i=Q(r,t);return i>1?0:i<-1?Math.PI:Math.acos(i)}}();function O(r,t){return r[0]===t[0]&&r[1]===t[1]&&r[2]===t[2]}class R extends Array{constructor(t=0,e=t,n=t){return super(t,e,n),this}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}set x(t){this[0]=t}set y(t){this[1]=t}set z(t){this[2]=t}set(t,e=t,n=t){return t.length?this.copy(t):(E(this,t,e,n),this)}copy(t){return d(this,t),this}add(t,e){return e?o(this,t,e):o(this,this,t),this}sub(t,e){return e?A(this,t,e):A(this,this,t),this}multiply(t){return t.length?I(this,this,t):x(this,this,t),this}divide(t){return t.length?P(this,this,t):x(this,this,1/t),this}inverse(t=this){return C(this,t),this}len(){return w(this)}distance(t){return t?V(this,t):w(this)}squaredLen(){return D(this)}squaredDistance(t){return t?j(this,t):D(this)}negate(t=this){return k(this,t),this}cross(t,e){return e?L(this,t,e):L(this,this,t),this}scale(t){return x(this,this,t),this}normalize(){return p(this,this),this}dot(t){return Q(this,t)}equals(t){return O(this,t)}applyMatrix3(t){return J(this,this,t),this}applyMatrix4(t){return G(this,this,t),this}scaleRotateMatrix4(t){return H(this,this,t),this}applyQuaternion(t){return K(this,this,t),this}angle(t){return N(this,t)}lerp(t,e){return F(this,this,t,e),this}clone(){return new R(this[0],this[1],this[2])}fromArray(t,e=0){return this[0]=t[e],this[1]=t[e+1],this[2]=t[e+2],this}toArray(t=[],e=0){return t[e]=this[0],t[e+1]=this[1],t[e+2]=this[2],t}transformDirection(t){const e=this[0],n=this[1],i=this[2];return this[0]=t[0]*e+t[4]*n+t[8]*i,this[1]=t[1]*e+t[5]*n+t[9]*i,this[2]=t[2]*e+t[6]*n+t[10]*i,this.normalize()}}export{R as V};