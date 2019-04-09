var editor = ace.edit("editor");
editor.setTheme("ace/theme/TextMate"); //twilight, TextMate
editor.setShowPrintMargin(false);
editor.session.setMode("ace/mode/python");
editor.setValue(
  `command /id:
	description: Find the ID of the item you're holding
	trigger:
		message "You're holding a %type of tool% whose ID is %id of tool%."`
);
editor.clearSelection();
$('#export').click(function(){
  create('skript.sk',editor.getValue())
});
$('#import').click(function(){
  
});
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