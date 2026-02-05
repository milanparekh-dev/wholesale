import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/authSlice";
import { Box, CircularProgress } from "@mui/material";

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isChecking, setIsChecking] = useState(true);

    const publicPaths = ["/login", "/register", "/admin/login"];

    useEffect(() => {
        if (!router.isReady) return;

        const checkAuth = async () => {
            const token = localStorage.getItem("api_token");
            const userData = localStorage.getItem("user_data");

            if (token && userData) {
                try {
                    dispatch(loginAction(JSON.parse(userData)));
                } catch (e) {
                    console.error("Failed to parse user data", e);
                }
            }

            const path = router.pathname;
            const isPublicPath = publicPaths.includes(path);
            const isAdminPath = path.startsWith("/admin");

            if (!token && !isPublicPath) {
                // Determine which login page to redirect to
                if (isAdminPath) {
                    await router.replace("/admin/login");
                } else {
                    await router.replace("/login");
                }
            } else {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router.isReady, router.pathname]);

    const isPublicPath = publicPaths.includes(router.pathname);
    const shouldShowLoader = isChecking && !isPublicPath;

    if (shouldShowLoader) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    bgcolor: "background.default",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
