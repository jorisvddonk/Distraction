import { Builder } from './Builder';
import React from 'react';
import renderer from 'react-test-renderer';

describe("Builder", () => {
  it("should build a bunch of elements into pages", () => {
    const builder = new Builder(100, 100);
    for (let i = 0; i < 5; i++) {
      builder.addElement({
        front: () => <span></span>,
        width: 50,
        height: 50
      });
    }
    const renderedComponent = renderer.create(<>{builder.pages}</>);
    expect(renderedComponent.toJSON()).toMatchSnapshot();
  })
})