import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import CartButton from "/src/components/CartButton";
import VendorPopup from "/src/components/VendorPopup";
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
import LogoutIcon from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMembershipPrice } from "../utility/pricing";
import { DEFAULT_PRODUCT_IMAGE } from "../utility/constants";
import batch1 from "/src/products/products_mapped_batch_1.json";
import batch2 from "/src/products/products_mapped_batch_2.json";
import batch3 from "/src/products/products_mapped_batch_3.json";
import batch4 from "/src/products/products_mapped_batch_4.json";
import batch5 from "/src/products/products_mapped_batch_5.json";

export default function Home() {
  const router = useRouter();
  const membershipLevel = useSelector((state) => state.auth.membership_level);
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [vendorPopup, setVendorPopup] = useState(null);
  const [openSections, setOpenSections] = useState({ brand: true, upc: false });
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);
  const theme = useTheme();
  const [pageLoading, setPageLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("api_token");
    router.push("/login");
  };

  useEffect(() => {
    const loadProducts = () => {
      try {
        setLoading(true);
        const allBatches = [...batch1, ...batch2, ...batch3, ...batch4, ...batch5];
        const parsedData = allBatches.map((item) => ({
          ...item,
          brand_name: item.brand, // Map brand to brand_name
          vendors: item.vendors || [],
        }));

        const normalizedData = parsedData.map((item) => ({
          ...item,
          vendors: Array.isArray(item.vendors)
            ? item.vendors.map((v) => ({
              ...v,
              price: Number(v.price) || 0,
              qty: Number(v.qty) || 0,
            }))
            : [],
        }));

        setProductsList(normalizedData);
      } catch (error) {
        toast.error("Unable to load products!");
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Fetch brands
  const fetchBrands = async () => {
    console.log("productsList", productsList);

    try {
      setLoading(true);
      const response = [...new Set(productsList?.map((p) => p.brand_name))];
      const sortedBrands = response
        ? [...response].sort((a, b) => a.localeCompare(b))
        : [];
      setBrands(sortedBrands);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch brands!");
    } finally {
      setLoading(false);
    }
  };


  // Fetch products
  const fetchProducts = useCallback(
    async (_page = 1, append = false) => {
      try {
        setLoading(true);
        const PAGE_SIZE = 50;
        const normalizedSearch = search.trim().toLowerCase();

        const allFiltered = productsList.filter((p) => {
          const brandMatch = selectedBrands.length
            ? selectedBrands.includes(p.brand_name)
            : true;
          const titleMatch = normalizedSearch
            ? p.title?.toLowerCase().includes(normalizedSearch)
            : true;
          const totalQty = p.vendors?.reduce((s, v) => s + (v.qty || 0), 0);
          if (totalQty > 0) {
            console.log("totalQty", totalQty);
          }

          return brandMatch && titleMatch && totalQty > 0;
        });

        const start = (_page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const newProducts = allFiltered.slice(start, end);

        setProducts((prev) =>
          append ? [...prev, ...newProducts] : newProducts
        );
        setHasMore(end < allFiltered.length);
        setPage(_page);
      } catch (error) {
        toast.error("Unable to fetch products!");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [productsList, search, selectedBrands]
  );

  useEffect(() => {
    fetchBrands();
    fetchProducts(1, false);
    setPage(1);
  }, [productsList]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProducts([]);
    const id = setTimeout(() => fetchProducts(1, false), 0);
    return () => clearTimeout(id);
  }, [search, selectedBrands]);

  const fetchNext = () => fetchProducts(page + 1, true);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
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
                key={b}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(b)}
                    onChange={() => handleBrandChange(b)}
                  />
                }
                label={
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    {b}
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
        {/* Header */}
        <Box
          sx={{
            background: theme.palette.background.paper,
            padding: isMobile ? "10px 10px" : "10px 70px",
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "0 2px 10px rgba(4,6,8,0.6)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: theme.palette.text.primary, alignSelf: "center" }}
          >
            Wholesale Leville Inc.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CartButton />
            <IconButton onClick={handleLogout} sx={{ color: theme.palette.text.primary }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>

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
                      {["Price", "Product Name", "QTY", "Action"].map((h) => (
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
                          </TableCell>
                          <TableCell
                            sx={{
                              color: totalQty > 0 ? theme.palette.success.main : theme.palette.error.main,
                              fontWeight: 600,
                              padding: "4px 12px",
                            }}
                          >
                            {totalQty}
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
      </div>
    </Box>
  );
}
