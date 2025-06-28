import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      alert("Login Successfully");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    
      }}
    >
      <Container maxWidth="xs" sx={{ p: 4, boxShadow: 3, bgcolor: "white", borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Typography align="center">
          Don’t have an account? <Link to="/">Sign Up</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
