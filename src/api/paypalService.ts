import axios from 'axios';
import base64 from 'base-64';

const baseUrl = process.env['PAYPAL_BASEURL']
const clientId = process.env['PAYPAL_STORE_CLIENTID']
const clientSecret = process.env['PAYPAL_STORE_CLIENTSECRET']

const apiRoutes = {
  authTokenRoute: '/v1/oauth2/token',
  purchaseRoute: '/v2/checkout/orders',
};

// get token
export const getAuthToken = async () => {
  try {
    const response = await axios.post(
      `${baseUrl}${apiRoutes.authTokenRoute}`,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + base64.encode(`${clientId}:${clientSecret}`),
        },
      },
    );

    //    if(response){
    //    console.log(response.data)
    console.log('api 1 working::token');
    return response.data;
    //    }
  } catch (error) {
    console.log('api 1 failed::token');

    console.log(error.response ? error.response.data : error.message);
  }
};

// make purchase order
export const makePurchaseRequest = async (token, orderData) => {
  const orderDetails = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: `${orderData?.price.toFixed(2)}`,
          // 110
          // "value": `${orderData?.price}`
        },
      },
    ],
    application_context: {
      return_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    },
  };

  try {
    const response = await axios.post(
      `${baseUrl}${apiRoutes.purchaseRoute}`,
      orderDetails,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response);
    console.log('api 2 working::makePurchaseRequest');
    return response.data;
  } catch (error) {
    console.log('api 2 failed::makePurchaseRequest');
    console.log(error.response ? error.response.data : error.message);
  }
};

// capture purchare order to place order
export const capturePaymentForPurchase = async (token, order_id) => {
  try {
    console.log('token and order id', token, order_id);
    const response = await axios.post(
      `${baseUrl}${apiRoutes.purchaseRoute}/${order_id}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('response from capture payment success====>', response);
    console.log('api 3 working::capturePaymentPurchase');
    return response.data;
  } catch (error) {
    console.log('api 3 failed::capturePaymentPurchase');
    console.log(error.response ? error.response.data : error.message);
  }
};
