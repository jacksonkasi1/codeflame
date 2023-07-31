const vscode = require('vscode');

function activate(context) {
    var activeEditor = vscode.window.activeTextEditor;
    var decorationsArray = [];

    const kasiDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "#00ff00",
        color: "white"
    });

    function updateDecorations() {
        if (activeEditor) {
            decorationsArray.length = 0;

            const regEx = /\/\/.*?\b(kasi)\b/gi;
            const text = activeEditor.document.getText();
            let match;

            while ((match = regEx.exec(text))) {
                const startPos = activeEditor.document.positionAt(match.index);
                const endPos = activeEditor.document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                decorationsArray.push(decoration);
            }
            activeEditor.setDecorations(kasiDecorationType, decorationsArray);
        } 
    }

    if (activeEditor) {
        updateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            updateDecorations();
        }
    }, null, context.subscriptions);
}

exports.activate = activate;
