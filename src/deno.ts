import { ConfigurationController } from "./configuration";
import { run, runWithStdio } from "./run";
import * as vscode from "vscode";
import { SUPPORTED_LANGUAGES } from "./constants";

function optionWithNoValue(option: string, switchVal: boolean): [string] | [] {
  if (switchVal) {
    return [option];
  } else {
    return [];
  }
}

export default class DenoCmd {
  private _config: ConfigurationController;
  private _disposables: vscode.Disposable[] = [];
  constructor(config: ConfigurationController) {
    this._config = config;
  }

  get formatOptions(): string[] {
    if (
      this._config.configuration.enable &&
      this._config.configuration.format.config.enable
    ) {
      return [
        `--options-indent-width=${this._config.configuration.format.config.indentWidth}`,
        `--options-line-width=${this._config.configuration.format.config.lineWidth}`,
        ...optionWithNoValue(
          `--options-use-tabs`,
          this._config.configuration.format.config.useTabs,
        ),
        ...optionWithNoValue(
          `--options-single-quote`,
          this._config.configuration.format.config.singleQuote,
        ),
        `--options-prose-wrap=${this._config.configuration.format.config.proseWrap}`,
      ];
    } else {
      return [];
    }
  }

  formatFile(...files: string[]) {
    if (this._config.configuration.enable) {
      if (this._config.configuration.format.enable) {
        const shouldFormat = files.filter((file) => {
          const fileExtension = file.split(".").pop();
          if (fileExtension === "ts") {
            return this._config.configuration.format.enableForTypeScript;
          } else if (fileExtension === "tsx") {
            return this._config.configuration.format.enableForTypeScriptReact;
          } else if (fileExtension === "js") {
            return this._config.configuration.format.enableForJavaScript;
          } else if (fileExtension === "jsx") {
            return this._config.configuration.format.enableForJavaScriptReact;
          } else if (fileExtension === "md") {
            return this._config.configuration.format.enableForMarkdown;
          } else if (fileExtension === "json") {
            return this._config.configuration.format.enableForJSON;
          } else if (fileExtension === "jsonc") {
            return this._config.configuration.format.enableForJSONC;
          }
          return false;
        });
        run("deno", "fmt", "-w", ...this.formatOptions, "--", ...shouldFormat);
      }
    }
  }

  async formatString(
    type: typeof SUPPORTED_LANGUAGES[number] | string,
    content: string,
  ): Promise<string> {
    if (this._config.configuration.enable) {
      if (this._config.configuration.format.enable) {
        let shouldFormat: boolean;
        if (type === "typescript") {
          shouldFormat = this._config.configuration.format.enableForTypeScript;
        } else if (type === "typescriptreact") {
          shouldFormat =
            this._config.configuration.format.enableForTypeScriptReact;
        } else if (type === "javascript") {
          shouldFormat = this._config.configuration.format.enableForJavaScript;
        } else if (type === "javascriptreact") {
          shouldFormat =
            this._config.configuration.format.enableForJavaScriptReact;
        } else if (type === "markdown") {
          shouldFormat = this._config.configuration.format.enableForMarkdown;
        } else if (type === "json") {
          shouldFormat = this._config.configuration.format.enableForJSON;
        } else if (type === "jsonc") {
          shouldFormat = this._config.configuration.format.enableForJSONC;
        } else {
          shouldFormat = false;
        }
        if (shouldFormat) {
          return await runWithStdio(
            "deno",
            content,
            "fmt",
            ...this.formatOptions,
            "-",
          );
        }
      }
    }

    return content;
  }
}