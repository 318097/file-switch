const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const { NODE_ENV, MODE } = env;
  console.log(
    `[App]: Processing '${NODE_ENV}' environment for '${MODE}' mode.`
  );

  const watch = MODE === "ext" && NODE_ENV === "development";
  return {
    watch,
    entry: "./app/popup/index.js",
    mode: NODE_ENV,
    devtool: "cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, "app/build"),
      filename: "script.js",
    },
    devServer: {
      contentBase: path.join(__dirname, "app/build"),
      port: 9001,
      clientLogLevel: "silent",
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(ttf|otf)$/,
          use: ["file-loader"],
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: ["@svgr/webpack"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./app/popup/index.html" }),
      new webpack.DefinePlugin({
        __TYPE__: JSON.stringify(MODE),
        __ENV__: JSON.stringify(NODE_ENV),
      }),
    ],
  };
};
