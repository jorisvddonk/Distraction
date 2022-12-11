import { Builder, Renderer } from '..';
import React from 'react';
import * as path from 'path';

const builder = new Builder();
for (let i = 0; i < 10; i++) {
  builder.addElement({
    front: () => <div style={{ width: '100%', height: '100%', border: "0.2mm solid black", boxSizing: 'border-box', backgroundColor: '#fdd' }}>{i} (front)</div>,
    back: i % 2 === 0 ? () => <div style={{ width: '100%', height: '100%', border: "0.2mm solid black", boxSizing: 'border-box', backgroundColor: '#ddf' }}>{i} (back)</div> : undefined,
    width: 20,
    height: 10
  });
}
const renderer = new Renderer(builder.build());
renderer.renderToPNGs((i) => path.join(process.cwd(), 'example_output', `./foo${i}.png`));
