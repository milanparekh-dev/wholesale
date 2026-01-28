import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import {
  Paper,
  Typography,
  Button,
  Divider,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function VendorPopup({ product, close }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedQty, setSelectedQty] = useState({});
  const chartRef = useRef(null);

  // AmCharts modules will only load on client
  const [amChartsLoaded, setAmChartsLoaded] = useState(false);
  const am5Ref = useRef(null);
  const am5xyRef = useRef(null);
  const am5themes_AnimatedRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      am5Ref.current = require("@amcharts/amcharts5");
      am5xyRef.current = require("@amcharts/amcharts5/xy");
      am5themes_AnimatedRef.current = require("@amcharts/amcharts5/themes/Animated").default;
      setAmChartsLoaded(true);
    }
  }, []);

  const handleQtyChange = (vendorIdx, change, maxQty) => {
    setSelectedQty((prev) => {
      const current = prev[vendorIdx] || 1;
      const next = Math.min(Math.max(current + change, 1), maxQty || 99);
      return { ...prev, [vendorIdx]: next };
    });
  };

  const handleAddToCart = (vendorIdx, goToCart = false) => {
    const vendor = product.vendors[vendorIdx];
    const qty = Number(selectedQty[vendorIdx] || 1);

    if (vendor.qty && qty > vendor.qty) {
      alert(`Only ${vendor.qty} available`);
      return;
    }

    dispatch(
      addToCart({
        upc: product.upc,
        title: product.title,
        vendor: vendor.name,
        qty,
        price: vendor.price,
      })
    );

    if (goToCart) {
      router.push("/cart");
    } else {
      toast.success(`Added ${qty} item(s) from ${vendor.name} to cart`);
    }
  };

  // Chart setup (only runs on client)
  useEffect(() => {
    if (!amChartsLoaded || !chartRef.current) return;

    const am5 = am5Ref.current;
    const am5xy = am5xyRef.current;
    const am5themes_Animated = am5themes_AnimatedRef.current;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "day",
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Price",
        xAxis,
        yAxis,
        valueYField: "price",
        categoryXField: "day",
        stroke: am5.color(0x673ab7),
        fill: am5.color(0x673ab7),
        tooltip: am5.Tooltip.new(root, { labelText: "{categoryX}: ${valueY}" }),
      })
    );

    const last5Days = [
      { day: "Day -4", price: product.vendors[0]?.price * 0.95 },
      { day: "Day -3", price: product.vendors[0]?.price * 0.97 },
      { day: "Day -2", price: product.vendors[0]?.price },
      { day: "Day -1", price: product.vendors[0]?.price * 1.02 },
      { day: "Today", price: product.vendors[0]?.price },
    ];

    series.data.setAll(last5Days);
    xAxis.data.setAll(last5Days);

    // Dark theme
    chart.get("colors").set("colors", [am5.color(0xffffff)]);
    xAxis.get("renderer").labels.template.setAll({ fill: am5.color(0xffffff) });
    yAxis.get("renderer").labels.template.setAll({ fill: am5.color(0xffffff) });
    xAxis.get("renderer").grid.template.setAll({ stroke: am5.color(0xffffff), strokeOpacity: 0.2 });
    yAxis.get("renderer").grid.template.setAll({ stroke: am5.color(0xffffff), strokeOpacity: 0.2 });

    return () => root.dispose();
  }, [amChartsLoaded, product]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "90%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#121212",
          p: 3,
          borderRadius: 3,
          position: "relative",
          animation: "scaleIn 0.3s ease",
        }}
      >
        <IconButton
          onClick={close}
          sx={{ position: "absolute", top: 10, right: 10, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>

        {/* Product Info */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <img
            src={product.image || "https://via.placeholder.com/120"}
            alt={product.title}
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
          />
          <Box>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
              {product.title}
            </Typography>
            <Typography sx={{ color: "#bbb" }}>
              Brand: {product.brand} | Category: {product.category} | Type: {product.type}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#fff", mb: 2 }} />

        {/* Vendor Table */}
        <TableContainer
          component={Paper}
          sx={{ background: "#1e1e1e", borderRadius: 2, border: "1px solid #fff", mb: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Vendor</TableCell>
                <TableCell sx={{ color: "#fff" }}>Price</TableCell>
                <TableCell sx={{ color: "#fff" }}>Available Qty</TableCell>
                <TableCell sx={{ color: "#fff" }}>Select Qty</TableCell>
                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.vendors.map((v, i) => (
                <TableRow key={v.sku} sx={{ "&:hover": { background: "#2a2a2a" } }}>
                  <TableCell sx={{ color: "#fff" }}>{v.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>${v.price.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: v.qty > 0 ? "#4caf50" : "#f44336" }}>
                    {v.qty > 0 ? v.qty : "Out of Stock"}
                  </TableCell>
                  <TableCell>
                    {v.qty > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleQtyChange(i, -1, v.qty)}
                          disabled={(selectedQty[i] || 1) <= 1}
                          sx={{ minWidth: 30 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>
                        <Typography sx={{ color: "#fff", minWidth: 25, textAlign: "center" }}>
                          {selectedQty[i] || 1}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleQtyChange(i, +1, v.qty)}
                          disabled={(selectedQty[i] || 1) >= v.qty}
                          sx={{ minWidth: 30 }}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {v.qty > 0 && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddToCart(i, false)}
                        sx={{ textTransform: "none", background: "#673ab7" }}
                      >
                        Add
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Chart */}
        <Divider sx={{ borderColor: "#fff", mb: 1 }} />
        <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          Price Comparison Last 5 Days
        </Typography>
        <Box sx={{ width: "100%", height: 250, mb: 2 }}>
          <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
        </Box>

        {/* Bottom Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={close} sx={{ color: "#fff", borderColor: "#fff" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const firstAvailable = product.vendors.findIndex((v) => v.qty > 0);
              if (firstAvailable !== -1) handleAddToCart(firstAvailable, true);
              else alert("No available stock to buy");
            }}
          >
            Go to Cart
          </Button>
        </Box>

        <style jsx global>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </Paper>
    </div>
  );
}
