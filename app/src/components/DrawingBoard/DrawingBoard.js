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
    position: "relative",
    // border: "2px solid red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  boardWrap: {}
});

class DrawingBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canvasWrapperWidth: 0,
      canvasWrapperHeight: 0
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.resizeView);
    this.resizeView();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeView);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.draw.length !== this.props.draw.length) {
      return true;
    }
    if (nextState.canvasWrapperWidth !== this.state.canvasWrapperWidth) {
      return true;
    }

    return false;
  }

  resizeView = () => {
    const parent = document.getElementById("DrawingBoard");
    const h = parent.offsetHeight;
    const w = parent.offsetWidth;

    let canvasWrapperWidth, canvasWrapperHeight;
    if (h / w > 5 / 12) {
      canvasWrapperWidth = w;
      canvasWrapperHeight = (w * 5) / 12;
    } else {
      canvasWrapperWidth = (h * 12) / 5;
      canvasWrapperHeight = h;
    }

    this.setState({
      canvasWrapperWidth,
      canvasWrapperHeight
    });
  };

  onObjectAdded = obj => {
    this.props.roomClient.addDrawingObject(obj);
  };

  onClear = () => {
    this.props.roomClient.clearDrawingObjects();
  };

  render() {
    const { classes, draw } = this.props;
    const { canvasWrapperWidth, canvasWrapperHeight } = this.state;
    const { onObjectAdded, onClear } = this;
    const wrapperStyles = {
      width: canvasWrapperWidth,
      height: canvasWrapperHeight
    };

    return (
      <div id="DrawingBoard" className={classes.board}>
        <div className={classes.boardWrap} style={wrapperStyles}>
          <DrawingCanvas
            draw={draw}
            onObjectAdded={onObjectAdded}
            onClear={onClear}
            stageWidth={canvasWrapperWidth}
            stageHeight={canvasWrapperHeight}
          />
        </div>
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
