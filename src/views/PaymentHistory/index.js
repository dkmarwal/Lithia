import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { userPaymentHistory } from "~/redux/helpers/user";
import generatePDF from "~/module/GeneratePDF/";
import { CSVLink } from "react-csv";
import { connect } from "react-redux";
import { Box, Typography, Link } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {PaymentType} from '../../config/bankTypes'

const csvHeaders = [
  { label: "Payment Date", key: "ValueDate" },
  { label: "Payment Reference", key: "PaymentRef" },
  { label: "Payment Type", key: "PaymentTypeDesc" },
  { label: "Amount", key: "Amount" },
  { label: "Payment Status", key: "PaymentStatus" },
];

class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessType: 2,
      data: {},
      isLoading: false,
      paymentType: []
    };
  }
  componentDidMount() {
    window.scroll(0, 0);
    this.payUserHistory();
  }


  payUserHistory = async () => {
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    const clientId = sessionStorage.getItem(`@consumerUserId_${clientURL}`);
    const params = {
      payeeID: clientId || "",
      businessType: this.state.businessType || "",
    };
    try {
      this.setState({ isLoading: true });
      const res = await userPaymentHistory(params);
      res.data.lstPaymentDetailsByPayeeId.forEach((field) => {
        this.state.paymentType.push(field.PaymentTypeID)
      });
      this.setState({ data: res.data });
      this.setState({ isLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  handleDownloadPDF = async () => {
    this.setState({ isLoading: true });
    if (
      this.state.data &&
      this.state.data?.lstPaymentDetailsByPayeeId?.length > 0
    ) {
    
      const title = "Payment History";
      const date = Date().split(" ");
      const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
      const fileName = `payment_history_${dateStr}.pdf`;
      await generatePDF(fileName);
      this.setState({ isLoading: false });
    }
  };

  paymentTypeTxt = (payment) => {    
    if(payment.PaymentTypeID === PaymentType.RTP) {
      return <>Bank Account (<span className="pdfTblColSpacing">RTP</span><sup>&reg;</sup>)</>
    } else {
      return payment.PaymentTypeDesc;
    }
  }


  render() {
    const { data, isLoading, paymentType } = this.state;
    const { history } = this.props;
    const csvRows = [];
    if (data && data?.lstPaymentDetailsByPayeeId) {
      data.lstPaymentDetailsByPayeeId.forEach((field) => {
        csvRows.push({ ...field, Amount: `$${field.Amount}` });
      });
    }

    return (
      <Box className="main-wrapper">
        <Box className="global-wrap payment-history">
          <Box className="mb-4" onClick={()=>  history.goBack()}>
            <i className="icon-ico-arrow-back bluetxt fa-lg" />{" "}
            <Link href="#" className="no-underline ml-1">
              Back
            </Link>
          </Box>
          <Typography variant="h1" className="main-title">Payment History</Typography>

          <Typography className="description">
            You can see the status of pending and completed payments. Payments
            won’t be displayed until your car has sold and the deposit has been
            initiated.
          </Typography>
          { !data.TotalRecords && !isLoading && 
          <Typography variant="h3" className="card-subtitle m-0">
               No Transaction
          </Typography>
          }
          <Box className="row">
            <Box className="col-xs-12 col-md-12">
              <Typography variant="h3" align="center">
                {isLoading && <CircularProgress /> }
              </Typography>
              {data?.lstPaymentDetailsByPayeeId &&
                data?.lstPaymentDetailsByPayeeId.map((items, index) => {
                  return (
                    <Box>
                    <Box className="mb-15 card card-details" key={index}>
                      <Box className="two-cols">
                        <Typography variant="h3" className="card-subtitle m-0">
                          Transaction
                        </Typography>
                        <span className="badge badge-green mb-0">
                          {items?.PaymentStatus}
                        </span>
                      </Box>
                      <Box className="form-details mt-20">
                        <Box className="form-wrap col-xs-12 col-md-12 mt-1">
                          <label>Payment date</label>
                          <Box className="value">{items?.ValueDate}</Box>
                        </Box>
                        <Box className="seperator col-xs-12 col-md-12" />
                        <Box className="form-wrap col-xs-12 col-md-12">
                          <label>Payment Reference</label>
                          <Box className="value">{items?.PaymentRef}</Box>
                        </Box>
                        <Box className="seperator col-xs-12 col-md-12" />
                        <Box className="form-wrap col-xs-12 col-md-12">
                          <label>Payment Type </label>
                          <Box className="value">{this.paymentTypeTxt(items)}</Box>
                        </Box>
                        <Box className="seperator col-xs-12 col-md-12" />
                        <Box className="form-wrap col-xs-12 col-md-12">
                          <label>Amount</label>
                          <Box className="value bold bold-value">${items?.Amount}</Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                     
                  );
                })}
                {paymentType.includes(PaymentType.RTP) &&
                        <Box className='col-xs-12 col-md-11 rtp-disclaimer pl-0'>
                          RTP<sup className="trade">&reg;</sup> is a registered service mark of The
                          Clearing House Payments Company L.L.C.
                        </Box>
                      }
            </Box>
            <Box className="visible">
            <Box id="pdfHtml" className="col-xs-14 col-md-14 form-details">
              <Typography variant="h6" className="main-title">Payment History</Typography>
              <table style={{width: '100%', borderCollapse: "collapse"}}>
                <thead>
                  <tr>
                    <th className="pdfTblHead">Payment  Date</th>
                    <th className="pdfTblHead">Payment  Reference</th>
                    <th className="pdfTblHead">Payment  Type</th>
                    <th className="pdfTblHead">Amount</th>
                    <th className="pdfTblHead">Payment  Status</th>
                  </tr>
                </thead>
                <tbody> 
                {data?.lstPaymentDetailsByPayeeId &&
                      data?.lstPaymentDetailsByPayeeId.map((items, index) => {
                        return (
                  <tr>
                    <td className="pdfTblCol pdfTblColSpacing">{items.ValueDate}</td>
                    <td className="pdfTblCol">{items.PaymentRef}</td>
                    <td className="pdfTblCol">{this.paymentTypeTxt(items)}</td>
                    <td className="pdfTblCol">${items.Amount}</td>
                    <td className="pdfTblCol">{items.PaymentStatus}</td>
                  </tr>
                )})}
                </tbody>
              </table>
              {paymentType.includes(PaymentType.RTP) &&
                        <Box className='col-xs-10 col-md-11 rtp-disclaimer pl-0 mt-10'>
                          <span>RTP <sup>&reg;</sup></span> is a registered service mark of The
                          Clearing House Payments Company L.L.C.
                        </Box>
                      }
            </Box>
            </Box>
          </Box>
          {data?.TotalRecords > 0 && (
            <Box className="mt-20 pt-5">
              <Box className="row">
                <Box className="col-xs-12 col-md-6 box-btn">
                  <button
                    type="button"
                    className="btn-border btn-xs-block xs-mb-15 btn-wd"
                    onClick={this.handleDownloadPDF}
                  >
                    {isLoading ? <CircularProgress color="inherit" size={20}/> : "Download PDF"}
                  </button>
                </Box>
                <Box className="col-xs-12 col-md-6 box-btn">
                  <CSVLink
                    data={csvRows}
                    filename={"payment_history.csv"}
                    className="btn-border text-decoration-none"
                    headers={csvHeaders}
                  >
                    {isLoading ?<CircularProgress color="inherit" size={20}/> : "Download CSV"}
                  </CSVLink>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      
    );
  }
}

export default connect((state) => ({
  ...state.user,
}))(withRouter(PaymentHistory));
