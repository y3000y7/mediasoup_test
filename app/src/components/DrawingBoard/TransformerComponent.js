import React, { Component } from "react";
import Konva from "konva";
import { Transformer } from "react-konva";

export default class TransformerComponent extends Component {
  constructor(props) {
    super(props);

    this.checkNode = this.checkNode.bind(this);
  }

  componentDidMount() {
    this.checkNode();
    this.transformer.find("Rect").fill("white");
    this.transformer.find("Rect").width(9);
    this.transformer.find("Rect").height(9);
    this.transformer.find("Rect").cornerRadius(1);
    this.transformer.find("Shape").stroke("#f3f4f4");
    this.transformer.find("Shape").strokeWidth(1);
    this.transformer.find(".back").sceneFunc(ctx => {
      const tr = this.transformer;
      const shape = this.transformer.find(".back")[0];
      const padding = tr.getPadding();
      ctx.beginPath();
      ctx.rect(
        -padding,
        -padding,
        shape.width() + padding * 2,
        shape.height() + padding * 2
      );
      ctx.moveTo(shape.width() / 2, shape.height() + padding);
      if (tr.rotateEnabled()) {
        ctx.lineTo(
          shape.width() / 2,
          shape.height() +
            tr.rotateAnchorOffset() * Konva.Util._sign(shape.height())
        );
      }

      ctx.fillStrokeShape(shape);
    });
    const shape = this.transformer.find(".back")[0];
    this.transformer
      .find(".rotater")
      .y(shape.height() + this.transformer.rotateAnchorOffset());
  }

  componentDidUpdate() {
    this.checkNode();
  }

  checkNode() {
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;
    console.log(111111111, stage, selectedShapeName);
    const selectedNode = stage.findOne("." + selectedShapeName);
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node;
        }}
        keepRatio={false}
        rotateAnchorOffset={25}
      />
    );
  }
}
