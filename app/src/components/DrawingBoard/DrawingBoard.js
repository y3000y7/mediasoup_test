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
    border: "2px solid green"
  }
});

class DrawingBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      line: { tool: "pen", points: [] }
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.draw.length !== this.props.draw.length) return true;
    if (nextState.line.points.length !== this.state.line.points.length)
      return true;

    return false;
  }

  handleMouseDown = e => {
    const pos = e.target.getStage().getPointerPosition();
    this.setState({
      isDrawing: true,
      line: { tool: "pen", points: [pos.x, pos.y] }
    });
  };

  handleMouseMove = e => {
    // no drawing - skipping
    if (!this.state.isDrawing) {
      return;
    }
    const { line } = this.state;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    // let lastLine = lines[lines.length - 1];
    // add point
    // line.points = line.points.concat([point.x, point.y]);

    // replace last
    // lines.splice(lines.length - 1, 1, lastLine);
    // setLines(lines.concat());
    this.setState({
      line: { ...line, points: line.points.concat([point.x, point.y]) }
    });
  };

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
    const { roomClient } = this.props;
    const { line } = this.state;
    roomClient.addDrawingObject(line);
    this.setState({ line: { tool: "pen", points: [] } });
  };

  render() {
    const { classes, draw } = this.props;
    const { line, stageWidth, stageHeight } = this.state;
    const { handleMouseDown, handleMouseMove, handleMouseUp } = this;
    return (
      <div className={classes.board}>
        <Stage
          width={1280}
          height={720}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Rect width={1280} height={720} x={0} y={0} fill="#dddddd" />
            {draw.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#000000"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            ))}
            {line.points.length > 0 && (
              <Line
                points={line.points}
                stroke="#000000"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            )}
          </Layer>
        </Stage>
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
