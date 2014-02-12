
var experiments = require("../experiments/__index");

var log = (typeof console !== "undefined" && typeof console.log === "function") ? 
	function() { return console.log.apply(console, arguments); }: function(){};

var browserSupported = typeof document !== "undefined" && 
	document.querySelectorAll && Array.prototype.forEach;
if (!browserSupported)
{
	log("[Mutagen] browser not supported");
} else {
	for (var name in experiments) {
		var experiment = experiments[name];
		var variation = 0;
		try {
			if (typeof experiment.chooseVariation === "function") {
				variation = experiment.chooseVariation();
			} else if (experiment.gacx) {
				variation = cxApi.chooseVariation(experiment.id);
			}
		} catch (err) {
			log("[Mutagen] error choosing variation, experiment: " + name);
			continue;
		}
		var variate = experiment.variations && experiment.variations[variation];
		if (typeof variate !== "function") continue;
		log("[Mutagen] experiment: " + name + ", variation: " + variation);
		try {
			variate(experiment);
			log("[Mutagen] applied");
		} catch (error) {
			log("[Mutagen] error while applying experiment: " + name + ", variation: " + variation);
			log(error);
			log(error.stack);
		}
	}
}
