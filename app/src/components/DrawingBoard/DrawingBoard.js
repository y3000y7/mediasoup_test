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
    justifyContent: "center",
    zIndex: 100
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
    if (nextProps.objects.length !== this.props.objects.length) {
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

  onObjectChanged = obj => {
    this.props.roomClient.changeDrawingObject(obj);
  };

  onClear = () => {
    this.props.roomClient.clearDrawingObjects();
  };

  render() {
    const { classes, objects, drawTimeStamp } = this.props;
    const { canvasWrapperWidth, canvasWrapperHeight } = this.state;
    const { onObjectAdded, onClear, onObjectChanged } = this;
    const wrapperStyles = {
      width: canvasWrapperWidth,
      height: canvasWrapperHeight
    };

    return (
      <div id="DrawingBoard" className={classes.board}>
        <div className={classes.boardWrap} style={wrapperStyles}>
          <DrawingCanvas
            objects={objects}
            drawTimeStamp={drawTimeStamp}
            onObjectAdded={onObjectAdded}
            onObjectChanged={onObjectChanged}
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
    objects: state.draw.objects,
    drawTimeStamp: state.draw.timeStamp
  };
};

export default withRoomContext(
  connect(
    mapStateToProps,
    null,
    null,
    {
      areStatesEqual: (next, prev) => {
        // return (
        //   prev.draw.objects === next.draw.objects &&
        //   prev.draw.timeStamp === next.draw.timeStamp
        // );
        return false;
      }
    }
  )(withStyles(styles)(DrawingBoard))
);
