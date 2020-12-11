import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRoomContext } from "../../RoomContext";
import classnames from "classnames";
import PropTypes from "prop-types";
import * as appPropTypes from "../appPropTypes";
import IconButton from "@material-ui/core/IconButton";
import { green } from "@material-ui/core/colors";
import handUpIcon from "../../images/icon-main-hand-up-on.svg";
import handDownIcon from "../../images/icon-main-hand-up-off.svg";

const styles = () => ({
  raiseHand: {
    position: "fixed",
    cursor: "pointer",
    right: "20px",
    top: "213px",
    background: "#000000",
    width: "50px",
    height: "50px",
    zIndex: 101,
    display: "flex",
    justifyContent: "center",
    borderRadius: "50%"
  },
  raised: { background: "#ff9f0a" },
  handIcon: {
    width: "30px",
    height: "30px"
  }
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
          <img
            src={me.raisedHand ? handUpIcon : handDownIcon}
            alt=""
            className={classes.handIcon}
          />
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
