import { spawn } from 'node:child_process';
import process from 'node:process';

export function stripTerminalControl(value) {
  return (
    value
      // eslint-disable-next-line no-control-regex -- OSC sequences contain protocol control bytes.
      .replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/gu, '')
      // eslint-disable-next-line no-control-regex -- CSI sequences contain the ESC protocol byte.
      .replace(/\u001b\[[0-?]*[ -/]*[@-~]/gu, '')
  );
}

export function unexpectedWarningLines(output) {
  return stripTerminalControl(output)
    .split(/\r?\n/u)
    .filter((line) => {
      const normalized = line.trim();
      return (
        /(?:^|[\s([])warnings?(?=[:\s])/iu.test(normalized) ||
        /\b[1-9]\d*\s+warnings?\b/iu.test(normalized) ||
        /\[WARN(?:ING)?\]/iu.test(normalized) ||
        /PLUGIN_TIMINGS/u.test(normalized) ||
        /^(?:▲|⚠|\(!\))/u.test(normalized) ||
        /^│\s+\(!\)/u.test(normalized)
      );
    });
}

export async function runWarningFree(command, args, options = {}) {
  const startedAt = performance.now();
  const childEnvironment = { ...process.env, ...options.env };
  // Playwright deliberately enables FORCE_COLOR in its children. Inheriting NO_COLOR at
  // the same time makes Node warn before application code runs, so normalize the conflict
  // at this process boundary. Output remains visible and is still inspected below.
  delete childEnvironment.NO_COLOR;
  delete childEnvironment.FORCE_COLOR;

  let output = '';
  let durationExceeded = false;
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      detached: process.platform !== 'win32',
      env: childEnvironment,
      shell: false,
      stdio: ['inherit', 'pipe', 'pipe'],
    });
    let forceKillTimer;
    const terminate = (signal) => {
      if (child.pid === undefined) return;
      try {
        if (process.platform === 'win32') child.kill(signal);
        else process.kill(-child.pid, signal);
      } catch (error) {
        if (error?.code !== 'ESRCH') reject(error);
      }
    };
    const durationTimer =
      options.maxDurationMs === undefined
        ? undefined
        : setTimeout(() => {
            durationExceeded = true;
            terminate('SIGTERM');
            forceKillTimer = setTimeout(() => terminate('SIGKILL'), 250);
            forceKillTimer.unref();
          }, options.maxDurationMs);
    durationTimer?.unref();
    child.on('error', (error) => {
      if (durationTimer) clearTimeout(durationTimer);
      if (forceKillTimer) clearTimeout(forceKillTimer);
      reject(error);
    });
    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    });
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stderr.write(text);
    });
    child.on('close', (code, signal) => {
      if (durationTimer) clearTimeout(durationTimer);
      if (forceKillTimer) clearTimeout(forceKillTimer);
      resolve(code ?? (signal ? 1 : 0));
    });
  });

  const warningLines = unexpectedWarningLines(output);
  const elapsedMs = performance.now() - startedAt;
  durationExceeded ||= options.maxDurationMs !== undefined && elapsedMs > options.maxDurationMs;
  if (warningLines.length > 0) {
    console.error(`warning-free gate failed: ${warningLines.length} warning line(s) detected`);
    for (const line of warningLines) console.error(`- ${line.trim()}`);
  }
  if (exitCode !== 0) console.error(`warning-free gate failed: child exit=${exitCode}`);
  if (durationExceeded) {
    console.error(
      `duration gate failed: elapsed=${Math.ceil(elapsedMs)}ms budget=${options.maxDurationMs}ms`,
    );
  }
  return exitCode === 0 && warningLines.length === 0 && !durationExceeded ? 0 : 1;
}

if (process.argv[1] === import.meta.filename) {
  const separator = process.argv.indexOf('--', 2);
  const runnerArguments =
    separator === -1 ? process.argv.slice(2) : process.argv.slice(2, separator);
  const invocation = separator === -1 ? [] : process.argv.slice(separator + 1);
  const durationArgument = runnerArguments.find((argument) =>
    argument.startsWith('--max-duration-ms='),
  );
  const unknownArguments = runnerArguments.filter(
    (argument) => !argument.startsWith('--max-duration-ms='),
  );
  const maxDurationMs = durationArgument
    ? Number(durationArgument.slice('--max-duration-ms='.length))
    : undefined;
  if (
    invocation.length === 0 ||
    unknownArguments.length > 0 ||
    (maxDurationMs !== undefined && (!Number.isFinite(maxDurationMs) || maxDurationMs <= 0))
  ) {
    console.error(
      'usage: node tools/quality/run-warning-free.mjs [--max-duration-ms=<positive number>] -- <command> [args...]',
    );
    process.exitCode = 2;
  } else {
    process.exitCode = await runWarningFree(invocation[0], invocation.slice(1), { maxDurationMs });
  }
}
