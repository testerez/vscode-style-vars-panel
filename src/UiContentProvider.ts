import * as vscode from 'vscode';
import { renderContent } from './view';
import { isColor, isDimen } from './util';

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
    return renderContent(this.getSelectedWord(), this.getSassVars());
  }

  private errorSnippet(error: string): string {
    return `
                <body style="padding: 20px;">
                    ${error}
                </body>
            `;
  }

  private getSassVars() {
    // TODO: get path from settings
    return require('./sampleVars').default;
    //return extractScssVariables('/Users/tomesterez/projects/pbv4/src/styles/_theme-dark.scss');
  }
}