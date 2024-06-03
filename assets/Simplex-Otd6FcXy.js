import{y as r,f as a,G as n,o as s,c,b as i,F as v}from"./index-8v8F2D54.js";const x=i("h3",null,"Simplex Noise",-1),m=`
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`,l=`
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

  //
  // Description : GLSL 2D simplex noise function
  //      Author : Ian McEwan, Ashima Arts
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License :
  //  Copyright (C) 2011 Ashima Arts. All rights reserved.
  //  Distributed under the MIT License. See LICENSE file.
  //  https://github.com/ashima/webgl-noise
  //
  float noise(vec2 v) {
    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0 - sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5 * (sqrt(3.0) - 1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0
     // First corner (x0)
     vec2 i = floor(v + dot(v, C.yy));
     vec2 x0 = v - i + dot(i, C.xx);

     // Other two corners(x1, x2)
     vec2 i1 = vec2(0, 0);
     i1 = (x0.x > x0.y)? vec2(1.0, 0.0) : vec2(0.0, 1.0);
     vec2 x1 = x0.xy + C.xx - i1;
     vec2 x2 = x0.xy + C.zz;

     // Do some permutations to avoid
     // truncation effects in permutation
     i = mod289(i);
     vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0)
     );

     vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);

     m = m * m;
     m = m * m;

     // Gradients:
     //  41 pts uniformly over a line, mapped onto a diamond
     //  (在一条线上均匀分布 41 个点，映射到一个菱形上。)
     //  The ring size 17*17 = 289 is close to a multiple
     //      of 41(41 * 7 = 287)
     //  (环的大小17 * 17等于289，接近41的倍数（41 * 7等于287）。)
     vec3 x = 2.0 * fract(p * C.www) - 1.0;
     vec3 h = abs(x) - 0.5;
     vec3 ox = floor(x + 0.5);
     vec3 a0 = x - ox;

     // Normalise gradients implicitly by scaling m
     // Approximation of: m *= inversesqrt(a0 * a0 + h * h)
     m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

     // Compute final noise value at P
     vec3 g = vec3(0.0);
     g.x = a0.x * x0.x + h.x * x0.y;
     g.yz = a0.yz * vec2(x1.x, x2.x) + h.yz * vec2(x1.y, x2.y);
     return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
  }
`,p={__name:"Simplex",setup(u){const t=r(null);return a(()=>{const e=new n(t.value),o=e.compileSync(l,m);e.useProgram(o),e.setMeshData([{positions:[[-1,-1],[-1,1],[1,1],[1,-1]],attributes:{uv:[[0,0],[0,1],[1,1],[1,0]]},cells:[[0,1,2],[2,0,3]]}]),e.render()}),(e,o)=>(s(),c(v,null,[x,i("canvas",{ref_key:"glRef",ref:t,width:"512",height:"512"},null,512)],64))}};export{p as default};
