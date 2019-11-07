import React from "react";
import { DElement, IDElement, IDElementBlock } from "./DElement";
import ReactDOMServer from "react-dom/server";
import { Packer } from "./Packer";
import { DPage } from "./DPage";

export class Builder {
  private iDElements: IDElementBlock[] = [];
  constructor(private pageWidth: number = 210, private pageHeight: number = 297) { }

  public addElement(options: IDElement) {
    const o = Object.assign({}, options) as IDElementBlock;
    o.totalwidth = o.width;
    o.totalheight = o.height;
    if (o.back !== undefined) {
      o.totalwidth = o.width * 2; // todo: add different double-sided layouts (e.g. bottom-top)
    }
    this.iDElements.push(o);
  }

  private get elements(): Array<JSX.Element[]> {
    const pages: Array<JSX.Element[]> = [];
    const remainingElements: IDElementBlock[] = ([] as IDElementBlock[]).concat(this.iDElements);
    while (remainingElements.length > 0) {
      const packer: Packer = new Packer(this.pageWidth, this.pageHeight);
      const fits = packer.fit(remainingElements);
      const elements: JSX.Element[] = [];
      while (fits.length > 0) {
        const elem = remainingElements.shift();
        const fit = fits.shift();
        if (elem !== undefined) {
          if (fit !== undefined && fit !== null) {
            elements.push(<DElement front={elem.front} back={elem.back} width={elem.width} height={elem.height} x={fit.x} y={fit.y} />);
          } else {
            remainingElements.push(elem);
          }
        }
      }
      pages.push(elements);
    }
    return pages;
  }

  public get pages() {
    return this.elements.map(elements => {
      return <DPage width={this.pageWidth} height={this.pageHeight}>{elements}</DPage>
    });
  }

  public build(): string[] {
    return this.pages.map(page => {
      const body = ReactDOMServer.renderToString(page);
      const htmlString = `<html><head><style>${Builder.getRootStylesheet()}</style></head><body>${body}</body></html>`;
      return htmlString;
    });
  }

  public static getRootStylesheet() {
    return `* { box-sizing: border-box; -webkit-print-color-adjust: exact; }
    html, body {
      padding: 0px !important;
      margin: 0px !important;
    }`;
  }
}
