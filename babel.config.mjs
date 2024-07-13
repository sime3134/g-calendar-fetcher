import presetEnv from "@babel/preset-env";
import transformRuntime from "@babel/plugin-transform-runtime";

export default {
  presets: [
    [
      presetEnv,
      {
        targets: "> 0.25%, not dead",
      },
    ],
  ],
  plugins: [transformRuntime],
};
