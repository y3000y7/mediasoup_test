import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { withRoomContext } from "../../RoomContext";
import { Stage, Layer, Rect, Line, Text } from "react-konva";
import { borderRadius } from "@material-ui/system";

const styles = () => ({
  board: {
    background: "#333333",
    width: "100%",
    height: "100%",
    position: "relative"
  },
  tools: {
    position: "absolute",
    left: "20px",
    top: "20px",
    display: "flex"
  },
  tool: {
    cursor: "pointer",
    width: "50px",
    lineHeight: "50px",
    borderRadius: "10px",
    marginRight: "10px",
    backgroundColor: "#ffffff",
    fontSize: "12px",
    textAlign: "center"
  },
  selectedTool: {
    background: "#000000",
    color: "#ffffff"
  },
  colors: {
    position: "absolute",
    left: "20px",
    top: "80px",
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

class DrawingBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTool: "pen",
      selectedColor: "#FFFFFF",
      drawingObject: null
    };
    this.tools = ["select", "pen", "text", "clear"];
    this.colors = [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#00FFFF",
      "#FF00FF",
      "#000000",
      "#FFFFFF"
    ];
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
    const pos = e.target.getStage().getPointerPosition();
    let drawingObject = null;
    // if (selectedTool === "pen") {
    drawingObject = {
      tool: selectedTool,
      fill: selectedColor,
      points: [pos.x, pos.y]
    };
    // }

    this.setState({
      drawingObject
    });
  };

  handleMouseMove = e => {
    // no drawing - skipping
    if (!this.state.drawingObject) {
      return;
    }
    const { drawingObject } = this.state;

    if (drawingObject.tool === "pen") {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();

      this.setState({
        drawingObject: {
          ...drawingObject,
          points: drawingObject.points.concat([point.x, point.y])
        }
      });
    }
  };

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
    const { roomClient } = this.props;
    const { drawingObject } = this.state;
    if (drawingObject) {
      roomClient.addDrawingObject(drawingObject);
      this.setState({ drawingObject: null });
    }
  };

  handleSelectTool = tool => {
    if (tool === "clear") {
      const { roomClient } = this.props;
      roomClient.clearDrawingObjects();
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
    const { classes, draw } = this.props;
    const {
      drawingObject,
      selectedTool,
      selectedColor,
      stageWidth,
      stageHeight
    } = this.state;
    const {
      tools,
      colors,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleSelectTool,
      handleSelectColor
    } = this;
    return (
      <div className={classes.board}>
        <Stage
          width={600}
          height={600}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Rect width={600} height={600} x={0} y={0} fill="#444" />
            {draw.map((obj, i) => {
              switch (obj.tool) {
                case "pen": {
                  return (
                    <Line
                      key={i}
                      points={obj.points}
                      stroke={obj.fill}
                      strokeWidth={5}
                      tension={0.5}
                      lineCap="round"
                      draggable={selectedTool === "select"}
                    />
                  );
                }
                case "text": {
                  return (
                    <Text
                      key={i}
                      x={obj.points[0]}
                      y={obj.points[1]}
                      text="type here..."
                      fill={obj.fill}
                      fontSize={20}
                    />
                  );
                }
                default:
                  return null;
              }
            })}

            {drawingObject && drawingObject.tool === "pen" && (
              <Line
                points={drawingObject.points}
                stroke={drawingObject.fill}
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            )}
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

DrawingBoard.propTypes = {
  // roomClient      : PropTypes.any.isRequired,
  // activeSpeakerId: PropTypes.string,
  // advancedMode: PropTypes.bool,
  // peers: PropTypes.object.isRequired,
  // consumers: PropTypes.object.isRequired,
  // myId: PropTypes.string.isRequired,
  // selectedPeerId: PropTypes.string,
  // spotlights: PropTypes.array.isRequired,
  // boxes: PropTypes.number,
  // toolbarsVisible: PropTypes.bool.isRequired,
  // hideSelfView: PropTypes.bool.isRequired,
  // toolAreaOpen: PropTypes.bool.isRequired,
  // permanentTopBar: PropTypes.bool.isRequired,
  // aspectRatio: PropTypes.number.isRequired,
  // classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    // activeSpeakerId: state.room.activeSpeakerId,
    // selectedPeerId: state.room.selectedPeerId,
    // peers: state.peers,
    // consumers: state.consumers,
    // myId: state.me.id,
    // spotlights: state.room.spotlights,
    // toolbarsVisible: state.room.toolbarsVisible,
    // hideSelfView: state.room.hideSelfView,
    // toolAreaOpen: state.toolarea.toolAreaOpen,
    // aspectRatio: state.settings.aspectRatio,
    // permanentTopBar: state.settings.permanentTopBar
    draw: state.draw
  };
};

export default withRoomContext(
  connect(
    mapStateToProps,
    null,
    null,
    {
      areStatesEqual: (next, prev) => {
        return prev.draw === next.draw;
      }
    }
  )(withStyles(styles)(DrawingBoard))
);
