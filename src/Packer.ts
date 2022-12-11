// https://codeincomplete.com/posts/bin-packing/
import { IDElement, IDElementBlock } from "./DElement";

export interface Node {
  width: number;
  height: number;
  x: number;
  y: number;
  right?: Node;
  down?: Node;
}

export class Packer {
  private root: Node;
  constructor(w, h, pageMargin) {
    // NOTE: any element margin is assumed to be calculated in the blocks already.
    this.root = { x: pageMargin, y: pageMargin, width: w - (pageMargin * 2), height: h - (pageMargin * 2) };
  };

  fit = (blocks: IDElementBlock[]) => {
    blocks = blocks.sort((a, b) => {
      return a.totalwidth - b.totalwidth;
    });
    const retFits: Node[] = [];
    for (let n = 0; n < blocks.length; n++) {
      let block = blocks[n];
      let node = this.findNode(this.root, block.totalwidth, block.totalheight)
      if (node) {
        retFits.push(this.splitNode(node, block.totalwidth, block.totalheight));
      }
    }
    return retFits;
  }

  findNode = (root: Node, w: number, h: number) => {
    if (root.right && root.down) {
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    } else if ((w <= root.width) && (h <= root.height)) {
      return root;
    } else {
      return null;
    }
  }

  splitNode = (node: Node, w: number, h: number) => {
    node.down = { x: node.x, y: node.y + h, width: node.width, height: node.height - h };
    node.right = { x: node.x + w, y: node.y, width: node.width - w, height: h };
    return node;
  }

}