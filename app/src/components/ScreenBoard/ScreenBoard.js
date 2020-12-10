import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRoomContext } from "../../RoomContext";
import PropTypes from "prop-types";
import { makePeerScreenConsumerSelector } from "../Selectors";
import Peer from "../Containers/Peer";
const getPeerScreenConsumer = makePeerScreenConsumerSelector();

const styles = () => ({
  board: {
    position: "fixed",
    // background: "#f00",
    width: "auto",
    // height: "500px",
    left: "80px",
    top: "250px",
    zIndex: 101,
    border: "1px solid white",
    borderRadius: "10px",
    overflow: "hidden"
  },
  screens: {
    display: "flex",
    flexDirection: "row"
  }
});

class ScreenBoard extends React.PureComponent {
  render() {
    const { classes, advancedMode } = this.props;

    const peerStyle = {
      width: "500px",
      height: "auto"
    };

    const screenConsumerPeerIds = Object.keys(this.props.peers)
      .map(peerId => {
        const screenConsumer = getPeerScreenConsumer(this.props, peerId);
        if (screenConsumer) return peerId;
        else return null;
      })
      .filter(peerId => peerId !== null);

    if (screenConsumerPeerIds.length === 0) {
      return <div />;
    }

    return (
      <div className={classes.board}>
        <div className={classes.screens}>
          {screenConsumerPeerIds.map(peerId => {
            return (
              <Peer
                key={peerId}
                advancedMode={advancedMode}
                id={peerId}
                style={peerStyle}
                smallContainer
                cameraOn={false}
                extraOn={false}
                screenOn={true}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

ScreenBoard.propTypes = {
  peers: PropTypes.object.isRequired,
  consumers: PropTypes.object.isRequired,
  advancedMode: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    peers: state.peers,
    consumers: state.consumers
  };
};

const mapDispatchToProps = dispatch => ({});

export default withRoomContext(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
      areStatesEqual: (next, prev) => {
        return prev.peers === next.peers && prev.consumers === next.consumers;
      }
    }
  )(withStyles(styles)(ScreenBoard))
);
