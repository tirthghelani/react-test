import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchProducts,
  searchProducts,
  setSearchTerm,
} from "../features/products/productsSlice";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Rating,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowLeft } from "@mui/icons-material";
import debounce from "lodash/debounce";

const Products = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);
  const [searchValue, setSearchValue] = useState("");

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchText: string) => {
      if (searchText.trim()) {
        dispatch(searchProducts(searchText));
      } else {
        dispatch(fetchProducts());
      }
    }, 500),
    [dispatch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const renderProductGrid = () => {
    if (items.length === 0 && status !== "loading") {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            width: "100%",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {items.map((product) => (
          <Grid key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              {/* Uncomment when image support is needed
              <CardMedia
                component="img"
                height="200"
                image={product.thumbnail}
                alt={product.title}
                sx={{ objectFit: "cover" }}
              /> */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {product.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    mb: 1,
                  }}
                >
                  {product.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <Chip
                    label={`${product.discountPercentage}% OFF`}
                    color="error"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating
                    value={product.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({product.rating})
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Chip label={product.category} size="small" sx={{ mr: 1 }} />
                  <Chip
                    label={`Stock: ${product.stock}`}
                    size="small"
                    color={product.stock > 0 ? "success" : "error"}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ py: 3 }}>
      <TextField
        fullWidth
        value={searchValue}
        onChange={handleSearch}
        placeholder="Search products..."
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ArrowLeft />
            </InputAdornment>
          ),
        }}
      />

      {status === "failed" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {status === "loading" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {status !== "loading" && renderProductGrid()}
    </Box>
  );
};

export default Products;
