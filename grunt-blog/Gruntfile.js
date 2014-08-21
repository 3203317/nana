module.exports = function(grunt){
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>\n * <%= pkg.author %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
			}, build: {
				src: 'src/*.js',
				dest: 'build/<%= pkg.name %>.js'
			}, buildall: { //任务三：按原文件结构压缩js文件夹内所有JS文件
				files: [{
					expand: true,
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