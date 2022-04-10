import execa from "execa";

export function run(
  cmd: string,
  ...args: string[]
): execa.ExecaChildProcess<string> {
  return execa(cmd, args, { stdio: "inherit" });
}

export async function runWithStdio(
  cmd: string,
  input: string,
  ...args: string[]
): Promise<string> {
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