import axios from "axios";
import config from "../../../config";
import { IPaymentData } from "./ssl.interface";

const initPayment = async (paymentData: IPaymentData) => {
  try {
    const data = {
      store_id: config.ssl.ssl_store_id,
      store_passwd: config.ssl.ssl_store_passwd,
      total_amount: paymentData?.amount,
      currency: "BDT",
      tran_id: paymentData?.transactionId,
      success_url: `https://flstshare-server.vercel.app/api/v1/payment/success?tran_id=${paymentData?.transactionId}&amount=${paymentData?.amount}`,
      fail_url: config.ssl.ssl_fail_url,
      cancel_url: config.ssl.ssl_cancel_url,
      ipn_url: config.ssl.ssl_ipn_url,
      shipping_method: "N/A",
      product_name: paymentData?.flat_name,
      product_category: "Electronic",
      product_profile: "N/A",
      cus_name: paymentData?.cus_name,
      cus_email: paymentData?.cus_email,
      cus_add1: paymentData?.cus_address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentData?.cus_phone,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "Bangladesh",
    };

    const response = await axios({
      method: "post",
      url: config.ssl.ssl_payment_url,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.ssl_validation_api}?val_id=${payload?.val_id}&store_id=${config.ssl.ssl_store_id}&store_passwd=${config.ssl.ssl_store_passwd}&format=json`,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const SSLService = {
  initPayment,
  validatePayment,
};
