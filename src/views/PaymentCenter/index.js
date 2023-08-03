import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import iconDollar from "~/assets/images/lithia/icon-dollar.png";
import iconFile from "~/assets/images/lithia/icon-file.png";
import config from "~/config";
import { connect } from "react-redux";
import { Box, Typography, Link as MuiLink} from "@material-ui/core";

class PaymentCenter extends Component {
  componentDidMount() {
    window.scroll(0, 0);
  }

  render() {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
      return (
      <Box className="main-wrapper">
        <Box className="global-wrap payment-center">
          <Typography variant="h1" className="main-title">Driveway Payments Center</Typography>
          <Box className="deco small">
            <i className="icon-decoration" />
          </Box>
          <p className="description">
            You can review and update your payment account information, or see
            the status of your digital payments. We’re here to help.
          </p>
          <Box className="row">
            <Box className="col-xs-12 col-md-12">
              <Box className="mainnav">
                <ul>
                  <li>
                    <Box className="menu-title">Account </Box>
                    <Link
                      to={`${config.baseName}/${routeParam}/payment-account`}
                    >
                      <img src={iconDollar} alt="icon Dollar" />
                      Payment Account
                    </Link>
                  </li>
                  <li>
                    <Box className="menu-title">Activity </Box>
                    <Link
                      to={`${config.baseName}/${routeParam}/payment-history`}
                    >
                      <img src={iconFile} alt="icon File" />
                      Payment History
                    </Link>
                  </li>
                </ul>
              </Box>
            </Box>
          </Box>
          <Box className="mt-15 xs-mt-20 xs-pt-10">
          <MuiLink href="https://www.driveway.com/" target="_blank" rel="noopener noreferrer">
            <button type="button" className="btn-primary btn-xs-block">
              Visit Driveway
            </button>
            </MuiLink>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user }))(withRouter(PaymentCenter))
