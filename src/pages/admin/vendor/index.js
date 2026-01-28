export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function AdminVendorRemoved() {
  return null;
}

/* REMOVED: legacy admin vendor page (auth/session disabled)
"use client";

import React, { useState, useRef, useEffect } from "react";
import VendorEditPopUp from "/src/components/VendorEditPopUp";
import {
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import AdminLayout from "/src/components/AdminLayout";
import dayjs from "dayjs";

export default function Home() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [vendorPopup, setVendorPopup] = useState(null);
  const [categoryPopup, setCategoryPopup] = useState(false);
  const [kycPopup, setKycPopup] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/users?role=vendor");
      if (response?.status == "success") setBrands(response?.data?.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch brands!");
    } finally {
      setLoading(false);
    }
  };

  const sortBrands = (data) => {
    if (!sortBy) return data;
    const sorted = [...data].sort((a, b) => {
      if (sortBy === "created_asc") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "created_desc") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "updated_asc") return new Date(a.updated_at) - new Date(b.updated_at);
      if (sortBy === "updated_desc") return new Date(b.updated_at) - new Date(a.updated_at);
      return 0;
    });
    return sorted;
  };

  useEffect(() => { fetchBrands(); }, []);

  const filteredBrands = sortBrands(
    brands.filter((b) => b?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApprove = async (vendor) => {
    try {
      const body = { email: vendor?.email, kyc_status: "approved" };
      const response = await adminApi.post("/api/update-kyc-status/", body);
      if (response?.status === "success") {
        toast.success(`Approved KYC for ${vendor?.name}`);
        fetchBrands();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to approve KYC!");
    }
  };

  const handleReject = async (vendor) => {
    try {
      const body = { email: vendor?.email, kyc_status: "reject" };
      const response = await adminApi.post("/api/update-kyc-status/", body);
      if (response?.status === "success") {
        toast.success(`Rejected KYC for ${vendor?.name}`);
        fetchBrands();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reject KYC!");
    }
  };

  const kycFields = [
    { key: "bank_statement", label: "Bank Statement" },
    { key: "business_certificate", label: "Business Certificate" },
    { key: "ownerid_proof", label: "Owner ID Proof" },
    { key: "tax_certificate", label: "Tax Certificate" },
  ];

  return (
    <AdminLayout>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          p: 2,
        }}
      >
        {/* SEARCH + SORT */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 3,
            p: 2,
            background: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 18px 44px rgba(4,6,8,0.45)",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: 220,
              "& .MuiOutlinedInput-root": {
                background: theme.palette.background.subtle,
                borderRadius: "8px",
                "& fieldset": { border: `1px solid ${theme.palette.divider}` },
                color: theme.palette.text.primary,
                "&:hover fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              },
              "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.primary.main,
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: isMobile ? "100%" : "200px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                background: theme.palette.background.subtle,
                "& fieldset": { border: `1px solid ${theme.palette.divider}` },
                "&:hover fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              },
            }}
          >
            <InputLabel sx={{ color: theme.palette.text.secondary }}>
              Sort By
            </InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="created_asc">Created On (Earliest First)</MenuItem>
              <MenuItem value="created_desc">Created On (Latest First)</MenuItem>
              <MenuItem value="updated_asc">Updated On (Earliest First)</MenuItem>
              <MenuItem value="updated_desc">Updated On (Latest First)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* -------------------- DESKTOP TABLE -------------------- */}
        <TableContainer
          component={Paper}
          ref={containerRef}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            maxHeight: "80vh",
            overflowY: "auto",
            mt: 2,
            boxShadow: "0 20px 48px rgba(4,6,8,0.5)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Vendor Name", "Email", "KYC Status", "Created On", "Updated On", "View KYC", "Actions"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: theme.palette.text.primary,
                      background: theme.palette.background.elevated,
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBrands.map((b) => (
                <TableRow
                  key={b?._id}
                  sx={{
                    "&:hover": {
                      background: theme.palette.background.subtle,
                    },
                  }}
                >
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.primary }}>
                      {b?.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {b?.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography
                      sx={{
                        color:
                          b?.kyc_status === "pending"
                            ? theme.palette.warning.main
                            : b?.kyc_status === "reject"
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                        textTransform: "capitalize",
                      }}
                    >
                      {b?.kyc_status}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {dayjs(b?.created_at).format("DD MMM YYYY hh:mm A")}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {dayjs(b?.updated_at).format("DD MMM YYYY hh:mm A")}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Button
                      variant="text"
                      sx={{ color: theme.palette.primary.main, textTransform: "none" }}
                      onClick={() => setKycPopup(b)}
                    >
                      <VisibilityIcon fontSize="small" /> View
                    </Button>
                  </TableCell>

                  <TableCell sx={{ padding: "4px 8px" }}>
                    <CheckCircleIcon
                      sx={{ color: theme.palette.success.main, cursor: "pointer" }}
                      onClick={() => handleApprove(b)}
                    />
                    <CancelIcon
                      sx={{ color: theme.palette.error.main, cursor: "pointer", ml: 1 }}
                      onClick={() => handleReject(b)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* -------------------- EDIT POPUP -------------------- */}
        {categoryPopup && (
          <VendorEditPopUp
            product={vendorPopup}
            close={() => { setVendorPopup(null); setCategoryPopup(false); fetchBrands(); }}
          />
        )}

        {/* -------------------- KYC POPUP -------------------- */}
        {kycPopup && (
          <Dialog
            open
            onClose={() => setKycPopup(null)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            }}
          >
            <DialogTitle sx={{ color: theme.palette.text.primary }}>
              KYC Documents - {kycPopup?.name}
            </DialogTitle>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {kycFields.map((item) => {
                const link = kycPopup?.[item.key];
                if (!link) return null;
                return (
                  <Box
                    key={item.key}
                    sx={{
                      background: theme.palette.background.subtle,
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        textTransform: "capitalize",
                        mb: 1,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: "underline",
                      }}
                    >
                      View File
                    </a>
                  </Box>
                );
              })}
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => {
                  handleApprove(kycPopup);
                  setKycPopup(null);
                }}
                sx={{ color: theme.palette.success.main }}
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  handleReject(kycPopup);
                  setKycPopup(null);
                }}
                sx={{ color: theme.palette.error.main }}
              >
                Reject
              </Button>
              <Button
                onClick={() => setKycPopup(null)}
                sx={{ color: theme.palette.text.secondary }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </AdminLayout>
  );
}

*/
