var fs = require("fs");
var path = require("path")
var browserify = require("browserify");

var useGacx = false;
var experiment = {};

experiment.files = fs.readdirSync(path.join(__dirname, "../experiments"))
.filter(function(file) {
	return path.extname(file) === '.js' && !/index\.js$/.test(file);  
}).map(function(file) {
	return path.join("../experiments", file);
});
experiment.paths = experiment.files.map(function(file) {
	return file.replace(/\.js$/, "");
});
experiment.modules = experiment.paths.map(function(path) {
	return require(path);
});
experiment.ids = experiment.modules.map(function(experiment){
	if (experiment.gacx) useGacx = true;
	return experiment.id;
});

fs.writeFileSync(path.join(__dirname, "../experiments/index.js"), 
	experiment.files.map(function(file){
		var name = path.basename(file, '.js');
		return 'exports["' + name + '"] = require("./' + name + '");';
	}).join('\n'));

browserify("./browser.js", {
	basedir: __dirname
})
.transform("uglifyify")
.bundle(function(error, experimentsBundle) {
	if (error) {
		console.error(error);
		return;
	}
	var uglify = require("uglifyjs");

	if (useGacx) {
		var gacx = require("./gacx");
		gacx.build(experiment.ids, function(cxApiSource) {
			fs.writeFileSync(path.join(__dirname, "../bundle.js"), 
				cxApiSource + "\n" + experimentsBundle
				);
		});
	} else {
		fs.writeFileSync(path.join(__dirname, "../bundle.js"), 
			experimentsBundle
			);
	}
});

