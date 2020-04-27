const path          = require("path");

const sass          = require("postcss-node-sass");
const stripcomments = require("postcss-strip-inline-comments");
const autoprefixer  = require("autoprefixer");
const postcss       = require("postcss");
const rgbafallback  = require("postcss-color-rgba-fallback");
const cssgrace      = require("cssgrace");
const cssnano       = require("cssnano");
const pixelround    = require("postcss-round-subpixels")
const assets        = require("postcss-assets")

// eslint-disable-next-line no-unused-vars
// const colorblind    = require("postcss-colorblind");

module.exports = async function(data) {
	return await postcss()
		.use(stripcomments)
		.use(sass({ includePaths: [path.join(__dirname, "./../lib/styles")] }))
		.use(autoprefixer)
		.use(rgbafallback)
		.use(cssgrace)
		.use(cssnano({ preset: "default" }))
		.use(pixelround)
		.use(assets({loadPaths: ['images/']}))
		// .use(colorblind({method: "deuteranopia"}))
		.process(data);
};