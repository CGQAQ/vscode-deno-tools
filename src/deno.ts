import { run, runWithStdio } from "./run";

let _enableFormatter = true;

export function disableFormatter() {
  _enableFormatter = false;
}

export function enableFormatter() {
  _enableFormatter = true;
}

export function formatFile(...files: string[]) {
  run("deno", "fmt", ...files);
}

export async function formatString(content: string): Promise<string> {
  return runWithStdio("deno", content, "fmt", "-");
}