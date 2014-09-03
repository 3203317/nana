module.exports = function(grunt){
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		/* 清理目录 */
		clean: {
			foo: {
				src: ['build/**/*'],
				filter: function(fp){
					var sb = fp.split('/');
					return 'node_modules' !== sb[1];
				}
			}
		}, uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>\n * <%= pkg.author.email %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
			}, build: {
				src: '../blog/package.json',
				dest: 'build/package.json'
			}, buildall: { // 任务三：按原文件结构压缩js文件夹内所有JS文件
				files: [{
					mangle: !0, // 不混淆变量名
					expand: !0,
					cwd: '../blog', // js目录下
					src: ['**/*.js', '!node_modules/**/*'], // 所有js文件
					dest: 'build/' // 输出到此目录下
				}]
			}, buildjs: {
				src: '../../js/js/olxjs/1.0.0/js/olx.js',
				dest: '../../js/js/olxjs/1.0.0/js/olx.min.js'
			}
		}, htmlmin: {
			dist: {
				options: {
					removeComments: true, // 去注析
					collapseWhitespace: true // 去换行
				}, files: [{
					expand: true,
					cwd: '../blog/',
					src: '**/*.html',
					dest: 'build/'
				}]
			}
		}, cssmin: {
			build: {
				expand: true,
				cwd: '../blog/',
				src: ['**/*.css', '!node_modules/**/*'],
				dest: 'build/'
			}
		}, imagemin: {
			/* 压缩图片大小 */
			dynamic: {
				files: [{
					expand: true,
					cwd: '../blog/',
					src: ['**/*.{jpg,png,gif}', '!node_modules/**/*'],
					dest: 'build/'
				}]
			}
		}, copy: {
			build: {
				src: '../blog/package.json',
				dest: 'build/package.json'
			}, html: {
				files: [{
					expand: !0,
					cwd: '../blog',
					src: ['**/*.html', '!node_modules/**/*'],
					dest: 'build/'
				}]
			}, ttf: {
				files: [{
					expand: !0,
					cwd: '../blog',
					src: ['**/*.ttf', '!node_modules/**/*'],
					dest: 'build/'
				}]
			}
		}, less: {
			compress: {
				files: {
					'./build/public/assets/css/olx/olx.css': '../blog/public/assets/css/olx/olx.less',
					'./build/public/manage/css/index.css': '../blog/public/manage/css/index.less',
					'./build/public/site/css/article.css': '../blog/public/site/css/article.less',
					'./build/public/site/css/artintro.css': '../blog/public/site/css/artintro.less',
					'./build/public/site/css/index.css': '../blog/public/site/css/index.less',
					'./build/public/site/css/loadmore.css': '../blog/public/site/css/loadmore.less',
					'./build/public/user/css/login.css': '../blog/public/user/css/login.less',
					'./build/public/user/css/my.css': '../blog/public/user/css/my.less',
					'./build/public/user/css/register.css': '../blog/public/user/css/register.less'
				}, options: {
					compress: true
				}
			}
		}
	});
	
	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');

	// Default task(s).
	// grunt.registerTask('default', ['uglify']);
	grunt.registerTask('default', ['clean', 'uglify:buildall', 'uglify:buildjs', 'imagemin', 'copy', 'less']);
	grunt.registerTask('html', ['htmlmin']);
	grunt.registerTask('cc', ['clean']);
};