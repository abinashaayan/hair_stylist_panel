import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper
} from "@mui/material";
import SubCategoryTable from "../scenes/subcategory/subcategory"; 

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
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manage Categories
            </Typography>
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
      </Box>
    </Paper>
  );
};

export default MultipleTabs;
