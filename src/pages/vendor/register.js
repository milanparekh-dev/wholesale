export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function VendorRegisterRemoved() {
  return null;
}

/* REMOVED: legacy vendor register page (auth/session disabled)
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OTPInput from "react-otp-input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import { useRouter } from "next/navigation";

export default function VendorRegisterPage() {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  // Step 3
  const [businessCertificate, setBusinessCertificate] = useState(null);
  const [taxCertificate, setTaxCertificate] = useState(null);
  const [ownerIdProof, setOwnerIdProof] = useState(null);
  const [bankStatement, setBankStatement] = useState(null);

  // Step 4
  const [otp, setOtp] = useState("");

  const handleNext = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setStep(2);
  };

  const handleBusinessNext = () => {
    if (
      !companyName ||
      !businessType ||
      !country ||
      !stateName ||
      !city ||
      !postalCode ||
      !fullAddress
    ) {
      toast.error("Please fill all business fields");
      return;
    }
    setStep(3);
  };

  const handleSubmitDocuments = async () => {
    if (
      !businessCertificate ||
      !taxCertificate ||
      !ownerIdProof ||
      !bankStatement
    ) {
      toast.error("Please upload all required documents");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", "+" + phone);
      formData.append("password", password);
      formData.append("company_name", companyName);
      formData.append("business_type", businessType);
      formData.append("country", country);
      formData.append("state", stateName);
      formData.append("city", city);
      formData.append("postal_code", postalCode);
      formData.append("full_address", fullAddress);
      formData.append("role", "vendor");
      formData.append("business_certificate", businessCertificate);
      formData.append("tax_certificate", taxCertificate);
      formData.append("ownerid_proof", ownerIdProof);
      formData.append("bank_statement", bankStatement);

      const response = await adminApi.post("/api/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === "success") {
        toast.success("Registration successful. Verify OTP.");
        setStep(4);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);
      formData.append("phone", "+" + phone);

      const response = await adminApi.post("/api/verify-otp", formData);
      if (response?.status === "success") {
        localStorage.setItem("api_token", response?.data?.user?.api_token);
        toast.success("OTP verified. Registration complete!");
        router.push("/vendor");
      } else {
        toast.error("Invalid OTP");
      }
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.background.subtle,
      borderRadius: 2,
      color: theme.palette.text.primary,
      "& fieldset": { border: `1px solid ${theme.palette.divider}` },
      "&:hover fieldset": { border: `1px solid ${theme.palette.primary.main}` },
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.palette.primary.main}`,
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  };

  const phoneStyle = {
    width: "100%",
    background: theme.palette.background.subtle,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    height: 50,
    color: theme.palette.text.primary,
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

  const primaryButton = {
    mt: 1,
    py: 1.3,
    fontWeight: 600,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textTransform: "none",
    "&:hover": { backgroundColor: theme.palette.primary.light },
  };

  const backButton = {
    mt: 1,
    py: 1.3,
    fontWeight: 600,
    backgroundColor: theme.palette.background.elevated,
    color: theme.palette.text.primary,
    textTransform: "none",
    border: `1px solid ${theme.palette.divider}`,
    "&:hover": { backgroundColor: theme.palette.background.subtle },
  };

  const uploadButton = {
    textTransform: "none",
    justifyContent: "flex-start",
    borderStyle: "dotted",
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.subtle,
    "&:hover": {
      borderColor: theme.palette.primary.light,
      backgroundColor: theme.palette.background.elevated,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: { xs: "100%", md: 1000 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 28px 60px rgba(4,6,8,0.5)",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* LEFT PANEL */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.common.white,
            textAlign: "center",
            backgroundImage:
              "url(https://res.cloudinary.com/dbxjpuupy/image/upload/v1766603718/ChatGPT_Image_Dec_25_2025_12_45_14_AM_iuxzup.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
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
          <Box sx={{ position: "relative", px: 4 }}>
            <Typography fontSize={18} fontWeight={600}>
              Wholesale Leville Inc.
            </Typography>
            <Typography fontSize={32} fontWeight={700} mt={1}>
              Join our fragrance family
            </Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 320, mx: "auto", mt: 1 }}>
              Trade premium fragrances and manage your inventory with ease.
            </Typography>
          </Box>
        </Box>

        {/* RIGHT PANEL */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {[1, 2, 3, 4].map((s) => (
              <Box
                key={s}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor:
                    step >= s
                      ? theme.palette.primary.main
                      : theme.palette.background.elevated,
                  color:
                    step >= s
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {s}
              </Box>
            ))}
          </Box>

          <Typography variant="h5" fontWeight={700} textAlign="center">
            {step === 1 && "Create your account"}
            {step === 2 && "Business Details"}
            {step === 3 && "Upload Documents"}
            {step === 4 && "Verify OTP"}
          </Typography>

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div {...animProps}>
                <TextField
                  fullWidth
                  placeholder="Full Name"
                  size="small"
                  sx={inputStyle}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  fullWidth
                  placeholder="Email"
                  size="small"
                  sx={inputStyle}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PhoneInput
                  country="us"
                  value={phone}
                  onChange={setPhone}
                  inputStyle={phoneStyle}
                  buttonStyle={{
                    border: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.background.elevated,
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="Password"
                  size="small"
                  type="password"
                  sx={inputStyle}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  placeholder="Confirm Password"
                  size="small"
                  type="password"
                  sx={inputStyle}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button fullWidth sx={primaryButton} onClick={handleNext}>
                  Next
                </Button>
                <Typography textAlign="center">
                  Already have an account?{" "}
                  <Link
                    href="/vendor/login"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Login
                  </Link>
                </Typography>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div {...animProps}>
                {[
                  ["Company Name", setCompanyName],
                  ["Business Type", setBusinessType],
                  ["Country", setCountry],
                  ["State", setStateName],
                  ["City", setCity],
                  ["Postal Code", setPostalCode],
                ].map(([label, setter], i) => (
                  <TextField
                    key={i}
                    fullWidth
                    placeholder={label}
                    size="small"
                    sx={inputStyle}
                    onChange={(e) => setter(e.target.value)}
                  />
                ))}
                <TextField
                  fullWidth
                  placeholder="Full Address"
                  size="small"
                  multiline
                  rows={2}
                  sx={inputStyle}
                  onChange={(e) => setFullAddress(e.target.value)}
                />
                <Box display="flex" gap={2}>
                  <Button fullWidth sx={backButton} onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    fullWidth
                    sx={primaryButton}
                    onClick={handleBusinessNext}
                  >
                    Next
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                {...animProps}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Business Certificate */}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={uploadButton}
                >
                  {businessCertificate
                    ? businessCertificate.name
                    : "Upload Business Certificate"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setBusinessCertificate(e.target.files[0])}
                  />
                </Button>

                {/* Tax Certificate */}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={uploadButton}
                >
                  {taxCertificate
                    ? taxCertificate.name
                    : "Upload Tax Certificate"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setTaxCertificate(e.target.files[0])}
                  />
                </Button>

                {/* Owner ID Proof */}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={uploadButton}
                >
                  {ownerIdProof ? ownerIdProof.name : "Upload Owner ID Proof"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setOwnerIdProof(e.target.files[0])}
                  />
                </Button>

                {/* Bank Statement */}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={uploadButton}
                >
                  {bankStatement ? bankStatement.name : "Upload Bank Statement"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setBankStatement(e.target.files[0])}
                  />
                </Button>

                <Box display="flex" gap={2}>
                  <Button fullWidth sx={backButton} onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    fullWidth
                    sx={primaryButton}
                    onClick={handleSubmitDocuments}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress
                        size={22}
                        sx={{ color: theme.palette.primary.contrastText }}
                      />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div {...animProps} style={{ textAlign: "center" }}>
                <Typography>Enter OTP sent to your Phone</Typography>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} style={otpStyle} />}
                />
                <Button
                  fullWidth
                  sx={primaryButton}
                  onClick={handleOtpSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress
                      size={22}
                      sx={{ color: theme.palette.primary.contrastText }}
                    />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
}

const animProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

*/
