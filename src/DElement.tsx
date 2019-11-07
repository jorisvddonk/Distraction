import React, { CSSProperties, ReactNode } from "react";

export interface IDElement {
  front: () => ReactNode;
  back?: () => ReactNode;
  width: number;
  height: number;
}

export interface IDElementBlock extends IDElement {
  totalwidth: number;
  totalheight: number;
}

export interface IElementState {
  x: number;
  y: number
}

export class DElement extends React.Component<IDElement & IElementState, any> {
  render() {
    return <>
      <div style={this.elementStyle}>
        {this.props.front()}
      </div>
      {this.props.back !== undefined ?
        <div style={this.elementStyleBack}>
          {this.props.back()}
        </div> : null}
    </>
  }

  get elementStyle(): CSSProperties {
    return {
      width: this.props.width + "mm",
      height: this.props.height + "mm",
      position: "absolute",
      left: this.props.x + "mm",
      top: this.props.y + "mm",
      overflow: 'hidden'
    };
  }

  get elementStyleBack(): CSSProperties {
    return Object.assign({}, this.elementStyle, {
      left: (this.props.x + this.props.width) + "mm",
      top: this.props.y + "mm", // todo: add top-bottom double-sided style?
    });
  }
}
