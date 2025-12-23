export default {
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.mjs" }],
  },
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  moduleFileExtensions: ["js"],
  setupFiles: ["./test/setup.js"],
};
