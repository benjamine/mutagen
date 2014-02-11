
var superagent = require('superagent');
var agent = superagent.agent();

var getExperimentInfo = function(ids, callback, experimentsInfo, index) {
	index = index || 0;
	var id = ids[index];
	agent.get('https://www.google-analytics.com/cx/api.js?experiment='+id, function(res) {
		var info = /experiments_=(.*);G\.DEFAULT/m.exec(res.text)[1];
		if (!experimentsInfo) {
			experimentsInfo = {};
		}
		experimentsInfo[id] = JSON.parse(info)[id];
		if (index < ids.length - 1) {
			getExperimentInfo(ids, callback, experimentsInfo, index + 1);
		} else {
			callback(experimentsInfo);
		}
	});
}; 

var patch = function(source, experimentsInfo) {
	return source.replace(/experiments_=(.*);G\.DEFAULT/m,
		"experiments_="+JSON.stringify(experimentsInfo)+";G.DEFAULT");
};

var build = function build(experimentIds, callback) {
	agent.get('https://www.google-analytics.com/cx/api.js', function(res){
		var source = res.text;
		getExperimentInfo(experimentIds, function(experimentsInfo) {
			callback(patch(source, experimentsInfo));
		});
	});
};

exports.build = build;