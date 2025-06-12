import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Example alias if needed
      // '@components': '/src/components',
    },
    // Ensure Vite can resolve node_modules
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimizeDeps: {
    include: [
      'chartjs-adapter-dayjs',
    ],
    // If you need to explicitly exclude or include certain dependencies
    // you can use this option
    exclude: [],
  },
});
