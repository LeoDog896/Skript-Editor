/* global define */
define(function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/python").Mode;
var ExampleHighlightRules = require("ace/mode/example_highlight_rules").ExampleHighlightRules;

var Mode = function() {
    this.HighlightRules = ExampleHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    // Extra logic goes here. (see below)
}).call(Mode.prototype);

exports.Mode = Mode;
});