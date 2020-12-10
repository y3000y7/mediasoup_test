import React from "react";
import { Rect, Ellipse, Line, Text, Transformer } from "react-konva";
import Tool from "./Tool";

const TransformShape = ({
  id,
  type,
  properties,
  isSelected,
  draggable,
  onSelect,
  onChange
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const values = {
    ...properties,
    id,
    onClick: onSelect,
    onTap: onSelect,
    ref: shapeRef,
    draggable,
    onDragEnd: e => {
      // console.log(1111111, e);
      onChange({
        id: id,
        x: e.target.x(),
        y: e.target.y()
      });
    },
    onTransformEnd: e => {
      // transformer is changing scale of the node
      // and NOT its width or height
      // but in the store we have only width and height
      // to match the data better we will reset scale on transform end
      const node = shapeRef.current;
      // const scaleX = node.scaleX();
      // const scaleY = node.scaleY();

      // we will reset it back
      // node.scaleX(1);
      // node.scaleY(1);
      // node.width(Math.max(5, node.width() * scaleX));
      // node.height(Math.max(node.height() * scaleY));
      onChange({
        id: id,
        x: node.x(),
        y: node.y(),
        // set minimal value
        // width: Math.max(5, node.width() * scaleX),
        // height: Math.max(node.height() * scaleY),
        skewX: node.skewX(),
        skewY: node.skewY(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY()
      });
    }
  };

  return (
    <React.Fragment>
      {type === Tool.RECT && <Rect {...values} />}
      {type === Tool.ELLIPSE && <Ellipse {...values} />}
      {type === Tool.TEXT && <Text {...values} />}
      {type === Tool.PEN && <Line {...values} />}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
export default TransformShape;
