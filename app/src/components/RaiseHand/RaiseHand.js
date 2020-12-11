import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRoomContext } from "../../RoomContext";
import classnames from "classnames";
import PropTypes from "prop-types";
import * as appPropTypes from "../appPropTypes";

const styles = () => ({
  raiseHand: {
    position: "fixed",
    cursor: "pointer",
    left: "80px",
    bottom: "100px",
    background: "#fff",
    width: "100px",
    height: "100px",
    zIndex: 101
  },
  raised: { border: "5px solid green" }
});

class RaiseHand extends React.PureComponent {
  raiseHand = () => {
    const { roomClient, me } = this.props;
    roomClient.setRaisedHand(!me.raisedHand);
  };

  render() {
    const { classes, me } = this.props;
    const { raiseHand } = this;

    return (
      <div
        className={classnames(
          classes.raiseHand,
          me.raisedHand ? classes.raised : null
        )}
        onClick={raiseHand}
      >
        RaiseHand
      </div>
    );
  }
}

RaiseHand.propTypes = {
  roomClient: PropTypes.object.isRequired,
  me: appPropTypes.Me.isRequired
};

const mapStateToProps = state => {
  return {
    me: state.me
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
        // return prev.peers === next.peers && prev.consumers === next.consumers;
        return false;
      }
    }
  )(withStyles(styles)(RaiseHand))
);
