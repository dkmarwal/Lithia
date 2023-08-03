import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Box, Backdrop } from "@material-ui/core";
import App from "./App";
import { connect } from "react-redux";
import config from "~/config";
import { CircularProgress } from "@material-ui/core";
import { fetchSSODetails, consumerDetails } from "~/redux/helpers/sso.js";
import Unauthorise from "~/views/Unauthorise";

import "~/lithia.css";

export class Wrapper extends React.Component {
  getSSODetails(token) {
    return fetchSSODetails(token);
  }

  deleteAllCookies() {
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
  
  }

  getConsumerDetails = (clientSlugURL) => {
    return consumerDetails(clientSlugURL);
  };

  render() {
    return (
      <Box>
        <Switch>
         
          <Route
            key={1}
            exact
            path={`${config.baseName}/ssologin`}
            render={(props) => {
              const params = new Map(
                window.location.search
                  .slice(1)
                  .split("&")
                  .map((param) => param.split("="))
              );
              let token = params.get("token");

              this.deleteAllCookies();
              // this.setCookie("@consumerAccessToken", token);
              // sessionStorage.setItem(`@consumerAccessToken`, token);

              this.getSSODetails(token).then((response) => {
                if (response.error) {
                  this.props.history.push(`${config.baseName}/unauthorized`);
                  return false;
                }
                const clientSlugURL =
                  response.data?.userData?.slugURL || "page";
                this.deleteAllCookies();
                sessionStorage.setItem(
                  `@consumerAccessToken_${clientSlugURL}`,
                  response.data.accessToken
                );
                sessionStorage.setItem(
                  `@consumerRefreshToken_${clientSlugURL}`,
                  response.data.refreshToken
                );
                sessionStorage.setItem(
                  `@consumerUserId_${clientSlugURL}`,
                  response.data.userData.userId
                );
                // this.setCookie(`@consumerAccessToken_${clientSlugURL}`, response.data.accessToken);
                // this.setCookie(`@consumerRefreshToken_${clientSlugURL}`, response.data.refreshToken);
                // this.setCookie(`@consumerUserId_${clientSlugURL}`, response.data.userData.userId);
                if (clientSlugURL) {
                  this.getConsumerDetails(clientSlugURL).then((response) => {
                    if (response.error) {
                      props.history.push(`${config.baseName}/unauthorized`);
                      return false;
                    }
                    if (response?.data?.consumerStatusId === 128) {
                      props.history.push({
                        pathname: `${config.baseName}/${clientSlugURL}/paymentRegistration`,
                        state: {
                          isVerified: true,
                        },
                      });
                      return false;
                    } else {
                      props.history.push(
                        `${config.baseName}/${clientSlugURL}/dashboard`
                      );
                      return false;
                    }
                  });
                  //window.location.href = `${config.baseName}/${clientSlugURL}`;
                } else {
                  props.history.push(
                    `${config.baseName}/${clientSlugURL}/nopagefound`
                  );
                  //window.location.href = `${config.baseName}/page/nopagefound`;
                }
              });

              return (
                <Box>
                  <Backdrop open={true}>
                    <CircularProgress style={{ color: "#fff" }} />
                  </Backdrop>
                </Box>
              );
            }}
          />

          <Route
            key={2}
            exact
            path={`${config.baseName}/unauthorized`}
            component={Unauthorise}
          />
          <Route key={3} path={"/"} component={App} />
        </Switch>
      </Box>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(withRouter((props) => <Wrapper {...props} />));
