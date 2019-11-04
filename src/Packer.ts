// https://codeincomplete.com/posts/bin-packing/
import { IDElement } from "./DElement";

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
  constructor(w, h) {
    this.root = { x: 0, y: 0, width: w, height: h };
  };

  fit = (blocks: IDElement[]) => {
    const retFits: Node[] = [];
    for (let n = 0; n < blocks.length; n++) {
      let block = blocks[n];
      let node = this.findNode(this.root, block.width, block.height)
      if (node) {
        retFits.push(this.splitNode(node, block.width, block.height));
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