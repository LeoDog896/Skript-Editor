/* global ace, Mode */
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
editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });
editor.clearSelection();
$('#export').click(function(){
  create('skript.sk',editor.getValue())
});
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
    $(".editor").css("margin-left","160px");
  } else {
    $("#editor").css("margin-left","0px");
    $(".header").css("margin-left","0px");
  }
})
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   editor.setValue(reader.result)
});