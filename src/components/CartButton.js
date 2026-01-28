import Link from "next/link";
import { useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";

export default function CartButton() {
  const count = useSelector((state) => state.cart.items.length);
  const theme = useTheme();
  return (
    <div>
      <Link href="/cart">
        <Button
          variant="contained"
          sx={{
            background: theme.palette.primary.main,
            color: theme.palette.background.default,
            textTransform: "none",
            borderRadius: "6px",
            px: 2.5,
            py: 1,
            fontWeight: 600,
            "&:hover": { background: theme.palette.primary.light },
          }}
        >
          View Cart ({count})
        </Button>
      </Link>
    </div>
  );
}
