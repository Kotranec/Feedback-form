const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: "development",
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      'react-datepicker': path.resolve(__dirname, './node_modules/react-datepicker'),
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.s(a|c)ss|css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          },
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8000
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html')
    }),
  ],
  devtool: 'inline-source-map'
};
