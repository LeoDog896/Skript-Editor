var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.setShowPrintMargin(false);
editor.session.setMode("ace/mode/python");
editor.setValue("command /example:\n" + 
                "    trigger:\n        message \"This is an example message" + 
                "\"");
editor.clearSelection();
$('#compile').click(function(){
  
})