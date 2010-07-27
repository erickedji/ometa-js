/*
  Copyright (c) 2007, 2008 Alessandro Warth <awarth@cs.ucla.edu>

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
*/

// This code was adapted from Takashi Yamamiya's Javascript Workspace,
// which you can visit at http://metatoys.org/propella/js/workspace.js

// ---------------------------------------------------------------------------------------------------------------------------

// INSTRUCTIONS: a client page must (1) include something along these lines:

/*
  <body onLoad="$('workspaceForm').onkeydown=onShortCutKey">
    ...
    <form id=workspaceForm>
      <b>Source</b><br>
      <textarea cols=132 rows=24 name=source>...</textarea><br>
      <input type=button value="print it (ctrl+p)" onClick="printIt()">
      <input type=button value="do it (ctrl+d)" onClick="doIt()">
      <br><br>
      <b>Translation</b>
      <br>
      <div id=translation>
        <textarea cols=132 rows=4 name=translation>
        </textArea>
      </div>
      <b>Transcript</b>
      <br>
      <div id=transcript>
        <textarea cols=132 rows=4 name=transcript></textArea>
      </div>
    </form>
    ...
  </body>
*/

// and (2) define its own translateCode function

function translateCode(s) {
  //throw { errorPos: 0 }
  return s
}

// ---------------------------------------------------------------------------------------------------------------------------

function printIt() {
  var result       = evalSelection()
  if (!result)
    return
  
  var output = $('output');
  var getTextContent = function(element) {
    if (Object.isUndefined(element.textContent)) {
      return element.innerText
    }
    return element.textContent
  }
  var separator = '<div style="border-top:1px #ccc solid; margin: 5px;"></div>'
  if (getTextContent(output).strip() === '')
    separator = ''
  $('output').insert(separator +  result)
}

function doIt() {
  var result = evalSelection()
  if (result)
    Editor.focus();
}

function saveIt() { }

/* Get expression from textarea */
function getSource() {
  var text  = Editor.selection()
  if (text === '')
    text = Editor.lineContent(Editor.cursorLine())
  return text
}

function evalSelection() {
  var source = getSource()
  try { $('workspaceForm').translation.value = translateCode(source) }
  catch (e) {
    if (e.errorPos != undefined) {
      var errorPos     = Editor.cursorPosition(true).character + e.errorPos
          errorIndicator     = ">>>"
      var allCode = Editor.getCode();
      var separator = '<div style="border-top:1px #ccc solid; margin: 5px;"></div>'
      Editor.setCode(allCode.substring(0, errorPos) + errorIndicator + allCode.substring(errorPos));
      $('output').insert(separator + 'Parser error (the position is indicated in the code with ">>>")');
    }
    return undefined
  }
  try {
    return " " + eval($('workspaceForm').translation.value);
  } catch (e) {
    alert("Oops!\n\n" + e)
    throw e
  }
}

