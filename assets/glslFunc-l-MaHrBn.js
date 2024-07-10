const e=`
  // 点到直线的距离
  float line_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    return cross(p, normalize(ab)).z;
  }

  // 点到线段的距离
  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    float d = abs(cross(p, normalize(ab)).z);
    float proj = dot(p, ab) / l;
    if(proj >= 0.0 && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
  }

  // 点到三角形的距离
  float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, a);

    if ((d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0)
        || (d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0)) {
      return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负
    }

    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部距离为正
  }
`,n=`
    float square_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c, in vec2 d) {
        float d1 = line_distance(st, a, b);
        float d2 = line_distance(st, b, c);
        float d3 = line_distance(st, c, d);
        float d4 = line_distance(st, d, a);
        
        if (d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 && d4 >= 0.0
        || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0 && d4 <= 0.0) {
          return -min(abs(d1), min(abs(d2), min(abs(d3), abs(d4))));
        }
        
        return min(seg_distance(st, a, b), min(seg_distance(st, b, c), min(seg_distance(st, c, d), seg_distance(st, d, a))));
    }
`,i=`
  // 以向量方式计算
  float polygon_distance(in vec2 st, in int edges, in vec2 start, in float step) {
    // 正多边形内角和 = (n - 2) * 180°
    // 每个内角的角度 = (n - 2) * 180° / n
    // 每个角要旋转到下一个角的旋转角度 = 每个角的补角 = 180° - (n-2) / n * 180°
    float delta = PI * (1.0 - (float(edges) - 2.0) / float(edges));
    // float delta = 2 * PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    vec2 dir = vec2(step, 0.0);
    vec2 startPoint = vec2(start); // 起点
    dir = rotation * dir;
    vec2 endPoint = vec2(startPoint.x + dir.x, startPoint.y + dir.y); // 终点
    float minSeg = seg_distance(st, startPoint, endPoint); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    bool isInner = true;
    // 循环
    for(int i = 1; i < 32767; i ++) {
      if (i >= edges) break;
      startPoint = endPoint;
      dir = rotation * dir;
      endPoint = vec2(startPoint.x + dir.x, startPoint.y + dir.y);
      minSeg = min(minSeg, seg_distance(st, startPoint, endPoint)); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner ? -minSeg : minSeg;
  }

  // 以极坐标方式计算
  float polygon_distance2(in vec2 st, in int edges, in vec2 start) {
    float delta = 2.0 * PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    vec2 startPoint = vec2(start); // 起点
    vec2 endPoint = rotation * startPoint; // 下一个点
    float minSeg = seg_distance(st, startPoint, endPoint); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    bool isInner = true;
    // 循环
    for(int i = 1; i < 32767; i ++) {
      if (i >= edges) break;
      startPoint = endPoint;
      endPoint = rotation * startPoint;
      minSeg = min(minSeg, seg_distance(st, startPoint, endPoint)); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner ? -minSeg : minSeg;
  }
`,a=`
  float ellipse_distance(in vec2 st, in vec2 center, in float radiusX, in float radiusY) {
    float d = pow((vUv.x - center.x), 2.0) / pow(radiusX, 2.0) + pow((vUv.y - center.y), 2.0) / pow(radiusY, 2.0); // 椭圆公式
    if (d <= 1.0) return -d; // 如果在椭圆内部返回负数
    return d - 1.0;
  }
  
  float ellipse_distance2(in vec2 st, in vec2 center, in float radiusX, in float radiusY) {
    float d = pow((vUv.x - center.x), 2.0) / pow(radiusX, 2.0) + pow((vUv.y - center.y), 2.0) / pow(radiusY, 2.0); // 椭圆公式

    if (d <= 0.0) return d * (min(radiusX, radiusY) / max(radiusX, radiusY));
    return (d) * (1.0 - min(radiusX, radiusY) / max(radiusX, radiusY));
  }
`,o=`
  // 以极坐标方式计算，短边作为起始点
  float star_distance(in vec2 st, in int edges, in vec2 start) {
    float delta = PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    // 偶数点短半径，奇数点长半径
    vec2 startPoint = vec2(start); // 第0个点
    vec2 midPoint = 2.0 * rotation * startPoint; // 第1个点
    vec2 endPoint = rotation * rotation * startPoint; // 第2个点

    float minSeg = min(seg_distance(st, startPoint, midPoint), seg_distance(st, midPoint, endPoint)); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    float triangleD = triangle_distance(st, startPoint, midPoint, endPoint);

    bool isInner = true;
    bool isInTriangle = false;
    int count = 2;
    // 循环
    for(int i = 2; i < 32767; i ++) {
      if (count > edges * 2) break;
      count = count + 2;

      float triangleD = triangle_distance(st, startPoint, midPoint, endPoint);
      if (triangleD <= 0.0) isInTriangle = true;

      startPoint = endPoint;
      midPoint = 2.0 * rotation * startPoint;
      endPoint = rotation * rotation * startPoint;


      minSeg = min(minSeg, min(seg_distance(st, startPoint, midPoint), seg_distance(st, midPoint, endPoint))); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner || isInTriangle ? -minSeg : minSeg;
  }
`,m={base:e,square:n,polygon:i,ellipse:a,star:o},s=`
  // Function from Inigo Quiles
  vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(
      abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
      0.0,
      1.0
    );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }
`,x={hsb:s},r=`
  // 随机函数
  float random (float x) {
    return fract(sin(x * 1243758.5453123));
  }
`,c=`
  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }
`,t=`
  vec2 random2vec(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }
`,d=`
  // 二维噪声，对st与方形区域的四个顶点插值
  highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
`,l=`
  ${t}
  
  vec2 random2(vec2 st) {
    return -1.0 + 2.0 * random2vec(st); // x和y：-1~1
  }

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1

    return mix(
      mix(
        dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }
`,f=`
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
`,u={random:r,random2d:c,random2vec:t,noise_value:d,noise_gradient:l,noise_simplex:f},v=`
    // http://www.flong.com/texts/code/shapers_bez/
    // Helper functions:
    float slope_from_t (float t, float A, float B, float C) {
        float dtdx = 1.0 / (3.0 * A * t * t + 2.0 * B * t + C);
        return dtdx;
    }
    float x_from_t (float t, float A, float B, float C, float D) {
        float x = A * (t * t * t) + B * (t * t) + C * t + D;
        return x;
    }
    float y_from_t (float t, float E, float F, float G, float H) {
        float y = E * (t * t * t) + F * (t * t) + G * t + H;
        return y;
    }
    float cubic_bezier (float x, float a, float b, float c, float d) {
        float y0a = 0.00; // initial y
        float x0a = 0.00; // initial x
        float y1a = b; // 1st influence y
        float x1a = a; // 1st influence x
        float y2a = d; // 2nd influence y
        float x2a = c; // 2nd influence x
        float y3a = 1.00; // final y
        float x3a = 1.00; // final x
        
        float A = x3a - 3.0 * x2a + 3.0 * x1a - x0a;
        float B = 3.0 * x2a - 6.0 * x1a + 3.0 * x0a;
        float C = 3.0 * x1a - 3.0 * x0a;
        float D = x0a;
        
        float E = y3a - 3.0 * y2a + 3.0 * y1a - y0a;
        float F = 3.0 * y2a - 6.0 * y1a + 3.0 * y0a;
        float G = 3.0 * y1a - 3.0 * y0a;
        float H = y0a;
        
        // Solve for t given x (using Newton-Raphelson), then solve for y given t.
        // Assuming for the first guess that t = x.
        float currentt = x;
        const int nRefinementIterations = 5;
        for (int i = 0; i < nRefinementIterations; i ++) {
            float currentx = x_from_t(currentt, A, B, C, D);
            float currentslope = slope_from_t(currentt, A, B, C);
            currentt -= (currentx - x) * (currentslope);
            currentt = clamp(currentt, 0.0, 1.0);
        }
        
        float y = y_from_t(currentt, E, F, G, H);
        return y;
    }
`,g={cubic_bezier:v};export{g as b,x as c,m as d,u as n};
