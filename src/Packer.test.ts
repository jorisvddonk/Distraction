import { Packer } from './Packer';
import { IDElementBlock } from './DElement';
import React from 'react';

describe("Packer", () => {
  it("should pack a bunch of nodes", () => {
    const generateNode = (width, height): IDElementBlock => {
      return {
        front: () => React.createElement('div'),
        width,
        height,
        totalwidth: width,
        totalheight: height
      }
    }
    const p = new Packer(100, 100);
    const nodes = p.fit([generateNode(30, 30), generateNode(30, 30), generateNode(30, 30), generateNode(30, 30)]);
    expect(nodes[0].x).toBe(0);
    expect(nodes[0].y).toBe(0);
    expect(nodes[1].x).toBe(30);
    expect(nodes[1].y).toBe(0);
    expect(nodes[2].x).toBe(60);
    expect(nodes[2].y).toBe(0);
    expect(nodes[3].x).toBe(0);
    expect(nodes[3].y).toBe(30);
  });

  it("should not pack nodes that don't fit", () => {
    const generateNode = (width, height): IDElementBlock => {
      return {
        front: () => React.createElement('div'),
        width,
        height,
        totalwidth: width,
        totalheight: height
      }
    }
    const p = new Packer(100, 100);
    const nodes = p.fit([generateNode(90, 90), generateNode(30, 30)]);
    expect(nodes[0]).not.toBeNull();
    expect(nodes[1]).not.toBeNull();
  });
})