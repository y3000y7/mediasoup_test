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
    console.log(11111111, "change", "SHOULDCOM");
    if (nextProps.objects.length !== this.props.objects.length) {
      return true;
    }
    if (JSON.stringify(nextProps.draw) !== JSON.stringify(this.props.draw)) {
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
    if (nextState.selectedObjId !== this.state.selectedObjId) {
      return true;
    }
    if (
      nextProps.stageWidth !== this.props.stageWidth ||
      nextProps.stageHeight !== this.props.stageHeight
    ) {
      return true;
    }

    return false;
  }

  handleMouseDown = e => {
    const { selectedTool, selectedColor } = this.state;
    if (selectedTool === Tool.SELECT) return;

    const pos = e.target.getStage().getPointerPosition();
    const scale = this.props.stageWidth / originWidth;

    let drawingObject = {
      id: new Date().getTime(),
      x: pos.x / scale,
      y: pos.y / scale,
      type: selectedTool,
      fill: selectedColor
    };

    if (selectedTool === Tool.RECT || selectedTool === Tool.ELLIPSE) {
      drawingObject.width = 0;
      drawingObject.height = 0;
      // drawingObject.x = x;
      // drawingObject.y = y;
      drawingObject.startX = pos.x / scale;
      drawingObject.startY = pos.y / scale;
    } else if (selectedTool === Tool.PEN) {
      drawingObject.points = [pos.x / scale, pos.y / scale];
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
    const pos = e.target.getStage().getPointerPosition();
    const scale = this.props.stageWidth / originWidth;

    switch (drawingObject.type) {
      case Tool.PEN: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            x: drawingObject.x,
            y: drawingObject.y,
            points: drawingObject.points.concat([pos.x / scale, pos.y / scale])
          }
        });
        break;
      }
      case Tool.RECT: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            width: pos.x / scale - drawingObject.x,
            height: pos.y / scale - drawingObject.y
          }
        });
        break;
      }
      case Tool.ELLIPSE: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            x:
              drawingObject.startX + (pos.x / scale - drawingObject.startX) / 2,
            y:
              drawingObject.startY + (pos.y / scale - drawingObject.startY) / 2,
            width: Math.abs(pos.x / scale - drawingObject.startX),
            height: Math.abs(pos.y / scale - drawingObject.startY)
          }
        });
        break;
      }
      default:
        break;
    }
  };

  handleMouseUp = () => {
    const { drawingObject } = this.state;
    if (drawingObject) {
      this.props.onObjectAdded(drawingObject);
      this.setState({ drawingObject: null });
    }
  };

  handleSelectTool = tool => {
    if (tool !== Tool.SELECT) {
      this.handleOnSelect(null);
    }
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
    if (this.state.selectedTool === Tool.SELECT) {
      if (this.state.selectedObjId !== id) {
        this.setState({ selectedObjId: id });
      }
    }
  };

  handleOnChangeObj = changedProps => {
    this.props.onObjectChanged(changedProps);
  };

  render() {
    console.log(11111111111, "RENDER");
    const { classes, objects, stageWidth, stageHeight } = this.props;
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
      handleOnSelect,
      handleOnChangeObj
    } = this;

    const scale = stageWidth / originWidth;
    console.log(1111111111, objects);
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
              onClick={() => handleOnSelect(null)}
              onTap={() => handleOnSelect(null)}
            />
            {[...objects, drawingObject].map((obj, i) => {
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
                    x: obj.x,
                    y: obj.y,
                    text: "type here...",
                    fill: obj.fill,
                    fontSize: 20
                  };
                  break;
                }
                case Tool.RECT: {
                  properties = {
                    x: obj.x,
                    y: obj.y,
                    width: obj.width,
                    height: obj.height,
                    fill: obj.fill
                  };
                  break;
                }
                case Tool.ELLIPSE: {
                  properties = {
                    x: obj.x,
                    y: obj.y,
                    width: obj.width,
                    height: obj.height,
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
                    console.log(1111111, "onchange");
                    handleOnSelect(obj.id);
                    handleOnChangeObj(changedProps);
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
