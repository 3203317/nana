module.exports = function(grunt){
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>\n * <%= pkg.author %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
			}, build: {
				src: 'src/package.json',
				dest: 'build/package.json'
			}, buildall: { //任务三：按原文件结构压缩js文件夹内所有JS文件
				files: [{
					mangle: !0, //不混淆变量名
					expand: !0,
					cwd: 'src', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'build/' //输出到此目录下
				}]
			}
		}
	});
	
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	// grunt.registerTask('default', ['uglify']);
	grunt.registerTask('default', ['uglify:buildall']);
};