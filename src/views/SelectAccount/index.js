import React from 'react';
import { Box, Typography } from "@material-ui/core";
const SelectAccount = () => {
    return (
          <Box className="main-wrapper">
            <Box className="global-wrap">
              <Typography varianat="h1" className="main-title">Select Account</Typography>
              <p className="description">Only one account can be used to receive your Driveway Payment. Please select the account you would like to use.</p>             
              <Box className="row">
                <Box className="col-xs-12 col-md-12">
                  <Box className="card card-nobg">
                    <Box className="radiobox">
                      <Box className="radio">
                        <label className="custom-radio">
                          <input type="radio" name="radio" defaultChecked="checked" /><span>360 Savings ( **** 7504 )</span>
                          <span className="checkmark" />
                        </label>
                      </Box>
                      <Box className="radio">
                        <label className="custom-radio">
                          <input type="radio" name="radio" /><span>360 Checking (**** 8623 )</span>
                          <span className="checkmark" />
                        </label>
                      </Box>
                      <Box className="radio">
                        <label className="custom-radio">
                          <input type="radio" name="radio" /><span>360 Expense Management (**** 1948)</span>
                          <span className="checkmark" />
                        </label>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className="mt-25 pt-5"><button type="button" className="btn-primary btn-block">Continue</button></Box>
            </Box>
          </Box>
      );
    }
    
    export default SelectAccount