import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
    extensions: [".jsx", ".js"],
  },
});
