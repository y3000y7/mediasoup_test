import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Stage, Layer, Rect } from "react-konva";
import TransformShape from "./TransformShape";
import Tool from "./Tool";

import chatIconOn from "../../images/icon-chat-on.svg";
import userlistIconOn from "../../images/icon-user-list-on.svg";
import selectIconOn from "../../images/icon-select-on.svg";
import penIconOn from "../../images/icon-pencil-on.svg";
import rectIconOn from "../../images/icon-rect-on.png";
import ellipseIconOn from "../../images/icon-ellipse-on.png";
import textIconOn from "../../images/icon-text-on.svg";
import clearIconOn from "../../images/icon-delete-on.svg";

import chatIconOff from "../../images/icon-chat-off.svg";
import userlistIconOff from "../../images/icon-user-list-off.svg";
import selectIconOff from "../../images/icon-select-off.svg";
import penIconOff from "../../images/icon-pencil-off.svg";
import rectIconOff from "../../images/icon-rect-off.png";
import ellipseIconOff from "../../images/icon-ellipse-off.png";
import textIconOff from "../../images/icon-text-off.svg";
import clearIconOff from "../../images/icon-delete-off.svg";

const styles = () => ({
  stage: {
    borderRadius: "15px",
    overflow: "hidden"
  },
  tools: {
    position: "absolute",
    top: "30px",
    right: "12.5px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  tool: {
    boxSizing: "border-box",
    position: "relative",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    borderRadius: "5px",
    fontSize: "12px",
    textAlign: "center",
    marginBottom: "10px"
  },
  toolImg: {
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "20px",
    height: "20px"
  },
  selectedTool: {
    color: "#ffffff"
  },
  colors: {
    position: "absolute",
    right: "110px",
    bottom: "150px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "10.83vw",
    maxWidth: "208px",
    minWidth: "150px",
    // height: "271px",
    backgroundColor: "#2f2f2f",
    borderRadius: "10px",
    padding: "25px 20px"
  },
  color: {
    cursor: "pointer",
    width: "20%",
    maxWidth: "30px",
    minWidth: "22px",
    height: "1.5625vw",
    maxHeight: "30px",
    minHeight: "22px",
    margin: "11px 2% 0",
    borderRadius: "6px",
    transform: "scale(1)"
  },
  selectedColor: {
    transform: "scale(1.3)",
    border: "3px solid #000000"
  }
});

const tools = Object.values(Tool);

const colors = [
  "#ffffff",
  "#c5c5c5",
  "#9b9b9b",
  "#000000",
  "#fd3918",
  "#ffa016",
  "#fbd213",
  "#ff9cbd",
  "#99d823",
  "#96ddff",
  "#00b1ff",
  "#a56fff"
];

// const originWidth = 1920;
// const originHeight = 1080;
const originWidth = 1710;
const originHeight = 746;

class DrawingCanvas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTool: Tool.PEN,
      selectedColor: colors[0],
      drawingObject: null,
      selectedObjId: null
    };
    this.layerRef = React.createRef();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.objects.length !== this.props.objects.length) {
      return true;
    }
    if (
      JSON.stringify(nextProps.objects) !== JSON.stringify(this.props.objects)
    ) {
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
  componentDidUpdate() {}

  handleMouseDown = e => {
    const { selectedTool, selectedColor } = this.state;
    if (selectedTool === Tool.SELECT) return;
    if (selectedTool === Tool.CHAT) return;
    if (selectedTool === Tool.USERLIST) return;

    const pos = e.target.getStage().getPointerPosition();
    const scaleX = this.props.stageWidth / originWidth;
    const scaleY = this.props.stageHeight / originHeight;

    let drawingObject = {
      id: new Date().getTime(),
      x: pos.x / scaleX,
      y: pos.y / scaleY,
      type: selectedTool,
      fill: selectedColor
    };

    if (selectedTool === Tool.RECT || selectedTool === Tool.ELLIPSE) {
      drawingObject.width = 0;
      drawingObject.height = 0;
      // drawingObject.x = x;
      // drawingObject.y = y;
      drawingObject.startX = pos.x / scaleX;
      drawingObject.startY = pos.y / scaleY;
    } else if (selectedTool === Tool.PEN) {
      drawingObject.points = [pos.x / scaleX, pos.y / scaleY];
    } else if (selectedTool === Tool.TEXT) {
      this.handleSelectTool(Tool.SELECT);
      const text = window.prompt("작성할 내용을 입력하세요");
      drawingObject.text = text;
      drawingObject.fontSize = 48;
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
    const scaleX = this.props.stageWidth / originWidth;
    const scaleY = this.props.stageHeight / originHeight;

    switch (drawingObject.type) {
      case Tool.PEN: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            x: drawingObject.x,
            y: drawingObject.y,
            points: drawingObject.points.concat([
              pos.x / scaleX,
              pos.y / scaleY
            ])
          }
        });
        break;
      }
      case Tool.RECT: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            width: pos.x / scaleX - drawingObject.x,
            height: pos.y / scaleY - drawingObject.y
          }
        });
        break;
      }
      case Tool.ELLIPSE: {
        this.setState({
          drawingObject: {
            ...drawingObject,
            x:
              drawingObject.startX +
              (pos.x / scaleX - drawingObject.startX) / 2,
            y:
              drawingObject.startY +
              (pos.y / scaleY - drawingObject.startY) / 2,
            width: Math.abs(pos.x / scaleX - drawingObject.startX),
            height: Math.abs(pos.y / scaleY - drawingObject.startY)
          }
        });
        break;
      }
      default:
        break;
    }
  };

  handleMouseUp = () => {
    const { selectedTool, drawingObject } = this.state;
    if (drawingObject) {
      this.props.onObjectAdded(drawingObject);
      this.setState({ drawingObject: null });
    }
  };

  handleSelectTool = tool => {
    if (tool === Tool.CHAT) {
      this.props.openChatTab();
      return;
    }
    if (tool === Tool.USERLIST) {
      this.props.openUsersTab();
      return;
    }
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
    const { classes, objects, stageWidth, stageHeight } = this.props;
    const {
      drawingObject,
      selectedTool,
      selectedColor,
      selectedObjId
    } = this.state;
    const {
      layerRef,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleSelectTool,
      handleSelectColor,
      handleOnSelect,
      handleOnChangeObj
    } = this;

    const scaleX = stageWidth / originWidth;
    const scaleY = stageHeight / originHeight;

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
          scale={{ x: scaleX, y: scaleY }}
          className={classes.stage}
        >
          <Layer ref={layerRef}>
            <Rect
              width={stageWidth / scaleX}
              height={stageHeight / scaleY}
              x={0}
              y={0}
              fill="#1a1a1a"
              onClick={() => handleOnSelect(null)}
              onTap={() => handleOnSelect(null)}
            />
            {[...objects, drawingObject].map((obj, i) => {
              if (!obj) {
                return null;
              }
              let properties = {
                skewX: obj.skewX ? obj.skewX : 0,
                skewY: obj.skewY ? obj.skewY : 0,
                scaleX: obj.scaleX ? obj.scaleX : 1,
                scaleY: obj.scaleY ? obj.scaleY : 1
              };
              switch (obj.type) {
                case Tool.PEN: {
                  properties = {
                    ...properties,
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
                    ...properties,
                    x: obj.x,
                    y: obj.y,
                    text: obj.text,
                    fontSize: obj.fontSize,
                    fill: obj.fill
                  };
                  break;
                }
                case Tool.ELLIPSE:
                case Tool.RECT: {
                  properties = {
                    ...properties,
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
                  draggable={
                    selectedTool === Tool.SELECT && obj.type !== Tool.PEN
                  }
                  onChange={changedProps => {
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
            let defaultImg, activeImg, bgColor;
            switch (tool) {
              case Tool.CHAT:
                defaultImg = chatIconOff;
                activeImg = chatIconOn;
                bgColor = "#51c5f7";
                break;
              case Tool.USERLIST:
                defaultImg = userlistIconOff;
                activeImg = userlistIconOn;
                bgColor = "#aadc73";
                break;
              case Tool.SELECT:
                defaultImg = selectIconOff;
                activeImg = selectIconOn;
                bgColor = "#9182e6";
                break;
              case Tool.PEN:
                defaultImg = penIconOff;
                activeImg = penIconOn;
                bgColor = "#fb7f85";
                break;
              case Tool.RECT:
                defaultImg = rectIconOff;
                activeImg = rectIconOn;
                break;
              case Tool.ELLIPSE:
                defaultImg = ellipseIconOff;
                activeImg = ellipseIconOn;
                break;
              case Tool.TEXT:
                defaultImg = textIconOff;
                activeImg = textIconOn;
                bgColor = "#53cdc1";
                break;
              case Tool.CLEAR:
                defaultImg = clearIconOff;
                activeImg = clearIconOn;
                bgColor = "#ffd464";
                break;
            }

            if (tool === selectedTool) {
              className += " " + classes.selectedTool;
            }
            return (
              <div
                key={i}
                className={className}
                onClick={() => handleSelectTool(tool)}
                // style={{ backgroundColor: `${bgColor}` }}
                style={{
                  backgroundColor: `${
                    tool === selectedTool ? bgColor : "#000000"
                  }`
                }}
              >
                <img
                  src={tool === selectedTool ? activeImg : defaultImg}
                  alt={tool}
                  className={classes.toolImg}
                />
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
