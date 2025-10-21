import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// 复制目录的插件
function copyDirPlugin() {
  return {
    name: 'copy-dir',
    writeBundle() {
      const sourceDir = resolve(__dirname, 'icons')
      const targetDir = resolve(__dirname, 'dist/icons')
      
      function copyDir(src: string, dest: string) {
        try {
          mkdirSync(dest, { recursive: true })
          const files = readdirSync(src)
          
          for (const file of files) {
            const srcPath = join(src, file)
            const destPath = join(dest, file)
            
            if (statSync(srcPath).isDirectory()) {
              copyDir(srcPath, destPath)
            } else {
              copyFileSync(srcPath, destPath)
            }
          }
        } catch (error) {
          console.error('Error copying directory:', error)
        }
      }
      
      copyDir(sourceDir, targetDir)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyDirPlugin()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        sidebar: resolve(__dirname, 'sidebar.html'),
        settings: resolve(__dirname, 'src/settings/settings.tsx'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.(ts|tsx)$/, '') : 'chunk'
          return `${facadeModuleId}.js`
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})