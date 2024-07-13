module.exports = {
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.js" }],
  },
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  moduleFileExtensions: ["js"],
};
