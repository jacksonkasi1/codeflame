// const vscode = require('vscode');

// function activate(context) {
//     var activeEditor = vscode.window.activeTextEditor;
    
//     const schema = {
//         keys: [
//             {
//                 key: 'kasi',
//                 bgColor: '#fff',
//                 color: '#FF0000',
//                 // highlightBg: false,
//                 highlightWordsAll: true,
//                 highlightLine: true,
//                 highlightLineBg: true
//             },
//             {
//                 key: 'kasi2',
//                 bgColor: '#808080',
//                 color: '#adff2f',
//                 highlightBg: true,
//                 highlightWordsAll: true,
//                 highlightLine: true,
//                 highlightLineBg: true
//             }
//         ]
//     }

//     // Create a decoration type for each key in the schema
//     const decorationTypes = schema.keys.map(item => {
//         return {
//           key: item.key,
//           type: vscode.window.createTextEditorDecorationType({
//             backgroundColor: item.highlightBg ? item.bgColor : 'transparent',
//             color: item.color
//           })
//         };
//     });

//     function updateDecorations() {
//         if (!activeEditor) return;

//         // Set decorations for each type
//         decorationTypes.forEach(decoration => {
//           const matches = [];
//           const regEx = new RegExp(`\\b${decoration.key}\\b`, 'ig');
//           const text = activeEditor.document.getText();
//           let match;
    
//           while ((match = regEx.exec(text))) {
//             const startPos = activeEditor.document.positionAt(match.index);
//             const endPos = activeEditor.document.positionAt(match.index + match[0].length);
//             const range = { range: new vscode.Range(startPos, endPos) };
//             matches.push(range);
//           }
    
//           activeEditor.setDecorations(decoration.type, matches);
//         });
//      }

//     if (activeEditor) updateDecorations();

//     // Handles changing editors
//     vscode.window.onDidChangeActiveTextEditor(editor => {
//         activeEditor = editor;
//         if (editor) updateDecorations();
//     }, null, context.subscriptions);

//     // Handles edits
//     vscode.workspace.onDidChangeTextDocument(event => {
//         if (activeEditor && event.document === activeEditor.document) updateDecorations();
//     }, null, context.subscriptions);
// }

// exports.activate = activate;


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
                highlightBg: false,
                highlightWordsAll: true,
                highlightLine: true,
                highlightLineBg: true
            }
        ]
    }

    // Generate decoration types for each keyword in the schema
    const decorationTypes = schema.keys.map((setting) => {
        const { key, bgColor, color, highlightBg } = setting;
        return {
            key,
            decoration: vscode.window.createTextEditorDecorationType({
                backgroundColor: highlightBg ? bgColor : undefined,
                color: color
            })
        };
    });

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }

        const text = activeEditor.document.getText();
        decorationTypes.forEach(({ key, decoration }) => {
            const regexPattern = `((\\/\\*[\\s\\S]*?\\*\\/)|(\\/\\/.*))\\b${key}\\b`;
            const regEx = new RegExp(regexPattern, 'g');
            const decorationsArray = [];

            let match;
            while (match = regEx.exec(text)) {
                const startPos = activeEditor.document.positionAt(match.index + match[0].lastIndexOf(key));
                const endPos = activeEditor.document.positionAt(match.index + match[0].lastIndexOf(key) + key.length);
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
