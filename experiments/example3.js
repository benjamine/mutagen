
var dom = require("../src/variations/dom");

exports.chooseVariation = function() {
	return Math.floor(Math.random()*4);
};

exports.variations = {
	1: function() {
		dom.htmlAppend(".nav", '<a href="/signup">register now</a>');
	},
	2: function() {
		dom.hide(".btn-signup");
	},
	3: function() {
		dom.setAttribute("img", "src", "http://lh4.ggpht.com/-UGySRGyBnAc/SclGEU-NOPI/AAAAAAAGTSY/2OR8NbkDrKY/kitten-in-cup.jpg");
	}
};
