
// some dom manipulation functions useful to implement variations
// based on http://youmightnotneedjquery.com/ (using IE9+)

var each = function(selector, fn) {
	var elements = document.querySelectorAll(selector);
	Array.prototype.forEach.call(elements, fn);
};

exports.each = each;

exports.hide = function(selector) {
	each(selector, function(el, i) {
		el.style.display = 'none';
	});
};

exports.show = function(selector) {
	each(selector, function(el, i) {
		el.style.display = '';
	});
};

var insertHtml = function(el, where, htmlString) {
	return el.insertAdjacentHTML(where, htmlString);
};

exports.htmlBefore = function(selector, htmlString) {
	each(selector, function(el, i) {
		insertHtml(el, 'beforestart', htmlString);
	});
};

exports.htmlAfter = function(selector, htmlString) {
	each(selector, function(el, i) {
		insertHtml(el, 'afterend', htmlString);
	});
};

exports.htmlAppend = function(selector, htmlString) {
	each(selector, function(el, i) {
		insertHtml(el, 'beforeend', htmlString);
	});
};

exports.htmlPrepend = function(selector, htmlString) {
	each(selector, function(el, i) {
		insertHtml(el, 'afterstart', htmlString);
	});
};

exports.setAttribute = function(selector, name, value) {
	each(selector, function(el, i) {
		el.setAttribute(name, value);
	});
};
