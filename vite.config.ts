import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

const defineVars = ["API_URL"]

export default defineConfig({
    build: {
        outDir: "./dist",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: [
                        "react",
                        "react-dom",
                    ],
                    utility: [
                        "axios",
                        "jose",
                        "moment",
                        "query-string",
                        "universal-cookie",
                        "@toast-ui/react-editor",
                        "@toast-ui/editor"
                    ],
                    core: [
                        "ra-core",
                    ],
                    admin: [
                        "react-admin"
                    ]
                },

            },
        },
    },
    plugins: [
        react()
    ],
    define: Object.fromEntries(
        defineVars.map((key) => [key, JSON.stringify(process.env[key])])
    ),
})