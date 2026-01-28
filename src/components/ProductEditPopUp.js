"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";

export default function ProductEditPopUp({
  product,
  close,
  categoryList,
  brandsList,
  vendorList,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isEdit = Boolean(product);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  /* ---------------- PRODUCT STATE ---------------- */
  const [productState, setProductState] = useState({
    upc: product?.upc || "",
    title: product?.title || "",
    brand_id: product?.brand_id || product?.brand || "",
    category_id: product?.category_id || product?.category || "",
    gender_id: product?.gender_id || product?.gender || "",
    image: product?.image || null, // If editing, keep existing image url
  });

  /* ---------------- VENDOR STATE ---------------- */
  const [vendors, setVendors] = useState(
    product?.vendors?.length
      ? JSON.parse(product.vendors)
      : [
          {
            vendor_id: "",
            sku: "",
            price: "",
            qty: "",
            vipStandardPrice: "",
            vipPremiumPrice: "",
          },
        ]
  );

  /* ---------------- HANDLERS ---------------- */
  const handleProductChange = (key, value) => {
    if (key === "image") {
      setProductState((prev) => ({ ...prev, image: value }));
    } else {
      setProductState((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleVendorChange = (index, key, value) => {
    const updated = [...vendors];
    updated[index][key] = value;
    setVendors(updated);
  };

  const addVendor = () => {
    setVendors((prev) => [
      ...prev,
      {
        vendor_id: "",
        sku: "",
        price: "",
        qty: "",
        vipStandardPrice: "",
        vipPremiumPrice: "",
      },
    ]);
  };

  const removeVendor = (index) => {
    if (vendors.length === 1) return;
    setVendors(vendors.filter((_, i) => i !== index));
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!productState.upc || !productState.title) {
      toast.warning("UPC & Title are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("upc", productState.upc);
      formData.append("title", productState.title);
      formData.append("brand_id", productState.brand_id);
      formData.append("category_id", productState.category_id);
      formData.append("gender_id", productState.gender_id);

      if (productState.image && productState.image instanceof File) {
        formData.append("image", productState.image);
      }

      vendors.forEach((vendor, index) => {
        formData.append(`vendors[${index}][vendor_id]`, vendor.vendor_id);
        formData.append(`vendors[${index}][sku]`, vendor.sku);
        formData.append(`vendors[${index}][price]`, vendor.price);
        formData.append(`vendors[${index}][qty]`, vendor.qty);
        formData.append(
          `vendors[${index}][vipStandardPrice]`,
          vendor.vipStandardPrice || ""
        );
        formData.append(
          `vendors[${index}][vipPremiumPrice]`,
          vendor.vipPremiumPrice || ""
        );
      });

      if (isEdit) {
        await adminApi.post(`/api/products/${product._id}`, formData);
        toast.success("Product Updated");
      } else {
        await adminApi.post(`/api/products`, formData);
        toast.success("Product Added");
      }

      close();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STYLES ---------------- */
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.background.subtle,
      color: theme.palette.text.primary,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.divider,
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
    "& .MuiSvgIcon-root": { color: theme.palette.text.secondary },
  };

  return (
    <Box sx={overlayStyle(theme)} onClick={close}>
      <Paper sx={modalStyle(theme, isMobile)} onClick={(e) => e.stopPropagation()}>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {isEdit ? "Edit Product" : "Add Product"}
          </Typography>
          <Divider sx={{ my: 2, bgcolor: theme.palette.divider }} />

          {/* ---------------- GENERAL SECTION ---------------- */}
          <Box sx={sectionStyle(theme, "subtle")}>
            <Typography sx={sectionTitle(theme.palette.primary.main)}>
              General Product Information
            </Typography>

            <Box sx={gridStyle}>
              <TextField
                label="UPC"
                value={productState.upc}
                onChange={(e) => handleProductChange("upc", e.target.value)}
                fullWidth
                sx={inputSx}
              />

              <TextField
                label="Title"
                value={productState.title}
                onChange={(e) => handleProductChange("title", e.target.value)}
                fullWidth
                sx={inputSx}
              />

              <FormControl fullWidth sx={inputSx}>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={productState.brand_id}
                  label="Brand"
                  onChange={(e) =>
                    handleProductChange("brand_id", e.target.value)
                  }
                >
                  {brandsList?.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={inputSx}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={productState.category_id}
                  label="Category"
                  onChange={(e) =>
                    handleProductChange("category_id", e.target.value)
                  }
                >
                  {categoryList?.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Gender"
                value={productState.gender_id}
                onChange={(e) =>
                  handleProductChange("gender_id", e.target.value)
                }
                fullWidth
                sx={inputSx}
              />

              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    height: "56px",
                    mb: 1,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Upload Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProductChange("image", e.target.files[0]);
                      }
                    }}
                  />
                </Button>

                {(productState.image &&
                  typeof productState.image !== "string") ? (
                  <Box mt={1}>
                    <img
                      src={URL.createObjectURL(productState.image)}
                      alt="Preview"
                      style={{ maxHeight: 80, borderRadius: 6 }}
                    />
                  </Box>
                ) : productState.image && typeof productState.image === "string" ? (
                  <Box mt={1}>
                    <img
                      src={productState.image}
                      alt="Current"
                      style={{ maxHeight: 80, borderRadius: 6 }}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>

          {/* ---------------- VENDOR SECTION ---------------- */}
          <Box sx={sectionStyle(theme, "paper")}>
            <Typography sx={sectionTitle(theme.palette.secondary.main)}>
              Vendor Details
            </Typography>

            {vendors.map((vendor, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.subtle,
                }}
              >
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color={theme.palette.text.secondary}>
                    Vendor #{index + 1}
                  </Typography>

                  {vendors.length > 1 && (
                    <IconButton size="small" onClick={() => removeVendor(index)}>
                      <Delete sx={{ color: theme.palette.error.main }} />
                    </IconButton>
                  )}
                </Box>

                <Box sx={gridStyle}>
                  <FormControl fullWidth sx={inputSx}>
                    <InputLabel>Vendor</InputLabel>
                    <Select
                      value={vendor.vendor_id}
                      label="Vendor"
                      onChange={(e) =>
                        handleVendorChange(index, "vendor_id", e.target.value)
                      }
                    >
                      {vendorList?.map((v) => (
                        <MenuItem key={v._id} value={v._id}>
                          {v.name} ({v.company_name})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="SKU"
                    value={vendor.sku}
                    onChange={(e) =>
                      handleVendorChange(index, "sku", e.target.value)
                    }
                    fullWidth
                    sx={inputSx}
                  />

                  <TextField
                    label="Price"
                    type="number"
                    value={vendor.price}
                    onChange={(e) =>
                      handleVendorChange(index, "price", e.target.value)
                    }
                    fullWidth
                    sx={inputSx}
                  />

                  <TextField
                    label="Quantity"
                    type="number"
                    value={vendor.qty}
                    onChange={(e) =>
                      handleVendorChange(index, "qty", e.target.value)
                    }
                    fullWidth
                    sx={inputSx}
                  />

                  <TextField
                    label="VIP Standard Price"
                    type="number"
                    value={vendor.vipStandardPrice}
                    onChange={(e) =>
                      handleVendorChange(index, "vipStandardPrice", e.target.value)
                    }
                    fullWidth
                    sx={inputSx}
                  />

                  <TextField
                    label="VIP Premium Price"
                    type="number"
                    value={vendor.vipPremiumPrice}
                    onChange={(e) =>
                      handleVendorChange(index, "vipPremiumPrice", e.target.value)
                    }
                    fullWidth
                    sx={inputSx}
                  />
                </Box>
              </Box>
            ))}

            <Button
              startIcon={<Add />}
              onClick={addVendor}
              variant="outlined"
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              }}
            >
              Add Another Vendor
            </Button>
          </Box>

          {/* ---------------- ACTIONS ---------------- */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={close}
              sx={{
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSave}
              sx={{
                background: theme.palette.primary.main,
                color: theme.palette.background.default,
                "&:hover": { background: theme.palette.primary.light },
              }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Paper>
    </Box>
  );
}

/* ---------------- STYLES ---------------- */
const overlayStyle = (theme) => ({
  position: "fixed",
  inset: 0,
  bgcolor: "rgba(4, 6, 8, 0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1200,
  backdropFilter: "blur(6px)",
  color: theme.palette.text.primary,
});

const modalStyle = (theme, isMobile) => ({
  width: isMobile ? "95%" : "95%",
  maxWidth: 1000,
  maxHeight: "92vh",
  overflowY: "auto",
  bgcolor: theme.palette.background.paper,
  p: 3,
  borderRadius: 3,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 20px 40px rgba(4,6,8,0.65)",
});

const sectionStyle = (theme, surfaceKey) => ({
  bgcolor:
    (theme.palette.background && theme.palette.background[surfaceKey]) ||
    theme.palette.background.paper,
  p: 3,
  borderRadius: 3,
  mb: 3,
  border: `1px solid ${theme.palette.divider}`,
});

const sectionTitle = (color) => ({
  color,
  fontWeight: 600,
  mb: 2,
  letterSpacing: 0.2,
});

const gridStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "1fr 1fr",
  },
  gap: 2,
};
