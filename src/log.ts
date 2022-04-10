import * as vscode from "vscode";;

const channel = vscode.window.createOutputChannel("Deno tools extension");

export function showOutputWindow() {
    channel.show();
}

export function println(...messages: string[]) {
    channel.appendLine(messages.join(" "));
}

export function print(...messages: string[]) {
    channel.append(messages.join(" "));
}