"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  useTheme,
  LinearProgress,
  Typography,
  Chip,
} from "@mui/material";

import adminApi from "/src/utility/adminApi";
import ProductEditPopUp from "/src/components/ProductEditPopUp";
import { toast } from "react-toastify";
import AdminLayout from "/src/components/AdminLayout";
import FilterDropdown from "/src/components/FilterDropdown";
import ThickCircleLoader from "/src/components/Loading";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Home() {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addProductPopup, setAddProductPopup] = useState(false);
  const [vendorPopup, setVendorPopup] = useState(null);
  const [enlargeImg, setEnlargeImg] = useState(null);
  const [importPopup, setImportPopup] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [importId, setImportId] = useState(null);
  const pollRef = useRef(null);
  const theme = useTheme();

  const fetchCategoryList = async () => {
    try {
      const res = await adminApi.get("/api/categories/");
      setCategoryList(res.data || []);
    } catch {}
  };

  const fetchBrandsList = async () => {
    try {
      const res = await adminApi.get("/api/brands/");
      setBrandsList(res.data || []);

      const brandNames = res.data.map((b) => b.name);
      setBrands(brandNames.sort());
    } catch {}
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/users?role=vendor");
      if (response?.status === "success") {
        setVendorList(response?.data?.users || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch vendors!");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const selectedBrandIds = selectedBrands
        .map((name) => {
          const brand = brandsList.find((b) => b.name === name);
          return brand?._id;
        })
        .filter(Boolean);

      const brandParam =
        selectedBrandIds.length > 0
          ? `&brands=${selectedBrandIds.join(",")}`
          : "";
      const res = await adminApi.get(
        `/api/products/?page=${page}&per_page=${rowsPerPage}&search=${encodeURIComponent(
          search,
        )}${brandParam}`,
      );

      setProducts(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error("Unable to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, selectedBrands, brandsList]);

  const deleteProduct = async (p) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await adminApi.delete(`/api/products/${p?._id}`);

      if (response?.status === "success") {
        fetchProducts();

        Swal.fire({
          title: "Deleted!",
          text: "The product has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Failed to delete the product.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong while deleting.",
        "error",
      );
    }
  };

  const reloadProducts = () => {
    setPage(1);
  };

  useEffect(() => {
    // fetchBrands();
    fetchCategoryList();
    fetchBrandsList();
    fetchVendors();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 100);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search, selectedBrands, fetchProducts]);

  const resetFilters = () => {
    setSearch("");
    setSelectedBrands([]);
    reloadProducts();
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startProgressPolling = (id) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await adminApi.get(
          `/api/admin/products/import-progress/${id}`,
        );
        const data = res?.data;
        if (data) {
          setImportProgress(data);
          if (data.status === "completed" || data.status === "failed") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setImporting(false);
            if (data.status === "completed") {
              fetchProducts();
            }
          }
        }
      } catch {
        // silently ignore polling errors
      }
    }, 2000);
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      toast.error("Please select an .xlsx file");
      return;
    }

    const ext = (importFile.name || "").toLowerCase().split(".").pop();
    if (ext !== "xlsx") {
      toast.error("Only .xlsx files are accepted");
      return;
    }

    try {
      setImporting(true);
      setImportProgress(null);
      const formData = new FormData();
      formData.append("file", importFile);

      const res = await adminApi.post(
        "/api/admin/products/import-excel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const newImportId = res?.data?.import_id;
      if (newImportId) {
        setImportId(newImportId);
        setImportProgress({
          status: "queued",
          total: 0,
          processed: 0,
          inserted: 0,
          updated: 0,
          failed: 0,
        });
        startProgressPolling(newImportId);
        toast.info("Import started! Tracking progress...");
      } else {
        toast.success(res?.data?.message || "Import submitted");
        setImportPopup(false);
        setImportFile(null);
        setImporting(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Import failed");
      setImporting(false);
    }
  };

  const handleCloseImportPopup = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    setImportPopup(false);
    setImportFile(null);
    setImporting(false);
    setImportProgress(null);
    setImportId(null);
  };

  const cardBg = {
    background: "#181819",
    boxShadow:
      "0 0 0 1px rgba(255, 255, 255, 0.04), 0 0 18px rgba(0, 0, 0, 0.7)",
  };

  return (
    <AdminLayout>
      <Box
        sx={{
          minHeight: "100vh",
          p: 2,
          color: theme.palette.text.primary,
        }}
      >
        {/* FILTER BAR */}
        <Box
          sx={{
            ...cardBg,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
            p: "10px",
            borderRadius: "4px",
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
              background: theme.palette.background.subtle,
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                color: theme.palette.text.primary,
                background: theme.palette.background.subtle,
                "& fieldset": { border: `1px solid ${theme.palette.divider}` },
                "&:hover fieldset": { borderColor: theme.palette.primary.main },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
            }}
          />

          {/* BRAND FILTER */}
          <FilterDropdown
            label="Brand"
            options={brands}
            value={selectedBrands}
            onApply={(v) => {
              setPage(1);
              setSelectedBrands(v);
            }}
          />

          <Button
            variant="outlined"
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              boxShadow: "none",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                boxShadow: "none",
              },
            }}
            onClick={resetFilters}
          >
            Reset
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              boxShadow: "none",
              textTransform: "none",
              "&:hover": {
                borderColor: theme.palette.primary.light,
                color: theme.palette.primary.light,
                boxShadow: "none",
              },
            }}
            onClick={() => setImportPopup(true)}
          >
            Import Excel (.xlsx)
          </Button>

          <Button
            variant="contained"
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.background.default,
              "&:hover": { background: theme.palette.primary.light },
              ml: "auto",
            }}
            onClick={() => setAddProductPopup(true)}
          >
            + Add Product
          </Button>
        </Box>

        {/* TABLE */}
        {loading ? (
          <ThickCircleLoader />
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              ...cardBg,
              borderRadius: "4px",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Image",
                    "Brand",
                    "Title",
                    "Category",
                    "Gender",
                    "Action",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        color: theme.palette.text.secondary,
                        background: theme.palette.background.subtle,
                        fontWeight: 600,
                        padding: "2px 12px",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((p) => (
                  <TableRow
                    key={p.upc}
                    sx={{
                      "&:hover": { background: "rgba(138, 180, 248, 0.08)" },
                    }}
                  >
                    <TableCell sx={{ padding: "2px 8px" }}>
                      <img
                        src={
                          p.image ||
                          "https://res.cloudinary.com/dbxjpuupy/image/upload/v1765398958/Gemini_Generated_Image_fspkkgfspkkgfspk_se19ha.png"
                        }
                        width={35}
                        height={35}
                        style={{
                          borderRadius: 4,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => setEnlargeImg(p.image)}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        padding: "2px 8px",
                      }}
                    >
                      {p.brand}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        padding: "2px 8px",
                      }}
                    >
                      {p.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.secondary,
                        padding: "2px 8px",
                      }}
                    >
                      {p.category}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.secondary,
                        padding: "2px 8px",
                      }}
                    >
                      {p.gender}
                    </TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          background: theme.palette.primary.main,
                          color: theme.palette.background.default,
                          "&:hover": {
                            background: theme.palette.primary.light,
                          },
                        }}
                        onClick={() => {
                          setVendorPopup(p);
                          setAddProductPopup(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          background: "#b21313d3",
                          color: "#fff",
                          ml: 1,
                          "&:hover": { background: "red" },
                        }}
                        onClick={() => {
                          deleteProduct(p);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* PAGINATION */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
                setPage(1);
              }}
              sx={{
                color: theme.palette.text.primary,
                background: theme.palette.background.subtle,
                borderRadius: "8px",
                "& .MuiSelect-icon": { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.divider,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {[10, 20, 50, 100].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} rows
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Pagination
            count={Math.ceil(total / rowsPerPage)}
            page={page}
            onChange={(e, p) => setPage(p)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.default,
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "rgba(138, 180, 248, 0.18)",
              },
              "& .MuiPaginationItem-icon": {
                color: theme.palette.text.secondary,
              },
            }}
          />
        </Box>

        {/* IMAGE POPUP */}
        <Dialog open={!!enlargeImg} onClose={() => setEnlargeImg(null)}>
          <DialogContent
            sx={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <img
              src={enlargeImg}
              style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: 4 }}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={importPopup}
          onClose={handleCloseImportPopup}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Import products from Excel
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 340,
            }}
          >
            {/* FILE UPLOAD SECTION */}
            {!importProgress && (
              <>
                <Box
                  sx={{
                    p: 2,
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    background: theme.palette.background.subtle,
                  }}
                >
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    style={{ width: "100%" }}
                  />
                  <Box
                    sx={{
                      mt: 1,
                      color: theme.palette.text.secondary,
                      fontSize: 14,
                    }}
                  >
                    Only .xlsx files are allowed. Please use the NYPX_clean.xlsx
                    format; validation is handled by the backend.
                  </Box>
                  {importFile && (
                    <Box sx={{ mt: 1, fontSize: 14 }}>
                      Selected: {importFile.name}
                    </Box>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<CloudDownloadIcon />}
                  component="a"
                  href="/xlsx/NYPX_clean.xlsx"
                  download
                  sx={{ textTransform: "none", alignSelf: "flex-start" }}
                >
                  Download sample (NYPX_clean.xlsx)
                </Button>
              </>
            )}

            {/* PROGRESS TRACKING SECTION */}
            {importProgress && (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: theme.palette.background.subtle,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Status Badge */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Chip
                    label={
                      importProgress.status === "queued"
                        ? "Queued"
                        : importProgress.status === "parsing"
                        ? "Parsing Excel..."
                        : importProgress.status === "processing"
                        ? "Processing Products..."
                        : importProgress.status === "completed"
                        ? "Completed"
                        : "Failed"
                    }
                    size="small"
                    sx={{
                      fontWeight: 600,
                      backgroundColor:
                        importProgress.status === "completed"
                          ? "#1b5e20"
                          : importProgress.status === "failed"
                          ? "#b71c1c"
                          : "#0d47a1",
                      color: "#fff",
                    }}
                  />
                  {importProgress.status !== "completed" &&
                    importProgress.status !== "failed" && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#4caf50",
                          animation: "pulse 1.2s infinite",
                          "@keyframes pulse": {
                            "0%": { opacity: 1, transform: "scale(1)" },
                            "50%": { opacity: 0.4, transform: "scale(1.3)" },
                            "100%": { opacity: 1, transform: "scale(1)" },
                          },
                        }}
                      />
                    )}
                </Box>

                {/* Progress Bar */}
                {importProgress.total > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {importProgress.processed} / {importProgress.total} products
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {importProgress.total > 0
                          ? Math.round(
                              (importProgress.processed / importProgress.total) * 100,
                            )
                          : 0}
                        %
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        importProgress.total > 0
                          ? (importProgress.processed / importProgress.total) * 100
                          : 0
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          background:
                            importProgress.status === "completed"
                              ? "linear-gradient(90deg, #43a047, #66bb6a)"
                              : importProgress.status === "failed"
                              ? "linear-gradient(90deg, #e53935, #ef5350)"
                              : "linear-gradient(90deg, #1976d2, #42a5f5)",
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Parsing / Queued state with indeterminate bar */}
                {(importProgress.status === "queued" ||
                  importProgress.status === "parsing") && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {importProgress.status === "queued"
                        ? "Waiting for background worker..."
                        : "Reading and parsing Excel file..."}
                    </Typography>
                    <LinearProgress
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Stats Counters */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 1.5,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1.5,
                      borderRadius: 2,
                      background: "rgba(76, 175, 80, 0.1)",
                      border: "1px solid rgba(76, 175, 80, 0.3)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#66bb6a" }}
                    >
                      {importProgress.inserted}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Inserted
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1.5,
                      borderRadius: 2,
                      background: "rgba(33, 150, 243, 0.1)",
                      border: "1px solid rgba(33, 150, 243, 0.3)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#42a5f5" }}
                    >
                      {importProgress.updated}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Updated
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1.5,
                      borderRadius: 2,
                      background: "rgba(244, 67, 54, 0.1)",
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#ef5350" }}
                    >
                      {importProgress.failed}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Failed
                    </Typography>
                  </Box>
                </Box>

                {/* Error message */}
                {importProgress.status === "failed" && importProgress.error && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 1,
                      background: "rgba(244, 67, 54, 0.08)",
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                      color: "#ef5350",
                      fontSize: 13,
                    }}
                  >
                    Error: {importProgress.error}
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseImportPopup}
              sx={{ textTransform: "none" }}
            >
              {importProgress?.status === "completed" ? "Done" : "Cancel"}
            </Button>
            {!importProgress && (
              <Button
                variant="contained"
                onClick={handleImportSubmit}
                disabled={importing}
                sx={{ textTransform: "none" }}
              >
                {importing ? "Uploading..." : "Upload"}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* EDIT / ADD PRODUCT */}
        {addProductPopup && (
          <ProductEditPopUp
            product={vendorPopup}
            categoryList={categoryList}
            brandsList={brandsList}
            vendorList={vendorList}
            close={() => {
              setAddProductPopup(false);
              setVendorPopup(null);
            }}
          />
        )}
      </Box>
    </AdminLayout>
  );
}