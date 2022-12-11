import React from "react";

interface IDPageProps {
  width: number,
  height: number,
  children: React.ReactNode
}

export class DPage extends React.Component<IDPageProps, any> {
  render() {
    return (
      <div style={{ position: 'relative', height: `${this.props.height}mm`, width: `${this.props.width}mm`, overflow: 'hidden' }}>
        {this.props.children}
      </div>
    );
  }
}
