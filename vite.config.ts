/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' //vite svg plugin
import { viteMockServe } from 'vite-plugin-mock'
import inspect from 'vite-plugin-inspect' // vite inspect plugin
import autoImport from 'unplugin-auto-import/vite'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    test: {
      globals: true,
    },
    define: {
      global: 'window',
    },
    plugins: [
      autoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'types/auto/auto-imports.d.ts',
      }),
      glsl(),
      inspect(),
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: './mock',
        localEnabled: command === 'serve',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },

    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "@/styles/variable.scss";',
        },
      },
    },

    server: {
      //代理服务器
      proxy: {
        '/api': {
          target: 'http://localhost:5000', // 代理目标地址
          changeOrigin: true, // 是否改变源
          rewrite: (path: string) => path.replace(/^\/api/, ''), // 重写路径
        },
      },
    },
    base:
      process.env.NODE_ENV === 'production'
        ? '/com-tty/' // 替换为你的仓库名
        : '/',
    build: {
      outDir: 'dist',
    },
  }
})
