"use client";

import React, { useState, useRef, useEffect } from "react";
import BrandEditPopUp from "/src/components/BrandEditPopUp";
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
  Menu,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import AdminLayout from "/src/components/AdminLayout";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import ThickCircleLoader from "/src/components/Loading";

export default function Home() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [vendorPopup, setVendorPopup] = useState(null);
  const [categoryPopup, setCategoryPopup] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event, brand) => {
    setAnchorEl(event.currentTarget);
    setSelectedBrand(brand);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBrand(null);
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/brands/");
      if (response) setBrands(response?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch brands!");
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This brand will be permanently deleted.",
      icon: "warning",
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.text.secondary,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const response = await adminApi.delete(`/api/brands/${id}`);

      if (response?.status === "success") {
        toast.success("Brand deleted successfully!");
        fetchBrands();
      } else {
        toast.error("Unable to delete brand!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete brand!");
    } finally {
      setLoading(false);
    }
  };

  const sortBrands = (data) => {
    if (!sortBy) return data;
    const sorted = [...data].sort((a, b) => {
      if (sortBy === "created_asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "created_desc")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "updated_asc")
        return new Date(a.updated_at) - new Date(b.updated_at);
      if (sortBy === "updated_desc")
        return new Date(b.updated_at) - new Date(a.updated_at);
      return 0;
    });
    return sorted;
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = sortBrands(
    brands.filter((b) => b?.name?.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <AdminLayout>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          p: 2,
        }}
      >
        {/* Top Controls */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
            p: "5px 10px",
            borderRadius: "4px",
            background: theme.palette.background.paper,
            justifyContent: "space-between",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 18px 44px rgba(4,6,8,0.45)",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: theme.palette.background.subtle,
                  borderRadius: "8px",
                  "& fieldset": {
                    border: `1px solid ${theme.palette.divider}`,
                  },
                  color: theme.palette.text.primary,
                  "&:hover fieldset": {
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                  "&.Mui-focused fieldset": {
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.primary.main,
                },
                minWidth: 180,
              }}
            />

            <FormControl
              size="small"
              sx={{
                minWidth: isMobile ? "100%" : 200,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: theme.palette.background.subtle,
                  "& fieldset": {
                    border: `1px solid ${theme.palette.divider}`,
                  },
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
                <MenuItem value="created_asc">
                  Created On (Earliest First)
                </MenuItem>
                <MenuItem value="created_desc">
                  Created On (Latest First)
                </MenuItem>
                <MenuItem value="updated_asc">
                  Updated On (Earliest First)
                </MenuItem>
                <MenuItem value="updated_desc">
                  Updated On (Latest First)
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              setVendorPopup(null);
              setCategoryPopup(true);
            }}
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              "&:hover": { background: theme.palette.primary.light },
              height: 40,
            }}
          >
            + Add Brand
          </Button>
        </Box>

        {loading ? (
          <ThickCircleLoader />
        ) : (
          <>
            {!isMobile ? (
              <TableContainer
                component={Paper}
                ref={containerRef}
                sx={{
                  background: theme.palette.background.paper,
                  borderRadius: "4px",
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
                      {[
                        "Category Name",
                        "Created On",
                        "Updated On",
                        "Action",
                      ].map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            color: theme.palette.text.primary,
                            background: theme.palette.background.elevated,
                            fontWeight: 600,
                            padding: "2px 12px",
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
                        <TableCell sx={{ padding: "2px 8px" }}>
                          <Typography
                            sx={{ color: theme.palette.text.primary }}
                          >
                            {b?.name || "No Brand Name"}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: "2px 8px" }}>
                          <Typography
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {dayjs(b?.created_at).format("DD MMM YYYY hh:mm A")}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: "2px 8px" }}>
                          <Typography
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {dayjs(b?.updated_at).format("DD MMM YYYY hh:mm A")}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: "2px 8px" }}>
                          <Button
                            size="small"
                            onClick={(e) => handleMenuClick(e, b)}
                            sx={{
                              minWidth: "32px",
                              color: theme.palette.text.primary,
                              border: `1px solid ${theme.palette.divider}`,
                              background: theme.palette.background.subtle,
                              "&:hover": {
                                background: theme.palette.background.elevated,
                                borderColor: theme.palette.primary.main,
                              },
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </Button>

                          <Menu
                            anchorEl={anchorEl}
                            open={openMenu && selectedBrand?._id === b._id}
                            onClose={handleMenuClose}
                            PaperProps={{
                              sx: {
                                background: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                setVendorPopup(b);
                                setCategoryPopup(true);
                              }}
                              sx={{
                                color: theme.palette.primary.main,
                                display: "flex",
                                gap: 1,
                              }}
                            >
                              <EditIcon fontSize="small" /> Edit
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                deleteBrand(b?._id);
                              }}
                              sx={{
                                color: theme.palette.error.main,
                                display: "flex",
                                gap: 1,
                              }}
                            >
                              <DeleteIcon fontSize="small" /> Delete
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Box sx={{ maxHeight: "78vh", overflowY: "auto", pb: 2 }}>
                  {filteredBrands.map((b) => (
                    <Box
                      key={b?._id}
                      sx={{
                        background: theme.palette.background.paper,
                        padding: 2,
                        mb: 2,
                        borderRadius: "6px",
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: "0 14px 36px rgba(4,6,8,0.45)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        }}
                      >
                        {b?.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Created:{" "}
                        {dayjs(b?.created_at).format("DD MMM YYYY hh:mm A")}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Updated:{" "}
                        {dayjs(b?.updated_at).format("DD MMM YYYY hh:mm A")}
                      </Typography>

                      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                        <Button
                          variant="text"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontSize: "12px",
                            color: theme.palette.primary.main,
                          }}
                          onClick={() => {
                            setVendorPopup(b);
                            setCategoryPopup(true);
                          }}
                        >
                          Edit <EditIcon sx={{ fontSize: 14 }} />
                        </Button>

                        <Button
                          variant="text"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontSize: "12px",
                            color: theme.palette.error.main,
                          }}
                          onClick={() => deleteBrand(b?._id)}
                        >
                          Delete <DeleteIcon sx={{ fontSize: 14 }} />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
        {categoryPopup && (
          <BrandEditPopUp
            product={vendorPopup}
            close={() => {
              setVendorPopup(null);
              setCategoryPopup(false);
              fetchBrands();
            }}
          />
        )}
      </Box>
    </AdminLayout>
  );
}
