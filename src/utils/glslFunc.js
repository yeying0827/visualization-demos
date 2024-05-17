// 基础距离函数
const baseDistanceFunction = `
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
`;

// 正方形距离函数
const squareDistanceFunction = `
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
`;

// 多边形距离函数
const polygonDistanceFunction = `
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
`;

// 椭圆距离函数
const ellipseDistanceFunction = `
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
`;

// n角星距离函数
const starDistanceFunction = `
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
`;

export const distance = {
    base: baseDistanceFunction,
    square: squareDistanceFunction,
    polygon: polygonDistanceFunction,
    ellipse: ellipseDistanceFunction,
    star: starDistanceFunction
};
