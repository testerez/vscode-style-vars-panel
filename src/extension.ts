import * as vscode from 'vscode';
import UiContentProvider from './UiContentProvider';

export function activate(context: vscode.ExtensionContext) {

  let previewUri = vscode.Uri.parse('css-preview://authority/css-preview');
  let currentEditor: vscode.TextEditor;
  let provider = new UiContentProvider();
  let registration = vscode.workspace.registerTextDocumentContentProvider('css-preview', provider);

  vscode.window.onDidChangeActiveTextEditor(e => {
    currentEditor = e || currentEditor;
    if (e) {
      provider.update(previewUri);
    }
  });

  vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
    const editor = vscode.window.activeTextEditor;
    if (!e || !editor) {
      return;
    }
    if (e.document === editor.document) {
      provider.update(previewUri);
    }
  });

  vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
      if (e.textEditor === vscode.window.activeTextEditor) {
      provider.update(previewUri);
    }
  })

  let disposable = vscode.commands.registerCommand('extension.showStyleVarsPanel', () => {
    return vscode.commands.executeCommand(
      'vscode.previewHtml',
      previewUri,
      vscode.ViewColumn.Two,
      'Style Vars'
    ).then(s => {
      const editor = vscode.window.activeTextEditor;
      editor.show()
    }, reason => {
      vscode.window.showErrorMessage(reason);
    });
  });

  vscode.commands.registerCommand('extension.insertVar', ({ name }) => {
    const editor = currentEditor;
    if (!editor) {
      return;
    }
    editor.show();
    editor.edit(function (editBuilder) {
      editBuilder.replace(
        editor.document.getWordRangeAtPosition(editor.selection.anchor) ||
        editor.selection,
        name
      );
    });
  });

  context.subscriptions.push(disposable, registration);
}

export function deactivate() {
}
