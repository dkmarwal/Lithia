import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getPaymentDetails } from '~/redux/helpers/account';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import config from '~/config';
import {PaymentType} from '../../config/bankTypes';
import { Box, Typography, Link, CircularProgress } from '@material-ui/core';

class PaymentAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    this.getUserPayItem();
  }

  getUserPayItem = async () => {
    const paymentDetails = await getPaymentDetails();
    this.setState({
      data: paymentDetails?.data,
      loading: false,
    });
  };

  updateAccountInfo = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    this.props.history.push(
      `${config.baseName}/${routeParam}/update-payment-account`
    );
  };

  goBackBtn = () => {
    this.props.history.push('/payment-center');
  };

  paymentTypeTxt = () => {
    const { data } = this.state;
    
    if(data.primaryPaymentMethodId === PaymentType.RTP) {
      return <>{`${data.paymentMethodInfo?.paymentCode}`}<sup>&reg;</sup></>
    } else {
      return data.paymentMethodInfo?.paymentCode;
    }
  }

  render() {
    const { data, loading } = this.state;
    const { history } = this.props;

    return (
      <>
        {loading ? (
          <Box
            width='100vw'
            height='100vh'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <CircularProgress color='primary' size={40} />
          </Box>
        ) : (
          <Box className='main-wrapper'>
            <Box className='global-wrap payment-account'>
              <Box className='mb-4' onClick={() => history.goBack()}>
                <i className='icon-ico-arrow-back bluetxt fa-lg' />
                <Link href='#' className='no-underline ml-5'>
                  Back
                </Link>
              </Box>
              <Typography variant='h1' className='main-title'>
                Payment Account
              </Typography>
              <Typography className='description'>
                You’re all set to receive direct digital payments. You can make
                changes by updating your bank account information.
              </Typography>
              <Box className='row'>
                <Box className='col-xs-12 col-md-12'>
                  <Box className='card card-details mb-15'>
                    <Box className='two-cols'>
                      <Typography variant='h3' className='card-subtitle m-0'>
                        Bank Account
                      </Typography>
                      {/* <span className="badge badge-green mb-0">Active</span> */}
                    </Box>
                    <Box className='form-details mt-20'>
                      <Box className='form-wrap col-xs-12 col-md-12 mt-1'>
                        <label>Routing Number</label>
                        <Box className='value'>
                          {data && data.consumerBankAccountDetails
                            ? data.consumerBankAccountDetails?.routingNumber
                            : ''}
                        </Box>
                      </Box>
                      <Box className='seperator col-xs-12 col-md-12' />
                      <Box className='form-wrap col-xs-12 col-md-12'>
                        <label>Account number</label>
                        <Box className='value'>
                          {data && data.consumerBankAccountDetails
                            ? data.consumerBankAccountDetails?.accountNumber
                            : ''}
                        </Box>
                      </Box>
                      <Box className='seperator col-xs-12 col-md-12' />
                      <Box className='form-wrap col-xs-12 col-md-12'>
                        <label>Bank Name</label>
                        <Box className='value text-uppercase'>
                          {data && data.consumerBankAccountDetails
                            ? data.consumerBankAccountDetails?.bankName.toUpperCase()
                            : ''}
                        </Box>
                      </Box>
                      <Box className='seperator col-xs-12 col-md-12' />
                      <Box className='form-wrap col-xs-12 col-md-12'>
                        <label>Type of account</label>
                        <Box className='value'>
                          {data &&
                          data?.consumerBankAccountDetails?.accountTypeId === 1
                            ? 'Checking Account'
                            : data?.consumerBankAccountDetails
                                ?.accountTypeId === 2
                            ? 'Savings Account'
                            : ''}
                        </Box>
                      </Box>
                      <Box className='seperator col-xs-12 col-md-12' />
                      <Box className='form-wrap col-xs-12 col-md-12'>
                        <label>Payment Type</label>
                        <Box className='value'>
                          {this.paymentTypeTxt()}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {data.primaryPaymentMethodId === 128 && (
                  <Box className='col-xs-12 col-md-11 rtp-disclaimer mt-0'>
                    RTP<sup className="trade">&reg;</sup> is a registered service mark of The
                    Clearing House Payments Company L.L.C.
                  </Box>
                )}
              </Box>

              <Box className='mt-25 pt-5'>
                <button
                  type='button'
                  className='btn-border btn-xs-block'
                  onClick={this.updateAccountInfo}
                >
                  Update Account Information
                </button>
              </Box>
              <Box className='notification mt-25'>
                <Box component='span'>
                  <InfoOutlinedIcon />
                </Box>
                <Typography>
                  Updates to your account information will not affect payments
                  already in process.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </>
    );
  }
}

export default withRouter(PaymentAccount);
