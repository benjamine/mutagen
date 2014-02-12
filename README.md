mutagen
=======

Simple tool to experiment with multiple variations of websites.

- simple setup, to add an experiments just create a .js file on /experiments folder
- supports Google Analytics Content Experiments for choosing variations, but a custom choosing function can be specified on a per-experiment basis.
- if GACX is used, cxApi is patched to support multiple experiments on a page.
- bundles cxApi (if used), experiments and variations implementation code in a single and minified file (browserify + uglifyjs).
- (optional) minimalistic module for DOM manipulation useful when writing variations.

Usage
---------

Check the [experiments folder README](experiments/README.md)