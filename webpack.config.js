const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  console.log(`[App]: Running in ${env.NODE_ENV} mode.`);
  const nodeEnv = (env.NODE_ENV || "").toUpperCase();
  return {
    entry: "./app/popup/index.js",
    mode: "development",
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
        __TYPE__: JSON.stringify("APP"),
        __ENV__: JSON.stringify(nodeEnv),
      }),
    ],
  };
};
