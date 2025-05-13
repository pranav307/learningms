export default function VerificationEmail(_ref) {
  var username = _ref.username,
    otp = _ref.otp;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Hello ", username), /*#__PURE__*/React.createElement("p", null, "Your OTP for email verification is: ", otp), /*#__PURE__*/React.createElement("p", null, "This will expire after 1 hour."));
}
