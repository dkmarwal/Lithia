import React, { Component } from "react";
import DrivewayLogo from "~/assets/images/lithia/driveway-logo.svg";
import config from "~/config";
import { connect } from "react-redux";
import { logout } from "~/redux/actions/user";
import { Box, Link} from '@material-ui/core'

class Header extends Component {
  constructor(props) {
    super();
  }

  logout = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    const { isSSO } = this.props?.user?.info;

    this.props.dispatch(logout(isSSO)).then(() => {
      this.props.history.push(`${config.baseName}/${routeParam}/logout`);
    });
  };


  render() {
    const { isLoggedIn } = this.props;
   
    return (
        <Box component="header"> 
        <Box className="container-fluid">
          <Box className="row">
            <Box className="header-toprow">
              Driveway Payments powered by U.S. Bank
            </Box>
            {isLoggedIn ? (
              <Box component="nav" className="navbar navbar-default">
                <Box className="navbar-header">
                 
                  <Box className="logo">
                  <Link href="payment-center" rel="noreferrer"> 
                    <img src={DrivewayLogo} alt="Driveway" />
                    </Link>
                  </Box>
                 
                </Box>
                <Box className="btn-wrap">
                  <button
                    type="button"
                    className="btn-border header-btn"
                    onClick={() => {
                      this.logout();
                    }}
                  >
                    Log Out
                  </button>
                </Box>
              </Box>
            ): null}
          </Box>
        </Box>
        </Box>
     
    );
  }
}

export default connect((state) => ({ ...state.user }))(
 (Header)
);
