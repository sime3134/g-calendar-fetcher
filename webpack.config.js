const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/g-calendar-fetcher.js",
  output: {
    filename: "g-calendar-fetcher.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "GCalendarFetcher",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: {
    ical: "ICAL",
  },
  resolve: {
    alias: {
      "ical.js": path.resolve(__dirname, "node_modules/ical.js/build/ical.js"),
    },
    extensions: [".js"],
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
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
