import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import SalesRepLayout from "./SalesRepLayout";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Render the appropriate layout based on user role
  if (user?.role === "admin") {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  // Default to sales rep layout
  return (
    <SalesRepLayout>
      <Outlet />
    </SalesRepLayout>
  );
};

export default Layout;
