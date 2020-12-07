import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRoomContext } from "../../RoomContext";
import DrawingCanvas from "./DrawingCanvas";

const styles = () => ({
  board: {
    background: "#333333",
    width: "100%",
    height: "100%",
    position: "relative"
  }
});

class DrawingBoard extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.draw.length !== this.props.draw.length) {
      return true;
    }

    return false;
  }

  onObjectAdded = obj => {
    this.props.roomClient.addDrawingObject(obj);
  };

  onClear = () => {
    this.props.roomClient.clearDrawingObjects();
  };

  render() {
    const { classes, draw } = this.props;
    const { onObjectAdded, onClear } = this;

    return (
      <div className={classes.board}>
        <DrawingCanvas
          draw={draw}
          onObjectAdded={onObjectAdded}
          onClear={onClear}
        />
      </div>
    );
  }
}

DrawingBoard.propTypes = {};

const mapStateToProps = state => {
  return {
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
