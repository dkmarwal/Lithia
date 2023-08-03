import React, { Component } from 'react';
import DrivewayLogo from '~/assets/images/lithia/driveway-logo.svg';
import {
  getConsumerInfo,
  getMobileNumer,
  textMecode,
} from '~/redux/helpers/user';

import { userOTPverify } from '~/redux/actions/user';
import { connect } from 'react-redux';
import config from '~/config';
import { Box, Typography, Link } from '@material-ui/core';
import CaseMsg from '~/components/CaseMsg';
import CircularProgress from '@material-ui/core/CircularProgress';
import {PaymentType} from '~/config/bankTypes'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textMeCode: 'Text me a Code',
      data: '',
      isOtpSent: false,
      isOtpVerified: false,
      loading: false,
      isEnrollLink: false,
      isExpired: false,
      isLocked: false,
      isMsg: '',
      pageLoading: false,
      otp: false,
      notification: { message: '' },
      phoneNumber: '',
      fields: {
        enterCode: '',
      },
      errors: {
        enterCode: '',
      },
    };
  }

  componentDidMount() {
    this.fetchUserMobileNo();
  }


  fetchUserMobileNo = async () => {
    const enrollID = this.props.enrollmentId;
    this.setState({ pageLoading: true });
    const res = await getMobileNumer(enrollID);
    if (res?.data.isLocked || res?.error) {
      this.setState({ isLocked: true, pageLoading: false, isMsg: res?.message });
    } 
    else if (res && !res.error) {
      this.setState({ data: res.data, pageLoading: false });
    } else if (res?.data.invalidUrl) {
      this.setState({ isEnrollLink: true, pageLoading: false });
    } else if (res?.data.isExpired) {
      this.setState({ isExpired: true, pageLoading: false });
    } else {
      return false;
    }
  };

  handleOtp = async (e) => {
    e.preventDefault();
    this.setState({ 
      fields: {
        enterCode: '',
      },
    });
    const enrollID = this.props?.enrollmentId;
    const response = await textMecode(enrollID);
    this.setState({ 
      otp: true, 
      textMeCode: 'Resend Code' ,
    });

    if(response?.data.isLocked) {
      this.setState({ isLocked: true, pageLoading: false, isMsg: response?.message});
      window.scroll(0, 0);
    }
    return response;
  };

  changeRoute = async () => {
    const { history, user } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    const id = user?.info?.consumerId;
    const resp = await getConsumerInfo(id);
    if (resp && !resp.error) {
      if (resp.data?.consumerStatusId === PaymentType.RTP) {
        history.push(`${config.baseName}/${routeParam}/bank-payments`);
      } else {
        history.push(`${config.baseName}/${routeParam}/payment-center`);
      }
    } else {
      this.setState({
        notification: {
          message: resp?.message ?? 'Oops! Something went wrong.',
        },
      });
    }
  };

  validate = (name, value) => {
    if(name === "enterCode"){
      if (!value) {
        return 'Please enter your OTP number.';
      } else if (!value.match(/[0-9]/g) || value.match(/[A-Za-z]/g)) {
        return 'The OTP code must be numeric only';
      } 
      // else if (value.length < 6) {
      //   return 'Please enter a valid 6-digit OTP number';
      // } 
      else if (value.length > 7) {
        return 'The OTP code provided is invalid';
      } else {
        return '';
      }
    } return ''
  };

  handleChange = (e) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [e.target.name]: this.validate(e.target.name, e.target.value),
      },
      fields: {
        ...this.state.fields,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSubmissionError = () => {
    const { user } = this.props;
    if (user?.data?.isLocked) {
      const showMsg = user?.error;
      this.setState({ isLocked: true, pageLoading: false, isMsg: showMsg });
      window.scroll(0, 0);
    } else {
      this.setState(() => ({
        notification: {
          message: user?.error ?? 'Oops! Something went wrong.',
        },
        loading: false,
      }));
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { fields } = this.state;
    let validationErrors = {};
    Object.keys(fields).forEach((name) => {
      const error = this.validate(name, fields[name]);
      if (error && error.length > 0) {
        validationErrors[name] = error;
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      this.setState({ errors: validationErrors });
      return;
    }

    if (fields.enterCode) {
      this.setState({ loading: true });
      const valueEnterCode = {
        enterCode: fields.enterCode.toString(),
      };

      const enrollID = this.props?.enrollmentId;
      await this.props
        .dispatch(userOTPverify(valueEnterCode.enterCode, enrollID))
        .then((response) => {
          if (
            response
            // &&
            // !response.error &&
            // response?.message === "Otp Successfully Verified"
          ) {
            this.changeRoute();
            this.setState({ loading: false });
          } else {
            this.handleSubmissionError();
          }
          // else if (response?.data?.isLocked) {
          //   const showMsg = response.message;
          //   this.setState({ isLocked: true, pageLoading: false, isMsg: showMsg});
          //   window.scroll(0, 0);
          // }

          // else {
          //   this.setState(() => ({
          //     notification: {
          //       message: response?.message ?? "Oops! Something went wrong.",
          //     },
          //     loading: false,
          //   }));
          // }
        });
    }
  };

  render() {
    const {
      data,
      fields,
      errors,
      textMeCode,
      loading,
      notification,
      pageLoading,
      isEnrollLink,
      isLocked,
      isExpired,
      isMsg,
    } = this.state;
    const isEnabled =
      isNaN(fields.enterCode) ||
      fields.enterCode?.length < 6 ||
      data?.phoneNumber?.length < 10
        ? false
        : true;

    return (
      <>
        {pageLoading ? (
          <Box
            width='100vw'
            height='100vh'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <CircularProgress color='primary' size={40} />{' '}
          </Box>
        ) : isEnrollLink ? (
          <CaseMsg
            DrivewayLogo={DrivewayLogo}
            textMsg='You may have entered an incorrect URL, Check the URL you have
          entered is correct.'
          />
        ) : isLocked ? (
          <CaseMsg DrivewayLogo={DrivewayLogo} textMsg={isMsg+'.'} />
        ) : isExpired ? (
          <CaseMsg
            DrivewayLogo={DrivewayLogo}
            textMsg=' Enrollment Link is not Available. Please contact customer
          service for more details.'
          />
        ) : (
          <Box className='main-wrapper'>
            <Box className='login-wrap'>
              <Box className='header'>
                <img
                  src={DrivewayLogo}
                  alt='Driveway'
                  width='122'
                  height='32'
                />
              </Box>
              <Box className='clearfix' />
              <Typography variant='h1' className='title'>
                Payment Center Log In
              </Typography>
              <Box className='notification'>
                <Typography>
                  We'll send a verification code to your mobile device ending in{' '}
                  {data && data?.phoneNumber
                    ? data?.phoneNumber?.slice(6, 10)
                    : 'Loading...'}
                  . Request your code, then enter it below to continue.
                </Typography>
              </Box>
              <Box className='workarea'>
                <form onSubmit={this.handleSubmit} autoComplete='off'>
                  <Box className='form-group'>
                    <label htmlFor='phoneNumber'>Mobile Number</label>
                    <div className='icon-wrap'>
                      <input
                        type='text'
                        className={`form-control form-icon ${
                          errors.phoneNumber?.length > 0 && 'errorfield'
                        } `}
                        value={
                          data && data?.phoneNumber
                            ? data.phoneNumber
                            : 'Loading...' || ''
                        }
                        name='phoneNumber'
                        disabled
                        maxLength={10}
                        onChange={this.handleChange}
                      />
                    </div>
                    <Box component='span' className='otptxt'>
                      <Link href='#' onClick={this.handleOtp}>
                        {textMeCode}
                      </Link>
                    </Box>
                    {errors.phoneNumber?.length > 0 && (
                      <Typography className='errortxt'>
                        {errors.phoneNumber}
                      </Typography>
                    )}
                    <Box className='text-right mt-10'>
                      <Link
                        href='https://www.usbank.com/about-us-bank/privacy.html'
                        className='link'
                        target='_blank'
                        rel='noopener noreferrer'
                        underline='always'
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        href='https://qc-payee.incedopay.com/nirajclient/TermsOfService'
                        className='link'
                        target='_blank'
                        rel='noopener noreferrer'
                        underline='always'
                      >
                        Terms of Service
                      </Link>
                    </Box>
                  </Box>

                  <Box className='form-group'>
                    <label htmlFor='enterCode'>Enter Code</label>
                    <input
                      type='text'
                      className={`form-control ${
                        errors.enterCode?.length > 0 && 'errorfield'
                      } `}
                      placeholder='Enter code here'
                      value={fields.enterCode}
                      autoComplete='off'
                      name='enterCode'
                      maxLength={6}
                      disabled={this.state.otp ? false : true}
                      onChange={this.handleChange}
                    />

                    {errors.enterCode?.length > 0 ? (
                      <Typography className='errortxt'>
                        {errors?.enterCode || data?.message}
                      </Typography>
                    ) : notification.message ? (
                      <Typography className='errortxt'>
                        {
                          (notification.message =
                            'Your code is invalid, please try again')
                        }
                      </Typography>
                    ) : (
                      <Typography className='infomsg mt-5'>
                        {data?.otpValidityMessage}
                      </Typography>
                    )}
                  </Box>

                  <Box className='butt-wrap'>
                    <button
                      type='submit'
                      className='btn-primary btn-block btn-large'
                      disabled={!isEnabled}
                    >
                      {loading ? (
                        <CircularProgress color='inherit' size={20} />
                      ) : (
                        'Get Started'
                      )}
                    </button>
                  </Box>

                  <Typography className='footermsg'>
                    Having trouble signing in? Your valet will be able to help
                    you get access when they arrive for your vehicle inspection.
                  </Typography>
                </form>
              </Box>
            </Box>
          </Box>
        )}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(Login);
