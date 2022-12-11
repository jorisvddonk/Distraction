import { Builder, DoubleSidedLayoutMode, Renderer } from '..';
import React from 'react';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  const builder = new Builder({ elementMargin: 2, pageMargin: 3, doubleSidedLayoutMode: DoubleSidedLayoutMode.ABOVE_BELOW__FOLD });
  for (let i = 0; i < 20; i++) {
    const w = 87;
    const h = 65;
    builder.addElement({
      front: () => <div style={{
        border: "0.5mm solid black",
        backgroundColor: '#ddd',
        width: '100%',
        height: '100%',
        overflow: "hidden",
        borderRadius: "0.5cm",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <span>{i} - {w}x{h}</span>
      </div>,
      back: undefined,
      width: w,
      height: h,
    });
  }
  const renderer = new Renderer(builder, { deviceScaleFactor: 4 });
  await renderer.renderToPDF(path.join(process.cwd(), 'example_output', `./example_3.pdf`));
  await renderer.renderToPNGs((i) => path.join(process.cwd(), 'example_output', `./example_3__${i}.png`));
  await renderer.close();
  fs.writeFileSync('./test.html', builder.buildSinglePage());
}

main().then(console.log).catch(console.error);
