import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import HotelIcon from "@mui/icons-material/Hotel";
import BarChartIcon from "@mui/icons-material/BarChart";

const MyCompanyStatsCard = ({ attendanceData }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const total = attendanceData?.length || 0;
  const present = attendanceData?.filter((d) => d.status === "present").length || 0;
  const absent = attendanceData?.filter((d) => d.status === "absent").length || 0;
  const leave = attendanceData?.filter((d) => d.status === "leave").length || 0;

  const cardItems = [
    {
      title: "Present Days",
      count: present,
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
    {
      title: "Absent Days",
      count: absent,
      icon: <EventBusyIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.error.main,
    },
    {
      title: "Leaves Taken",
      count: leave,
      icon: <HotelIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
    },
    {
      title: "Total Records",
      count: total,
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {cardItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
        <motion.div
          whileHover={{ y: -5, boxShadow: "0px 15px 25px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <Card
            elevation={isDark ? 8 : 3}
            sx={{
              borderRadius: 4,
              p: 2,
              position: "relative",
              overflow: "hidden",
              background: isDark ? "rgba(40, 40, 40, 0.8)" : "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={800} sx={{ color: item.color }}>
                    {item.count}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {item.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.color,
                    color: '#fff',
                    boxShadow: `0 4px 12px ${item.color}60`,
                  }}
                >
                  {item.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default MyCompanyStatsCard;
