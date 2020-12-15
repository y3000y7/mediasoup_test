import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRoomContext } from "../../RoomContext";
import PropTypes from "prop-types";
import {
  makePeerScreenConsumerSelector,
  meScreenProducersSelector
} from "../Selectors";
import * as appPropTypes from "../appPropTypes";
import Peer from "../Containers/Peer";
import Me from "../Containers/Me";
const getPeerScreenConsumer = makePeerScreenConsumerSelector();

const styles = () => ({
  board: {
    position: "absolute",
    // background: "#f00",
    width: "100vw",
    height: "calc(100vh - 274px)",
    // height: "500px",
    left: "0px",
    top: "274px",
    zIndex: 101,
    // border: "1px solid white",
    borderRadius: "10px",
    overflow: "hidden"
  },
  screens: {
    display: "flex",
    flexDirection: "row",
    margin: "0 auto",
    width: "calc(100vw - 130px)",
    height: "calc(100vh - 274px)"
  }
});

class ScreenBoard extends React.PureComponent {
  render() {
    const { classes, advancedMode, peers, screenProducer } = this.props;

    const peerStyle = {
      // margin: "0 auto",
      // width: "calc(100vw - 130px)",
      // height: "calc(100vh - 274px)",
      flex: "100%",
      // border: "1px solid #ffffff",
      width: "100%",
      height: "100%",
      marginRight: "3px"
    };

    const screenConsumerPeerIds = Object.keys(peers)
      .map(peerId => {
        const screenConsumer = getPeerScreenConsumer(this.props, peerId);
        if (screenConsumer) return peerId;
        else return null;
      })
      .filter(peerId => peerId !== null);

    if (!screenProducer && screenConsumerPeerIds.length === 0) {
      return <div />;
    }

    return (
      <div className={classes.board}>
        <div className={classes.screens}>
          {screenProducer && (
            <Me
              advancedMode={advancedMode}
              style={peerStyle}
              smallContainer
              cameraOn={false}
              extraOn={false}
              screenOn={true}
            />
          )}
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
  me: appPropTypes.Me.isRequired,
  peers: PropTypes.object.isRequired,
  consumers: PropTypes.object.isRequired,
  screenProducer: appPropTypes.Producer,
  advancedMode: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    peers: state.peers,
    consumers: state.consumers,
    screenProducer: meScreenProducersSelector(state)
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
        return (
          prev.peers === next.peers &&
          prev.consumers === next.consumers &&
          prev.me === next.me
        );
      }
    }
  )(withStyles(styles)(ScreenBoard))
);
