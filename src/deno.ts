import {run, runWithStdio} from "./run";

export function formatFile(...files: string[]) {
    run("deno", "fmt", ...files);
}

export async function formatString(content: string): Promise<string> {
    return runWithStdio("deno", content, "fmt", "-");
}