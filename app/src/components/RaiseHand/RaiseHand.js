import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRoomContext } from "../../RoomContext";
import classnames from "classnames";
import PropTypes from "prop-types";
import * as appPropTypes from "../appPropTypes";
import IconButton from "@material-ui/core/IconButton";
import PanIcon from "@material-ui/icons/PanTool";
import { green } from "@material-ui/core/colors";

const styles = () => ({
  raiseHand: {
    position: "fixed",
    cursor: "pointer",
    left: "80px",
    bottom: "100px",
    background: "#999",
    width: "80px",
    height: "80px",
    zIndex: 101,
    display: "flex",
    justifyContent: "center",
    borderRadius: "20px"
  },
  raised: { background: "#fff", border: "2px solid green" }
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
        <IconButton
          className={classes.buttons}
          style={{ color: green[500] }}
          size="medium"
        >
          <PanIcon />
        </IconButton>
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
