export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function AdminProductRemoved() {
  return null;
}

/* REMOVED: legacy admin product page (auth/session disabled)
"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  useTheme,
} from "@mui/material";

import adminApi from "/src/utility/adminApi";
import ProductEditPopUp from "/src/components/ProductEditPopUp";
import { toast } from "react-toastify";
import AdminLayout from "/src/components/AdminLayout";
import FilterDropdown from "/src/components/FilterDropdown";
import ThickCircleLoader from "/src/components/Loading";

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
  const theme = useTheme();

  // const fetchBrands = async () => {
  //   try {
  //     const res = await adminApi.get("/api/get_brands/");
  //     setBrands(res.data.sort());
  //   } catch {
  //     toast.error("Failed to fetch brands");
  //   }
  // };

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

  const fetchProducts = useCallback(
    async () => {
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
            search
          )}${brandParam}`
        );

        setProducts(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch {
        toast.error("Unable to fetch products");
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, search, selectedBrands, brandsList]
  );

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

  return (
    <AdminLayout>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          p: 2,
          color: theme.palette.text.primary,
        }}
      >
        {/* FILTER BAR */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            mb: 3,
            p: 1.5,
            background: theme.palette.background.paper,
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0px 12px 30px rgba(4,6,8,0.55)",
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
                "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
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
              background: theme.palette.background.paper,
              borderRadius: "12px",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0px 12px 30px rgba(4,6,8,0.55)",
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
                        padding: "6px 12px",
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
                    sx={{ "&:hover": { background: "rgba(138, 180, 248, 0.08)" } }}
                  >
                    <TableCell sx={{ padding: "4px 8px" }}>
                      <img
                        src={
                          p.image ||
                          "https://res.cloudinary.com/dbxjpuupy/image/upload/v1765398958/Gemini_Generated_Image_fspkkgfspkkgfspk_se19ha.png"
                        }
                        width={45}
                        height={45}
                        style={{
                          borderRadius: 4,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => setEnlargeImg(p.image)}
                      />
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, padding: "4px 8px" }}>
                      {p.brand}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, padding: "4px 8px" }}>
                      {p.title}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary, padding: "4px 8px" }}>
                      {p.category}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary, padding: "4px 8px" }}>
                      {p.gender}
                    </TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          background: theme.palette.primary.main,
                          color: theme.palette.background.default,
                          "&:hover": { background: theme.palette.primary.light },
                        }}
                        onClick={() => {
                          setVendorPopup(p);
                          setAddProductPopup(true);
                        }}
                      >
                        Edit
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
                "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
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
              "& .MuiPaginationItem-icon": { color: theme.palette.text.secondary },
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

*/
