var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.setShowPrintMargin(false);
editor.session.setMode("ace/mode/python");
editor.setValue("command /example:\n" + 
                "    trigger:\n        message \"This is an example message" + 
                "\"");
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
