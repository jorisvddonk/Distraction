import { ReactNode } from "react";

/**
 * 
 */
export interface IDElement {
  /** front-face React component of element */
  front: () => ReactNode;
  /** back-face React component of element */
  back?: () => ReactNode;
  /** width of element, in millimeters */
  width: number;
  /** height of element, in millimeters */
  height: number;
}

export interface IDElementBlock extends IDElement {
  totalwidth: number; // used to calculate bounds
  totalheight: number; // used to calculate bounds
}

export interface IElementState {
  x: number;
  y: number
}

