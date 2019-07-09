/* global ace, Mode, Cookies, define, LZString, codeBlastAce */
if (location.protocol != "https:") location.protocol = "https:";
let byteCount = s => encodeURI(s).split(/%..|./).length - 1;
let errorRegs = [
  {reg: /\s+(command|function) .+:/g, msg: "Declerations of commands & functions should not have whitespaces behind them"},
  {reg: /^(trigger|description|cooldown|permission)([/\w]+|):([/\w+]|)/g, msg: "Command properties should have whitespaces behind them"},
  {reg: /teleport (the |)(player|attacker|victim|loop-entity|loop-player|) (to|below|above|next to) (-|)\d+(,|) (-|)\d+(,|) (-|)\d+/g, msg: "Use vector(x, y, z) instead of x, y, z"},
  {reg: /^{_\w+}/g, msg: "You cant use temp variables unless its in an event!"},
  {reg: /^format slot \d+ of [\w\s]+/g, msg: "We reccomend using TuSKe instead of skQuery GUI"}
]
function create(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
var editor = ace.edit("editor");
codeBlastAce(ace)
editor.setShowPrintMargin(false);
editor.session.setMode("ace/mode/skript");
editor.setValue(
  `command /id: # this is a comment
	description: Find the ID of the item you're holding
	trigger:
		message "You're holding a %type of tool% whose ID is %id of tool%."`
);
const { Split } = require('ace/split');
editor.setOptions({
  useSoftTabs: false,
  enableLiveAutocompletion: true
});
$('#export').click(() => create('skript.sk',editor.getValue()));
$("#theme").change(() => {
  editor.setTheme("ace/theme/" + $("#theme").val())
  Cookies.set('theme', $("#theme").val())
})
setTimeout(() => window.parseReady = true, 2000);
editor.getSession().on('change', function() {
  $("#bytes").html(byteCount(editor.getValue()))
  $("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
  Cookies.set('data',editor.getValue());
  if (window.parseReady) {
    editor.getSession().setAnnotations([])
    if (editor.getValue() == "") {
      editor.getSession().setAnnotations([{
        row: 0,
        column: 0,
        text: "File is empty",
        type: "warning"
      }]);
    } else {
      let annData = [];
      editor.getValue().split("\n").forEach((txt, index) => {
        errorRegs.forEach(data => {
          if (txt.match(data.reg)) annData.push({row: index, column: 0, text: data.msg, type: data.type ? data.type : "error"})
        })
      })
      editor.getSession().setAnnotations(annData)
    }
  }
});
$(() => {
  if (Cookies.get('data') && !location.hash) editor.setValue(Cookies.get('data'));
  if (Cookies.get('theme')) editor.setTheme("ace/theme/" + Cookies.get('theme'))
  if (location.hash) editor.setValue(LZString.decompressFromBase64(decodeURI(location.hash.substring(1))))
  editor.clearSelection();
  $(`[value=${editor.getTheme().replace("ace/theme/","")}]`).prop('selected', true);
})
$("#bytes").html(byteCount(editor.getValue()))
$("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
$('#import').click(() => document.getElementById("fileElem").click());
$("#fileElem").change(function(e){
  let tempFile = e.target.files[0];
  var reader = new FileReader();
  reader.readAsText(tempFile, "UTF-8");
  reader.onload = evt => editor.setValue(evt.target.result);
});
$("#file").click(function(){  
  $(".sidenav").toggle();
  if ($(".sidenav").is(":visible")){
    $(".header").css("margin-left","160px");
    $("#editor").css("margin-left","160px");
    $("#editor").css("width",window.innerWidth - 160);
  } else {
    $("#editor").css("margin-left","0px");
    $(".header").css("margin-left","0px");
    $("#editor").css("width",window.innerWidth);
  }
})
$("#hash").click(() => location.hash = LZString.compressToBase64(editor.getValue()))
$("#customize").click(() => $(".themes-modal").addClass("show-modal"))
$("#options").click(() => $(".options-modal").addClass("show-modal"))
$("#blast-o").change(() => $("#blast-o").is(':checked') ? editor.setOption('blastCode', { effect: 1 }) : editor._codeBlast.destroy())
$("#soft-o").change(() => $("#soft-o").is(':checked') ? editor.setOption('useSoftTabs', true) : editor.setOption('useSoftTabs', false))
$("#soft-s").change(() => editor.setOption("tabSize", $("#soft-s").val()))
$(".close-button").click(() => $(".modal").removeClass("show-modal"))