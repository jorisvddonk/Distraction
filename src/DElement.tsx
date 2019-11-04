import React, { CSSProperties } from "react";

export interface IDElement {
  front: () => void;
  back?: () => void;
  width: number;
  height: number;
}

export interface IElementState {
  x: number;
  y: number
}

export class DElement extends React.Component<IDElement & IElementState, any> {
  render() {
    return <div style={this.cardStyle}>
      {this.props.front()}
      {this.props.back !== undefined ? this.props.back() : null}
    </div>
  }

  get cardStyle(): CSSProperties {
    return {
      border: "0.2mm solid black",
      width: this.props.width + "mm",
      height: this.props.height + "mm",
      position: "absolute",
      left: this.props.x + "mm",
      top: this.props.y + "mm",
      overflow: 'hidden'
    };
  }
}
