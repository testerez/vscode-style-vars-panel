import * as path from 'path';
import * as vscode from 'vscode';
import * as mainView from './mainview';
import * as noVarsView from './noVarsView';
import * as fs from 'fs';

export default class UiContentProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

  public provideTextDocumentContent(uri: vscode.Uri): string {
    return this.createCssSnippet();
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this._onDidChange.fire(uri);
  }

  private createCssSnippet() {
    return this.extractSnippet();
  }

  private getSelectedWord() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return null;
    }
    const wordSelect = editor.document.getWordRangeAtPosition(editor.selection.anchor);
    return wordSelect
      ? editor.document.getText(wordSelect)
      : null;
  }

  private extractSnippet(): string {
    const styleVars = this.getStyleVars();
    return Object.keys(styleVars).length
      ? mainView.getHTML(this.getSelectedWord(), styleVars)
      : noVarsView.getHTML();
  }

  private getStyleVars() {
    console.log('getting vars');
    try {
      return JSON.parse(fs.readFileSync(
        path.join(vscode.workspace.rootPath, '.vscode', 'style-vars.json'),
        'utf8'
      ));
    } catch(e) {
      console.error('Unable to load style variables', e);
      return {};
    }
  }
}
