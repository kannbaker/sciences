const path = require("node:path");
const fs = require("node:fs");
const { rspack } = require("@rspack/core");

const envFile = process.env.ENV_FILE || ".env";
const envPath = path.resolve(__dirname, envFile);
const env = fs.existsSync(envPath)
  ? Object.fromEntries(fs.readFileSync(envPath, "utf8").split(/\r?\n/).filter(Boolean).map((line) => line.split(/=(.*)/s, 2)))
  : {};
const baseUrl = process.env.BASE_URL ?? env.BASE_URL ?? "";

module.exports = {
  entry: "./src/index.ts",
  output: {
    clean: true,
    filename: "assets/app.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: baseUrl || "/"
  },
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [
      { test: /\.ts$/, exclude: /node_modules/, use: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  plugins: [
    new rspack.DefinePlugin({ __BASE_URL__: JSON.stringify(baseUrl) }),
    new rspack.HtmlRspackPlugin({ template: "./src/index.html" }),
    new rspack.HtmlRspackPlugin({ filename: "404.html", template: "./src/index.html" }),
    new rspack.CopyRspackPlugin({ patterns: [{ from: "./src/favicon.svg", to: "favicon.svg" }] })
  ],
  devServer: { port: 3100, historyApiFallback: true, static: { directory: path.join(__dirname, "dist") } }
};
