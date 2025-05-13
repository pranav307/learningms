export default function VerificationEmail({ username, otp }) {
    return (
      <div>
        <h1>Hello {username}</h1>
        <p>Your OTP for email verification is: {otp}</p>
        <p>This will expire after 1 hour.</p>
      </div>
    );
  }
  