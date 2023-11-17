<template>
  <h3>SVG实现柱状图</h3>
  <!--
     dataset = {
       total: [25, 26, 40, 45, 68],
       current: [15, 11, 17, 25, 37],
     }
 -->
  <svg xmlns="http://www.w3.org/2000/svg" width="120px" height="240px" viewBox="0 0 60 100">
    <g transform="translate(0, 100) scale(1, -1)">
      <g>
        <rect x="1" y="0" width="10" height="25" fill="#37c"/>
        <rect x="13" y="0" width="10" height="26" fill="#37c"/>
        <rect x="25" y="0" width="10" height="40" fill="#37c"/>
        <rect x="37" y="0" width="10" height="45" fill="#37c"/>
        <rect x="49" y="0" width="10" height="68" fill="#37c"/>
      </g>
      <g>
        <rect x="1" y="0" width="10" height="15" fill="#3c7"/>
        <rect x="13" y="0" width="10" height="11" fill="#3c7"/>
        <rect x="25" y="0" width="10" height="17" fill="#3c7"/>
        <rect x="37" y="0" width="10" height="25" fill="#3c7"/>
        <rect x="49" y="0" width="10" height="37" fill="#3c7"/>
      </g>
    </g>
  </svg>
  <h3>SVG 测试</h3>
  <svg xmlns="http://www.w3.org/2000/svg" width="240px" height="240px" viewBox="0 0 100 100">
    <g>
      <path
          d="M 50,50
       L 0,50
       A 6 6 30 0 1 10,20
       Z" fill="#3cf"/>
      <path
          d="M 50,50
       L 10,20
       A 6 6 0 1 1 20,10
       Z" fill="yellow"/>
    </g>
  </svg>
</template>
