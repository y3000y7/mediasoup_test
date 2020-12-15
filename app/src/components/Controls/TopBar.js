import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  lobbyPeersKeySelector,
  peersLengthSelector,
  raisedHandsSelector,
  makePermissionSelector
} from "../Selectors";
import { permissions } from "../../permissions";
import * as appPropTypes from "../appPropTypes";
import { withRoomContext } from "../../RoomContext";
import { withStyles } from "@material-ui/core/styles";
import * as roomActions from "../../actions/roomActions";
import * as toolareaActions from "../../actions/toolareaActions";
import { useIntl, FormattedMessage } from "react-intl";
import classnames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Paper from "@material-ui/core/Paper";
import AccountCircle from "@material-ui/icons/AccountCircle";
import FullScreenIcon from "@material-ui/icons/Fullscreen";
import FullScreenExitIcon from "@material-ui/icons/FullscreenExit";
import SettingsIcon from "@material-ui/icons/Settings";
import SecurityIcon from "@material-ui/icons/Security";
import PeopleIcon from "@material-ui/icons/People";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import SelfViewOnIcon from "@material-ui/icons/Videocam";
import SelfViewOffIcon from "@material-ui/icons/VideocamOff";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import MoreIcon from "@material-ui/icons/MoreVert";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import helpIcon from "../../images/icon-help.svg";
import helpHoverIcon from "../../images/icon-help-over.svg";
import settingIcon from "../../images/icon-setting.svg";
import settingHoverIcon from "../../images/icon-setting-over.svg";

const theme = createMuiTheme({
  overrides: {
    MuiToolbar: {
      padding: 0,

      regular: {
        height: "50px",
        minHeight: "50px",
        "@media(min-width:600px)": {
          minHeight: "50px"
        }
      },
      gutters: {
        paddingLeft: "0 !important",
        paddingRight: "0 !important"
      }
    }
  }
});

const styles = theme => ({
  persistentDrawerOpen: {
    width: "calc(100% - 30vw)",
    marginLeft: "30vw",
    [theme.breakpoints.down("lg")]: {
      width: "calc(100% - 40vw)",
      marginLeft: "40vw"
    },
    [theme.breakpoints.down("md")]: {
      width: "calc(100% - 50vw)",
      marginLeft: "50vw"
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 70vw)",
      marginLeft: "70vw"
    },
    [theme.breakpoints.down("xs")]: {
      width: "calc(100% - 90vw)",
      marginLeft: "90vw"
    }
  },
  menuButton: {
    margin: 0,
    padding: 0
  },
  logo: {
    display: "none",
    marginLeft: 20,
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  divider: {
    marginLeft: theme.spacing(3)
  },
  show: {
    opacity: 1,
    transition: "opacity .5s"
  },
  hide: {
    opacity: 0,
    transition: "opacity .5s"
  },
  grow: {
    flexGrow: 1
  },
  title: {
    display: "none",
    marginLeft: 20,
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  actionButton: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(0, 1)
  },
  disabledButton: {
    margin: theme.spacing(1, 0)
  },
  green: {
    color: "rgba(0, 153, 0, 1)"
  },
  moreAction: {
    // margin: theme.spacing(0.5, 0, 0.5, 1.5)
  },
  toolBar: {
    position: "relative",
    backgroundColor: "#1a1a1a",
    boxShadow: "0 3px 6px 0 rgba(0,0,0,0.2)",
    height: "50px !important"
  },
  toolBarTitle: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "15px",
    fontWeight: "500"
  },
  helpIcon: {
    width: "30px",
    height: "30px",
    backgroundImage: `url(${helpIcon})`,

    "&:hover": {
      backgroundImage: `url(${helpHoverIcon})`
    }
  },
  settingIcon: {
    width: "30px",
    height: "30px",
    backgroundImage: `url(${settingIcon})`,

    "&:hover": {
      backgroundImage: `url(${settingHoverIcon})`
    }
  },
  lectureTime: {
    position: "absolute",
    top: "0",
    right: "145px",
    lineHeight: "50px",
    color: "#ffffff"
  }
});

const PulsingBadge = withStyles(theme => ({
  badge: {
    backgroundColor: theme.palette.secondary.main,
    "&::after": {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: `3px solid ${theme.palette.secondary.main}`,
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}))(Badge);

const TopBar = props => {
  const intl = useIntl();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [time, setTime] = useState(0);

  useInterval(() => {
    setTime(time + 1);
  }, 1000);

  const handleExited = () => {
    setCurrentMenu(null);
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuOpen = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);

    handleMobileMenuClose();
  };

  const {
    roomClient,
    room,
    peersLength,
    lobbyPeers,
    permanentTopBar,
    drawerOverlayed,
    toolAreaOpen,
    isMobile,
    myPicture,
    loggedIn,
    loginEnabled,
    fullscreenEnabled,
    fullscreen,
    onFullscreen,
    setSettingsOpen,
    setExtraVideoOpen,
    setLockDialogOpen,
    setHideSelfView,
    toggleToolArea,
    openUsersTab,
    unread,
    canProduceExtraVideo,
    canLock,
    canPromote,
    classes
  } = props;

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const lockTooltip = room.locked
    ? intl.formatMessage({
        id: "tooltip.unLockRoom"
      })
    : intl.formatMessage({
        id: "tooltip.lockRoom"
      });

  const fullscreenTooltip = fullscreen
    ? intl.formatMessage({
        id: "tooltip.leaveFullscreen"
      })
    : intl.formatMessage({
        id: "tooltip.enterFullscreen"
      });

  const loginTooltip = loggedIn
    ? intl.formatMessage({
        id: "tooltip.logout"
      })
    : intl.formatMessage({
        id: "tooltip.login"
      });

  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <AppBar
          position="fixed"
          className={classnames(
            room.toolbarsVisible || permanentTopBar
              ? classes.show
              : classes.hide,
            !(isMobile || drawerOverlayed) && toolAreaOpen
              ? classes.persistentDrawerOpen
              : null
          )}
        >
          <Toolbar className={classes.toolBar}>
            <p className={classes.toolBarTitle}>기본 수업</p>
            {/* <PulsingBadge
            color="secondary"
            badgeContent={unread}
            onClick={() => toggleToolArea()}
          >
            <IconButton
              color="inherit"
              aria-label={intl.formatMessage({
                id: "label.openDrawer"
              })}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </PulsingBadge> */}
            {/* {window.config.logo !== "" ? (
            <img alt="Logo" src={window.config.logo} className={classes.logo} />
          ) : (
            <Typography variant="h6" noWrap color="inherit">
              {window.config.title}
            </Typography>
          )} */}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {/* <Tooltip
              title={intl.formatMessage({
                id: "label.moreActions"
              })}
            >
              <IconButton
                aria-owns={
                  isMenuOpen && currentMenu === "moreActions"
                    ? "material-appbar"
                    : undefined
                }
                aria-haspopup
                onClick={event => handleMenuOpen(event, "moreActions")}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Tooltip> */}
              {/* {fullscreenEnabled && (
              <Tooltip title={fullscreenTooltip}>
                <IconButton
                  aria-label={intl.formatMessage({
                    id: "tooltip.enterFullscreen"
                  })}
                  className={classes.actionButton}
                  color="inherit"
                  onClick={onFullscreen}
                >
                  {fullscreen ? <FullScreenExitIcon /> : <FullScreenIcon />}
                </IconButton>
              </Tooltip>
            )} */}
              {/* <Tooltip
              title={intl.formatMessage({
                id: "tooltip.participants"
              })}
            >
              <IconButton
                aria-label={intl.formatMessage({
                  id: "tooltip.participants"
                })}
                color="inherit"
                onClick={() => openUsersTab()}
              >
                <Badge color="primary" badgeContent={peersLength + 1}>
                  <PeopleIcon />
                </Badge>
              </IconButton>
            </Tooltip> */}
              <div className={classes.lectureTime}>
                수업 경과 {toTimerFormat(time)}
              </div>
              <Tooltip
                title={intl.formatMessage({
                  id: "tooltip.help"
                })}
              >
                <IconButton
                  aria-label={intl.formatMessage({
                    id: "tooltip.help"
                  })}
                  className={classes.actionButton}
                  color="inherit"
                  // onClick={() => setSettingsOpen(!room.helpOpen)}
                >
                  {/* <SettingsIcon /> */}
                  {/* <img
                    src={helpIcon}
                    alt="helpzIcon"
                    className={classes.helpIcon}
                  /> */}
                  <p
                    src={helpIcon}
                    alt="helpzIcon"
                    className={classes.helpIcon}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={intl.formatMessage({
                  id: "tooltip.settings"
                })}
              >
                <IconButton
                  aria-label={intl.formatMessage({
                    id: "tooltip.settings"
                  })}
                  className={classes.actionButton}
                  color="inherit"
                  onClick={() => setSettingsOpen(!room.settingsOpen)}
                >
                  <p
                    src={settingIcon}
                    alt="settingIcon"
                    className={classes.settingIcon}
                  />
                  {/* <SettingsIcon /> */}
                </IconButton>
              </Tooltip>
              {/* <Tooltip title={lockTooltip}>
              <span className={classes.disabledButton}>
                <IconButton
                  aria-label={intl.formatMessage({
                    id: "tooltip.lockRoom"
                  })}
                  className={classes.actionButton}
                  color="inherit"
                  disabled={!canLock}
                  onClick={() => {
                    if (room.locked) {
                      roomClient.unlockRoom();
                    } else {
                      roomClient.lockRoom();
                    }
                  }}
                >
                  {room.locked ? <LockIcon /> : <LockOpenIcon />}
                </IconButton>
              </span>
            </Tooltip> */}
              {lobbyPeers.length > 0 && (
                <Tooltip
                  title={intl.formatMessage({
                    id: "tooltip.lobby"
                  })}
                >
                  <span className={classes.disabledButton}>
                    <IconButton
                      aria-label={intl.formatMessage({
                        id: "tooltip.lobby"
                      })}
                      className={classes.actionButton}
                      color="inherit"
                      disabled={!canPromote}
                      onClick={() => setLockDialogOpen(!room.lockDialogOpen)}
                    >
                      <PulsingBadge
                        color="secondary"
                        badgeContent={lobbyPeers.length}
                      >
                        <SecurityIcon />
                      </PulsingBadge>
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {loginEnabled && (
                <Tooltip title={loginTooltip}>
                  <IconButton
                    aria-label={intl.formatMessage({
                      id: "tooltip.login"
                    })}
                    className={classes.actionButton}
                    color="inherit"
                    onClick={() => {
                      loggedIn ? roomClient.logout() : roomClient.login();
                    }}
                  >
                    {myPicture ? (
                      <Avatar src={myPicture} />
                    ) : (
                      <AccountCircle
                        className={loggedIn ? classes.green : null}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <div className={classes.sectionMobile}>
              {lobbyPeers.length > 0 && (
                <Tooltip
                  title={intl.formatMessage({
                    id: "tooltip.lobby"
                  })}
                >
                  <span className={classes.disabledButton}>
                    <IconButton
                      aria-label={intl.formatMessage({
                        id: "tooltip.lobby"
                      })}
                      className={classes.actionButton}
                      color="inherit"
                      disabled={!canPromote}
                      onClick={() => setLockDialogOpen(!room.lockDialogOpen)}
                    >
                      <PulsingBadge
                        color="secondary"
                        badgeContent={lobbyPeers.length}
                      >
                        <SecurityIcon />
                      </PulsingBadge>
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <IconButton
                aria-haspopup
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
            <div className={classes.divider} />

            {/* <Button
            aria-label={intl.formatMessage({
              id: "label.leave"
            })}
            className={classes.actionButton}
            variant="contained"
            color="secondary"
            onClick={() => roomClient.close()}
          >
            <FormattedMessage id="label.leave" defaultMessage="Leave" />
          </Button> */}
          </Toolbar>
        </AppBar>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
          onExited={handleExited}
          getContentAnchorEl={null}
        >
          {currentMenu === "moreActions" && (
            <Paper>
              <MenuItem
                disabled={!canProduceExtraVideo}
                onClick={() => {
                  handleMenuClose();
                  setExtraVideoOpen(!room.extraVideoOpen);
                }}
              >
                <VideoCallIcon
                  aria-label={intl.formatMessage({
                    id: "label.addVideo"
                  })}
                />
                <p className={classes.moreAction}>
                  <FormattedMessage
                    id="label.addVideo"
                    defaultMessage="Add video"
                  />
                </p>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  setHideSelfView(!room.hideSelfView);
                }}
              >
                {room.hideSelfView ? (
                  <SelfViewOnIcon
                    aria-label={intl.formatMessage({
                      id: "room.showSelfView"
                    })}
                  />
                ) : (
                  <SelfViewOffIcon
                    aria-label={intl.formatMessage({
                      id: "room.hideSelfView"
                    })}
                  />
                )}
                {room.hideSelfView ? (
                  <p className={classes.moreAction}>
                    <FormattedMessage
                      id="room.showSelfView"
                      defaultMessage="Show self view video"
                    />
                  </p>
                ) : (
                  <p className={classes.moreAction}>
                    <FormattedMessage
                      id="room.hideSelfView"
                      defaultMessage="Hide self view video"
                    />
                  </p>
                )}
              </MenuItem>
            </Paper>
          )}
        </Popover>
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={isMobileMenuOpen}
          onClose={handleMenuClose}
          getContentAnchorEl={null}
        >
          {loginEnabled && (
            <MenuItem
              aria-label={loginTooltip}
              onClick={() => {
                handleMenuClose();
                loggedIn ? roomClient.logout() : roomClient.login();
              }}
            >
              {myPicture ? (
                <Avatar src={myPicture} />
              ) : (
                <AccountCircle className={loggedIn ? classes.green : null} />
              )}
              {loggedIn ? (
                <p className={classes.moreAction}>
                  <FormattedMessage
                    id="tooltip.logout"
                    defaultMessage="Log out"
                  />
                </p>
              ) : (
                <p className={classes.moreAction}>
                  <FormattedMessage
                    id="tooltip.login"
                    defaultMessage="Log in"
                  />
                </p>
              )}
            </MenuItem>
          )}
          {/* <MenuItem
            aria-label={lockTooltip}
            disabled={!canLock}
            onClick={() => {
              handleMenuClose();

              if (room.locked) {
                roomClient.unlockRoom();
              } else {
                roomClient.lockRoom();
              }
            }}
          >
            {room.locked ? <LockIcon /> : <LockOpenIcon />}
            {room.locked ? (
              <p className={classes.moreAction}>
                <FormattedMessage
                  id="tooltip.unLockRoom"
                  defaultMessage="Unlock room"
                />
              </p>
            ) : (
              <p className={classes.moreAction}>
                <FormattedMessage
                  id="tooltip.lockRoom"
                  defaultMessage="Lock room"
                />
              </p>
            )}
          </MenuItem> */}
          <MenuItem
            aria-label={intl.formatMessage({
              id: "tooltip.settings"
            })}
            onClick={() => {
              handleMenuClose();
              setSettingsOpen(!room.settingsOpen);
            }}
          >
            <SettingsIcon />
            <p className={classes.moreAction}>
              <FormattedMessage
                id="tooltip.settings"
                defaultMessage="Show settings"
              />
            </p>
          </MenuItem>
          {/* <MenuItem
            aria-label={intl.formatMessage({
              id: "tooltip.participants"
            })}
            onClick={() => {
              handleMenuClose();
              openUsersTab();
            }}
          >
            <Badge color="primary" badgeContent={peersLength + 1}>
              <PeopleIcon />
            </Badge>
            <p className={classes.moreAction}>
              <FormattedMessage
                id="tooltip.participants"
                defaultMessage="Show participants"
              />
            </p>
          </MenuItem>
          {fullscreenEnabled && (
            <MenuItem
              aria-label={intl.formatMessage({
                id: "tooltip.enterFullscreen"
              })}
              onClick={() => {
                handleMenuClose();
                onFullscreen();
              }}
            >
              {fullscreen ? <FullScreenExitIcon /> : <FullScreenIcon />}
              <p className={classes.moreAction}>
                <FormattedMessage
                  id="tooltip.enterFullscreen"
                  defaultMessage="Enter fullscreen"
                />
              </p>
            </MenuItem>
          )}
          <MenuItem
            disabled={!canProduceExtraVideo}
            onClick={() => {
              handleMenuClose();
              setExtraVideoOpen(!room.extraVideoOpen);
            }}
          >
            <VideoCallIcon
              aria-label={intl.formatMessage({
                id: "label.addVideo"
              })}
            />
            <p className={classes.moreAction}>
              <FormattedMessage
                id="label.addVideo"
                defaultMessage="Add video"
              />
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setHideSelfView(!room.hideSelfView);
            }}
          >
            {room.hideSelfView ? (
              <SelfViewOnIcon
                aria-label={intl.formatMessage({
                  id: "room.showSelfView"
                })}
              />
            ) : (
              <SelfViewOffIcon
                aria-label={intl.formatMessage({
                  id: "room.hideSelfView"
                })}
              />
            )}
            {room.hideSelfView ? (
              <p className={classes.moreAction}>
                <FormattedMessage
                  id="room.showSelfView"
                  defaultMessage="Show self view video"
                />
              </p>
            ) : (
              <p className={classes.moreAction}>
                <FormattedMessage
                  id="room.hideSelfView"
                  defaultMessage="Hide self view video"
                />
              </p>
            )}
          </MenuItem> */}
        </Menu>
      </MuiThemeProvider>
    </React.Fragment>
  );
};

TopBar.propTypes = {
  roomClient: PropTypes.object.isRequired,
  room: appPropTypes.Room.isRequired,
  isMobile: PropTypes.bool.isRequired,
  peersLength: PropTypes.number,
  lobbyPeers: PropTypes.array,
  permanentTopBar: PropTypes.bool.isRequired,
  drawerOverlayed: PropTypes.bool.isRequired,
  toolAreaOpen: PropTypes.bool.isRequired,
  myPicture: PropTypes.string,
  loggedIn: PropTypes.bool.isRequired,
  loginEnabled: PropTypes.bool.isRequired,
  fullscreenEnabled: PropTypes.bool,
  fullscreen: PropTypes.bool,
  onFullscreen: PropTypes.func.isRequired,
  setToolbarsVisible: PropTypes.func.isRequired,
  setSettingsOpen: PropTypes.func.isRequired,
  setExtraVideoOpen: PropTypes.func.isRequired,
  setLockDialogOpen: PropTypes.func.isRequired,
  setHideSelfView: PropTypes.func.isRequired,
  toggleToolArea: PropTypes.func.isRequired,
  openUsersTab: PropTypes.func.isRequired,
  unread: PropTypes.number.isRequired,
  canProduceExtraVideo: PropTypes.bool.isRequired,
  canLock: PropTypes.bool.isRequired,
  canPromote: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};

const makeMapStateToProps = () => {
  const hasExtraVideoPermission = makePermissionSelector(
    permissions.EXTRA_VIDEO
  );

  const hasLockPermission = makePermissionSelector(
    permissions.CHANGE_ROOM_LOCK
  );

  const hasPromotionPermission = makePermissionSelector(
    permissions.PROMOTE_PEER
  );

  const mapStateToProps = state => ({
    room: state.room,
    isMobile: state.me.browser.platform === "mobile",
    peersLength: peersLengthSelector(state),
    lobbyPeers: lobbyPeersKeySelector(state),
    permanentTopBar: state.settings.permanentTopBar,
    drawerOverlayed: state.settings.drawerOverlayed,
    toolAreaOpen: state.toolarea.toolAreaOpen,
    loggedIn: state.me.loggedIn,
    loginEnabled: state.me.loginEnabled,
    myPicture: state.me.picture,
    unread: state.toolarea.unreadMessages + raisedHandsSelector(state),
    canProduceExtraVideo: hasExtraVideoPermission(state),
    canLock: hasLockPermission(state),
    canPromote: hasPromotionPermission(state),
    locale: state.intl.locale,
    localesList: state.intl.list
  });

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({
  setToolbarsVisible: visible => {
    dispatch(roomActions.setToolbarsVisible(visible));
  },
  setSettingsOpen: settingsOpen => {
    dispatch(roomActions.setSettingsOpen(settingsOpen));
  },
  setExtraVideoOpen: extraVideoOpen => {
    dispatch(roomActions.setExtraVideoOpen(extraVideoOpen));
  },
  setLockDialogOpen: lockDialogOpen => {
    dispatch(roomActions.setLockDialogOpen(lockDialogOpen));
  },
  setHideSelfView: hideSelfView => {
    dispatch(roomActions.setHideSelfView(hideSelfView));
  },
  toggleToolArea: () => {
    dispatch(toolareaActions.toggleToolArea());
  },
  openUsersTab: () => {
    dispatch(toolareaActions.openToolArea());
    dispatch(toolareaActions.setToolTab("users"));
  }
});

export default withRoomContext(
  connect(
    makeMapStateToProps,
    mapDispatchToProps,
    null,
    {
      areStatesEqual: (next, prev) => {
        return (
          prev.room === next.room &&
          prev.peers === next.peers &&
          prev.lobbyPeers === next.lobbyPeers &&
          prev.settings.permanentTopBar === next.settings.permanentTopBar &&
          prev.settings.drawerOverlayed === next.settings.drawerOverlayed &&
          prev.me.loggedIn === next.me.loggedIn &&
          prev.me.browser === next.me.browser &&
          prev.me.loginEnabled === next.me.loginEnabled &&
          prev.me.picture === next.me.picture &&
          prev.me.roles === next.me.roles &&
          prev.toolarea.unreadMessages === next.toolarea.unreadMessages &&
          prev.toolarea.toolAreaOpen === next.toolarea.toolAreaOpen &&
          prev.intl.locale === next.intl.locale &&
          prev.intl.localesList === next.intl.localesList
        );
      }
    }
  )(withStyles(styles, { withTheme: true })(TopBar))
);

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function toTimerFormat(sec) {
  const hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}
