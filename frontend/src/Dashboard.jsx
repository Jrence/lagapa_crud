import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const API_URL = "http://localhost:5000/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch items from API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error Fetching Items:", error));
  }, []);

  // Add item to API
  const addItem = () => {
    if (!newItem.trim()) return;

    axios
      .post(API_URL, { name: newItem })
      .then((response) => {
        const newItemWithId = {
          ...response.data,
          id: response.data.id || Date.now(),
        };
        setItems((prevItems) => [...prevItems, newItemWithId]);
        setNewItem("");
      })
      .catch((error) => console.error("Error Adding Item:", error));
  };

  // Update item in API
  const updateItem = (id, name) => {
    axios
      .put(`${API_URL}/${id}`, { name })
      .then((response) => {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? response.data : item))
        );
      })
      .catch((error) => console.error("Error Updating Item:", error));
  };

  // Delete item from API
  const deleteItem = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error Deleting Item:", error));
  };

  return (
    <div style={{ border: "2px solid gray", padding: "20px" }}>
      <h1>Welcome {user}</h1>
      <h1>React + Express REST API</h1>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, e.target.value)}
            />
            <Button
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
}

export default App;
