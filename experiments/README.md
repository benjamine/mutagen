Experiments
==============

This folders contains the implementation of all the active experiments.

How to create an experiment (using Google Analytics Content Experiments)
--------------------------

### 1. Create the experiment on Google Analytics

Go to: https://developers.google.com/analytics/solutions/experiments-client-side#configure

Follow the steps **only** in "Configure the Experiment and Objective in Google Analytics" section.

Copy the experiment id, you'll use it on next steps.

### 2. Create an experiment file

Create a new javascript file in this folder, eg: ```/experiments/kitty-pics.js```, 
include the GACX info, and implement some variations:

``` javascript

// /experiments/kitty-pics.js

// indicates Google Analytics Content Experiments API should be used to choose a variation
exports.gacx = true;

// GACX experiment id
exports.id = "ayx-VOivRJfww_KPbBnPBA";

var dom = require("../src/variations/dom");

exports.variations = {
	1: function() {
	    // add a button to the menu
		dom.htmlAppend(".nav", '<a href="/signup">register now</a>');
	},
	2: function() {
	    // hide any signup button
		dom.hide(".btn-signup");
	},
	3: function() {
	    // lots of kitties
		dom.setAttribute("img", "src", "/images/kitty.jpg");
	}
};

```

#### On variations code

While writing variations please consider:

- this will load very early on the page, so no js frameworks will be available, as in the example you can use a variations/ lib to perform most common DOM manipulations useful for variations. check out: http://youmightnotneedjquery.com/
- to avoid overcomplicate experiments, old browsers are excluded from running experiments. Check ```/src/browser.js```, requiring ```Array.prototype.forEach``` means IE9+.
- size is very important here, so if your variation needs lot of code, instead of putting that in the experiment files, do it by injecting <script> or <style> tags to the page with relevant js or css.
- variation ```0``` is reserved for the original state, don't use it unless you want code to be executed when the experiment is inactive or the original variation was chosen (use 1, 2, 3...)

#### Custom variation choosing

You can provide your own method to choose a variation (it will be used instead of GACX):

``` javascript

// /experiments/kitty-pics.js

exports.chooseVariation = function() {
	// harcoded for testing, always choose variation 3
	return 3;
}

```

### 3. Bundling

Once you're ready to deploy you experiment implementation, send a pull requests for your peers to review.

Once it's merged, a CI build will be triggered, this job will regenerate the experiments bundle.js, you can do this manually by running:

```
npm install
node src/index.js
```

this file includes all the experiments and will choose and run a variation for each one when loaded on a browser. 

A copy of google cx api.js will be included with the information for each included experiment. 

Note that this includes the weights for each variation, google recalculates that twice a day (dependening on success rates), so this bundle should be regenerated with that frequency. Hashing can be used to detect when changes occur.

The last step in the CI build is publishing bundle.js file back to a separate github branch, where its http accesible, eg: http://rawgithub.com/benjamine/mutagen/bundle/bundle.js

### 4. Include the bundle

This is a first-time only step.

Include the experiments bundle on the site, the only requirements are:
- load it before any GA event is sent (otherwise events won't be appropiately associated to a variation, and you'll see a console error saying it)
- if variations alter the page visibly (and most likely they will), load it before page render, to avoid snap-in effects.

How to make changes to an experiment
--------------------------

To modify (or remove) an experiment, just edit the experiment file, and send a pull request.

Once the PR is merged, a CI build will rebuild the bundle and it will be picked up by the site automatically.

Depending on cache rules, the whole process should take less than a minute.

Testing an experiment before deploying it
-----------------------------

You can build the experiments bundle locally using:

```
npm install
node src/index.js
```

then add the bundle script manually or run it on any page by copying the file contents and pasting it in a browser console, you can do that to test your bundle right over production pages.

Traceability
-----------------------------

Whenever an experiment is run the browser console will show a message indicating so:

```
[Mutagen] experiment: example1, variation: 1
[Mutagen] applied
[Mutagen] experiment: example2, variation: 2
[Mutagen] applied
```

(if the original variation is chosen, no message will be logged)

Finally to detect the variation chosen by GACX a cookie named ```__utmx``` can be used to determine the chosen variation for each active experiment. On client-side this can be obtained using cxApi (that is included in the bundle):

```
cxApi.getChosenVariation(experimentId); // returns the variation number
```

More details on using cxApi can be found at: https://developers.google.com/analytics/devguides/collection/gajs/experiments#cxjs-methods

