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
      <div style={this.cardStyle}>
        {this.props.front()}
      </div>
      {this.props.back !== undefined ?
        <div style={this.cardStyleBack}>
          {this.props.back()}
        </div> : null}
    </>
  }

  get cardStyle(): CSSProperties {
    return {
      width: this.props.width + "mm",
      height: this.props.height + "mm",
      position: "absolute",
      left: this.props.x + "mm",
      top: this.props.y + "mm",
      overflow: 'hidden'
    };
  }

  get cardStyleBack(): CSSProperties {
    return Object.assign({}, this.cardStyle, {
      left: (this.props.x + this.props.width) + "mm",
      top: this.props.y + "mm", // todo: add top-bottom double-sided style?
    });
  }
}
