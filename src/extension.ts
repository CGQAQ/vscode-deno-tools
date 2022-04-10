// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getDenoCommand } from "./tools";
import which from "which";
import { formatString } from "./deno";
import { SUPPORTED_LANGUAGES } from './constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-deno-tools" is now active!');

	let cmd: string;
	try {
		cmd = await getDenoCommand();
		if(cmd === "deno") {
			cmd = await which("deno");
		}
		console.log("Found the Deno in path: ", cmd);
	} catch {
		console.error("Deno is not installed");
		vscode.window.showErrorMessage("Deno is not installed", "Deno is installed, reload to active.").then((click) => {
			if(click === "Deno is installed, reload to active.") {
				vscode.commands.executeCommand("workbench.action.reloadWindow");
			}
		});
		return;
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-deno-tools.foramtCurrent', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		
		const text = editor.document.getText();
		if (typeof text === "string") {
			const formatted = await formatString(text);

			//Creating a new range with startLine, startCharacter & endLine, endCharacter.
			let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);

			// To ensure that above range is completely contained in this document.
			let validFullRange = editor.document.validateRange(invalidRange);

			vscode.window.activeTextEditor?.edit(edit => { edit.replace(validFullRange, formatted); });
			console.log(text, formatted);
		}
	});

	SUPPORTED_LANGUAGES.map(
		(language) => {
			return vscode
				.languages
				.registerDocumentFormattingEditProvider(language, {
					provideDocumentFormattingEdits: async (document: vscode.TextDocument) => {
						const text = document.getText();
						if (typeof text === "string") {
							const formatted = await formatString(text);
							return [vscode.TextEdit.replace(document.validateRange(new vscode.Range(0, 0, document.lineCount, 0)), formatted)];
						}
					}
				});
		}
	).forEach((disposable) => context.subscriptions.push(disposable));

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
