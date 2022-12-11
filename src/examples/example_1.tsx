import { Builder, DoubleSidedLayoutMode, Renderer } from '..';
import React from 'react';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  const builder = new Builder({elementMargin: 2, pageMargin: 3, doubleSidedLayoutMode: DoubleSidedLayoutMode.ABOVE_BELOW__FOLD});
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      builder.addElement({
        front: () => <div style={{ width: '100%', height: '100%', border: "0.2mm solid black", boxSizing: 'border-box', backgroundColor: '#fdd' }}>{i} (double-sided, front)</div>,
        back: () => <div style={{ width: '100%', height: '100%', border: "0.2mm solid black", boxSizing: 'border-box', backgroundColor: '#ddf' }}>{i} (double-sided, back)</div>,
        width: 40,
        height: 20
      });
    } else {
      builder.addElement({
        front: () => <div style={{ width: '100%', height: '100%', border: "0.2mm solid black", boxSizing: 'border-box', backgroundColor: '#fdd' }}>{i} (single-sided, front)</div>,
        back: undefined,
        width: 40,
        height: 20
      });
    }
  }
  const renderer = new Renderer(builder);
  await renderer.renderToPNGs((i) => path.join(process.cwd(), 'example_output', `./foo${i}.png`));
  await renderer.close();
  fs.writeFileSync('./test.html', builder.buildSinglePage());
}

main().then(console.log).catch(console.error);
