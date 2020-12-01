import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { withRoomContext } from "../../RoomContext";

const styles = () => ({
  board: {
    background: "#333333",
    width: "100%",
    height: "100%"
  }
});

class DrawingBoard extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return <div className={classes.board}>DrawingBoard</div>;
  }
}

DrawingBoard.propTypes = {
  // roomClient      : PropTypes.any.isRequired,
  activeSpeakerId: PropTypes.string,
  advancedMode: PropTypes.bool,
  peers: PropTypes.object.isRequired,
  consumers: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
  selectedPeerId: PropTypes.string,
  spotlights: PropTypes.array.isRequired,
  boxes: PropTypes.number,
  toolbarsVisible: PropTypes.bool.isRequired,
  hideSelfView: PropTypes.bool.isRequired,
  toolAreaOpen: PropTypes.bool.isRequired,
  permanentTopBar: PropTypes.bool.isRequired,
  aspectRatio: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    activeSpeakerId: state.room.activeSpeakerId,
    selectedPeerId: state.room.selectedPeerId,
    peers: state.peers,
    consumers: state.consumers,
    myId: state.me.id,
    spotlights: state.room.spotlights,
    toolbarsVisible: state.room.toolbarsVisible,
    hideSelfView: state.room.hideSelfView,
    toolAreaOpen: state.toolarea.toolAreaOpen,
    aspectRatio: state.settings.aspectRatio,
    permanentTopBar: state.settings.permanentTopBar
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
