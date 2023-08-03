import React from "react"
import DrivewayLogo from "~/assets/images/lithia/driveway-logo.svg";
import { Box, Typography, Link } from '@material-ui/core'; 

const TermsOfService = () => {
    return (
        <Box className="main-wrapper">
          <Box className="login-wrap">
            <Box className="header">
              <img src={DrivewayLogo} alt="Driveway" width="122" height="32" />
            </Box>
            <Box className="clearfix" />
            <Typography variant='h1' className="title">Terms Of Service</Typography>
            <Box className="notification">
                  <Typography>
                    The U.S. Bank Payment program uses short code 52272 to alert consumers of action needed to receive a pending payment.
                    The consumer should contact the company payer referenced in the message with questions about the payment.
                    Our client privacy policy may be viewed at <Link href="https://www.usbank.com/privacy/" rel="noopener noreferrer" target="_blank">https://www.usbank.com/privacy/</Link> contact information may be found at <Link href="https://www.usbank.com/en/personal/PersonalCustomerService.cfm" target="_blank" rel="noopener noreferrer" style={{wordBreak: "break-word"}}>https://www.usbank.com/en/personal/PersonalCustomerService.cfm</Link>.
                    The consumer may reply to the message with the word "HELP" to receive additional information, or STOP to be added to our opt-out list.
                    This is a one-time message; no further communication will be sent.
                    The mobile carriers are not liable for delayed or undelivered messages.
                </Typography>
            </Box>
          
           
          </Box>
        </Box>
      );
}
export default TermsOfService