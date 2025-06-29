// const redis = require('../../lib/redis.js');
const { generateOTP } = require("../../utils/generateOTP.js");
const sendMail = require("../../utils/sendOTp.js");
const {Redis} = require('@upstash/redis')

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const OtpControllers = {
  sendOTP: async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const otp = generateOTP();
      await redis.set(email, otp, { ex: 300 }); // OTP valid for 5 minutes

      // Rate limiting to prevent spamming
      const throttleKey = `otp-throttle:${email}`;
      const attempts = await redis.incr(throttleKey);
      if (attempts === 1) {
        await redis.expire(throttleKey, 60); // Reset counter after 1 minute
      }
      if (attempts > 3) {
        return res.status(429).json({ message: 'Too many OTP requests. Please try again later.' });
      }
      
      const mailResult = await sendMail(email, otp);

      if (!mailResult || !mailResult.success) {
        return res.status(500).json({ 
          message: `Error sending OTP to ${email}`,
          error: mailResult?.error || 'Unknown error'
        });
      }

      return res.status(200).json({ 
        success: true,
        message: `OTP sent to ${email}`
      });
      
    } catch (error) {
      console.error('Error in sendOTP:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ 
          success: false,
          message: 'Email and OTP are required' 
        });
      }

      const redisOTP = await redis.get(email);

      if (!redisOTP) {
        return res.status(400).json({ 
          success: false,
          message: 'OTP has expired or is invalid' 
        });
      }
      console.log("from redis", redisOTP, typeof redisOTP);
      console.log("from body", otp, typeof otp);
      // Convert both to strings for comparison to handle type differences
      if (String(redisOTP) === String(otp)) {
        await redis.del(email); // Remove the OTP after successful verification
        return res.status(200).json({ 
          success: true,
          message: 'OTP verification successful' 
        });
      }

      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
      
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: error.message 
      });
    }
  }
};

module.exports = OtpControllers;