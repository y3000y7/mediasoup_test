import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { withRoomContext } from "../../RoomContext";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";

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
      tool: "pen",
      isDrawing: false,
      lines: []
    };
  }

  handleMouseDown = e => {
    const { lines, tool } = this.state;
    const pos = e.target.getStage().getPointerPosition();
    this.setState({
      isDrawing: true,
      lines: [...lines, { tool, points: [pos.x, pos.y] }]
    });
  };

  handleMouseMove = e => {
    // no drawing - skipping
    if (!this.state.isDrawing) {
      return;
    }
    const { lines } = this.state;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    // setLines(lines.concat());
    this.setState({ lines: lines.concat() });
  };

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
    const { roomClient } = this.props;
    const { lines } = this.state;
    roomClient.drawLine(lines[lines.length - 1]);
  };

  render() {
    const { classes } = this.props;
    const { lines, stageWidth, stageHeight } = this.state;
    const { handleMouseDown, handleMouseMove, handleMouseUp } = this;
    return (
      <div className={classes.board}>
        <Stage
          width={1000}
          height={500}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#ff9900"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            ))}
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
    lines: state.draw.lines
  };
};

export default withRoomContext(
  connect(
    mapStateToProps,
    null,
    null,
    {
      areStatesEqual: (next, prev) => {
        return (
          prev.room.activeSpeakerId === next.room.activeSpeakerId &&
          prev.room.selectedPeerId === next.room.selectedPeerId &&
          prev.room.toolbarsVisible === next.room.toolbarsVisible &&
          prev.room.hideSelfView === next.room.hideSelfView &&
          prev.toolarea.toolAreaOpen === next.toolarea.toolAreaOpen &&
          prev.settings.permanentTopBar === next.settings.permanentTopBar &&
          prev.settings.aspectRatio === next.settings.aspectRatio &&
          prev.peers === next.peers &&
          prev.consumers === next.consumers &&
          prev.room.spotlights === next.room.spotlights &&
          prev.me.id === next.me.id
        );
      }
    }
  )(withStyles(styles)(DrawingBoard))
);
