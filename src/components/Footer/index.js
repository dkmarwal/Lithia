import React from 'react';
import usbankLogo from '~/assets/images/lithia/usbank-logo.png'
import { Box, Typography, Link} from '@material-ui/core'

const Footer = () => {
    return ( 
        <Box component="footer">
          <Box className="footer-inner">
            <Typography variant="h3" className="footer-title">Driveway Payments</Typography>
            <Typography className="small" variant="p">Streamlining digital payments for our customers, <br />in partnership with U.S. Bank.</Typography>
            <Box className="mt-15 mb-5"><img src={usbankLogo} className="footerlogo" alt="" /></Box>
            <Box className="clearfix" />
            <hr />
            <Box className="clearfix" />
            <ul>
              <li><Link href='https://www.lithia.com/lithia-privacy.htm' target="_blank" rel="noopener noreferrer">Privacy Policy</Link></li>
              <li className="faq"><Link href='https://www.driveway.com/faq' target="_blank" rel="noopener noreferrer">FAQs</Link></li>
            </ul>
            <p className="small mt-25 mb-0">© 2023 U.S. Bank. All Rights Reserved.</p>
          </Box>
      </Box>  
    )
}

export default Footer