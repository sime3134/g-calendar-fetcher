const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

export const entry = ".src/g-calendar-fetcher.js";
export const output = {
  filename: "g-calendar-fetcher.min.js",
  path: resolve(__dirname, "dist"),
  library: "GCalendarFetcher",
  libraryTarget: "umd",
  globalObject: "this",
};
export const mode = "production";
export const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        output: {
          comments: false,
        },
        compress: {
          drop_console: true,
        },
        mangle: {
          reserved: [
            "FetchError",
            "ParseError",
            "CreationError",
            "GCalendarFetcher",
          ],
        },
      },
    }),
  ],
};
