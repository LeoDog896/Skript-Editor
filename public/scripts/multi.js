/* global ace, Mode, Cookies, define, LZString, codeBlastAce, Toast, io */
let isReadyShort = true;
setInterval(() => isReadyShort = true, 5000)
console.log(location.hash)
let byteCount = s => encodeURI(s).split(/%..|./).length - 1;
let errorRegs = [
  {reg: /\s+(command|function) .+:/g, msg: "Declerations of commands & functions should not have whitespaces behind them"},
  {reg: /^(trigger|description|cooldown|permission)([/\w]+|):([/\w+]|)/g, msg: "Command properties should have whitespaces behind them"},
  {reg: /teleport (the |)(player|attacker|victim|loop-entity|loop-player|) (to|below|above|next to) (-|)\d+(,|) (-|)\d+(,|) (-|)\d+/g, msg: "Use vector(x, y, z) instead of x, y, z"},
  {reg: /^{_\w+}/g, msg: "You cant use temp variables unless its in an event/command!"},
  {reg: /^(\s|)+format slot \d+ of [\w\s]+/g, msg: "We reccomend using TuSKe instead of skQuery GUI", type: "warning"}
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
function copyTextToClipboard(text) {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text)
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
editor.setOptions({
  useSoftTabs: false,
  enableLiveAutocompletion: true
});
var langTools = ace.require('ace/ext/language_tools');
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
  let socket = io();
  socket.on("userLogin", () => {
    new Toast({message: 'A user logged in!'});
  })
  
  socket.on("userDisconnect", () => {
    new Toast({message: "A user disconnected!"})
  })
  if (Cookies.get('data') && !location.hash) editor.setValue(Cookies.get('data'));
  if (Cookies.get('theme')) editor.setTheme("ace/theme/" + Cookies.get('theme'))
  setTimeout(() =>Cookies.get("blastCode") ? editor.setOption('blastCode', { effect: 1 }) : editor._codeBlast.destroy(), 200)
  if (Cookies.get("autocomplete")) editor.setOption("enableLiveAutocompletion", Cookies.get('autocomplete'))
  if (location.hash) editor.setValue(LZString.decompressFromBase64(decodeURI(location.hash.substring(1))))
  editor.clearSelection();
  $(`[value=${editor.getTheme().replace("ace/theme/","")}]`).prop('selected', true);
})
$("#bytes").html(byteCount(editor.getValue()))
$("#lines").html(editor.getValue().split(/\r\n|\r|\n/).length);
$('#import').click(() => document.getElementById("fileElem").click());

$("#link").click(() => {
  if (!isReadyShort) return;
  isReadyShort = false
  $.ajax({
    type: "POST",
    url: "/shorturl",
    data: {data: LZString.compressToBase64(editor.getValue())},
    success: function(data) {
      let toaster = new Toast({
        message: "Link: https://skript-editor.glitch.me/" + data.url,
        type: "success",
        customButtons: [
          {
            text: "Copy",
            onClick: function() {
              copyTextToClipboard("https://skript-editor.glitch.me/" + data.url)
              toaster._close()
            }
          }
        ]
      })
    }
  });
})

$("#share").click(() => {
  if (!isReadyShort) return;
  isReadyShort = false
  $.ajax({
    type: "POST",
    url: "/shareurl",
    data: {data: LZString.compressToBase64(editor.getValue())},
    success: function(data) {
      let toaster = new Toast({
        message: "Link: https://skript-editor.glitch.me/" + data.url,
        type: "success",
        customButtons: [
          {
            text: "Copy",
            onClick: function() {
              copyTextToClipboard("https://skript-editor.glitch.me/" + data.url)
              toaster._close()
            }
          }
        ]
      })
    }
  });
})


$("#customize").click(() => $(".themes-modal").addClass("show-modal"))
$("#options").click(() => $(".options-modal").addClass("show-modal"))
$("#blast-o").change(() => {
  $("#blast-o").is(':checked') ? editor.setOption('blastCode', { effect: 1 }) : editor._codeBlast.destroy()
  Cookies.set('blastCode', $("#blast-o").is(':checked'))
})
$("#soft-o").change(() => $("#soft-o").is(':checked') ? editor.setOption('useSoftTabs', true) : editor.setOption('useSoftTabs', false))
$("#autocomplete-o").change(() => {
  editor.setOption("enableLiveAutocompletion", $("#autocomplete-o").is(':checked'))
  Cookies.set('autocomplete', $("#autocomplete-o").is(':checked'))
})
$("#soft-s").change(() => editor.setOption("tabSize", $("#soft-s").val()))
$(".close-button").click(() => $(".modal").removeClass("show-modal"))
$("#discord").click(() => window.open("https://discord.gg/ukEwAAC"))


// Block stuff
console.log("%cStop!", "color: #F00; font-size: 30px; -webkit-text-stroke: 1px black; font-weight:bold")
console.log("If your going to put something inside here, only do it if you know what your doing!")