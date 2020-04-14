import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
const packageJson = require('./package.json');

export default () => ({
  mode: 'production',
  entry: {
    index: path.join(__dirname, 'src/index.js')
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: packageJson.name,
    libraryTarget: 'umd',
    globalObject: 'this'
  },

  module: {
    rules: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      include: path.join(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }]
    },
    {
      test: /\.(scss)$/,
      loader: 'style-loader!css-loader!sass-loader'
    }, {
      test: /\.svg$/,
      loader: 'svg-inline-loader?classPrefix'
    },
    {
      test: /\.(css)$/,
      loader: 'style-loader!css-loader!sass-loader'
    }, {
      test: /\.(mp3|png)$/,
      loader: 'file-loader'
    }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.svg', '.css', '.json']
  },

  externals: {
    react: 'react'
  },

  plugins: [new CleanWebpackPlugin(['dist/*.*'])],
  optimization: {
    splitChunks: {
      name: 'vendor',
      minChunks: 2
    }
  },
});
