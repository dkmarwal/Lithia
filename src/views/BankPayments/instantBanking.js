import React from 'react';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import config from '~/config';
import {
  Dialog,
  CircularProgress,
  Backdrop,
  IconButton,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
} from '@material-ui/core';
import NotificationModals from '~/components/Modals/NotificationModals';
import Transition from '~/components/Slide';
import { connect } from 'react-redux';
import {
  getMXWidgetUrl,
  getMXAccounts,
} from '~/redux/helpers/payments';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const InstantBanking = (props) => {
  const { classes, user, handleAccountsList, history } = props;
  const [showLoader, setShowLoader] = React.useState(false);
  const [showWidget, setShowWidget] = React.useState(false);
  const [showCircularProgress, setShowCircularProgress] = React.useState(false);
  const [showAccountList, setShowAccountsList] = React.useState(false);
  const [mxAccountsData, setMxAccountsData] = React.useState(null);
  const [notification, setNotification] = React.useState({
    message: '',
    isOpen: false,
  });
  let payloadData = null;

  const getAccountDetails = () => {
    if (payloadData?.user_guid) {
      getMXAccounts(
        payloadData.user_guid,
        payloadData.member_guid,
        user?.info?.clientId
      )
        .then((res) => {
          setShowCircularProgress(false);
          setShowLoader(false)
          if (res) {
            if (!res.error) {
              setMxAccountsData(res);
              handleShowAccountsList(res, payloadData.user_guid);
            } else {
              setNotification({
                isOpen: true,
                message: res.message,
              });
            }
          }
        })
        .catch((error) => {
          setShowCircularProgress(false);
        });
    }
  };

  const readyForPayment = () => {
    const routeParam =
      (props.match.params && props.match.params.clientSlug) || '';
    props.history.push(`${config.baseName}/${routeParam}/ready-for-payment`);
  };

  const handleShowAccountsList = (mxAccountData, userGuid) => {
    if (mxAccountData?.data?.accounts?.length > 1) {
      handleAccountsList(mxAccountData?.data?.accounts, userGuid);
    } else {
      readyForPayment();
    }
  };

  const getMXWidgetUrlData = () => {
    //setShowLoader(true);
    setShowWidget(true);
    getMXWidgetUrl()
      .then((res) => {
        if (!res?.error) {
          const connectURL = res?.data?.widget_url?.url;
          if (connectURL) {
            let mxConnect = new window.MXConnect({
              id: 'widget',
              iframeTitle: 'Connect',
              onEvent: function (type, payload) {
                if (type === 'mx/connect/memberConnected') {
                  if (!mxAccountsData) {
                    payloadData = payload;
                  }
                }
                if (type === 'mx/connect/connected/primaryAction') {
                  getAccountDetails();
                }

                if (type === 'mx/connect/stepChange' && payload?.current === 'connected') {
                  getAccountDetails();
                }
                console.log('onEvent', type, payload);
              },
              onLoad: function (event) {
                console.log('onLoad', event);
              },
              config: { ui_message_version: 4 },
              targetOrigin: '*',
            });
            //setShowWidget(true);
            //setShowLoader(false);
            mxConnect.load(connectURL);
  
          } else {
            setShowLoader(false);
            setNotification({
              isOpen: true,
              message: 'Invalid Request',
            });
          }
        } else {
          setShowLoader(false);
          setNotification({
            isOpen: true,
            message: 'Invalid Request',
          });
        }
      })
      .catch((err) => {
        setShowLoader(false);
        console.log('error', err);
      });
  };

  const handleDialogClose = () => {
    setShowWidget(false);
    setShowLoader(false);
    payloadData = null;
    if (showAccountList) {
      setShowAccountsList(false);
    }
  };

  const showNotification = (e) => {
    e.preventDefault();
    setNotification({
      message: '',
      isOpen: false,
    });
  };

  return (
    <>
      <Box className='btn-box'>
        <button
          type='button'
          onClick={() => {
            getMXWidgetUrlData();
          }}
          className='btn-primary btn-block'
        >
          Log In to Your Bank
        </button>
      </Box>
      {showLoader &&
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress />
        </Backdrop>
}
        <Dialog
          fullScreen
          open={showWidget}
          TransitionComponent={Transition}
          fullWidth
          className={clsx(
            classes.dialogMX
          )}
          maxWidth={false}
        >
          <DialogTitle
            disableTypography
            classes={{
              root: showAccountList
                ? classes.dialogTitleAccountList
                : classes.dialogTitleRoot,
            }}
          >
              <Box className='dialogTitleAction'>
                <ArrowBackIcon className='svgIcon' onClick={handleDialogClose}/>
                <IconButton
                  color='inherit'
                  onClick={handleDialogClose}
                  aria-label='close'
                >
                  <CloseIcon className='svgCloseIcon' />
                </IconButton>
              </Box>
          </DialogTitle>
          <DialogContent
            classes={{
              root: showCircularProgress
                ? classes.dialogContentRoot
                : showAccountList && classes.dialogContentAccountList,
            }}
          >
            {showWidget ? (
              <div id='widget'></div>
            ): null}
          </DialogContent>
          {notification.isOpen && (
            <NotificationModals
              title='PLEASE NOTE'
              text={notification.message}
              closeBtn={showNotification}
              closeBtnText='OK'
            />
          )}
        </Dialog>
      
    </>
  );
};

export default connect((state) => ({
  ...state.user,
}))(compose(withStyles(styles))(InstantBanking));
