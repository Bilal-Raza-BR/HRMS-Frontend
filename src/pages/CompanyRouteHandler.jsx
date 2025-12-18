import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CompanyPublicPage from "./CompanyPublicPage";
import CompanyDashboardLayout from "./CompanyDashboardLayout";
import { CircularProgress, Box } from "@mui/material";
import FullPageLoader from "../components/FullPageLoader";

const CompanyRouteHandler = ({toggleTheme,mode}) => {
  const { slug } = useParams();
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log(token);

        if (!token) {
          setShowDashboard(false);
          return;
        }

        const decoded = jwtDecode(token);
        // console.log("Decoded:", decoded);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        // console.log("Dashboard Data:", data);

        if (res.ok) {
          setShowDashboard(true);
        } else {
          setShowDashboard(false);
        }
      } catch (err) {
        console.error("Error checking access:", err);
        setShowDashboard(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [slug, refresh]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <FullPageLoader />
      </Box>
    );
  }

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return showDashboard ? (
    <CompanyDashboardLayout toggleTheme={toggleTheme} mode={mode} />
  ) : (
    <CompanyPublicPage refresh={handleRefresh} />
  );
};

export default CompanyRouteHandler;
