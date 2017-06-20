var webpack = require('webpack');
module.exports = {
    devtool: 'source-map',
    entry:'./entry.js',
    output:{
        path:__dirname+'/build',
        filename:'mooneat.js'
    },
    module:{
        loaders:[
            {test:/\.css$/,loader:'style-loader!css-loader'}

        ]
    }
}