var fs = require("fs");
var path = require("path")
var browserify = require("browserify");

var useGacx = false;
var experiment = {};

experiment.files = fs.readdirSync(path.join(__dirname, "../experiments"))
.filter(function(file) {
	return path.extname(file) === '.js' && !/__index\.js$/.test(file);  
}).map(function(file) {
	return path.join("../experiments", file);
});
experiment.paths = experiment.files.map(function(file) {
	return file.replace(/\.js$/, "");
});
experiment.modules = experiment.paths.map(function(path) {
	return require(path);
});
experiment.gacx_ids = experiment.modules.filter(function(experiment) {
	return experiment.gacx;
}).map(function(experiment){
	useGacx = true;
	return experiment.id;
});

var indexFile = path.join(__dirname, "../experiments/__index.js");
fs.writeFileSync(indexFile, 
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
	console.log("experiments bundled");
	fs.unlinkSync(indexFile);
	var uglify = require("uglifyjs");

	if (useGacx) {
		var gacx = require("./gacx");
		gacx.build(experiment.gacx_ids, function(cxApiSource) {
		console.log("patched google cx api");
			fs.writeFileSync(path.join(__dirname, "../bundle.js"), 
				cxApiSource + "\n" + experimentsBundle
				);
			console.log("bundle.js saved");
		});
	} else {
		fs.writeFileSync(path.join(__dirname, "../bundle.js"), 
			experimentsBundle
			);
		console.log("bundle.js saved");
	}
});

