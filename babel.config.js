module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current", // Ensures compatibility with the current Node.js version
        },
      },
    ],
  ],
};
