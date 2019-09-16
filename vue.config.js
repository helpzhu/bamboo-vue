let proxyUrl = 'http://localhost:8080';

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
	// 基本路径
	publicPath: '/', 
	// 编译路径
	outputDir: 'dist',
	// 静态资源目录
	assetsDir: 'static', 
	// 是否保存时检查
	lintOnSave: true,
	// 生产环境是否生成sourceMap
	productionSourceMap: false,
	devServer: {
		// 地址
		host: 'localhost',
		// 端口
		port: 8081,
		// 自动启动浏览器
		open: true,
		overlay: {
			warnings: false,
			errors: true
		},
		proxy: proxyUrl
		/* proxy: {
			"/":{
				target: baseUrl,
				ws: true,
				changeOrigin: true
			}
		} */
	},
}
