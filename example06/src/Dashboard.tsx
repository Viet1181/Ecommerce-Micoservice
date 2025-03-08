import { Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { authProvider } from "./authProvider";
import { blue } from "@mui/material/colors";

export const Dashboard = () => {

    const [authStatus, setAuthStatus] = useState("Not Authenticated");

    useEffect(() => {
        authProvider.checkAuth()
        .then(() => setAuthStatus("Authenticated"))
        .catch(() => setAuthStatus("Not Authenticated"));
    }, []);

    return (
        <Grid container justifyContent="center" style={{marginTop:50}}>
            <Grid item xs={12} md={8} lg={6}>
            <Card style={{
                borderRadius: 16,
                boxShadow: "0 4px 20px rgbb(0,0,0.1)",
                background: `linear-gradient(135deg, ${blue[500]} 30%, ${blue[300]} 90% )`,
                color: "white",
            }}>
                <CardHeader
                    avatar = {
                        <Avatar sx = {{bgcolor: "white",
                            color: blue[500],
                        }}>
                            A
                        </Avatar>
                    }
                    title="Welcome to the Administration"
                    titleTypographyProps={{variant: 'h5', fontWeight: 'bold'}}/>
                    <CardContent>
                        <Typography variant="body1" style={{ marginBottom: 16 }}>
                            Welcome to Administration panel. Here, you can manage content, monitor activities,
                            and customize settings to ensure the system runs efficently.
                            
                        </Typography>
                    </CardContent>
                    <CardContent>
                    {authStatus === null ? (
                        <Box display="flex" alignItems = "center">
                            <CircularProgress size={24} style={{color:"white", marginRight: 8}}/>
                            <Typography variant="body2">Checking authentication...</Typography>
                        </Box>
                    ) : (
                        <Typography variant="h6" style={{fontWeight: "bold"}}>
                            {authStatus}
                        </Typography>
                    )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};