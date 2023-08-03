import _ from "lodash";
import { BankType } from './bankTypes';
const config = {
  all: {
    env: process.env.REACT_APP_STAGE || "USBANK_DEV",
    baseName: process.env.PUBLIC_URL,
    sessionTimeout: 1000 * 5 * 12 * 20, //20 min
    showPopupTime: 1000 * 5 * 12 * 1, //1 min
    bankTypeId: BankType.USBANK,
  },
  USBANK_DEV: {
    willTranslate: true,
    showCaptcha: true,
    disableContextMenu: false,
    apiBase: "https://b2cusbankapi.incedopay.com:30010/api",
    baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    notificationSocket: "https://b2cusbankapi.incedopay.com:30010",
    consumerService:"https://b2cusbankapi.incedopay.com:30010/api/consumer-service",
    masterCardService:"https://b2cusbankapi.incedopay.com:30010/api/mastercard-service",
    paymentService: "https://b2cusbankapi.incedopay.com:30010/api/payment-service",
    bankTypeId: BankType.USBANK,
    apiVersion: 'v2',
  },
  US_UAT: {
    willTranslate: true,
    showCaptcha: true,
    disableContextMenu: false,
    apiBase: "https://b2cusbankapiuat.incedopay.com:30010/api",
    baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    notificationSocket: "https://b2cusbankapiuat.incedopay.com:30010",
    consumerService:"https://b2cusbankapiuat.incedopay.com:30010/api/consumer-service",
    masterCardService:"https://b2cusbankapiuat.incedopay.com:30010/api/mastercard-service",
    paymentService: "https://b2cusbankapiuat.incedopay.com:30010/api/payment-service",
    bankTypeId: BankType.USBANK,
    apiVersion: 'v2',
  },
  US_QC: {
    willTranslate: true,
    showCaptcha: true,
    disableContextMenu: false,
    apiBase: "https://b2cusbankapiqc.incedopay.com:30010/api",
    baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    notificationSocket: "https://b2cusbankapiqc.incedopay.com:30010",
    consumerService:"https://b2cusbankapiqc.incedopay.com:30010/api/consumer-service",
    masterCardService:"https://b2cusbankapiqc.incedopay.com:30010/api/mastercard-service",
    paymentService: "https://b2cusbankapiqc.incedopay.com:30010/api/payment-service",
    bankTypeId: BankType.USBANK,
    apiVersion: 'v2',
  },

};

export default _.merge(config.all, config[config.all.env]);
