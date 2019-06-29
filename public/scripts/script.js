/*

*/
/* global ace, Mode, Cookies, define, LZString */
async function hastebin(input){

    const url = "https://hastebin.com"
    const extension = "py";

    const res = await fetch(`${url}/documents`, {
        method: "POST",
        body: input,
        headers: { "Content-Type": "text/plain", 'Access-Control-Allow-Origin': '*',}
    });

    if (!res.ok) throw new Error(res.statusText);

    const { key } = await res.json();

    return `${url}/${key}.${extension}`;
};
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
  location.hash = LZString.compressToUTF16(editor.getValue())
});
$(function(){
  if (Cookies.get('data') && !location.hash) editor.setValue(Cookies.get('data'));
  if (location.hash) editor.setValue(LZString.decompressFromUTF16(decodeURI(location.hash.substring(1))))
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