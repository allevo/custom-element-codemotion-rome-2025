import type { ConfigEnv } from 'vite';
import { defineConfig } from "vite";
import checker from 'vite-plugin-checker'

export default defineConfig((configEnv: ConfigEnv) => {
    const withShadowDom = configEnv.mode !== 'development';
    return {
        root: "src",
        plugins: [
            checker({
                typescript: true,
            }),
        ],
        build: {
            emptyOutDir: true,
            outDir: '../dist',
            target: 'esnext',
            lib: {
                entry: 'index.ts',
                formats: ['es' as const],
                name: 'index',
                fileName: 'index',
            },
        },
    }
});
