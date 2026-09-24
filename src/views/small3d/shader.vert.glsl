// 顶点着色器
varying vec2 vUv; // 传递给片元着色器的变量

void main() {
  vUv = uv; // 获取纹理坐标
  // projectionMatrix, modelViewMatrix, position 都是 Three.js 自动传入的内置变量
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
