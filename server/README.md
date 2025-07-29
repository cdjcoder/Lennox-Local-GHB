# Gigante Print Media - Email Sending Backend

This is a simple Node.js/Express backend to handle email form submissions for the Gigante Print Media website.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Update the `.env` file with your email credentials:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=3000
   ```

   Note: For Gmail, you'll need to use an "App Password" instead of your regular password.
   [Learn how to create an App Password](https://support.google.com/accounts/answer/185833)

3. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

- `POST /api/send-email` - Accepts form data and sends emails (to both the website owner and the customer)

## Security Considerations

- Never commit your `.env` file with real credentials to version control
- Set up proper CORS rules in production