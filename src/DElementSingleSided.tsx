import React, { CSSProperties, ReactNode } from "react";
import { IDElement, IElementState } from "./DElement";

export class DElementSingleSided extends React.Component<Omit<IDElement, 'back'> & IElementState, any> {
  render() {
    return <div className="_distraction_DElementSingleSided" style={this.parentStyle}>
      <div style={this.elementStyle} className="_distraction_DElementSingleSided_front">
        {this.props.front()}
      </div>
    </div>
  }

  get parentStyle(): CSSProperties {
    return {
      width: this.props.width + "mm",
      height: this.props.height + "mm",
      position: "absolute",
      left: this.props.x + "mm",
      top: this.props.y + "mm",
      overflow: 'hidden'
    };
  }

  get elementStyle(): CSSProperties {
    return {
      width: this.props.width + "mm",
      height: this.props.height + "mm",
      position: "absolute",
      left: "0mm",
      top: "0mm",
      overflow: 'hidden'
    };
  }

}
