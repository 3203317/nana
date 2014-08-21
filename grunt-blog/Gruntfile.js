module.exports = function(grunt){
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		/* 清理目录 */
		clean: {
			options: {
				force: true
			},
			target: 'dest'
		},
		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>\n * <%= pkg.author.email %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
			}, build: {
				src: 'src/package.json',
				dest: 'build/package.json'
			}, buildall: { // 任务三：按原文件结构压缩js文件夹内所有JS文件
				files: [{
					mangle: !0, // 不混淆变量名
					expand: !0,
					cwd: 'src', // js目录下
					src: '**/*.js', // 所有js文件
					dest: 'build/' // 输出到此目录下
				}]
			}
		}, htmlmin: {
			dist: {
				options: {
					removeComments: true, // 去注析
					collapseWhitespace: true // 去换行
				}, files: [{
					expand: true,
					cwd: 'src/',
					src: '**/*.html',
					dest: 'build/'
				}]
			}
		}, cssmin: {
			build: {
				expand: true,
				cwd: 'src/',
				src: '**/*.css',
				dest: 'build/'
			}
		}, imagemin: {
			/* 压缩图片大小 */
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{jpg,png,gif}'],
					dest: 'build/'
				}]
			}
		}
	});
	
	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	// Default task(s).
	// grunt.registerTask('default', ['uglify']);
	grunt.registerTask('default', ['uglify:buildall', 'cssmin', 'imagemin']);
	grunt.registerTask('html', ['htmlmin']);
};