import React, { Component } from 'react';
import iconFileZoom from '~/assets/images/lithia/icon-file-zoom.png';
import artwork from '~/assets/images/lithia/artwork.png';
import { getPaymentDetails } from '~/redux/helpers/account';
import { logout } from '~/redux/actions/user';
import { connect } from 'react-redux';
import config from '~/config';
import { Box, Typography, CircularProgress, Link } from '@material-ui/core';
import { fetchAccountTypes } from '~/redux/helpers/account';
import { PaymentType } from '../../config/bankTypes'

class ReadyForPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      accountTypes: [],
      loading: true,
      showAccountsList: false
    };
  }
  componentDidMount() {
    window.scroll(0, 0);
    this.getUserPayItem();
  }
  logout = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    const { isSSO } = this.props?.user?.info;

    this.props.dispatch(logout(isSSO)).then(() => {
      this.props.history.push(`${config.baseName}/${routeParam}/logout`);
    });
  };

  getUserPayItem = async () => {
    const response = await getPaymentDetails();
    const accountTypes = await fetchAccountTypes();
    this.setState({
      data: response.data,
      accountTypes: accountTypes.data,
      showAccountsList: true,
      loading: false,
    });
  };

  viewAccount = async () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    await this.props.history.push(
      `${config.baseName}/${routeParam}/payment-center`
    );
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
    const { data, loading, showAccountsList } = this.state;
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
            <Box className='global-wrap ready-for-payment'>
            <Box className="mb-3" onClick={()=>  showAccountsList ? history.push(`${config.baseName}/Driveway.com/payment-center`) : history.goBack() }>
            <i className="icon-ico-arrow-back bluetxt fa-lg" />{" "}
            <Link href="javascript:void(0)" className="no-underline">
              Back
            </Link>
            </Box>
              <Typography variant='h1' className='main-title'>
                Ready For Payment
              </Typography>
              <Typography className='description'>
                Once your transaction is complete, we'll deposit your payment.
              </Typography>
              <Box className='row'>
                <Box className='col-xs-12 col-md-12'>
                  <Box className='card card-details'>
                    <Box className='two-cols'>
                      <Typography variant='h3' className='card-subtitle m-0'>
                        Bank Account
                      </Typography>
                      {/* <span className="badge badge-green mb-0">Active</span> */}
                    </Box>
                    <Box className='form-details mt-21'>
                      <Box className='form-wrap col-xs-12 col-md-12'>
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
                        <Box className='value'>
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
                          {/* {data && data.paymentMethodInfo
                            ? data.paymentMethodInfo?.description
                            : ''}{' '} */}
                            {this.paymentTypeTxt()}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {data.primaryPaymentMethodId === PaymentType.RTP && (
                  <Box className='col-xs-12 col-md-11 mt-25 rtp-disclaimer'>
                    RTP<sup>&reg;</sup> is a registered service mark of The
                    Clearing House Payments Company L.L.C.
                  </Box>
                )}
                {data.primaryPaymentMethodId === PaymentType.RTP && (
                <Box className='form-wrap col-xs-12 col-md-12 mt-10 mb-25'>
                  <img src={iconFileZoom} className='pull-left' alt='' />
                  <Box className='col-xs-10 col-md-11 note'>
                    Good news! Your bank supports Real Time Payments. That means
                    payments can transfer in under a minute.
                  </Box>
                </Box>
                )}
                {data.primaryPaymentMethodId === 2 &&
                <Box className='form-wrap col-xs-12 col-md-12 mt-25 mb-25'>
                  <img src={iconFileZoom} className='pull-left' alt='' />
                  <Box className='col-xs-10 col-md-11 note'>
                    Good news! Your bank supports ACH payments. That means you will be paid 1-3
                    days after your transaction is complete.
                  </Box>
                </Box>
                }
              </Box>

              <Box className='two-cols mtb-20'>
                <button
                  type='button'
                  className='btn-border btn-large xs-mb-15'
                  onClick={this.viewAccount.bind(this)}
                >
                  View Bank Account
                </button>
                <button
                  type='button'
                  className='btn-border btn-large'
                  onClick={() => {
                    this.logout();
                  }}
                >
                  Log Out
                </button>
              </Box>
              <Box className='clearfix' />
              <Box className='marketing-banner mt-20'>
                <Box>
                  <Typography variant='h2' className='banner-title'>
                    Looking for a new ride?
                  </Typography>
                  <Box className='link'>
                    Shop Driveway <i className='icon-ico-arrow-back' />
                  </Box>
                </Box>
                <Box className='mt-15'>
                  <img src={artwork} alt='' />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(ReadyForPayment);
