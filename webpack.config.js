const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: ".src/g-calendar-fetcher.js",
  output: {
    filename: "g-calendar-fetcher.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "GCalendarFetcher",
    libraryTarget: "umd",
    globalObject: "this",
  },
  mode: "production",
  optimization: {
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
  },
};
