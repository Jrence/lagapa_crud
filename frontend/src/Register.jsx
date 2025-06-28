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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container maxWidth="xs" sx={{ p: 4, boxShadow: 3, bgcolor: "white", borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
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
          fullWidth
          color="primary"
          onClick={handleRegister}
          sx={{ mt: 2 }}
        >
          Register
        </Button>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Typography align="center">
          Already have an account? <Link to="/login">Sign In</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;
