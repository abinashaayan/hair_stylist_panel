import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper
} from "@mui/material";
import CategoryTab from "../scenes/category/index"; // Replace with your actual component
import SubCategoryTable from "../scenes/subcategory/subcategory"; // Replace with your actual component
// import SubSubCategoryTable from "./SubSubCategoryTable"; // Replace with your actual component
// import ProductTable from "./ProductTable"; // Replace with your actual component

const MultipleTabs = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="management tabs"
      >
        <Tab label="Categories" />
        <Tab label="Subcategories" />
        {/* <Tab label="Sub-Subcategories" />
        <Tab label="Products" /> */}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manage Categories
            </Typography>
            <CategoryTab />
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manage Subcategories
            </Typography>
            <SubCategoryTable />
          </Box>
        )}

        {/* {currentTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manage Sub-Subcategories
            </Typography>
            <SubSubCategoryTable />
          </Box>
        )} */}

        {/* {currentTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manage Products
            </Typography>
            <ProductTable />
          </Box>
        )} */}
      </Box>
    </Paper>
  );
};

export default MultipleTabs;
