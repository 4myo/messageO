import "dotenv/config"

export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
    CLIENT_URL: process.env.CLIENT_URL,
}