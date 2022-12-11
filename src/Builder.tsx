import React from "react";
import { IDElement, IDElementBlock } from "./DElement";
import { DElementSideBySide } from "./DElementSideBySide";
import ReactDOMServer from "react-dom/server";
import { Packer } from "./Packer";
import { DPage } from "./DPage";
import { DElementAboveBelow } from "./DElementAboveBelow";
import { DElementSingleSided } from "./DElementSingleSided";

export enum DoubleSidedLayoutMode {
  /** Layout side by side, such that you can cut each element independently and then stick them together */
  SIDE_BY_SIDE__CUT,
  /** Layout side by side, such that you can cut the entire element and then fold along the vertical line that joins the front and backface */
  SIDE_BY_SIDE__FOLD,
  /** Layout above and below, such that you can cut each element independently and then stick them together */
  ABOVE_BELOW__CUT,
  /** Layout above and below, such that you can cut the entire element and then fold along the horizontal line that joins the front and backface */
  ABOVE_BELOW__FOLD,
}

export interface IBuilderOptions {
  /** horizontal and vertical page margin, in millimeters */
  pageMargin?: number;
  /** horizontal and vertical element margin, in millimeters */
  elementMargin?: number;
  /** page width, in millimeters */
  pageWidth?: number;
  /** page height, in millimeters */
  pageHeight?: number;
  /** double sided element layout mode. Defaults to SIDE_BY_SIDE */
  doubleSidedLayoutMode?: DoubleSidedLayoutMode,
  /** double sided mode. Defaults to FOLD. Only applicable for SIDE_BY_SIDE or ABOVE_BELOW layout modes */
}

type IIBuilderOptions = Required<IBuilderOptions>;

export class Builder {
  private iDElements: IDElementBlock[] = [];
  private options: IIBuilderOptions;
  constructor(options: IBuilderOptions = {}) {
    this.options = Object.assign({
      pageWidth: 210,
      pageHeight: 297,
      pageMargin: 0,
      elementMargin: 0,
      doubleSidedLayoutMode: DoubleSidedLayoutMode.SIDE_BY_SIDE__FOLD
    }, options);
  }

  public addElement(options: IDElement) {
    const o = Object.assign({}, options) as IDElementBlock;
    o.totalwidth = o.width + this.options.elementMargin;
    o.totalheight = o.height + this.options.elementMargin;
    if (o.back !== undefined) {
      if (this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.SIDE_BY_SIDE__CUT ||
        this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.SIDE_BY_SIDE__FOLD) {
        o.totalwidth *= 2;
      } else if (this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.ABOVE_BELOW__CUT ||
        this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.ABOVE_BELOW__FOLD) {
        o.totalheight *= 2;
      }
    }
    this.iDElements.push(o);
  }

  private get elements(): Array<JSX.Element[]> {
    const pages: Array<JSX.Element[]> = [];
    const remainingElements: IDElementBlock[] = ([] as IDElementBlock[]).concat(this.iDElements); // clone this.iDElements
    while (remainingElements.length > 0) {
      // generate a single page
      const packer: Packer = new Packer(this.options.pageWidth, this.options.pageHeight, this.options.pageMargin);
      const fits = packer.fit(remainingElements); // mutates `remainingElements`
      const elements: JSX.Element[] = [];
      while (fits.length > 0) {
        const elem = remainingElements.shift();
        const fit = fits.shift();
        if (elem !== undefined) {
          if (fit !== undefined && fit !== null) {
            if (elem.back !== undefined) {
              if (this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.SIDE_BY_SIDE__CUT || this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.SIDE_BY_SIDE__FOLD) {
                elements.push(<DElementSideBySide front={elem.front} back={elem.back} width={elem.width} height={elem.height} x={fit.x} y={fit.y} />);
              } else if (this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.ABOVE_BELOW__CUT || this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.ABOVE_BELOW__FOLD) {
                elements.push(<DElementAboveBelow front={elem.front} back={elem.back} width={elem.width} height={elem.height} x={fit.x} y={fit.y} />);
              }
            } else {
              elements.push(<DElementSingleSided front={elem.front} width={elem.width} height={elem.height} x={fit.x} y={fit.y} />);
            }
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
      return <DPage width={this.options.pageWidth} height={this.options.pageHeight}>{elements}</DPage>
    });
  }

  public buildMultipage(): string[] {
    return this.pages.map(page => {
      const body = ReactDOMServer.renderToString(page);
      const htmlString = `<html><head><style>${this.getRootStylesheet()}</style></head><body>${body}</body></html>`;
      return htmlString;
    });
  }

  public buildSinglePage(): string {
    const accumulatedPages = this.pages.reduce((memo, page) => {
      return `${memo}${ReactDOMServer.renderToString(page)}`;
    }, '');
    let bodyClassName = '';
    if (this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.SIDE_BY_SIDE__CUT || this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.ABOVE_BELOW__CUT) {
      bodyClassName = '_distraction_DoubleSidedMode__Cut';
    }
    if (this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.SIDE_BY_SIDE__FOLD || this.options.doubleSidedLayoutMode === DoubleSidedLayoutMode.ABOVE_BELOW__FOLD) {
      bodyClassName = '_distraction_DoubleSidedMode__Fold';
    }
    return `<html><head><style>${this.getRootStylesheet()}</style></head><body class=${bodyClassName}>${accumulatedPages}</body></html>`;
  }

  public getRootStylesheet() {
    // NOTE: do *NOT* do any positional CSS modifications here! they'll break! need to be done in the layout engine instead....
    return `* { box-sizing: border-box; }
    html {
      padding: 0mm;
      margin: 0mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      margin: 0mm;
      padding: 0mm;
    }

    ._distraction_DoubleSidedMode__Fold ._distraction_DElementAboveBelow_back {
      /* When in DoubleSidedMode 'Fold', we need to rotate the backface of AboveBelow elements */
      transform: scaleY(-1) scaleX(-1);
    }
    `;
  }
}
