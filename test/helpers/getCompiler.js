import path from 'path';

import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default (fixture, loaderOptions = {}, config = {}) => {
  const fullConfig = {
    mode: 'development',
    devtool: config.devtool || false,
    context: path.resolve(__dirname, '../fixtures'),
    entry: path.resolve(__dirname, '../fixtures', fixture),
    output: {
      path: path.resolve(__dirname, '../outputs'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/webpack/public/path/',
      library: '___TEST___',
    },
    module: {
      rules: [
        {
          test: /\.(html|hbs)$/i,
          rules: [
            {
              loader: path.resolve(__dirname, '../../src'),
              options: loaderOptions || {},
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|ogg|pdf|vtt|webp|xml|webmanifest|mp3|mp4)$/i,
          loader: 'file-loader',
          options: { name: '[name].[ext]' },
        },
        {
          test: /\.file.css$/i,
          rules: [
            {
              loader: 'file-loader',
              options: { name: '[name].[ext]' },
            },
          ],
        },
        {
          test: /\.file.js$/i,
          rules: [
            {
              loader: 'file-loader',
              options: { name: '[name].[ext]' },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        aliasImg: path.resolve(__dirname, '../fixtures/image.png'),
        aliasImageWithSpace: path.resolve(
          __dirname,
          '../fixtures/image image.png'
        ),
      },
    },
    plugins: [],
    ...config,
  };

  const compiler = webpack(fullConfig);

  if (!config.outputFileSystem) {
    const outputFileSystem = createFsFromVolume(new Volume());
    // Todo remove when we drop webpack@4 support
    outputFileSystem.join = path.join.bind(path);

    compiler.outputFileSystem = outputFileSystem;
  }

  return compiler;
};
