const vscode = require("vscode");
const { schema } = require("./schema");

function activate(context) {
  let activeEditor = vscode.window.activeTextEditor;

  const decorationTypes = schema.keys.map((setting) => {
    const {
      key,
      bgColor,
      color,
      highlightBg = true,
      highlightWordsAll = false,
      highlightLine = false,
      highlightLineBg = false,
    } = setting;

    return {
      key,
      highlightWordsAll,
      decoration: vscode.window.createTextEditorDecorationType({
        backgroundColor: highlightBg ? bgColor : undefined,
        color: color ? color : undefined,
        isWholeLine: highlightLine,
      }),
    };
  });

  function createRegexPattern(keyword, highlightWordsAll) {
    if (highlightWordsAll) {
      return `.*${keyword}.*`;
    }
    return `\\b${keyword}\\b`;
  }

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    const text = activeEditor.document.getText();
    decorationTypes.forEach(({ key, decoration, highlightWordsAll }) => {
      const regexPattern = createRegexPattern(key, highlightWordsAll);

      const decorationsArray = [];
      const lines = text.split("\n");
      lines.forEach((lineText, lineNumber) => {
        if (
          lineText.includes("//") ||
          lineText.includes("/*") ||
          lineText.includes("*/")
        ) {
          const regEx = new RegExp(regexPattern, "g");
          let match;
          while ((match = regEx.exec(lineText))) {
            const startPos = new vscode.Position(lineNumber, match.index);
            const endPos = new vscode.Position(
              lineNumber,
              match.index + match[0].length,
            );
            const decorationObj = {
              range: new vscode.Range(startPos, endPos),
              hoverMessage: match[0],
            };
            decorationsArray.push(decorationObj);
          }
        }
      });
      activeEditor.setDecorations(decoration, decorationsArray);
    });
  }

  if (activeEditor) {
    updateDecorations();
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        updateDecorations();
      }
    },
    null,
    context.subscriptions,
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        updateDecorations();
      }
    },
    null,
    context.subscriptions,
  );
}

exports.activate = activate;
