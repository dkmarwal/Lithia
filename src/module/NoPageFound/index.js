import React, {useEffect} from 'react';
import DrivewayLogo from "~/assets/images/lithia/driveway-logo.svg";
import { Box, Typography } from '@material-ui/core'; 

const NoPageFound = () => {
  useEffect(() => {
    window.scroll(0,0)
  },[])
    return (
        <Box className="main-wrapper">
          <Box className="login-wrap">
            <Box className="header">
              <img src={DrivewayLogo} alt="Driveway" width="122" height="32" />
            </Box>
            <Box className="clearfix" />
            <Typography variant='h1' className="title">Page Not Found 404</Typography>
            <Box className="notification">
              <Typography>
              We're sorry, but the page could not be found. The link may be outdated, or you may have entered the address (URL) incorrectly.
              </Typography>
            </Box>
           
          </Box>
        </Box>
      );
};

export default NoPageFound
