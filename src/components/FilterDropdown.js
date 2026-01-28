"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Grow,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const FilterDropdown = ({ label, options = [], value = [], onApply }) => {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(value);
  const [searchTerm, setSearchTerm] = useState("");

  const anchorRef = useRef(null);
  const theme = useTheme();

  useEffect(() => setTempSelected(value), [value]);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleSelectAll = () => {
    setTempSelected(tempSelected.length === options.length ? [] : [...options]);
  };

  const handleToggleOption = (option) => {
    setTempSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleApply = () => {
    onApply(tempSelected);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(value);
    setSearchTerm("");
    setOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* BUTTON */}
      <Button
        ref={anchorRef}
        onClick={handleToggle}
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "none",
          borderRadius: 1,
          minWidth: 180,
          justifyContent: "space-between",
          fontSize: "0.875rem",
          backgroundColor: `${theme.palette.background.subtle} !important`,
          color: `${theme.palette.text.primary} !important`,
          border: `1px solid ${theme.palette.divider} !important`,
          height: 40,
          "&:hover": {
            backgroundColor: `${theme.palette.background.paper} !important`,
            borderColor: `${theme.palette.primary.main} !important`,
          },
        }}
      >
        {`${label}${value.length > 0 ? ` (${value.length})` : ""}`}
      </Button>

      {/* POPPER */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        placement="bottom-start"
        sx={{ zIndex: 20 }}
      >
        {(props) => (
          <Grow {...props.TransitionProps}>
            <Paper
              sx={{
                mt: 0.8,
                borderRadius: 1,
                minWidth: 240,
                maxHeight: 340,
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "0px 20px 40px rgba(4,6,8,0.55)",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>

                  {/* SEARCH FIELD */}
                  <Box sx={{ p: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 40,
                          borderRadius: 1,
                          color: theme.palette.text.primary,
                          backgroundColor: theme.palette.background.subtle,
                          "& fieldset": { borderColor: theme.palette.divider },
                          "&:hover fieldset": { borderColor: theme.palette.primary.main },
                          "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                        },
                        "& input": { fontSize: "0.85rem" },
                      }}
                    />
                  </Box>

                  {/* OPTIONS */}
                  <MenuList
                    dense
                    sx={{
                      maxHeight: 220,
                      overflowY: "auto",
                      p: 0,
                      bgcolor: theme.palette.background.paper,
                    }}
                  >
                    {/* Select All */}
                    <MenuItem
                      onClick={handleSelectAll}
                      sx={{
                        color: theme.palette.text.primary,
                        "&:hover": { backgroundColor: theme.palette.background.subtle },
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={tempSelected.length === options.length}
                        indeterminate={
                          tempSelected.length > 0 && tempSelected.length < options.length
                        }
                        sx={{ color: theme.palette.text.secondary }}
                      />
                      <ListItemText primary="Select All" />
                    </MenuItem>

                    {/* INDIVIDUAL OPTIONS */}
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <MenuItem
                          key={option}
                          onClick={() => handleToggleOption(option)}
                          sx={{
                            color: theme.palette.text.primary,
                            "&:hover": { backgroundColor: theme.palette.background.subtle },
                          }}
                        >
                          <Checkbox
                            size="small"
                            checked={tempSelected.includes(option)}
                            sx={{ color: theme.palette.text.secondary }}
                          />
                          <ListItemText primary={option} />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled sx={{ color: theme.palette.text.secondary }}>
                        <ListItemText primary="No results found" />
                      </MenuItem>
                    )}
                  </MenuList>

                  {/* FOOTER BUTTONS */}
                  <Box
                    sx={{
                      borderTop: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                      backgroundColor: theme.palette.background.subtle,
                      position: "sticky",
                      bottom: 0,
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleApply}
                      sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.background.default,
                        "&:hover": { backgroundColor: theme.palette.primary.light },
                      }}
                    >
                      Apply
                    </Button>

                    <Button
                      size="small"
                      onClick={handleCancel}
                      sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        color: theme.palette.text.secondary,
                        "&:hover": { color: theme.palette.primary.main },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>

                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default FilterDropdown;
