import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "/src/components/Header";
import VendorPopup from "/src/components/VendorPopup";
import Footer from "/src/components/Footer";
import Loading from "/src/components/Loading";
import {
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { toast } from "react-toastify";

import InfiniteScroll from "react-infinite-scroll-component";
import adminApi from "/src/utility/adminApi";
import { getMembershipPrice } from "../utility/pricing";
import { DEFAULT_PRODUCT_IMAGE } from "../utility/constants";
import batch1 from "/src/products/products_mapped_batch_1.json";
import batch2 from "/src/products/products_mapped_batch_2.json";
import batch3 from "/src/products/products_mapped_batch_3.json";
import batch4 from "/src/products/products_mapped_batch_4.json";
import batch5 from "/src/products/products_mapped_batch_5.json";

export default function Home() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [vendorPopup, setVendorPopup] = useState(null);
  const [openSections, setOpenSections] = useState({ brand: true, upc: false });
  const [brands, setBrands] = useState([]);
  // Read membership level from Redux (populated by authSlice on login)
  const membershipLevel = useSelector((state) => state.auth.membership_level);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);
  const theme = useTheme();

  // Debounce: wait 500ms after the user stops typing before triggering the API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await adminApi.get("/api/brands/");
      const brandsData = response?.data || [];
      const sortedBrands = brandsData.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setBrands(sortedBrands);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch brands!");
    }
  }, []);


  // Fetch products
  const fetchProducts = useCallback(
    async (_page = 1, append = false) => {
      try {
        const PAGE_SIZE = 50;
        const normalizedSearch = debouncedSearch;

        const params = new URLSearchParams({
          page: _page,
          per_page: PAGE_SIZE,
          search: normalizedSearch,
        });

        if (selectedBrands.length > 0) {
          params.set("brands", selectedBrands.join(","));
        }

        const response = await adminApi.get(
          `/api/products?${params.toString()}`,
        );

        const body = response?.data || {};
        const responseData = body || {};
        const newProductsBatch = responseData.data || [];
        const total = parseInt(responseData.total || 0, 10);

        const normalizedNewProducts = newProductsBatch.map((item) => ({
          ...item,
          title: item.title || item.name || "Unknown Product",
          vendors: Array.isArray(item.vendors)
            ? item.vendors.map((v) => ({
                ...v,
                // Keep all price tiers intact so getMembershipPrice can resolve them
                price: Number(v.price) || 0,
                vipStandardPrice: Number(v.vipStandardPrice) || 0,
                vipPremiumPrice: Number(v.vipPremiumPrice) || 0,
                qty: Number(v.qty) || 0,
              }))
            : [],
        }));

        setProducts((prev) => {
          const updated = append
            ? [...prev, ...normalizedNewProducts]
            : normalizedNewProducts;
          // Calculate haveMore based on the updated length and the total from API
          setHasMore(
            updated.length < total && normalizedNewProducts.length > 0,
          );
          return updated;
        });

        setPage(_page);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Unable to fetch products!");
        setHasMore(false);
      }
    },
    [debouncedSearch, selectedBrands],
  );

  // Only fetch brands on mount — products are handled by the effect below
  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProducts([]);
    fetchProducts(1, false);
  }, [debouncedSearch, selectedBrands]);

  const fetchNext = () => fetchProducts(page + 1, true);

  const handleBrandChange = useCallback((brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setSelectedBrands([]);
  }, []);

  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasActiveFilters = search || selectedBrands.length > 0;

  const FilterContentInner = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Search Products"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.divider,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
        }}
      />
      <Box
        onClick={() => toggleSection("brand")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          background: "rgba(138, 180, 248, 0.12)",
          borderRadius: "4px",
          padding: "8px 10px",
          border: `1px solid ${theme.palette.primary.main}40`,
        }}
      >
        <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
          Brand
        </Typography>
        {openSections.brand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      <Collapse in={openSections.brand}>
        <Box sx={{ pl: 1, maxHeight: "60vh", overflowY: "auto" }}>
          <FormGroup>
            {brands.map((b) => (
              <FormControlLabel
                key={b._id}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(b._id)}
                    onChange={() => handleBrandChange(b._id)}
                  />
                }
                label={
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    {b.name}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </Box>
      </Collapse>
    </Box>
  );

  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        minHeight: "100vh",
        color: theme.palette.text.primary,
      }}
    >
      <div>
        <Header />

        {/* Mobile Filters */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: "10px",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              startIcon={<FilterAltIcon />}
              sx={{
                textTransform: "none",
                background: theme.palette.primary.main,
                color: theme.palette.background.default,
                "&:hover": { background: theme.palette.primary.light },
              }}
              onClick={() => setDrawerOpen(true)}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterAltOffIcon />}
              sx={{
                textTransform: "none",
                color: theme.palette.secondary.main,
                borderColor: theme.palette.secondary.main,
              }}
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
            >
              Reset
            </Button>
          </Box>
        )}

        {/* Main Layout */}
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            padding: isMobile ? "10px" : "20px 70px",
          }}
        >
          {/* Sidebar */}
          {!isMobile && (
            <Box
              sx={{
                width: "280px",
                background: theme.palette.background.paper,
                borderRadius: "4px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(4,6,8,0.5)",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {FilterContentInner}
            </Box>
          )}

          {/* Products Table */}
          <Box sx={{ flex: 1 }}>
            <TableContainer
              component={Paper}
              id="scrollableTable"
              ref={containerRef}
              sx={{
                borderRadius: "4px",
                maxHeight: "80vh",
                overflowY: "auto",
                background: theme.palette.background.paper,
                boxShadow: "0 2px 8px rgba(4,6,8,0.5)",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <InfiniteScroll
                dataLength={products.length}
                next={fetchNext}
                hasMore={hasMore}
                loader={
                  <Typography align="center" sx={{ p: 2 }}>
                    Loading...
                  </Typography>
                }
                scrollableTarget="scrollableTable"
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["Price", "Product Name", "Action"].map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                            padding: "10px 12px",
                            background: theme.palette.background.elevated,
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => {
                      const priceList = product.vendors?.map((v) =>
                        getMembershipPrice(v, membershipLevel)
                      ) || [0];
                      const lowestPrice = Math.min(...priceList);
                      const totalQty = product.vendors?.reduce(
                        (sum, v) => sum + (v.qty || 0),
                        0
                      );
                      const displayPrice = lowestPrice > 0 ? lowestPrice.toFixed(2) : "N/A";
                      return (
                        <TableRow
                          key={product.upc}
                          sx={{
                            "&:hover": { bgcolor: theme.palette.action.hover },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell
                            sx={{
                              color: theme.palette.success.main,
                              fontWeight: 600,
                              padding: "4px 12px",
                            }}
                          >
                            {displayPrice === "N/A" ? displayPrice : `$${displayPrice}`}
                          </TableCell>
                          <TableCell sx={{ padding: "4px 12px" }}>
                            {product.title}
                            {totalQty < 100 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  color: theme.palette.error.main,
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  mt: 0.25,
                                }}
                              >
                                Low Stock
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ padding: "4px 12px" }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => setVendorPopup(product)}
                              sx={{
                                textTransform: "none",
                                background: theme.palette.primary.main,
                                color: theme.palette.background.default,
                                "&:hover": { background: theme.palette.primary.light },
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </InfiniteScroll>
            </TableContainer>
          </Box>
        </Box>

        {/* Drawer for mobile filters */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: "80vw",
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <Box sx={{ p: 2 }}>{FilterContentInner}</Box>
        </Drawer>

        {vendorPopup && (
          <VendorPopup
            product={vendorPopup}
            close={() => setVendorPopup(null)}
          />
        )}
        <Footer />
      </div>
    </Box>
  );
}
