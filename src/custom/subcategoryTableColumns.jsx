import { Box, Chip } from "@mui/material";
import { Eye, Trash2 } from "lucide-react";
import { CustomIconButton } from "./Button";

export const subCategoryTableColumns = ({
  handleDelete,
  handleView,
}) => [
  {
    field: "subCategoryId",
    headerName: "SubCategory ID",
    width: 150,
  },
  {
    field: "name",
    headerName: "SubCategory Name",
    width: 200,
  },
  {
    field: "parentCategory",
    headerName: "Parent Category",
    width: 200,
  },
  // {
  //   field: "slug",
  //   headerName: "Slug",
  //   width: 200,
  // },
  {
    field: "isActive",
    headerName: "Status",
    width: 180,
    renderCell: (params) => (
      <Chip  
        label={params.row.isActive}
        color={params.row.isActive === "Active" ? "success" : "error"}
        size="small"
      />
    ),
  },
  // {
  //   field: "createdAt",
  //   headerName: "Created At",
  //   width: 150,
  // },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.3,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        gap={1}
      >
        <CustomIconButton
          icon={<Eye size={20} color="white" />}
          color="rgb(77 141 225)"
          onClick={() => handleView(params.row)}
        />
        <CustomIconButton
          icon={<Trash2 size={18} />}
          color="hsl(0 84.2% 60.2%)"
          onClick={() => handleDelete(params.row.id)}
        />
        
      </Box>
    ),
  },
];
