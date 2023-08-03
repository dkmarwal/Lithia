import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import checkdetails from '~/assets/images/lithia/checkdetails.png';
import Modals from '~/components/Modals';
import NotificationModals from '~/components/Modals/NotificationModals';
import { updateConsumerInfo } from '~/redux/helpers/user';
import { getPaymentDetails, fetchBankName } from '~/redux/helpers/account';
import {
  Box,
  Typography,
  Link,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import config from '~/config';
import TextField from '~/components/TextField';
import MaskInput from '~/components/MaskInput';
import InstantBanking from '../BankPayments/instantBanking';
import MXLogo from '~/assets/icons/MX_logo.png';
import { saveMXAccount } from '~/redux/helpers/payments';

class UpdatePaymentAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleBtn: true,
      modelPopup: false,
      data: [],
      notification: { message: '', isOpen: false },
      fields: {
        bankAccountId: '',
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
      paymentDetailsdata:[]
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    this.getUserPay();
    this.getUserPayItem();
  }

  getUserPayItem = async () => {
    const response = await getPaymentDetails();
    this.setState({
      paymentDetailsdata: response.data, 
    });
  };

  getUserPay = async () => {
    const res = await getPaymentDetails();
    const filterData = res.data?.consumerBankAccountDetails;
    this.setState((prevState) => ({
      fields: {
        ...prevState?.fields,
        routingNumber: filterData?.routingNumber,
        accountNumber: filterData?.accountNumber,
        confirmAcNo: filterData?.accountNumber,
        accountType: filterData?.accountTypeId,
        bankName: filterData?.bankName,
        bankAccountId: filterData?.bankAccountId,
      },
    }));
  };

  getRoutingNumber = async (routingNum = null) => {
    try {
      const { fields } = this.state;
      this.setState((prevState) => ({
        fields: {
          ...prevState?.fields,
          bankName: '',
        },
      }));
     
      const res = await fetchBankName(routingNum ? routingNum : fields?.routingNumber);
      const getBankName = await res.data?.[0];
      if (getBankName) {
        this.setState((prevState) => ({
          fields: {
            ...prevState?.fields,
            bankName: getBankName?.bankName,
          },
        }));
      } else { 
        this.setState((prevState) => ({
          errors: {
            ...prevState?.errors,
            routingNumber: 'Invalid Routing Number.',
          },
        }));

        this.setState((prevState) => ({
          fields: {
            ...prevState?.fields,
            bankName: '',
          },
        }));
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  handleAddBtn = () => {
    this.setState({ ...this.state, toggleBtn: !this.state.toggleBtn });
  };
  showPopup = (e) => {
    e.preventDefault();
    this.setState({ ...this.state, modelPopup: !this.state.modelPopup });
  };
  showNotification = (e) => {
    e.preventDefault();
    this.setState({ ...this.state, notification: { isOpen: false } });
  };

  readyForPayment() {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    this.props.history.push(
      `${config.baseName}/${routeParam}/ready-for-payment`
    );
  }

  updateUserPayItem = async (data) => {
    const bankId = this.state.fields?.bankAccountId;
    const response = await updateConsumerInfo(data, bankId);
    if (!response.error) {
      this.readyForPayment();
      this.setState({ data: response?.data });
      await this.getUserPay();
    } else {
      this.setState(() => ({
        notification: {
          message: response?.message ?? 'Something went wrong.',
          isOpen: true,
        },
      }));
    }
  };

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
    console.log(e.target.value.length);
    if(e.target.value.length > 8) {
      this.getRoutingNumber(e.target.value);
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
        routingNumber: fields?.routingNumber,
        accountNumber: fields?.accountNumber,
        bankName: fields?.bankName,
        accountType: fields?.accountType,
      };
      await this.updateUserPayItem(data);
    }
  };

  handleAccountsList = (accountsList, userId) => {
    this.setState({
      mxAccountsList: accountsList,
      showAccountsList: true,
      userId:userId,
    },() => {
      this.accountDetails()
    });
  };
  accountDetails = () => {
   const {paymentDetailsdata,mxAccountsList}=this.state; 
   const accountType = paymentDetailsdata.consumerBankAccountDetails.accountType;
   const selectAccountList = mxAccountsList.filter((item) => {
    return item.Type.toLowerCase().includes(accountType.toLowerCase());
   })
   const selectAccountListGuid = selectAccountList[0].AccountGuid;
   this.setState({
    selectedAccount: selectAccountListGuid,
   });
  }
  handleAccountSelection = ({ target }) => {
    this.setState({
      selectedAccount: target.value,
    });
  };

  renderAccountsList = () => {
    const { selectedAccount, mxAccountsList } = this.state;
    window.scroll(0, 0);
    return (
      <>
        <RadioGroup
          value={selectedAccount}
          onChange={this.handleAccountSelection}
          style={{
            border: '1px solid #000',
            padding:'16px',
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
        notification:{
          isOpen: true,
          message: 'Please select an account to share',
        }
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
              notification:{
                isOpen: true,
                message: 'Oops! Something went wrong.',
              }
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

  render() {
    const {
      data,
      errors,
      fields,
      notification,
      showAccountsList,
      selectedAccount,
    } = this.state;
    const { history } = this.props;
    return (
      <>
        <Box className='main-wrapper'>
          <Box className='global-wrap update-payment'>
            {showAccountsList ? (
              <Box className='mb-2'>
                <img src={MXLogo} alt='MX_Logo' width={60} />
              </Box>
            ) : (
              <Box className='mb-2' onClick={() => history.push(`${config.baseName}/Driveway.com/payment-center`)}>
                <i className='icon-ico-arrow-back bluetxt fa-lg'></i>{' '}
                <Link
                  href='#'
                  className='no-underline ml-1'
                  rel='noopener noreferrer'
                >
                  Back
                </Link>
              </Box>
            )}
            <Typography variant='h1' className='main-title'>
              {showAccountsList
                ? 'Select an account to share with Driveway.com'
                : 'Update Your Payment Account'}
            </Typography>
            {!showAccountsList ? (
              <>
                <Typography className='description'>
                  To update your account, you can log in to your bank or
                  manually enter your information.
                </Typography>
                <Box className='sub-title'>Bank Connection Options</Box>

                <Box className='row'>
                  <Box className='col-xs-12 col-md-12'>
                    <Box className='card'>
                      <Box component='span' className='badge badge-green'>
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
                      <InstantBanking
                        handleAccountsList={this.handleAccountsList}
                        {...this.props}
                      />
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
                        <Box className='row box-row'>
                          <Box className='col-xs-12 col-md-12'>
                            <Typography variant='h4' className='sectitle'>
                              Enter your bank account info
                            </Typography>
                            <Box className='chqlink'>
                              <Link
                                href='#'
                                rel='noopener noreferrer'
                                onClick={this.showPopup}
                              >
                                Here’s how to find your bank info
                              </Link>
                            </Box>
                            <form onSubmit={this.handleSubmit}>
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
                                  // onBlur={this.getRoutingNumber}
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

                                {errors.routingNumber?.length > 0 && (
                                  <Typography className='errortxt'>
                                    {errors?.routingNumber || data?.message}
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
                                      value={fields.accountType}
                                      onChange={this.handleChange}
                                    >
                                      <option value={2}>Savings Account</option>
                                      <option value={1}>Checking Account</option>
                                    </select>
                                  </Box>
                                </Box>
                              </Box>

                              <Box className='form-group mt-20'>
                                <label>Bank Name</label>
                                <input
                                  type='text'
                                  className='form-control text-uppercase'
                                  value={fields?.bankName}
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
                              <Box className='clearfix' />
                              <button
                                type='submit'
                                className='btn-primary btn-block mt-20 xs-mt-10'
                              >
                                Add Account
                              </button>
                            </form>
                          </Box>
                        </Box>
                      )}
                      <Box className='btn-box'>
                        <button
                          type='button'
                          className='btn-border btn-block'
                          onClick={this.handleAddBtn}
                        >
                          {this.state.toggleBtn ? 'Close' : 'Add Bank Details'}
                          <i
                            className={`${
                              this.state.toggleBtn
                                ? 'icon-ico-arrow-up'
                                : 'icon-ico-arrow-down'
                            } btn-arrow arrow-cls`}
                          />
                        </button>
                      </Box>
                      {this.state.toggleBtn && (
                      <Box className='mt-25 pt-6'>
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

export default connect((state) => ({
  ...state.user,
}))(withRouter(UpdatePaymentAccount));
