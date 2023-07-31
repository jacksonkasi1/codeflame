const vscode = require('vscode');

function activate(context) {
    var activeEditor = vscode.window.activeTextEditor;

    const schema = {
        keys: [
            {
                key: 'kasi',
                bgColor: '#fff',
                color: '#FF0000',
                highlightBg: true,
                highlightWordsAll: true,
                highlightLine: true,
                highlightLineBg: true
            },
            {
                key: 'kasi2',
                bgColor: '#808080',
                color: '#adff2f',
                highlightBg: true,
                highlightWordsAll: true,
                highlightLine: false,
                highlightLineBg: false,
                outline: true
            }
        ]
    }

    const decorationTypes = schema.keys.map((setting) => {
        const { key, bgColor, color, highlightBg, highlightWordsAll, highlightLine, highlightLineBg } = setting;
        return {
            key,
            highlightWordsAll,
            decoration: vscode.window.createTextEditorDecorationType({
                backgroundColor: highlightBg ? bgColor : undefined,
                color: highlightWordsAll ? color : undefined,
                isWholeLine: highlightLine,
                outline: highlightLineBg ? '1px solid #adff2f' : undefined
            })
        };
    });

    function createRegexPattern(keyword, highlightWordsAll){
        return highlightWordsAll ? `\\b${keyword}\\b` : `${keyword}`; // Adjust for whether we should match all or only standalone
    }

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }

        const text = activeEditor.document.getText();
        decorationTypes.forEach(({ key, decoration, highlightWordsAll }) => {
            const regexPattern = createRegexPattern(key, highlightWordsAll);
            const regEx = new RegExp(regexPattern, 'g');
            const decorationsArray = [];

            let match;
            while (match = regEx.exec(text)) {
                const startPos = activeEditor.document.positionAt(match.index);
                const endPos = activeEditor.document.positionAt(match.index + match[0].length);
                const decorationObj = { range: new vscode.Range(startPos, endPos), hoverMessage: match[0] };
                decorationsArray.push(decorationObj);
            }
            activeEditor.setDecorations(decoration, decorationsArray);
        });
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

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            updateDecorations();
        }
    }, null, context.subscriptions);
}

exports.activate = activate;
