const axios = require('axios');

const sendSms = async (to, message) => {
  try {
    const username = process.env.AT_USERNAME || 'sandbox';
    const apiKey = process.env.AT_API_KEY || 'mock_api_key';
    
    console.log(`[AFRICA'S TALKING MOCK API] Sending SMS to ${to}: "${message}"`);
    
    // In production, use the africastalking npm package or standard Axios request
    /*
    const credentials = { apiKey, username };
    const AfricasTalking = require('africastalking')(credentials);
    const sms = AfricasTalking.SMS;
    
    const options = {
        to: [to],
        message: message
    };
    
    const response = await sms.send(options);
    return response;
    */
    
    return {
      SMSMessageData: {
        Message: "Sent to 1/1 Total Cost: KES 0.8000",
        Recipients: [{
          status: "Success",
          statusCode: 101,
          number: to,
          messageId: "ATXid_47f1c546"
        }]
      }
    };
  } catch (error) {
    console.error("SMS sending failed:", error.message);
    throw error;
  }
};

module.exports = {
  sendSms
};
