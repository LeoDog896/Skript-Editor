var mode = "txt"
var tglSkTextBlockly = () => {
  $("#blocklyDiv").toggle()
  $("#blocklyArea").toggle()
  $("#editor").toggle()
  Blockly.svgResize(workspace);
  Blockly.resizeSvgContents(workspace)
  onresize();
}

function escapeString(str) {
  str.replace('"', '""')
}

Blockly.Blocks['create_command'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("String")
        .appendField("command");
    this.appendStatementInput("Attributes")
        .setCheck("type")
        .appendField("attributes");
    this.appendStatementInput("BLOCKS")
        .setCheck(null)
        .appendField("on run");
    this.setInputsInline(false);
    this.setColour(65);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['create_command'] = function(block) {
  var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
  var statements_attributes = Blockly.Python.statementToCode(block, 'Attributes');
  var statements_blocks = Blockly.Python.statementToCode(block, 'BLOCKS');
  // TODO: Assemble Python into code variable.
  var code = 'command ' + value_name + ":\n" + statements_attributes + "\t\ntrigger:\n" + statements_blocks;
  return code;
};

Blockly.Blocks['string_split'] = {
  init: function() {
    this.appendValueInput("STRING")
        .setCheck("String");
    this.appendValueInput("SPLITTER")
        .setCheck("String")
        .appendField("split at");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['string_split'] = function(block) {
  var value_string = Blockly.Python.valueToCode(block, 'STRING', Blockly.Python.ORDER_ATOMIC);
  var value_splitter = Blockly.Python.valueToCode(block, 'SPLITTER', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['condition_repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("repeat");
    this.appendValueInput("NAME")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("times");
    this.appendStatementInput("BLOCKS")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['condition_repeat'] = function(block) {
  var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
  var statements_blocks = Blockly.Python.statementToCode(block, 'BLOCKS');
  // TODO: Assemble Python into code variable.
  var code = 'loop ' + value_name + " times:\n" + statements_blocks;
  return code;
};

Blockly.Blocks['event_skript_load'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("On skript load");
    this.appendStatementInput("INFO")
        .setCheck(null);
    this.setColour(65);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['event_skript_load'] = function(block) {
  var statements_info = Blockly.Python.statementToCode(block, 'INFO');
  console.log(statements_info)
  var code = 'on load:\n' + statements_info;
  return code;
};

Blockly.Blocks['broadcast'] = {
  init: function() {
    this.appendValueInput("LABEL")
        .setCheck("String")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldLabelSerializable("broadcast"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(165);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.Python['broadcast'] = function(block) {
  console.log(block)
  var value = Blockly.Python.valueToCode(block,"LABEL",Blockly.Python.ORDER_NONE)
  var code = 'broadcast "' + (value).substring(1, value.length-1) + "\"\n";
  return code;
};


$("#toggleMode").click(() => {
  if (mode == "txt") {
    mode = "block";
    $("#toggleMode").attr("src", "../images/text.svg")
    tglSkTextBlockly()
  } else {
    mode = "txt";
    $("#toggleMode").attr("src", "../images/blockly.svg")
    tglSkTextBlockly()
  }
})
/* global Blockly */
var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
$("#blocklyDiv").hide()
$("#blocklyArea").hide()
var workspace = Blockly.inject(blocklyDiv, {
  media: '../blocks/media/',
  toolbox: document.getElementById('toolbox')
});
var onresize = function(e) {
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
  Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);
Blockly.svgResize(workspace);