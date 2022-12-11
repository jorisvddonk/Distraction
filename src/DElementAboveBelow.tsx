import React, { CSSProperties } from "react";
import { IDElement, IElementState } from "./DElement";


export class DElementAboveBelow extends React.Component<IDElement & IElementState, any> {
  render() {
    return <div className="_distraction_DElementAboveBelow" style={this.parentStyle}>
      <div style={this.elementStyle} className="_distraction_DElementAboveBelow_front">
        {this.props.front()}
      </div>
      <div style={this.elementStyleBack} className="_distraction_DElementAboveBelow_back">
        {this.props.back!()}
      </div>
    </div>;
  }

  get parentStyle(): CSSProperties {
    return {
      width: this.props.width + "mm",
      height: (this.props.height * 2) + "mm",
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

  get elementStyleBack(): CSSProperties {
    return Object.assign({}, this.elementStyle, {
      top: (0 + this.props.height) + "mm"
    });
  }
}
