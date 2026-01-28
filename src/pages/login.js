export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function LoginRemoved() {
  return null;
}
/* REMOVED: legacy login page (auth/session disabled)
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OTPInput from "react-otp-input";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
export default function LoginPage() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (resetStep === 1 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resetStep, resendTimer]);

  // Forgot Password Handlers
  const handleForgotOpen = () => {
    setForgotOpen(true);
    setResetStep(0);
  };

  const handleForgotClose = () => {
    setForgotOpen(false);
    setForgotEmail("");
    setResetOtp("");
    setResetPassword("");
    setResetConfirmPassword("");
    setForgotLoading(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!forgotEmail) return toast.error("Enter a valid email");

      setForgotLoading(true);
      const data = new FormData();
      data.append("phone", "+" + forgotEmail);
      await adminApi.post("/api/forgot-password", data);
      toast.info("OTP sent to your phone");
      setResetStep(1);
      setResendTimer(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const data = new FormData();
      data.append("phone", "+" + forgotEmail);
      await adminApi.post("/api/send-otp", data);
      toast.success("OTP resent successfully");
      setResendTimer(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || !resetPassword || !resetConfirmPassword)
      return toast.error("Please fill all fields");
    if (resetPassword !== resetConfirmPassword)
      return toast.error("Passwords do not match");

    try {
      setForgotLoading(true);
      const data = new FormData();
      data.append("phone", "+" + forgotEmail);
      data.append("otp", resetOtp);
      data.append("password", resetPassword);
      await adminApi.post("/api/reset-password", data);
      toast.success("Password reset successful");
      handleForgotClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setForgotLoading(false);
    }
  };

  // Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) return toast.error("Please fill all fields");

      setLoading(true);
      const data = new FormData();
      data.append("email", email);
      data.append("password", password);
      data.append("role", "buyer");

      const res = await adminApi.post("/api/login", data);
      if (res?.status === "success") {
        localStorage.setItem("api_token", res?.data?.api_token);
        router.push("/products");
      }
    } catch (error) {
      if (error?.response?.data?.data?.status === "phone_not_verified") {
        setPhone(error?.response?.data?.data?.phone || "");
        setShowOtp(true);
        toast.info("Verify OTP to continue");
      } else {
        toast.error("Invalid Credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("email", email);
      data.append("otp", otp);
      data.append("phone", phone);

      const res = await adminApi.post("/api/verify-otp", data);
      if (res?.status === "success") {
        localStorage.setItem("api_token", res?.data?.user?.api_token);
        router.push("/");
      }
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: theme.palette.background.subtle,
      "& fieldset": { border: `1px solid ${theme.palette.divider}` },
      "&:hover fieldset": { border: `1px solid ${theme.palette.primary.main}` },
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.palette.primary.main}`,
      },
      color: theme.palette.text.primary,
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
  };

  const otpStyle = {
    width: 45,
    height: 50,
    margin: 6,
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.subtle,
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: 20,
  };

  const phoneStyle = {
    width: "100%",
    background: theme.palette.background.subtle,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    height: 50,
    color: theme.palette.text.primary,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: { xs: "100%", md: 850 },
          minHeight: 520,
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 28px 60px rgba(4,6,8,0.55)",
        }}
      >
        {/* Left */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              "url(https://res.cloudinary.com/dbxjpuupy/image/upload/v1766603718/ChatGPT_Image_Dec_25_2025_12_45_14_AM_iuxzup.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: theme.palette.common.white,
            px: 4,
            textAlign: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
            }}
          />
          <Box sx={{ position: "relative" }}>
            <Typography fontSize={18} fontWeight={600}>
              Wholesale Leville Inc.
            </Typography>
            <Typography fontSize={32} fontWeight={700}>
              Welcome Back
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.85 }}>
              Trade premium fragrances with ease.
            </Typography>
          </Box>
        </Box>

        {/* Right side */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: theme.palette.background.paper,
          }}
        >
          <AnimatePresence mode="wait">
            {!forgotOpen && !showOtp && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <Typography fontSize={24} fontWeight={700} textAlign="center">
                  Login
                </Typography>

                <form
                  onSubmit={handleLogin}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={inputStyles}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={inputStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    sx={{
                      background: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      textTransform: "none",
                      "&:hover": { background: theme.palette.primary.light },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: theme.palette.primary.contrastText }}
                      />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>

                <Button
                  variant="text"
                  sx={{ color: theme.palette.primary.main, textTransform: "none" }}
                  onClick={handleForgotOpen}
                >
                  Forgot Password?
                </Button>

                <Divider />

                <Typography fontSize={14} textAlign="center">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Register
                  </Link>
                </Typography>
              </motion.div>
            )}

            {/* OTP Verification */}
            {showOtp && !forgotOpen && (
              <motion.div
                key="otpVerify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Typography>Enter OTP</Typography>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} style={otpStyle} />}
                />
                <Button
                  fullWidth
                  onClick={handleOtpSubmit}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": { background: theme.palette.primary.light },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: theme.palette.primary.contrastText }}
                    />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </motion.div>
            )}

            {/* Forgot Password Pages */}
            {forgotOpen && resetStep === 0 && (
              <motion.div
                key="forgot-email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%" }}
              >
                <Typography fontSize={24} fontWeight={700} textAlign="center">
                  Forgot Password
                </Typography>
                <form
                  onSubmit={handleForgotSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginTop: 20,
                  }}
                >
                  <PhoneInput
                    country="us"
                    value={forgotEmail}
                    onChange={setForgotEmail}
                    inputStyle={phoneStyle}
                    buttonStyle={{
                      border: `1px solid ${theme.palette.divider}`,
                      background: theme.palette.background.elevated,
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={forgotLoading}
                    sx={{
                      background: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": { background: theme.palette.primary.light },
                    }}
                  >
                    {forgotLoading ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: theme.palette.primary.contrastText }}
                      />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>

                  <Button
                    variant="text"
                    sx={{ color: theme.palette.primary.main }}
                    onClick={handleForgotClose}
                  >
                    Back to Login
                  </Button>
                </form>
              </motion.div>
            )}

            {forgotOpen && resetStep === 1 && (
              <motion.div
                key="forgot-otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%" }}
              >
                <Typography fontSize={22} textAlign="center">
                  Verify OTP & Reset Password
                </Typography>

                <OTPInput
                  value={resetOtp}
                  onChange={setResetOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} style={otpStyle} />}
                />

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    variant="text"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || resendLoading}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontSize: 14,
                    }}
                  >
                    {resendLoading ? (
                      <CircularProgress
                        size={16}
                        sx={{ color: theme.palette.primary.main }}
                      />
                    ) : resendTimer > 0 ? (
                      `Resend OTP in ${resendTimer}s`
                    ) : (
                      "Resend OTP"
                    )}
                  </Button>
                </Box>

                <form
                  onSubmit={handleResetPassword}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginTop: 20,
                  }}
                >
                  <TextField
                    label="New Password"
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    fullWidth
                    sx={inputStyles}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    fullWidth
                    sx={inputStyles}
                  />

                  <Button
                    type="submit"
                    disabled={forgotLoading}
                    sx={{
                      background: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": { background: theme.palette.primary.light },
                    }}
                  >
                    {forgotLoading ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: theme.palette.primary.contrastText }}
                      />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <Button
                    variant="text"
                    sx={{ color: theme.palette.primary.main }}
                    onClick={handleForgotClose}
                  >
                    Back to Login
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
}

*/
