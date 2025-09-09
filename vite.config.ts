// vite.config.ts
import { defineConfig } from "vite";
import ts from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    lib: {
      entry: "src/api.ts", // 라이브러리 엔트리
      name: "MyApi", // 글로벌로 사용할 이름
      fileName: (format) => `api.${format}.js`,
    },
    rollupOptions: {
      external: [], // 외부 모듈 제외
      plugins: [ts()],
    },
  },
});
