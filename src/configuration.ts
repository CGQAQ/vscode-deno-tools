import * as vscode from "vscode";

export interface FormatConfiguration {
  enable: boolean;
  enableForJavaScript: boolean;
  enableForTypeScript: boolean;
  enableForJavaScriptReact: boolean;
  enableForTypeScriptReact: boolean;
  enableForMarkdown: boolean;
  enableForJSON: boolean;
  enableForJSONC: boolean;

  config: {
    enable: boolean;
    useTabs: boolean;
    lineWidth: number;
    indentWidth: number;
    singleQuote: boolean;
    proseWrap: boolean;
  };
}

export interface Configuration {
  enable: boolean;
  format: FormatConfiguration;
}

export class ConfigurationController extends vscode.Disposable {
  private _disposables: vscode.Disposable[] = [];

  private _configuration: Configuration;

  get configuration(): Configuration {
    return this._configuration;
  }

  constructor() {
    super(() => {});

    this._configuration = vscode.workspace.getConfiguration(
      "denoTools",
    ) as unknown as Configuration;

    this._disposables.push(vscode.workspace.onDidChangeConfiguration(
      this.onDidChangeConfiguration,
      this,
    ));
  }

  private _onDidChangeConfiguration = new vscode.EventEmitter<Configuration>();
  public get configChanged(): vscode.Event<Configuration> {
    return this._onDidChangeConfiguration.event;
  }

  private onDidChangeConfiguration(event: vscode.ConfigurationChangeEvent) {
    if (event.affectsConfiguration("denoTools")) {
      this._configuration = vscode.workspace.getConfiguration(
        "denoTools",
      ) as unknown as Configuration;
      this._onDidChangeConfiguration.fire(this._configuration);
    }
  }
  override dispose() {
    this._disposables.forEach((d) => d.dispose());
    this._disposables = [];
  }
}