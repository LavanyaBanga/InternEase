import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          icons: ['@heroicons/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@heroicons/react', 'recharts']
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'],
//           router: ['react-router-dom'],
//           charts: ['recharts'],
//           icons: ['@heroicons/react']
//         }
//       }
//     },
//     chunkSizeWarningLimit: 1000
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom', 'react-router-dom', '@heroicons/react', 'recharts']
//   }
// })