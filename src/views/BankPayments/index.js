import React, { Component } from 'react';
import checkdetails from '~/assets/images/lithia/checkdetails.png';
import Modals from '~/components/Modals';
import NotificationModals from '~/components/Modals/NotificationModals';
import { addConsumerInfo, getUserProfile, getConsumerInfo } from '~/redux/helpers/user';
import { fetchBankName } from '~/redux/helpers/account';
import {
  Box,
  Typography,
  Link,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import config from '~/config';
import MaskInput from '~/components/MaskInput';
import { connect } from 'react-redux';
import InstantBanking from './instantBanking';
import MXLogo from '~/assets/icons/MX_logo.png';
import { saveMXAccount } from '~/redux/helpers/payments';
import TextField from '~/components/TextField';

class BankPayments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleBtn: false,
      modelPopup: false,
      data: [],
      loading: false,
      notification: { message: '', isOpen: false },
      fields: {
        routingNumber: '',
        accountNumber: '',
        confirmAcNo: '',
        accountType: 1,
        bankName: '',
        preferenceType: '',
      },
      errors: {
        routingNumber: '',
        accountNumber: '',
        confirmAcNo: '',
        accountType: 1,
        bankName: '',
        preferenceType: '',
      },
      showAccountsList: false,
      mxAccountsList: null,
      selectedAccount: null,
      saveLoader: false,
      userId: null,
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    this.getUserName();
  }

  showNotification = (e) => {
    e.preventDefault();
    this.setState({ ...this.state, notification: { isOpen: false } });
  };
  getUserName = async () => {
    const res = await getUserProfile();
    const { user } = this.props;
    const id = user?.info?.consumerId;
    const resp = await getConsumerInfo(id);
    this.setState({ data: res?.data, companyName: resp?.data.companyName, payeeType: resp?.data.payeeType});
  };

  getRoutingNumber = async () => {
    try {
      const { fields } = this.state;
      const res = await fetchBankName(fields?.routingNumber);
      const getBankName = await res.data?.[0];
      this.setState((prevState) => ({
        fields: {
          ...prevState?.fields,
          bankName: getBankName?.bankName,
        },
      }));
    } catch (error) {
      console.log('=>', error);
    }
  };

  handleAddBtn = () => {
    this.setState({ ...this.state, toggleBtn: !this.state.toggleBtn });
  };
  showPopup = (e) => {
    e.preventDefault();
    this.setState({ ...this.state, modelPopup: !this.state.modelPopup });
  };

  readyForPayment() {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    this.props.history.push(
      `${config.baseName}/${routeParam}/ready-for-payment`
    );
  }

  validate = (name, value) => {
    const { fields } = this.state;
    switch (name) {
      case 'routingNumber':
        if (!value) {
          return 'Please enter your routing number.';
        } else if (value.length < 9) {
          return 'Please enter a valid 9-digit Routing Number.';
        } else if (value.length > 10) {
          return 'The Routing Number provided is invalid.';
        } else if (!value.match(/[0-9]/g) || value.match(/[A-Za-z]/g)) {
          return 'Routing Number must be numeric only';
        } else {
          return '';
        }

      case 'accountNumber':
        if (!value) {
          return 'Please enter your account number.';
        } else if (value.length < 1 || value.length > 17) {
          return 'The Account Number provided is invalid.';
        } else if (!value.match(/[0-9]/g) || value.match(/[A-Za-z]/g)) {
          return 'Account number must be numeric only';
        } else {
          return '';
        }
      case 'confirmAcNo':
        if (!value) {
          return 'Please confirm your account number to verify.';
        } else if (!value.match(/[0-9]/g) || value.match(/[A-Za-z]/g)) {
          return 'Confirm Account number must be numeric only';
        } else if (value !== fields.accountNumber) {
          return 'Account number and confirm account number must be same.';
        } else {
          return '';
        }

      default: {
        return '';
      }
    }
  };

  handleChange = (e) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [e.target.name]: this.validate(e.target.name, e.target.value),
      },
      fields: {
        ...this.state.fields,
        [e.target.name]: e.target.value.replace(/[^0-9]/g, ''),
      },
    });
  };

  updateUserPayItem = async (data) => {
    const bankId = this.state.fields?.bankAccountId;
    const response = await addConsumerInfo(data, bankId);
    if (!response.error) {
      this.readyForPayment();
      this.setState({ data: response?.data });
      //  await this.getUserPay();
    } else {
      this.setState(() => ({
        notification: {
          message: response?.message ?? 'Oops! Something went wrong.',
          isOpen: true,
        },
      }));
    }
  };

  handleSubmit = async (e) => {
    const { fields } = this.state;
    e.preventDefault();
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

    if (
      fields.routingNumber &&
      fields.accountNumber &&
      fields.bankName &&
      fields.accountType
    ) {
      const data = {
        routingNumber: fields.routingNumber,
        accountNumber: fields.accountNumber,
        bankName: fields.bankName,
        accountType: fields.accountType,
      };
      await this.updateUserPayItem(data);
    }
  };

  handleAccountsList = (accountsList, userId) => {
    this.setState({
      mxAccountsList: accountsList,
      showAccountsList: true,
      userId: userId,
    });
  };
  handleAccountSelection = ({ target }) => {
    this.setState({
      selectedAccount: target.value,
    });
  };

  renderAccountsList = () => {
    const { selectedAccount, mxAccountsList } = this.state;
    return (
      <>
        <RadioGroup
          value={selectedAccount}
          onChange={this.handleAccountSelection}
          style={{
            border: '1px solid #000',
            padding: '16px',
          }}
        >
          {mxAccountsList?.map((item) => {
            return (
              <FormControlLabel
                key={item.AccountGuid}
                value={item.AccountGuid}
                control={<Radio />}
                label={`${item.Type} (${item.AccountNumberMasked})`}
              />
            );
          })}
        </RadioGroup>
      </>
    );
  };

  handleSaveData = () => {
    const { selectedAccount, userId } = this.state;
    const { user } = this.props;
    if (!selectedAccount) {
      this.setState({
        notification: {
          isOpen: true,
          message: 'Please select an account to share',
        },
      });
    } else {
      this.setState({
        saveLoader: true,
      });
      saveMXAccount(userId, selectedAccount, user?.info?.clientId)
        .then((res) => {
          if (res && !res.error) {
            this.setState({
              saveLoader: false,
            });
            this.readyForPayment();
          } else {
            this.setState({
              saveLoader: false,
            });
            this.setState({
              notification: {
                isOpen: true,
                message: 'Oops! Something went wrong.',
              },
            });
          }
        })
        .catch((error) => {
          this.setState({
            saveLoader: false,
          });
          console.log(error);
        });
    }
  };

  getDisplayName = () => {
    const {data, companyName, payeeType} = this.state;
    return payeeType === 'Business' ? companyName : data.displayName;
  }

  render() {
    const {
      data,
      fields,
      errors,
      notification,
      loading,
      showAccountsList,
      selectedAccount,
    } = this.state;

    return (
      <>
        <Box className='main-wrapper'>
          <Box className='global-wrap'>
            {showAccountsList ? (
              <Box className='mb-5'>
                <img src={MXLogo} alt='MX_Logo' width={60} />
              </Box>
            ) : (
              <Typography className='welcome-note m-0'>Welcome,</Typography> 
            )}
            <Typography variant='h1' className='main-title'>
              {data && data?.displayName
                ? showAccountsList
                  ? 'Select an account to share with Driveway.com'
                  : this.getDisplayName()
                : 'Loading...'}
            </Typography>
            {!showAccountsList ? (
              <>
                {' '}
                <Box className='deco'>
                  <i className='icon-decoration' />
                </Box>
                <Typography className='description'>
                  Get your cash faster with a digital payment. Just log in to
                  your bank or connect your account manually to receive a direct
                  deposit.
                </Typography>
                <Box className='sub-title'>Bank Connection Options</Box>
                <Box className='row'>
                  <Box className='col-xs-12 col-md-12'>
                    <Box className='card'>
                      <Box components='span' className='badge badge-green'>
                        Recommended
                      </Box>
                      <Typography variant='h3' className='card-title'>
                        Instant Connection
                      </Typography>
                      <Typography className='extra'>
                        Sign in to your bank to securely connect your account.
                        The fastest way to get set up for a digital payment.
                      </Typography>
                      <Box className='clearfix' />
                      <InstantBanking handleAccountsList={this.handleAccountsList} {...this.props} />
                      {/* <Box className="btn-box">
                    <button type="button" className="btn-primary btn-block">
                      Log In to Your Bank
                    </button>
                  </Box> */}
                    </Box>
                    <Box className='card'>
                      <Typography variant='h3' className='card-title mt-0'>
                        Manual Connection
                      </Typography>
                      <Typography className='card-description'>
                        If your bank does not support Instant Connection, you
                        can manually enter the routing number and your personal
                        account number.
                      </Typography>
                      {this.state.toggleBtn && (
                        <>
                        <Box className='row box-row'>
                          <Box className='col-xs-12 col-md-12'>
                            <Typography variant='h4' className='sectitle'>
                              Enter your bank account info
                            </Typography>
                            <Box className='chqlink'>
                              <Link href='#' onClick={this.showPopup}>
                                Here’s how to find your bank info
                              </Link>
                            </Box>
                            <form
                              onSubmit={this.handleSubmit}
                              autoComplete='off'
                            >
                              <Box className='form-group'>
                                <label>Routing Number</label>
                                <input
                                  type='text'
                                  placeholder='Enter your routing number here'
                                  className={`form-control ${
                                    errors.routingNumber?.length > 0 &&
                                    'errorfield'
                                  } `}
                                  value={fields.routingNumber}
                                  name='routingNumber'
                                  maxLength={9}
                                  onChange={this.handleChange}
                                  onBlur={this.getRoutingNumber}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onCopy={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onCut={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onDrag={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                />
                                {errors.routingNumber?.length > 0 && (
                                  <Typography className='errortxt'>
                                    {errors?.routingNumber}
                                  </Typography>
                                )}
                              </Box>
                              {/* <Box className='form-group'>
                                <label>Account Number</label>
                                <input
                                type='text'
                                placeholder='Enter your account number here'
                                className={`form-control ${
                                  errors.accountNumber?.length > 0 &&
                                  'errorfield'
                                } `}
                                value={fields.accountNumber}
                                name='accountNumber'
                                label='Account Number'
                                maxLength='17'
                                errors={errors?.accountNumber}
                                onChange={this.handleChange}
                                onBlur={this.getRoutingNumber}
                                getvalue={(val) => {
                                  this.setState((prevState) => ({
                                    fields: {
                                      ...this.state.fields,
                                      accountNumber: val,
                                    },
                                  }));
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onCut={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onDrag={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                autoComplete='off'
                              />
                              {errors.accountNumber?.length > 0 && (
                                  <Typography className='errortxt'>
                                    {errors?.accountNumber}
                                  </Typography>
                                )}
                              </Box>
                              <Box className='form-group'>
                                <label>Confirm Account Number</label>
                                <input
                                type='text'
                                placeholder='Enter your account number here'
                                className={`form-control ${
                                  errors.confirmAcNo?.length > 0 &&
                                  'errorfield'
                                } `}
                                value={fields.confirmAcNo}
                                name='confirmAcNo'
                                label='Account Number'
                                maxLength='17'
                                errors={errors?.confirmAcNo}
                                onChange={this.handleChange}
                                onBlur={this.getRoutingNumber}
                                getvalue={(val) => {
                                  this.setState((prevState) => ({
                                    fields: {
                                      ...this.state.fields,
                                      confirmAcNo: val,
                                    },
                                  }));
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onCut={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onDrag={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                autoComplete='off'
                              />
                              {errors.confirmAcNo?.length > 0 && (
                                  <Typography className='errortxt'>
                                    {errors?.confirmAcNo}
                                  </Typography>
                                )}
                              </Box> */}
                              
                              <MaskInput
                                autoComplete='off'
                                placeholder='Enter your account number here'
                                value={fields.accountNumber}
                                name='accountNumber'
                                label='Account Number'
                                maxLength={17}
                                errors={errors?.accountNumber}
                                getvalue={(val) => {
                                  this.setState((prevState) => ({
                                    fields: {
                                      ...this.state.fields,
                                      accountNumber: val,
                                    },
                                  }));
                                }}
                              />
                              <MaskInput
                                autoComplete='off'
                                placeholder='Enter your account number here'
                                value={fields.confirmAcNo}
                                name='confirmAcNo'
                                label='Confirm Account Number'
                                maxLength={17}
                                errors={errors?.confirmAcNo}
                                getvalue={(val) => {
                                  this.setState((prevState) => ({
                                    fields: {
                                      ...this.state.fields,
                                      confirmAcNo: val,
                                    },
                                  }));
                                }}
                              />
                              <Box className='form-group'>
                                <label>Account Type</label>
                                <Box className='customselect'>
                                  <Box className='select'>
                                    <select
                                      className='form-control'
                                      name='accountType'
                                      onChange={this.handleChange}
                                      value={fields.accountType}
                                    >
                                      <option value={1}>Savings Account</option>
                                      <option value={2}>Checking Account</option>
                                    </select>
                                  </Box>
                                </Box>
                              </Box>

                              <Box className='form-group mt-20'>
                                <label>Bank Name</label>
                                <input
                                  type='text'
                                  className='form-control text-uppercase'
                                  value={fields.bankName}
                                  name=' '
                                  maxLength={17}
                                  disabled
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onCopy={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onCut={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onDrag={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  autoComplete='off'
                                />
                              </Box>
                              {notification.message && (
                                <Typography className='errortxt'>
                                  {notification.message}
                                </Typography>
                              )}
                              <Box className='clearfix' />
                              <button
                                type='submit'
                                className='btn-primary btn-block mt-20 xs-mt-10 mb-30'
                              >
                                {loading ? (
                                  <CircularProgress color='inherit' size={20} />
                                ) : (
                                  ' Add Account'
                                )}
                              </button>
                            </form>
                          </Box>
                        </Box>
                      </>
                      )}
                      <Box className='btn-box'>
                        <button
                          type='submit'
                          className='btn-border btn-block'
                          onClick={this.handleAddBtn}
                        >
                          {this.state.toggleBtn ? 'Close' : 'Add Bank Details'}{' '}
                          <i
                            className={`${
                              this.state.toggleBtn
                                ? 'icon-ico-arrow-down'
                                : 'icon-ico-arrow-up'
                            } btn-arrow`}
                          />
                        </button>
                      </Box>
                      {this.state.toggleBtn && (
                      <Box className='mt-25 pt-5'>
                        <Box component='span' className='disclaimer'>
                          Review your entries carefully. Once your payment is
                          sent, the transaction cannot be canceled. Driveway
                          will not refund, and disclaims liability for, payments
                          sent to incorrectly entered accounts.
                        </Box>
                      </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              this.renderAccountsList()
            )}
            {showAccountsList && (
              <Box className='btn-box'>
                <button
                  type='button'
                  className='btn-primary btn-block mt-20 xs-mt-10 mb-5'
                  onClick={this.handleSaveData}
                  disabled={!selectedAccount}
                >
                  CONTINUE
                </button>
              </Box>
            )}
          </Box>
        </Box>
        {notification.isOpen && (
          <NotificationModals
            title='PLEASE NOTE'
            text={notification.message}
            closeBtn={this.showNotification}
            closeBtnText='OK'
          />
        )}
        {this.state.modelPopup && (
          <Modals
            img={checkdetails}
            alt='Cheque Details'
            title='Bank Details'
            text='Here’s where to find your account information'
            closeBtn={this.showPopup}
            closeBtnText='Close'
          />
        )}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(BankPayments);
