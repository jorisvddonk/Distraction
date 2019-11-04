import React, { CSSProperties } from "react";

interface IWordProps {
  word: string;
}

const textStyle: CSSProperties = {
  fontSize: "0.8cm",
  fontWeight: "bold",
  margin: "0.25cm"
};

export class Word extends React.Component<IWordProps, any> {
  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          border: "0.5mm solid black",
          backgroundColor: "beige",
          position: 'relative',
          top: '0px',
          left: '0px'
        }}
      >
        {this.props.word && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%"
            }}
          >
            <span
              style={{
                ...textStyle
              }}
            >
              {this.props.word}
            </span>
          </div>
        )}
      </div>
    );
  }
}
