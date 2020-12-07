import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Stage, Layer, Rect, Ellipse, Line, Text } from "react-konva";
import TransformerComponent from "./TransformerComponent";

const styles = () => ({
  tools: {
    position: "absolute",
    left: "20px",
    top: "20px",
    display: "flex"
  },
  tool: {
    cursor: "pointer",
    width: "50px",
    lineHeight: "30px",
    borderRadius: "5px",
    marginRight: "10px",
    backgroundColor: "#ffffff",
    fontSize: "12px",
    textAlign: "center"
  },
  selectedTool: {
    background: "#333333",
    color: "#ffffff"
  },
  colors: {
    position: "absolute",
    left: "20px",
    top: "60px",
    display: "flex"
  },
  color: {
    cursor: "pointer",
    width: "30px",
    height: "30px",
    marginRight: "10px",
    borderRadius: "15px",
    transform: "scale(1)"
  },
  selectedColor: {
    transform: "scale(1.3)",
    border: "3px solid #000000"
  }
});

const Tool = {
  SELECT: "select",
  PEN: "pen",
  RECT: "rect",
  ELLIPSE: "ellipse",
  TEXT: "text",
  CLEAR: "clear"
};
const tools = Object.values(Tool);

const colors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#000000",
  "#FFFFFF"
];

class DrawingCanvas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTool: Tool.PEN,
      selectedColor: colors[0],
      drawingObject: null,
      selectedShapeName: ""
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.draw.length !== this.props.draw.length) {
      return true;
    }
    if (
      JSON.stringify(nextState.drawingObject) !==
      JSON.stringify(this.state.drawingObject)
    ) {
      return true;
    }
    if (nextState.selectedTool !== this.state.selectedTool) {
      return true;
    }
    if (nextState.selectedColor !== this.state.selectedColor) {
      return true;
    }

    return false;
  }

  handleMouseDown = e => {
    const { selectedTool, selectedColor } = this.state;

    if (selectedTool === Tool.SELECT) {
      // clicked on stage - cler selection
      if (e.target === e.target.getStage()) {
        this.setState({
          selectedShapeName: ""
        });
        return;
      }
      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const id = e.target.id();
      const rect = this.props.draw.find(r => r.id === id);
      if (rect) {
        this.setState({
          selectedShapeName: id
        });
      } else {
        this.setState({
          selectedShapeName: ""
        });
      }
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    let drawingObject = null;
    drawingObject = {
      tool: selectedTool,
      fill: selectedColor,
      points: [pos.x, pos.y],
      id: new Date().getTime()
    };

    if (selectedTool === Tool.RECT || selectedTool === Tool.ELLIPSE) {
      drawingObject.points = [pos.x, pos.y, pos.x, pos.y];
    }

    this.setState({
      drawingObject
    });
  };

  handleMouseMove = e => {
    if (!this.state.drawingObject) {
      return;
    }
    const { drawingObject } = this.state;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    switch (drawingObject.tool) {
      case Tool.PEN: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            points: drawingObject.points.concat([point.x, point.y])
          }
        });
        break;
      }
      case Tool.RECT:
      case Tool.ELLIPSE: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            points: [
              drawingObject.points[0],
              drawingObject.points[1],
              point.x,
              point.y
            ]
          }
        });
      }
    }
  };

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
    const { drawingObject } = this.state;
    if (drawingObject) {
      this.props.onObjectAdded(drawingObject);
      this.setState({ drawingObject: null });
    }
  };

  handleSelectTool = tool => {
    if (tool === Tool.CLEAR) {
      this.props.onClear();
    } else {
      if (tool !== this.state.selectedTool) {
        this.setState({ selectedTool: tool });
      }
    }
  };

  handleSelectColor = color => {
    if (color !== this.state.selectedColor) {
      this.setState({ selectedColor: color });
    }
  };

  render() {
    const { classes, draw, stageWidth, stageHeight } = this.props;
    const { drawingObject, selectedTool, selectedColor } = this.state;
    const {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleSelectTool,
      handleSelectColor
    } = this;
    return (
      <div>
        <Stage
          width={stageWidth}
          height={stageHeight}
          onMouseDown={e => {
            handleMouseDown(e);
          }}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Rect
              width={stageWidth}
              height={stageHeight}
              x={0}
              y={0}
              fill="#444"
            />
            {[...draw, drawingObject].map((obj, i) => {
              if (!obj) {
                return null;
              }
              switch (obj.tool) {
                case Tool.PEN: {
                  return (
                    <Line
                      key={i}
                      id={obj.id}
                      points={obj.points}
                      stroke={obj.fill}
                      strokeWidth={5}
                      tension={0.5}
                      lineCap="round"
                      draggable={selectedTool === Tool.SELECT}
                    />
                  );
                }
                case Tool.TEXT: {
                  return (
                    <Text
                      key={i}
                      id={obj.id}
                      x={obj.points[0]}
                      y={obj.points[1]}
                      text="type here..."
                      fill={obj.fill}
                      fontSize={20}
                      draggable={selectedTool === Tool.SELECT}
                    />
                  );
                }
                case Tool.RECT: {
                  return (
                    <Rect
                      key={i}
                      id={obj.id}
                      x={obj.points[0]}
                      y={obj.points[1]}
                      width={obj.points[2] - obj.points[0]}
                      height={obj.points[3] - obj.points[1]}
                      fill={obj.fill}
                      draggable={selectedTool === Tool.SELECT}
                    />
                  );
                }
                case Tool.ELLIPSE: {
                  return (
                    <Ellipse
                      key={i}
                      id={obj.id}
                      x={obj.points[0] + (obj.points[2] - obj.points[0]) / 2}
                      y={obj.points[1] + (obj.points[3] - obj.points[1]) / 2}
                      width={Math.abs(obj.points[2] - obj.points[0])}
                      height={Math.abs(obj.points[3] - obj.points[1])}
                      fill={obj.fill}
                      draggable={selectedTool === Tool.SELECT}
                    />
                  );
                }
                default:
                  return null;
              }
            })}
            <TransformerComponent
              selectedShapeName={this.state.selectedShapeName}
            />
          </Layer>
        </Stage>

        {/* tools */}
        <div className={classes.tools}>
          {tools.map((tool, i) => {
            let className = classes.tool;
            if (tool === selectedTool) {
              className += " " + classes.selectedTool;
            }
            return (
              <div
                key={i}
                className={className}
                onClick={() => handleSelectTool(tool)}
              >
                {tool}
              </div>
            );
          })}
        </div>

        {/* colors */}
        <div className={classes.colors}>
          {colors.map((color, i) => {
            let className = classes.color;
            if (color === selectedColor) {
              className += " " + classes.selectedColor;
            }

            return (
              <div
                key={i}
                className={className}
                onClick={() => handleSelectColor(color)}
                style={{ backgroundColor: color }}
              ></div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DrawingCanvas);
