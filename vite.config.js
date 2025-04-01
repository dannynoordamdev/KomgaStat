import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,  // Ensures Vite uses the specified port
    allowedHosts: ['komgastat.northdev.xyz', 'localhost', '192.168.2.41']
  }
});
