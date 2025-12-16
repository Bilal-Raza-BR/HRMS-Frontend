import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  CssBaseline,
  Fade,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CompanySidebar from "../components/company/CompanySidebar";
import CompanyTopbar from "../components/company/CompanyTopbar";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FullPageLoader from "../components/FullPageLoader";
import MyCompanyStatsCard from "../components/company/MyCompanyStatsCard";
import UserProfilePage from "../components/company/UserProfilePage";
import AttendanceModal from "../components/company/AttendanceModal";
import AttendanceManagement from "../components/company/AttendanceManagement"; // ✅ Naya Component Import
import ApplicationTable from "../components/company/ApplicationTable";
import CompanyEmployeeTable from "../components/company/CompanyEmployeeTable"; // ✅ IMPORT
import ApplyLeaveModal from "../components/company/ApplyLeaveModal"; // ✅ Naya Component Import
import LeaveRequestTable from "../components/company/LeaveRequestTable"; // ✅ Naya Component Import
import ManualInviteForm from "../components/company/ManualInviteForm"; // ✅ Naya Component Import

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const drawerWidth = 260;

const CompanyDashboardLayout = ({ toggleTheme, mode }) => {
  const { slug } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  const [openApplyLeaveModal, setOpenApplyLeaveModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);

      const res = await fetch(`http://localhost:5000/api/${slug}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok || !data.data) return;

      const foundUser = data.data.users.find((u) => u.email === decoded.email);
      if (!foundUser) return console.error("❌ User not found in company");

      setUser(foundUser);
      setCompany({
        name: data.companyName,
        logoUrl: data.logoUrl || "https://via.placeholder.com/80",
        ...data.data,
      });

      setCurrentUser({
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        profilePic: foundUser.profilePic || "",
      });
    } catch (error) {
      console.error("❌ Failed to load dashboard data:", error);
    }
  }, [slug]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (!currentUser || !company) return <FullPageLoader />;

  const currentUserAttendance = user.attendance || [];

  const chartData = [
    {
      name: "Present",
      value: currentUserAttendance.filter((a) => a.status?.toLowerCase() === "present").length,
    },
    {
      name: "Absent",
      value: currentUserAttendance.filter((a) => a.status?.toLowerCase() === "absent").length,
    },
    {
      name: "Leave",
      value: currentUserAttendance.filter((a) => a.status?.toLowerCase() === "leave").length,
    },
  ];
const COLORS = {
  present: "#4caf50", // Green
  absent: "#f44336", // Red
  leave: "#ff9800", // Orange
};

  return (
    <Fade in={true}>
      <Box sx={{ display: "flex", bgcolor: "background.default" }}>
        <CssBaseline />

        <CompanySidebar
          currentUser={currentUser}
          company={company}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onTabChange={setActivePage}
          activeTab={activePage}
        />

        <Box
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CompanyTopbar
            currentUser={currentUser}
            company={company}
            setMobileOpen={setMobileOpen}
            toggleTheme={toggleTheme}
            mode={mode}
            setOpenAttendanceModal={setOpenAttendanceModal}
            setOpenApplyLeaveModal={setOpenApplyLeaveModal}
          />

          <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />

          <Box p={{ xs: 1.5, sm: 2, md: 3 }} sx={{ flexGrow: 1 }}>
            {activePage === "dashboard" && (
              <>
                <MyCompanyStatsCard attendanceData={currentUserAttendance} />
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    mt: 4,
                    borderRadius: 3,
                    background: (theme) => theme.palette.background.paper,
                    boxShadow: (theme) => theme.shadows[4],
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    📊 Attendance Summary
                  </Typography>

                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip
                        contentStyle={{
                          background: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: "12px",
                        }}
                      />
                      <Legend iconType="circle" verticalAlign="bottom" />
                      <Pie
                        dataKey="value"
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isSmallScreen ? 50 : 70}
                        outerRadius={isSmallScreen ? 80 : 100}
                        fill="#8884d8"
                        paddingAngle={5}
                        label={!isSmallScreen && (({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`)
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name.toLowerCase()]}
                          />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: isSmallScreen ? "20px" : "24px",
                          fontWeight: "bold",
                          fill: theme.palette.text.primary,
                        }}
                      >
                        {currentUserAttendance.length} Days
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </>
            )}

            {activePage === "profile" && user && (
              <UserProfilePage currentUser={user} company={company} />
            )}

            {activePage === "applications" && (
              <ApplicationTable
                applications={company.applications || []}
                companySlug={slug}
                refreshData={fetchDashboardData}
                currentUser={currentUser}
              />
            )}

            {activePage === "attendance" && (
              <AttendanceManagement slug={slug} />
            )}

            {activePage === "employees" && company?.users && (
              <CompanyEmployeeTable slug={slug} initialEmployees={company.users} />
            )}

            {activePage === "leave-requests" && (
              <LeaveRequestTable slug={slug} />
            )}

            {activePage === "invite-user" && (
              <ManualInviteForm />
            )}
          </Box>
        </Box>

        <AttendanceModal
          open={openAttendanceModal}
          onClose={() => setOpenAttendanceModal(false)}
          currentUser={currentUser}
          companySlug={slug}
          refreshData={fetchDashboardData}
        />

        <ApplyLeaveModal
          open={openApplyLeaveModal}
          onClose={() => setOpenApplyLeaveModal(false)}
          slug={slug}
        />
      </Box>
    </Fade>
  );
};

export default CompanyDashboardLayout;
