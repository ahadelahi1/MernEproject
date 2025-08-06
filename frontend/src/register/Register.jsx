import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function RegisterData() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [age, setage] = useState("");
  const [gender, setgender] = useState("");
  const [role, setrole] = useState("");
  const [address, setaddress] = useState("");

  const submitfunc = async (e) => {
    e.preventDefault();

    // Regular expressions
    const nameRegex = /^[a-zA-Z]{2,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

    // Validation
    if (!name || !email || !password || !age || !gender || !role || !address) {
      toast.error("All fields are required");
      return;
    }

    if (!nameRegex.test(name)) {
      toast.error("Invalid name. Only alphabets, 2-15 characters.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be strong (8+ chars, uppercase, lowercase, number, symbol)");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/user/register", {
        name,
        email,
        password,
        age,
        gender,
        role,
        address,
      });
      toast.success(res.data.msg || "Data Registered successfully");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Register yourself</h2>
      <hr />

      <div className="mb-3">
        <label className="form-label">Enter your name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Enter your email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Enter your password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Enter your age</label>
        <input
          type="number"
          className="form-control"
          value={age}
          onChange={(e) => setage(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Select your gender</label>
        <select
          className="form-control"
          value={gender}
          onChange={(e) => setgender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Select your role</label>
        <select
          className="form-control"
          value={role}
          onChange={(e) => setrole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Enter your address</label>
        <textarea
          className="form-control"
          value={address}
          onChange={(e) => setaddress(e.target.value)}
        ></textarea>
      </div>

      <button className="btn btn-success mt-3" type="submit" onClick={submitfunc}>
        Register
      </button>
    </div>
  );
}

export default RegisterData;
