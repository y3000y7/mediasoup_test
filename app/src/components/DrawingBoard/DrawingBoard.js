import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { withRoomContext } from "../../RoomContext";
import { Stage, Layer, Rect, Line } from "react-konva";

const styles = () => ({
  board: {
    background: "#333333",
    width: "100%",
    height: "100%",
    // border: "1px solid red",
    position: "relative"
  },
  tools: {
    position: "absolute",
    right: "20px",
    top: "50px",
    width: "50px",
    height: "200px"
  },
  tool: {
    cursor: "pointer",
    width: "50px",
    lineHeight: "50px",
    marginBottom: "10px",
    backgroundColor: "#ffffff",
    fontSize: "12px",
    // border: "2px solid red",
    textAlign: "center"
  },
  selectedTool: {
    background: "#ffff00"
  }
});

class DrawingBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTool: "pen",
      drawingObject: null
    };
    this.tools = ["select", "pen", "text", "clear"];
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

    return false;
  }

  handleMouseDown = e => {
    const { selectedTool } = this.state;
    const pos = e.target.getStage().getPointerPosition();
    let drawingObject = null;
    if (selectedTool === "pen") {
      drawingObject = { tool: "pen", points: [pos.x, pos.y] };
    }

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
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    this.setState({
      drawingObject: {
        ...drawingObject,
        points: drawingObject.points.concat([point.x, point.y])
      }
    });
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

  render() {
    const { classes, draw } = this.props;
    const { drawingObject, selectedTool, stageWidth, stageHeight } = this.state;
    const {
      tools,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleSelectTool
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
            <Rect width={600} height={600} x={0} y={0} fill="#333333" />
            {draw.map((obj, i) => (
              <Line
                key={i}
                points={obj.points}
                stroke="#ffffff"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                draggable={selectedTool === "select"}
              />
            ))}
            {drawingObject && (
              <Line
                points={drawingObject.points}
                stroke="#ffffff"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            )}
          </Layer>
        </Stage>
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
