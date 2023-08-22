import { defineConfig } from "vite";
import { resolve } from "path";
import { splitVendorChunkPlugin } from "vite";
import glslify from "rollup-plugin-glslify";

const root = "";//フォルダの階層を変更したらここもそれにあった記述に変更する

export default defineConfig({
  root,
  base: "/portfolio-webgl",
  publicDir: "./public",//フォルダの階層を変更したらここもそれにあった記述に変更する
  plugins: [
    splitVendorChunkPlugin(),
    glslify({
      compress(code) {
        // Based on https://github.com/vwochnik/rollup-plugin-glsl
        // Modified to remove multiline comments. See #16
        let needNewline = false;
        return code
          .replace(/\\(?:\r\n|\n\r|\n|\r)|\/\*.*?\*\/|\/\/(?:\\(?:\r\n|\n\r|\n|\r)|[^\n\r])*/gs, "")
          .split(/\n+/)
          .reduce((result, line) => {
            line = line.trim().replace(/\s{2,}|\t/, " "); // lgtm[js/incomplete-sanitization]
            if (line.charAt(0) === "#" || /else/.test(line)) {
              if (needNewline) {
                result.push("\n");
              }
              result.push(line, "\n");
              needNewline = false;
            } else {
              result.push(line.replace(/\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|-|!|;)\s*/g, "$1"));
              needNewline = true;
            }
            return result;
          }, [])
          .join(process.env.NODE_ENV === "development" ? "\n" : "")
          .replace(/\n+/g, "\n");
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: "#",
        replacement: "/scripts",
      },
    ],
  },
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        // htmlを追加する場合にはこちらに追記
        index: resolve(root, "index.html"),
        // diverse: resolve(root, "diverse.html"),
      },
    },
  },
  server: {
    host: true,
  },
});
