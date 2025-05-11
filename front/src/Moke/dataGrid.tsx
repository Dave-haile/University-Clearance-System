import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { api } from "../pages/Admin/services/services_api";
import { User } from "../types";

export const MokeDataGrid = () => {
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    const response = await api.users.getAll();
    console.log(response);
    setUsers(response);
  };
  useEffect(() => {
    fetchUsers();
  });
  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 60 },
    { field: "avatar", headerName: "Avatar", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "isActive", headerName: "isActive", width: 60 },
  ];
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography
        variant="h3"
        component={"h3"}
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Manage Users
      </Typography>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
      ></DataGrid>
    </Box>
  );
};
