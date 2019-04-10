/* global ace, Mode */
function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}
var editor = ace.edit("editor");
ace.define('ace/mode/custom', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/custom_highlight_rules'], (acequire, exports) => {
  const oop = acequire('ace/lib/oop');
  const TextMode = acequire('ace/mode/text').Mode;
  const CustomHighlightRules = acequire('ace/mode/custom_highlight_rules').CustomHighlightRules;

  oop.inherits(Mode, TextMode); // ACE's way of doing inheritance

  exports.Mode = Mode; // eslint-disable-line no-param-reassign
});

// This is where we really create the highlighting rules
ace.define('ace/mode/custom_highlight_rules', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports) => {
  const oop = acequire('ace/lib/oop');
  const TextHighlightRules = acequire('ace/mode/python_highlight_rules').TextHighlightRules;

  const CustomHighlightRules = function CustomHighlightRules() {
    this.$rules = new TextHighlightRules().getRules(); // Use Text's rules as a base
  };

  oop.inherits(CustomHighlightRules, TextHighlightRules);

  exports.CustomHighlightRules = CustomHighlightRules;
});
//editor.setTheme("ace/theme/twilight");
editor.setShowPrintMargin(false);
editor.session.setMode("ace/mode/python");
editor.setValue(
  `command /id:
	description: Find the ID of the item you're holding
	trigger:
		message "You're holding a %type of tool% whose ID is %id of tool%."`
);
editor.clearSelection();
editor.getSession().on('change', function() {
  $("#bytes").html(byteCount(editor.getValue()))
  $("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
});
$("#bytes").html(byteCount(editor.getValue()))
$("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
$('#export').click(function(){
  create('skript.sk',editor.getValue())
});
$('#import').click(function(){
  
});
$(".files").click(function(){
  $(".sidenav").toggle();
})
function create(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = document.getElementById('export');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
    }
}