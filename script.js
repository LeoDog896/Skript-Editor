/* global define */
ace.define('ace/mode/example_highlight_rules', ["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module){
"use strict";

var oop = require("ace/lib/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var PythonHighlightRules = function() {

    var keywords = (
        "message|broadcast|ban|unban|set|add|wait|halt|remove|reset|subtract|clear|delete|dye|color|colour|let|make|execute|format"
    );

    var builtinConstants = (
        "true|false|second|seconds|minecraft|minute|minute|hour|hours"
    );

    var builtinFunctions = (
        "stop|cancel|the|event"
    );
    //var futureReserved = "";
    var keywordMapper = this.createKeywordMapper({
        "invalid.deprecated": "debugger",
        "support.function": builtinFunctions,
        "variable.language": "self|cls",
        "constant.language": builtinConstants,
        "keyword": keywords
    }, "identifier");

    var strPre = "[uU]?";
    var strRawPre = "[rR]";
    var strFormatPre = "[fF]";
    var strRawFormatPre = "(?:[rR][fF]|[fF][rR])";
    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var octInteger = "(?:0[oO]?[0-7]+)";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + "|" + binInteger + ")";

    var exponent = "(?:[eE][+-]?\\d+)";
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var exponentFloat = "(?:(?:" + pointFloat + "|" + intPart + ")" + exponent + ")";
    var floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";

    var stringEscape = "\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "#.*$"
        }, {
            token : "string",           // multi line """ string start
            regex : strPre + '"{3}',
            next : "qqstring3"
        }, {
            token : "string",           // " string
            regex : strPre + '"(?=.)',
            next : "qqstring"
        }, {
            token : "string",           // multi line ''' string start
            regex : strPre + "'{3}",
            next : "qstring3"
        }, {
            token: "string",
            regex: strRawPre + '"{3}',
            next: "rawqqstring3"
        }, {
            token: "string", 
            regex: strRawPre + '"(?=.)',
            next: "rawqqstring"
        }, {
            token: "string",
            regex: strRawPre + "'{3}",
            next: "rawqstring3"
        }, {
            token: "string",
            regex: strRawPre + "'(?=.)",
            next: "rawqstring"
        }, {
            token: "string",
            regex: strFormatPre + '"{3}',
            next: "fqqstring3"
        }, {
            token: "string",
            regex: strFormatPre + '"(?=.)',
            next: "fqqstring"
        }, {
            token: "string",
            regex: strFormatPre + "'{3}",
            next: "fqstring3"
        }, {
            token: "string",
            regex: strFormatPre + "'(?=.)",
            next: "fqstring"
        },{
            token: "string",
            regex: strRawFormatPre + '"{3}',
            next: "rfqqstring3"
        }, {
            token: "string",
            regex: strRawFormatPre + '"(?=.)',
            next: "rfqqstring"
        }, {
            token: "string",
            regex: strRawFormatPre + "'{3}",
            next: "rfqstring3"
        }, {
            token: "string",
            regex: strRawFormatPre + "'(?=.)",
            next: "rfqstring"
        }, {
            token: "keyword.operator",
            regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|@|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token: "punctuation",
            regex: ",|:|;|\\->|\\+=|\\-=|\\*=|\\/=|\\/\\/=|%=|@=|&=|\\|=|^=|>>=|<<=|\\*\\*="
        }, {
            token: "paren.lparen",
            regex: "[\\[\\(\\{]"
        }, {
            token: "paren.rparen",
            regex: "[\\]\\)\\}]"
        }, {
            token: "text",
            regex: "\\s+"
        }, {
            include: "constants"
        }],
        "qqstring": [{
            token: "constant.language.escape",
            regex: stringEscape
        }, {
            token: "string",
            regex: "\\\\$",
            next: "qqstring"
        }, {
            token: "string",
            regex: '"|$',
            next: "start"
        }, {
            defaultToken: "string"
        }],
        "qstring": [{
            token: "constant.language.escape",
            regex: stringEscape
        }, {
            token: "string",
            regex: "\\\\$",
            next: "qstring"
        }, {
            token: "string",
            regex: "'|$",
            next: "start"
        }, {
            defaultToken: "string"
        }],
        "rawqqstring3": [{
            token: "string", // multi line """ string end
            regex: '"{3}',
            next: "start"
        }, {
            defaultToken: "string"
        }],
        "rawqstring3": [{
            token: "string",  // multi line ''' string end
            regex: "'{3}",
            next: "start"
        }, {
            defaultToken: "string"
        }],
        "rawqqstring": [{
            token: "string",
            regex: "\\\\$",
            next: "rawqqstring"
        }, {
            token: "string",
            regex: '"|$',
            next: "start"
        }, {
            defaultToken: "string"
        }],
        "rawqstring": [{
            token: "string",
            regex: "\\\\$",
            next: "rawqstring"
        }, {
            token: "string",
            regex: "'|$",
            next: "start"
        }, {
            defaultToken: "string"
        }],
        "fqqstring3": [{
            token: "constant.language.escape",
            regex: stringEscape
        }, {
            token: "string", // multi line """ string end
            regex: '"{3}',
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "fqstring3": [{
            token: "constant.language.escape",
            regex: stringEscape
        }, {
            token: "string",  // multi line ''' string end
            regex: "'{3}",
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "fqqstring": [{
            token: "constant.language.escape",
            regex: stringEscape
        }, {
            token: "string",
            regex: "\\\\$",
            next: "fqqstring"
        }, {
            token: "string",
            regex: '"|$',
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "fqstring": [{
            token: "constant.language.escape",
            regex: stringEscape
        }, {
            token: "string",
            regex: "'|$",
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "rfqqstring3": [{
            token: "string", // multi line """ string end
            regex: '"{3}',
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "rfqstring3": [{
            token: "string",  // multi line ''' string end
            regex: "'{3}",
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "rfqqstring": [{
            token: "string",
            regex: "\\\\$",
            next: "rfqqstring"
        }, {
            token: "string",
            regex: '"|$',
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "rfqstring": [{
            token: "string",
            regex: "'|$",
            next: "start"
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fqstringParRules"
        }, {
            defaultToken: "string"
        }],
        "fqstringParRules": [{//TODO: nested {}
            token: "paren.lparen",
            regex: "[\\[\\(]"
        }, {
            token: "paren.rparen",
            regex: "[\\]\\)]"
        }, {
            token: "string",
            regex: "\\s+"
        }, {
            token: "string",
            regex: "'(.)*'"
        }, {
            token: "string",
            regex: '"(.)*"'
        }, {
            token: "function.support",
            regex: "(!s|!r|!a)"
        }, {
            include: "constants"
        },{
            token: 'paren.rparen',
            regex: "}",
            next: 'pop'
        },{
            token: 'paren.lparen',
            regex: "{",
            push: "fqstringParRules"
        }],
        "constants": [{
            token: "constant.numeric", // imaginary
            regex: "(?:" + floatNumber + "|\\d+)[jJ]\\b"
        }, {
            token: "constant.numeric", // float
            regex: floatNumber
        }, {
            token: "constant.numeric", // long integer
            regex: integer + "[lL]\\b"
        }, {
            token: "constant.numeric", // integer
            regex: integer + "\\b"
        }, {
            token: ["punctuation", "function.support"],// method
            regex: "(\\.)([a-zA-Z_]+)\\b"
        }, {
            token: keywordMapper,
            regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }]
    };
    this.normalizeRules();
  
};

oop.inherits(PythonHighlightRules, TextHighlightRules);

exports.SkriptHighlightRules = PythonHighlightRules;
});
ace.define('ace/mode/example', ["require","exports","module","ace/lib/oop","ace/mode/python","ace/mode/example_highlight_rules"], function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/python").Mode;
var ExampleHighlightRules = require("ace/mode/example_highlight_rules").SkriptHighlightRules;

var Mode = function() {
    this.HighlightRules = ExampleHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    // Extra logic goes here. (see below)
}).call(Mode.prototype);

exports.Mode = Mode;
});

/* global ace, Mode, Cookies */
if (location.protocol != "https:") location.protocol = "https:";
function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}
function create(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

var editor = ace.edit("editor");
//editor.setTheme("ace/theme/twilight");
editor.setShowPrintMargin(false);
editor.session.setMode("ace/mode/example"); //ace/mode/python
editor.setValue(
  `command /id: # this is a comment
	description: Find the ID of the item you're holding
	trigger:
		message "You're holding a %type of tool% whose ID is %id of tool%."`
);
editor.setOptions({
  tabSize: 4,
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true
});
editor.clearSelection();
$('#export').click(function(){
  create('skript.sk',editor.getValue())
});
editor.getSession().on('change', function() {
  $("#bytes").html(byteCount(editor.getValue()))
  $("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
  Cookies.set('data',editor.getValue());
});
$(function(){
  if (Cookies.get('data')) editor.setValue(Cookies.get('data'));
})
$("#bytes").html(byteCount(editor.getValue()))
$("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
var fileElem = document.getElementById("fileElem");
$('#import').click(function(){
  if (fileElem) {
    fileElem.click();
  }
});
$("#fileElem").change(function(e){
  let tempFile = e.target.files[0];
  
});
$(".file").click(function(){  
  $(".sidenav").toggle();
  if ($(".sidenav").is(":visible")){
    $(".header").css("margin-left","160px");
    $("#editor").css("margin-left","160px");
    $("#editor").css("width",document.width - 160);
  } else {
    $("#editor").css("margin-left","0px");
    $(".header").css("margin-left","0px");
    $("#editor").css("width",document.width);
  }
})
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   editor.setValue(reader.result)
});