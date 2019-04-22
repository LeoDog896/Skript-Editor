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
editor.session.setMode("ace/mode/python"); //ace/mode/python
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
    $("#editor").css("width",document.width - 160)
  } else {
    $("#editor").css("margin-left","0px");
    $(".header").css("margin-left","0px");
    $("#editor").css("width",document.width)
  }
})
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   editor.setValue(reader.result)
});