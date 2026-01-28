export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function AdminCategoryRemoved() {
  return null;
}

/* REMOVED: legacy admin category page (auth/session disabled)
"use client";

import React, { useState, useRef, useEffect } from "react";
import CategoryEditPopUp from "/src/components/CategoryEditPopUp";
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
  const [selectedItem, setSelectedItem] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/categories/");
      if (response) setBrands(response?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch categories!");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted.",
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
      const response = await adminApi.delete(`/api/categories/${id}`);
      if (response?.status === "success") {
        toast.success("Category deleted successfully!");
        fetchBrands();
      } else {
        toast.error("Unable to delete category!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete category!");
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

  return (
    <AdminLayout>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          p: 2,
        }}
      >
        {/* Search + Sort + Add */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            mb: 3,
            p: 1.5,
            background: theme.palette.background.paper,
            borderRadius: "4px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 18px 44px rgba(4,6,8,0.45)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
          <Button
            variant="contained"
            onClick={() => { setVendorPopup(null); setCategoryPopup(true); }}
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              "&:hover": { background: theme.palette.primary.light },
              height: "40px",
            }}
          >
            + Add Category
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
                      {["Category Name", "Created On", "Updated On", "Action"].map((h) => (
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
                            {b?.name || "No Category Name"}
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
                            size="small"
                            onClick={(e) => handleMenuClick(e, b)}
                            sx={{
                              minWidth: "32px",
                              color: theme.palette.text.primary,
                              background: theme.palette.background.subtle,
                              border: `1px solid ${theme.palette.divider}`,
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
                            open={openMenu && selectedItem?._id === b._id}
                            onClose={handleMenuClose}
                            PaperProps={{
                              sx: {
                                background: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => { handleMenuClose(); setVendorPopup(b); setCategoryPopup(true); }}
                              sx={{
                                color: theme.palette.primary.main,
                                display: "flex",
                                gap: 1,
                              }}
                            >
                              <EditIcon fontSize="small" /> Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => { handleMenuClose(); deleteCategory(b?._id); }}
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
                        padding: 1,
                        mb: 1,
                        borderRadius: "4px",
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: "0 14px 32px rgba(4,6,8,0.45)",
                      }}
                    >
                      <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                        {b?.name}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}>
                        Created: {dayjs(b?.created_at).format("DD MMM YYYY hh:mm A")}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}>
                        Updated: {dayjs(b?.updated_at).format("DD MMM YYYY hh:mm A")}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontSize: "11px",
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.primary.main,
                            padding: "0px 6px",
                          }}
                          onClick={() => { setVendorPopup(b); setCategoryPopup(true); }}
                        >
                          Edit <EditIcon sx={{ fontSize: 12 }} />
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontSize: "11px",
                            color: theme.palette.error.main,
                            borderColor: theme.palette.error.main,
                            padding: "0px 6px",
                          }}
                          onClick={() => deleteCategory(b?._id)}
                        >
                          Delete <DeleteIcon sx={{ fontSize: 12 }} />
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
          <CategoryEditPopUp
            product={vendorPopup}
            close={() => { setVendorPopup(null); setCategoryPopup(false); fetchBrands(); }}
          />
        )}
      </Box>
    </AdminLayout>
  );
}

*/
