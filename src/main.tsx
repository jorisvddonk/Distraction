import React from "react";
import { Builder } from "./Builder";
import { Word } from "./Word";

const builder: Builder = new Builder(210, 297);
for (let i = 0; i < 100; i++) {
  builder.addElement({
    front: () => <Word word={`foo${i}`} />,
    width: 50 + Math.random() * 10,
    height: 50
  })
}

export function getHTMLS() {
  return builder.build();
}

export function getElements() {
  return builder.pages;
}
