import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  StatBox,
  LineChart,
  ProgressCircle,
  BarChart,
  GeographyChart,
} from "../../components";
import {
  DownloadOutlined,
  Email,
  PersonAdd,
  PointOfSale,
  Traffic,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import { useState } from "react";
import { CustomIconButton } from "../../custom/Button";

const statData = [
  { title: "User Management", subtitle: "Add, Edit, Delete User", icon: <PersonAdd sx={{ fontSize: "26px" }} /> },
  { title: "Category Management", subtitle: "Add, Edit, Delete Category, Subcategory and more", icon: <PointOfSale sx={{ fontSize: "26px" }} /> },
];

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const [selectedStat, setSelectedStat] = useState(null);
  const navigate = useNavigate();

  const handleStatClick = (stat) => {
    // Map your stat to its route here
    if (stat.title === "Category Management") {
      navigate("/category");
    } else if (stat.title === "User Management") {
      navigate("/customers");
    } else if (stat.type === "orders") {
      navigate("/orders");
    } else {
      // fallback or default navigation
      navigate("/");
    }
  };

  return (
    <Box m="15px">
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      <Box display="grid" gridTemplateColumns={isXlDevices ? "repeat(12, 1fr)" : isMdDevices ? "repeat(6, 1fr)" : "repeat(3, 1fr)"} gridAutoRows="140px" gap="20px">
        {statData.map((stat, index) => (

          <Box key={index} gridColumn="span 5" bgcolor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={() => handleStatClick(stat)}>
            <StatBox {...stat} />
          </Box>
        ))}

        {/* ---------------- Row 2 ---------------- */}

        {/* Line Chart */}
        {/* <Box
          gridColumn={
            isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
          }
          gridRow="span 2"
          bgcolor={colors.primary[400]}
        >
          <Box
            mt="25px"
            px="30px"
            display="flex"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.gray[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlined
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
              />
            </IconButton>
          </Box>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box> */}

        {/* Transaction Data */}
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          overflow="auto"
        >
          <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>

          {mockTransactions.map((transaction, index) => (
            <Box
              key={`${transaction.txId}-${index}`}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.gray[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Typography color={colors.gray[100]}>
                {transaction.date}
              </Typography>
              <Box
                bgcolor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box> */}

        {/* Revenue Details */}
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              textAlign="center"
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography textAlign="center">
              Includes extra misc expenditures and costs
            </Typography>
          </Box>
        </Box> */}

        {/* Bar Chart */}
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ p: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="250px"
            mt="-20px"
          >
            <BarChart isDashboard={true} />
          </Box>
        </Box> */}

        {/* Geography Chart */}
        {/* <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Geography Based Traffic
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="200px"
          >
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}

      </Box>
      <Box>
        {selectedStat && (
          <Card sx={{ mt: "18px", borderRadius: "15px", backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box p={2} borderRadius="10px">
                <Typography variant="h5">{selectedStat.title}</Typography>
                <Typography variant="subtitle1">{selectedStat.subtitle}</Typography>
                <Typography variant="body1">Progress: {selectedStat.progress}</Typography>
                <Typography variant="body1">Increase: {selectedStat.increase}</Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box >
  );
}

export default Dashboard;
