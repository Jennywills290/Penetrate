// webpack.config.js

const path = require('path');

module.exports = {
    mode:"development",
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        modules: [
            path.resolve(__dirname,  'src'), // Add this line to resolve the src directory
            'node_modules',
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Use style-loader and css-loader for CSS files
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i, // Add a rule for image files
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve(__dirname, 'src'), // Set context to src folder
                            outputPath: '/', // Output to images folder
                            publicPath: '/', // Public path for the images
                            useRelativePaths: true,
                        },
                    },
                ],
            },
        ],

    },
    devtool: false, // Disable source maps
    devServer: {
        static:[ {
            directory: path.join(__dirname, 'dist')
        },
        {
            directory: path.join(__dirname, 'src/components/styles'),
          }],
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
};
