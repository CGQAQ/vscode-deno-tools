import execa from "execa";
import { println } from "./log";

export function run(
  cmd: string,
  ...args: string[]
): execa.ExecaChildProcess<string> {
  println(`Running: ${cmd} ${args.join(" ")}`);
  return execa(cmd, args, { stdio: "inherit" });
}

export async function runWithStdio(
  cmd: string,
  input: string,
  ...args: string[]
): Promise<string> {
  println(`Running ${cmd} ${args.join(" ")} with input of "${input}"`);
  const { stdout, stderr, failed, exitCode } = await execa(cmd, args, {
    input,
  });

  if (failed || exitCode !== 0 || stderr.length > 0) {
    throw new Error(
      `${cmd} failed with exit code ${exitCode}, and message ${stderr}`,
    );
  }

  return stdout;
}