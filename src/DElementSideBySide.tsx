import React, { CSSProperties } from "react";
import { IDElement, IElementState } from "./DElement";


export class DElementSideBySide extends React.Component<IDElement & IElementState, any> {
  render() {
    return <div className="_distraction_DElementSideBySide" style={this.parentStyle}>
      <div style={this.elementStyle} className="_distraction_DElementSideBySide_front">
        {this.props.front()}
      </div>
      <div style={this.elementStyleBack} className="_distraction_DElementSideBySide_back">
        {this.props.back!()}
      </div>
    </div>;
  }

  get parentStyle(): CSSProperties {
    return {
      width: (this.props.width * 2) + "mm",
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

  get elementStyleBack(): CSSProperties {
    return Object.assign({}, this.elementStyle, {
      left: (0 + this.props.width) + "mm"
    });
  }
}
