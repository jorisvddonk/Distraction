import React from "react";
import { DElement, IDElement } from "./DElement";
import ReactDOMServer from "react-dom/server";
import { Packer } from "./Packer";
import { DPage } from "./DPage";

export class Builder {
  private iDElements: IDElement[] = [];
  constructor(private pageWidth: number, private pageHeight: number) { }

  public addElement(options: IDElement) {
    options = Object.assign({}, options);
    if (options.back !== undefined) {
      options.width = options.width * 2; // todo: add different double-sided layouts (e.g. bottom-top)
    }
    this.iDElements.push(options);
  }

  private get elements(): Array<JSX.Element[]> {
    const pages: Array<JSX.Element[]> = [];
    const remainingElements: IDElement[] = ([] as IDElement[]).concat(this.iDElements);
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
