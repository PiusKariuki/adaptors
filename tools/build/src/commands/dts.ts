import * as url from 'url';
import path from 'node:path';
import { exec } from 'node:child_process';
import { existsSync } from 'node:fs';

import resolvePath from '../util/resolve-path';

const tsEntryPoints = ['index.ts', 'index.js'];

const findEntryPoint = (rootPath: string) => {
  const entries = [...tsEntryPoints].reverse();
  while (entries.length) {
    const fileName = entries.pop();
    const entryPath = `${rootPath}/src/${fileName}`;
    if (existsSync(entryPath)) {
      return entryPath;
    }
  }
};

const findCustomBuildScript = (rootPath: string) => {
  const buildPath = `${rootPath}/build-dts.ts`;
  if (existsSync(buildPath)) {
    return buildPath;
  }
};

export default async (lang: string) => {
  const root = resolvePath(lang);
  console.log();
  console.log('Building DTS');
  console.log();

  const custom = false; // findCustomBuildScript(root);
  if (custom) {
    console.log('Loading custom build script....');
    const builder = await import(custom);
    await builder();
    console.log('Done!');
  } else {
    const entry = findEntryPoint(root);

    console.log(entry);

    const args = [
      '--allowJs',
      '--declaration',
      '--emitDeclarationOnly',
      '--lib es2020',
      `--declarationDir ${root}/types`,
      `${entry}`,
    ];

    // Need to run the command out of the build tool dir
    const cwd = path.dirname(url.fileURLToPath(import.meta.url));
    return new Promise<void>(resolve => {
      exec(
        'pnpm exec tsc ' + args.join(' '),
        {
          cwd,
        },
        (err, stdout) => {
          // Hide error reports (for now)
          console.log(stdout);
          resolve();
        }
      );
    });
  }
};
