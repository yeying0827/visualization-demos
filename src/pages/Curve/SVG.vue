<template>
  <h3>使用SVG绘制曲线</h3>
  <svg xmlns="http://www.w3.org/2000/svg"
       width="512px" height="512px" viewBox="0 0 512 512">
    <g transform="translate(256, 256) scale(1, -1)">
      <g><!-- 设置坐标系 -->
        <path
            fill="none"
            stroke="#ddd"
            d="M -256,0
                    L 256,0"/>
        <path
            fill="none"
            stroke="#ddd"
            d="M 0,-256
                    L 0,256"/>
      </g>
      <g><!-- 三阶贝塞尔曲线 -->
        <path
            fill="none"
            stroke="red"
            d="M 0,0
                    C 80,50 140,-50 200,0" />
        <!-- 起点和终点 -->
        <circle cx="0" cy="0" r="4" fill="blue" />
        <circle cx="200" cy="0" r="4" fill="blue" />
        <!-- 两个控制点 -->
        <circle cx="80" cy="50" r="4" fill="orange" />
        <circle cx="140" cy="-50" r="4" fill="orange" />
        <path
            fill="none"
            stroke="#333"
            d="M 0,0
                    L 80,50 140,-50 200,0"></path>

        <path
            fill="none"
            stroke="red"
            d="M 10,-90
                 C 30,-90 25,-10 50,-10
                 S 70,-90 90,-90" /><!-- 来源MDN -->
      </g>
      <g><!-- 二阶贝塞尔曲线 -->
        <path
            fill="none"
            stroke="pink"
            d="M 0,0
                    Q -90,120 -200,0"></path>
        <path
            fill="none"
            stroke="#ddd"
            d="M 0,0
                    L -90,120 -200,0"></path>
        <circle cx="-90" cy="120" r="4" fill="red"></circle>
      </g>
      <g><!-- 圆 -->
        <circle cx="0" cy="90" r="100"
                fill="none"
                stroke-width="2"
                stroke="blue"
                pathLength="360"
                stroke-dasharray="180 360"
                stroke-dashoffset="0"/>
        <path
            fill="none"
            stroke="#ddd"
            d="M -100,90
                    L 100,90"/>
      </g>
      <g><!-- 椭圆 -->
        <ellipse cx="0" cy="90" rx="50" ry="100" fill="none" stroke="cyan" stroke-width="4"/>
      </g>
    </g>
  </svg>
</template>
