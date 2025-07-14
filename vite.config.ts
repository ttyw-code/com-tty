import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' //vite svg plugin
import { viteMockServe } from 'vite-plugin-mock'
import inspect from 'vite-plugin-inspect' // vite inspect plugin

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // console.log('inspect', inspect())
  // console.log('vue', vue())
  // console.log('mode:', mode)
  // console.log('isPreview:', isPreview)
  // console.log('isSsrBuild:', isSsrBuild)
  return {
    plugins: [
      inspect(),
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
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
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
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
    build:{
      outDir: 'dist'
    }
  }
})
