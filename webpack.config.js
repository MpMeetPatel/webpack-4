// Webpack modules/Plugins
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");

// Mode API modules
const path = require("path");

const IS_DEV = process.env.NODE_ENV === "dev";

module.exports = {
   devServer: {
      contentBase: path.join(__dirname, "src")
   },
   optimization: {
      runtimeChunk: "single",
      splitChunks: {
         cacheGroups: {
            vendor: {
               test: /node_modules/,
               chunks: "initial",
               name: "vendor",
               priority: 10,
               enforce: true
            }
         }
      },
      minimizer: []
   },
   mode: IS_DEV ? "development" : "production",
   devtool: IS_DEV ? "cheap-module-source-map" : "",
   // Entry & Exit point
   entry: {
      main: path.resolve(__dirname, "src", "js", "index")
   },
   output: {
      filename: "js/[name].[hash].js",
      path: path.resolve(__dirname, "dist")
   },

   //    =============== Loaders ================
   module: {
      rules: [
         {
            test: /\.(js|mjs)$/,
            enforce: "pre",
            exclude: /node_modules/,
            use: [
               {
                  loader: require.resolve("eslint-loader")
               }
            ]
         },
         {
            test: /\.(js|mjs)$/,
            exclude: /node_modules/,
            use: [
               {
                  options: {
                     // faster for rebuilds
                     cacheDirectory: true
                  },
                  loader: require.resolve("babel-loader")
               }
            ]
         },
         {
            test: /\.(scss|sass|css)$/,
            use: [
               require.resolve("css-hot-loader"),
               MiniCssExtractPlugin.loader,
               {
                  loader: require.resolve("css-loader"),
                  options: {
                     sourceMap: IS_DEV ? true : false
                  }
               },
               {
                  loader: require.resolve("resolve-url-loader")
               },
               {
                  loader: require.resolve("postcss-loader"),
                  options: {
                     // Necessary for external CSS imports to work
                     ident: "postcss"
                  }
               },
               {
                  loader: require.resolve("sass-loader"),
                  options: {
                     sourceMap: true
                  }
               }
            ]
         },
         {
            loader: require.resolve("image-webpack-loader"),
            options: {
               bypassOnDebug: true,
               mozjpeg: {
                  progressive: true,
                  quality: 75
               }
            }
         },
         {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
               {
                  loader: require.resolve("url-loader"),
                  options: {
                     name: "[name].[hash].[ext]",
                     outputPath: "public/img"
                  }
               }
            ]
         },
         {
            test: /\.html$/,
            use: [
               {
                  loader: require.resolve("html-loader"),
                  options: {
                     attrs: [":data-src"],
                     minimize: true
                  }
               }
            ]
         }
      ]
   },
   //    =============== Plugins ================

   plugins: [
      new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery",
         "windows.jQuery": "jquery"
      }),
      new CopyWebpackPlugin([
         {
            from: "./src/public",
            to: "public"
         }
      ]),
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, "./src/index.html"),
         favicon: path.resolve(__dirname, "./src/icon.ico"),
         minify: !IS_DEV && {
            collapseWhitespace: true,
            preserveLineBreaks: true,
            removeComments: true
         }
      }),
      new MiniCssExtractPlugin({
         filename: IS_DEV ? "css/[name].css" : "css/[name].[contenthash].css",
         chunkFilename: "css/[name].[contenthash].css"
      }),
      new WebpackMd5Hash(),
      new CleanWebpackPlugin(["dist"])
   ]
};
