import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import DOMPurify from "dompurify";
import marked from "marked";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useIntl } from "react-intl";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const linkRenderer = new marked.Renderer();

linkRenderer.link = (href, title, text) => {
  title = title ? title : href;
  text = text ? text : href;

  return `<a target='_blank' href='${href}' title='${title}'>${text}</a>`;
};

const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      backgroundColor: "red"
    }
  }
});

const styles = theme => ({
  root: {
    position: "relative",
    display: "flex",
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    flexShrink: 0,
    backgroundColor: "transparent !important",
    boxShadow: "none",
    color: "#ffffff"
    // borderBottom: "1px solid #393939"
  },
  selfMessage: {
    marginLeft: "auto"
  },
  remoteMessage: {
    marginRight: "auto"
  },
  selfAvatar: {
    display: "none"
  },
  text: {
    fontFamily: "Noto Sans KR",
    fontSize: "15px",
    lineHeight: "normal",
    "& p": {
      margin: 0
    }
  },
  content: {
    marginLeft: theme.spacing(1),
    fontFamily: "Noto Sans KR"
  },
  avatar: {
    borderRadius: "50%",
    height: "2rem",
    maxHeight: "30px"
  },
  name: {
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Noto Sans KR"
  },
  time: {
    marginLeft: "6px",
    color: "#706f70",
    fontSize: "12px",
    fontFamily: "Noto Sans KR"
  }
});

const Message = props => {
  const intl = useIntl();

  const { self, picture, text, time, name, classes } = props;

  return (
    <Paper
      className={classnames(
        classes.root,
        self ? classes.selfMessage : classes.remoteMessage
      )}
    >
      <img
        alt="Avatar"
        className={classnames(
          classes.avatar,
          self ? classes.selfAvatar : classes.remoteAvatar
        )}
        src={picture}
      />
      <div className={classes.content}>
        <Typography variant="caption">
          {!self && <span className={classes.name}>{name}</span>}{" "}
          <span className={classes.time}>{time}</span>
        </Typography>
        <Typography
          className={classes.text}
          variant="subtitle1"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parse(text, { renderer: linkRenderer }),
              {
                ALLOWED_TAGS: ["a"],
                ALLOWED_ATTR: ["href", "target", "title"]
              }
            )
          }}
        />
      </div>
    </Paper>
  );
};

Message.propTypes = {
  self: PropTypes.bool,
  picture: PropTypes.string,
  text: PropTypes.string,
  time: PropTypes.object,
  name: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Message);
