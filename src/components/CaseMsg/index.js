import React from "react";
import { Box, Typography } from "@material-ui/core";
const CaseMsg = ({ DrivewayLogo, textMsg }) => {
  return (
    <Box className="main-wrapper">
      <Box className="login-wrap">
        <Box className="header">
          <img src={DrivewayLogo} alt="Driveway" width="122" height="32" />
        </Box>
        <Box className="clearfix" />
        <Box className="notification">
          <Typography>{textMsg}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default CaseMsg;
