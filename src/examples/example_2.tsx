import { Builder, DoubleSidedLayoutMode, Renderer } from '..';
import React from 'react';
import * as path from 'path';
import * as fs from 'fs';

class PseudoRandomNumberGenerator {
  private m: number;
  private a: number;
  private c: number;
  private s: number;
  constructor(private seed: number) {
    this.m = 0x80000000;
    this.a = 1103515245;
    this.c = 12345;
    this.s = seed;
  }

  generateFloat() { // between 0 and 1
    this.s = (this.a * this.s + this.c) % this.m;
    return this.s / (this.m - 1);
  }

  generateInt(max: number) { // between 0 and max (exclusive)
    return Math.floor(this.generateFloat() * max);
  }
}

async function main() {
  const builder = new Builder({ elementMargin: 2, pageMargin: 3, doubleSidedLayoutMode: DoubleSidedLayoutMode.ABOVE_BELOW__FOLD });
  const prng = new PseudoRandomNumberGenerator(1337);
  for (let i = 0; i < 10; i++) {
    const w = prng.generateInt(40) + 40;
    const h = prng.generateInt(40) + 40
    builder.addElement({
      front: () => <div style={{
        width: '100%',
        height: '100%',
        border: "0.2mm solid black",
        backgroundColor: '#fdd',
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
  await renderer.renderToPDF(path.join(process.cwd(), 'example_output', `./example_2.pdf`));
  await renderer.renderToPNGs((i) => path.join(process.cwd(), 'example_output', `./example_2__${i}.png`));
  await renderer.close();
  fs.writeFileSync('./test.html', builder.buildSinglePage());
}

main().then(console.log).catch(console.error);
