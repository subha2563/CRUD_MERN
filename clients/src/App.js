import { useEffect, useState } from "react";
import axios from "axios";

// ✅ YOUR LIVE BACKEND URL IS HERE
const API = "https://crud-mern-fdag.onrender.com"; 

export default function App() {
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  // READ
  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      const res = await axios.get(API);
      setPeople(res.data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  // CREATE
  const addPerson = async () => {
    if (!form.name || !form.age) return alert("Enter name & age");
    try {
      const res = await axios.post(API, { name: form.name, age: Number(form.age) });
      setPeople([...people, res.data]);
      setForm({ name: "", age: "" });
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  // SETUP EDIT
  const startEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, age: p.age });
  };

  // UPDATE
  const updatePerson = async () => {
    try {
      const res = await axios.put(`${API}/${editId}`, form);
      setPeople(people.map(p => p._id === editId ? res.data : p));
      setEditId(null);
      setForm({ name: "", age: "" });
    } catch (error) {
      console.error("Error updating person:", error);
    }
  };

  // DELETE
  const deletePerson = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setPeople(people.filter(p => p._id !== id));
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2>MERN Cloud CRUD</h2>
      
      <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ padding: "8px", marginRight: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
          style={{ padding: "8px", width: "60px", marginRight: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        {editId ? (
          <button onClick={updatePerson} style={{ padding: "8px 15px", background: "orange", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Update</button>
        ) : (
          <button onClick={addPerson} style={{ padding: "8px 15px", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add</button>
        )}
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {people.map(p => (
          <li key={p._id} style={{ background: "#f9f9f9", marginBottom: "10px", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "4px" }}>
            <span><b>{p.name}</b> ({p.age})</span>
            <div>
              <button onClick={() => startEdit(p)} style={{ marginRight: "5px", cursor: "pointer" }}>✏️</button>
              <button onClick={() => deletePerson(p._id)} style={{ color: "red", cursor: "pointer" }}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}