import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Stage, Layer, Rect } from "react-konva";
import TransformShape from "./TransformShape";
import Tool from "./Tool";

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

const originWidth = 1920;

class DrawingCanvas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTool: Tool.PEN,
      selectedColor: colors[0],
      drawingObject: null,
      selectedObjId: null
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
    if (nextProps.stageWidth !== this.props.stageWidth) {
      return true;
    }

    return false;
  }

  handleMouseDown = e => {
    const { selectedTool, selectedColor } = this.state;

    const pos = e.target.getStage().getPointerPosition();
    const scale = this.props.stageWidth / originWidth;
    let drawingObject = null;
    drawingObject = {
      type: selectedTool,
      fill: selectedColor,
      points: [pos.x / scale, pos.y / scale],
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
    const scale = this.props.stageWidth / originWidth;
    switch (drawingObject.type) {
      case Tool.PEN: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            points: drawingObject.points.concat([
              point.x / scale,
              point.y / scale
            ])
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
              point.x / scale,
              point.y / scale
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

  handleOnSelect = id => {
    this.setState({ selectedObjId: id });
  };

  render() {
    const { classes, draw, stageWidth, stageHeight } = this.props;
    const {
      drawingObject,
      selectedTool,
      selectedColor,
      selectedObjId
    } = this.state;
    const {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleSelectTool,
      handleSelectColor,
      handleOnSelect
    } = this;

    const scale = stageWidth / originWidth;

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
          scale={{ x: scale, y: scale }}
        >
          <Layer>
            <Rect
              width={stageWidth / scale}
              height={stageHeight / scale}
              x={0}
              y={0}
              fill="#444"
            />
            {[...draw, drawingObject].map((obj, i) => {
              if (!obj) {
                return null;
              }
              let properties;
              switch (obj.type) {
                case Tool.PEN: {
                  properties = {
                    points: obj.points,
                    stroke: obj.fill,
                    strokeWidth: 5,
                    tension: 0.5,
                    lineCap: "round"
                  };
                  break;
                }
                case Tool.TEXT: {
                  properties = {
                    x: obj.points[0],
                    y: obj.points[1],
                    text: "type here...",
                    fill: obj.fill,
                    fontSize: 20
                  };
                  break;
                }
                case Tool.RECT: {
                  properties = {
                    x: obj.points[0],
                    y: obj.points[1],
                    width: obj.points[2] - obj.points[0],
                    height: obj.points[3] - obj.points[1],
                    fill: obj.fill
                  };
                  break;
                }
                case Tool.ELLIPSE: {
                  properties = {
                    x: obj.points[0] + (obj.points[2] - obj.points[0]) / 2,
                    y: obj.points[1] + (obj.points[3] - obj.points[1]) / 2,
                    width: Math.abs(obj.points[2] - obj.points[0]),
                    height: Math.abs(obj.points[3] - obj.points[1]),
                    fill: obj.fill
                  };
                  break;
                }
                default:
                  return null;
              }
              return (
                <TransformShape
                  type={obj.type}
                  key={i}
                  id={obj.id}
                  properties={properties}
                  draggable={selectedTool === Tool.SELECT}
                  onChange={changedProps => {
                    console.log(11111111, "onchanged", changedProps);
                  }}
                  onSelect={() => handleOnSelect(obj.id)}
                  isSelected={obj.id === selectedObjId}
                />
              );
            })}
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
