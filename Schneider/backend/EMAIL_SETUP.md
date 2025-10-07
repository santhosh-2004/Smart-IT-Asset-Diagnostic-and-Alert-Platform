# Email Setup Guide for Schneider Factory Monitor

## Gmail App Password Setup

To enable email functionality (password reset), you need to set up a Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to Security → App passwords
2. Select "Mail" as the app and "Other" as the device
3. Click "Generate"
4. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")

### Step 3: Configure the Backend

**Option A: Environment Variable (Recommended)**
```bash
# Windows PowerShell
$env:GMAIL_APP_PASSWORD="your-16-character-app-password"

# Windows Command Prompt
set GMAIL_APP_PASSWORD=your-16-character-app-password

# Linux/Mac
export GMAIL_APP_PASSWORD="your-16-character-app-password"
```

**Option B: Update server.js directly**
Edit the `loadEmailConfig()` function in `server.js`:
```javascript
emailConfig.transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: data.email,
    pass: 'your-16-character-app-password' // Replace this
  }
});
```

### Step 4: Set Admin Email
1. Start the backend server
2. Open the frontend application
3. Click "Admin" and log in
4. Click "Set/Change Email" and enter your Gmail address
5. The system will now be able to send password reset emails

### Troubleshooting

**"Invalid login" or "Application-specific password required"**
- Make sure you're using the App Password, not your regular Gmail password
- Ensure 2-Factor Authentication is enabled
- Check that the App Password is exactly 16 characters

**"Network error" in frontend**
- Check that the backend server is running
- Verify the email endpoints are working: `http://localhost:3001/api/admin/set-email`
- Check browser console for specific error messages

**Email not sending**
- Verify the Gmail App Password is correct
- Check that the admin email is set in the system
- Look for error messages in the backend console

### Security Notes
- Never commit your App Password to version control
- Use environment variables for production deployments
- The App Password is specific to this application and can be revoked if needed 