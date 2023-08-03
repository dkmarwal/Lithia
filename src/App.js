import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';
import './App.css';
import { userInfo, logout, keepSessionLive } from '~/redux/actions/user';
import Login from '~/views/Login';
import BankPayments from '~/views/BankPayments';
import PaymentCenter from '~/views/PaymentCenter';
import PaymentAccount from '~/views/PaymentAccount';
import UpdatePaymentAccount from '~/views/UpdatePaymentAccount';
import PaymentHistory from '~/views/PaymentHistory';
import ReadyForPayment from '~/views/ReadyForPayment';
import TermsOfService from './views/TermsOfService';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import config from '~/config';
import NoPageFound from '~/module/NoPageFound/';
import { IdleTimeOutModal } from '~/components/Dialogs';
import IdleTimer from 'react-idle-timer';
import SnackbarComponent from '~/components/Snackbar';
import Logout from './views/Logout';
import "~/lithia.css";

class AuthRoute extends Component {
  constructor(props) {
    super(props);
    this.state = { supportContactInfo: null };
  }

  render() {
    const { component: Component, isLoggedIn, user, ...rest } = this.props;
    const path = window?.location?.pathname ?? '';
    const clientURL = path.split('/')[1];

    return (
      <Route
        {...rest}
        render={(props) =>
          user?.isLoggedIn ? (
            <Fragment>
              <div className='wrapper'>
                <Header {...props} isLoggedIn={user?.isLoggedIn} />
                <Component {...props} />
                <Footer {...props} />
              </div>
            </Fragment>
          ) : (
            <Redirect to={`${config.baseName}/${clientURL}`} />
          )
        }
      />
    );
  }
}

const ProtectedRoutes = connect((state) => ({
  ...state.user,
}))(AuthRoute);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      timeout: config.sessionTimeout - config.showPopupTime - 180000, //less 2 in milli seconds
      isTimedOut: false,
      logout: false,
      showModal: false,
    };
    this.idleTimer = null;
    this.onIdle = this._onIdle.bind(this);
  }

  componentDidMount() {
    if (config.disableContextMenu) {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      document.onkeydown = function (e) {
        // disable F12 key
        if (e.KeyboardEvent.keyCode === 123) {
          return false;
        }

        // disable I key
        if (e.ctrlKey && e.shiftKey && e.KeyboardEvent.keyCode === 73) {
          return false;
        }

        // disable J key
        if (e.ctrlKey && e.shiftKey && e.KeyboardEvent.keyCode === 74) {
          return false;
        }

        // disable U key
        if (e.ctrlKey && e.KeyboardEvent.keyCode === 85) {
          return false;
        }
      };
    }

    let routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    if (!routeParam && this.props.location.pathname) {
      const pathName = this.props.location.pathname.split('/');
      if (pathName?.length > 1) {
        routeParam = pathName[1];
      }
    }

    this.props.dispatch(userInfo()).then(() => {
      this.setState({
        isLoading: false,
      });

      this.checkSession();

      setInterval(() => {
        this.checkSession();
      }, 60000); //Check in every one minutes
    });
  }

  checkSession = () => {
    if (
      !this.state.showModal &&
      this.props.user &&
      this.props.user.isLoggedIn
    ) {
      const tokenExpiryTime = this.props.user.info.exp; //in seconds
      const currentTime = Math.floor(Date.now() / 1000); //convert to seconds

      if (
        tokenExpiryTime > currentTime &&
        currentTime >= tokenExpiryTime - 120
      ) {
        //refresh token
        this.updateSession();
      }
    }
  };

  _onActive(e) {
    //console.log("On active");
    const totalIdleTime = this.idleTimer && this.idleTimer.getTotalIdleTime();
    //console.log('total idle time', this.idleTimer.getTotalIdleTime());
    if (totalIdleTime >= config.sessionTimeout) {
      if (this.props.user && this.props.user.isLoggedIn) {
        this.idleTimer.reset();
        this.setState({ logout: true, isTimedOut: true, showModal: false });
      //  console.log('in _onActive logout');
        this.props.dispatch(logout());
      } else {
        this.idleTimer.reset();
      }
    } else {
      if (
        !this.state.showModal &&
        this.props.user &&
        this.props.user.isLoggedIn
      ) {
        const tokenExpiryTime = this.props.user.info.exp; //in seconds
        const currentTime = Math.floor(Date.now() / 1000); //convert to seconds

        if (
          tokenExpiryTime > currentTime &&
          currentTime >= tokenExpiryTime - 120
        ) {
          //refresh token
          this.updateSession();
        }
      }
      this.idleTimer.reset();
      this.setState({ isTimedOut: false });
    }
  }

  _onIdle(e) {
    if (this.props.user && this.props.user.isLoggedIn) {
      this.setState({ showModal: true });
      setTimeout(() => {
        if (
          this.state.showModal &&
          this.props.user &&
          this.props.user.isLoggedIn
        ) {
          this.idleTimer.reset();
          this.setState({ logout: true, isTimedOut: true, showModal: false });
          //console.log("in _onIdle logout");
          this.props.dispatch(logout());
        }
      }, config.showPopupTime);
    }
  }

  updateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        //console.log("updateSession keepSessionLive response", response);
        if (!response) {
        }
        this.idleTimer.reset(); //reset timer
      });
    } catch (ex) {
      //this.idleTimer.reset(); //reset timer
    }
  };

  keepUpdateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        if (!response) {
          this.setState({ showModal: false });
        }
        this.idleTimer.reset(); //reset timer
        this.setState({ showModal: false });
      });
    } catch (ex) {
      this.setState({ showModal: false });
      this.idleTimer.reset(); //reset timer
    }
  };

  render() {
    const { isLoggedIn } = this.props.user;
    const { isLoading, showModal } = this.state;

    let routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    if (!routeParam && this.props.location.pathname) {
      const pathName = this.props.location.pathname.split('/');
      if (pathName?.length > 1) {
        routeParam = pathName[1];
      }
    }

    if (isLoading) {
      return null;
    }

   
    return (
      <div className='App'>
        <BrowserRouter>
          <IdleTimer
            ref={(ref) => {
              this.idleTimer = ref;
            }}
            startOnMount={true}
            element={document}
            onIdle={this.onIdle}
            debounce={250}
            timeout={this.state.timeout}
          />
          <React.Fragment>
            <Switch>
              <Route
                exact
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug`}
                render={(props) => (
                  <div className='wrapper'>
                    <Header {...props} isLoggedIn={isLoggedIn} />
                    <Login
                      enrollmentId={props.match.params.enrollmentId}
                      {...props}
                    />
                    <Footer />
                  </div>
                )}
              />

              <Route
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/consumerverification/:enrollmentId`}
                render={(props) => (
                  <div className='wrapper'>
                    <Header {...props} isLoggedIn={isLoggedIn} />
                    <Login
                      enrollmentId={props.match.params.enrollmentId}
                      {...props}
                    />
                    <Footer />
                  </div>
                )}
              />

              <ProtectedRoutes
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/payment-center`}
                component={PaymentCenter}
              />

              <ProtectedRoutes
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/bank-payments`}
                component={BankPayments}
              />

              <ProtectedRoutes
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/payment-account`}
                component={PaymentAccount}
              />
              <ProtectedRoutes
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/update-payment-account`}
                component={UpdatePaymentAccount}
              />
              <ProtectedRoutes
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/ready-for-payment`}
                component={ReadyForPayment}
              />
              <ProtectedRoutes
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/payment-history`}
                component={PaymentHistory}
              />
              <Route
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/logout`}
                render={(props) => (
                  <Fragment>
                    <Header {...props} />
                    <Logout {...props} />
                    <Footer />
                  </Fragment>
                )}
              />
              <Route
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/TermsOfService`}
                render={(props) => (
                  <Fragment>
                    <Header {...props} />
                    <TermsOfService {...props} />
                    <Footer />
                  </Fragment>
                )}
              />

              <Route
                isLoggedIn={isLoggedIn}
                path={`${config.baseName}/:clientSlug/nopagefound`}
                render={(props) => (
                  <Fragment>
                    <Header {...props} />
                    <NoPageFound {...props} />
                    <Footer />
                  </Fragment>
                )}
              />

              <Route
                render={(props) => (
                  <Fragment>
                    <Header {...props} />
                    <NoPageFound {...props} />
                    <Footer />
                  </Fragment>
                )}
              />
            </Switch>
          </React.Fragment>
        </BrowserRouter>

        {showModal &&
          this.renderAlertMessage(
            "You Have Been Idle!",
            "You will get signed out. Do you want to stay signed in?",
            showModal
          )}
        <SnackbarComponent />
      </div>
    );
  }

  renderAlertMessage = (title, message, showModal) => {
    return (
      <IdleTimeOutModal
        open={showModal}
        title={title}
        message={message}
        onConfirm={() => this.keepUpdateSession()}
      />
    );
  };
}

export default connect((state) => ({ ...state.user }))(withRouter(App));
