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
    let editor = vscode.window.activeTextEditor;
    if (!(editor.document.languageId in { css: 1, scss: 1 })) {
      return this.errorSnippet("Active editor doesn't show a CSS document - no properties to preview.")
    }
    return this.extractSnippet();
  }

  private extractSnippet(): string {
    const editor = vscode.window.activeTextEditor;
    const wordSelect = editor.document.getWordRangeAtPosition(editor.selection.anchor);
    const word = wordSelect
      ? editor.document.getText(wordSelect)
      : null;

    return renderContent(word, this.getSassVars());
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