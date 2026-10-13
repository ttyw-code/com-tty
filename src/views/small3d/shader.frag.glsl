// 片元着色器
varying vec2 vUv; // 接收来自顶点着色器的变量
uniform float uTime; // 接收来自外部 JS 的时间变量

void main() {
  // 根据 UV 坐标和时间生成一个动态变化的颜色
  vec3 color = vec3(vUv.x, vUv.y, abs(sin(uTime)));
  gl_FragColor = vec4(color, 1.0); // 输出最终颜色 (R, G, B, A)
}
