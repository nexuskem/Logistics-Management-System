const axios = require('axios');

const getMpesaTokens = async () => {
  // Mock Token Generation
  // In production, hits Daraja API auth endpoint
  console.log("Generating M-Pesa Token...");
  return "mock_access_token_12345";
};

const sendStkPush = async (phoneNumber, amount, accountReference, transactionDesc) => {
  try {
    const token = await getMpesaTokens();
    const shortCode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    console.log(`[M-PESA MOCK API] STK Push sent to ${phoneNumber} for KES ${amount}`);
    
    // In production, make actual Axios post request to Safaricom Daraja API
    /*
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.APP_URL}/api/invoices/mpesa-callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
    */
    
    // Mock successful STK Push response
    return {
      MerchantRequestID: "29115-34620561-1",
      CheckoutRequestID: "ws_CO_19122019102010071",
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing"
    };

  } catch (error) {
    console.error('M-Pesa STK Push error:', error.message);
    throw error;
  }
};

module.exports = {
  getMpesaTokens,
  sendStkPush
};
