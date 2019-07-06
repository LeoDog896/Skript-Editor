/*

*/
/* global ace, Mode, Cookies, define, LZString */
if (location.protocol != "https:") location.protocol = "https:";
function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}
let errorRegs = [
  {reg: /\scommand [/\w]+:/g, msg: "Declerations of commands should not have whitespaces behind them"},
  {reg: /teleport (the |)(player|attacker|victim|loop-entity|loop-player|) (to|below|above|next to) (-|)\d+(,|) (-|)\d+(,|) (-|)\d+/g, msg: "Use vector(x, y, z) instead of x, y, z"}
]
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
});
editor.clearSelection();
$('#export').click(function(){
  create('skript.sk',editor.getValue())
});
setTimeout(function(){
    window.parseReady = true;
},2000);
editor.getSession().on('change', function() {
  $("#bytes").html(byteCount(editor.getValue()))
  $("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
  Cookies.set('data',editor.getValue());
  location.hash = LZString.compressToBase64(editor.getValue())
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
          if (txt.match(data.reg)) {
            annData.push({
              row: index,
              column: 0,
              text: data.msg,
              type: data.type ? data.type : "error"
            })
          }
        })
      })
      editor.getSession().setAnnotations(annData)
    }
  }
});
$(function(){
  if (Cookies.get('data') && !location.hash) editor.setValue(Cookies.get('data'));
  if (location.hash) editor.setValue(LZString.decompressFromBase64(decodeURI(location.hash.substring(1))))
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
  var reader = new FileReader();
  reader.readAsText(tempFile, "UTF-8");
  reader.onload = function (evt) {
    editor.setValue(evt.target.result);
  }
  
});
$(".file").click(function(){  
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

$("#customize").click(() => $(".modal")[0].classList.toggle("show-modal"))
$(".close-button").click(() => document.querySelector(".modal").classList.toggle("show-modal"))
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   editor.setValue(reader.result)
});
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});