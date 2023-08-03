import React,{useEffect} from "react";
import DrivewayLogo from "~/assets/images/lithia/driveway-logo.svg";
import { Box, Typography, Link } from "@material-ui/core";

const Logout = () => {

  useEffect(()=> {
    window.scroll(0, 0);
  }, [])
  return (
    <Box className="main-wrapper">
      <Box className="login-wrap">
        <Box className="header">
          <img src={DrivewayLogo} alt="Driveway" />
        </Box>
        <Box className="clearfix"/>
        <Typography variant="h1" className="title">
          You've been logged out
        </Typography>
        <Box className="notification">
          <Typography>
            Please use the link provided in your email to log back in.
          </Typography>
        </Box>

        <Typography className="mt-25">
          Having trouble logging in?{" "}
          <Box component="span" className="stylelink">
            <Link
              href="tel:+1-888.378.3929"
              rel="noopener noreferrer"
            >
              Call Us (888) DRV-EWAY
            </Link>
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default Logout;
