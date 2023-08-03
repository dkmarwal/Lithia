import React from "react";
import {
  Button,
  Grid,
  Box,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  IconButton,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";

import CloseIcon from "@material-ui/icons/Close";
import "./styles.scss";

import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";


export function AlertDialog(props) {
 
  const {
    dialogClassName = "",
    title,
    message,
    onConfirm,
    px = 8,
    py = 8,
    open = true,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={dialogClassName || ""}
    >
      <Box py={py} px={px}>
        {title && (
          <DialogTitle className="alert-dialog-title dialogTitle">
            {title}
          </DialogTitle>
        )}
        {message && (
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" mb={2} width={1}>
              <div className="dialogConten">{message}</div>
            </Box>
          </DialogContent>
        )}
        <DialogActions className="alert-dialog-btn">
          <Grid container justify="center">
            <Button variant="contained" onClick={onConfirm} color="primary">
             ok
            </Button>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
}


export function IdleTimeOutModal(props) {

  const { title, message, onConfirm, open = true } = props;
  return (
    <div id="mainDialogs">
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box py={6} px={6}>
          <DialogTitle className="dialogTitle">{title}</DialogTitle>
          <DialogContent>
            <div className="dialogConten">{message}</div>
          </DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button variant="contained" onClick={onConfirm} color="primary">
             Yes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}



// Customized Dialogs with close icon
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    "& .MuiTypography-h1": {
      fontWeight: 700,
      fontSize: 28,
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogHeading = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h1">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export function TimeoutDialog(props) {
  const { open, handleClose, msgText, dialogIcon = null } = props;
  return (
    <>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
      >
        <DialogHeading id="customized-dialog-title" onClose={handleClose}>
          <Box textAlign="center">
            {dialogIcon ? (
              <img
                src={dialogIcon}
                alt="Step Done"
                style={{ marginTop: "16px" }}
              />
            ) : (
              <InfoOutlinedIcon fontSize="large" htmlColor="#33C3A4" />
            )}
          </Box>
        </DialogHeading>
        <DialogContent
          style={{ padding: "8px 80px", color: "#2B2D30", fontSize: "16px" }}
        >
          <Box textAlign="center" pb={3}>
            {msgText}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
