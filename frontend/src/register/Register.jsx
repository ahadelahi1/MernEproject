import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
  MDBCheckbox
} from 'mdb-react-ui-kit';

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

    const nameRegex = /^[a-zA-Z]{2,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

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
    <MDBContainer fluid>
      <ToastContainer />
      <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Register</p>
              <form onSubmit={submitfunc} className="w-100">
                <MDBInput label='Name' className='mb-4' value={name} onChange={(e) => setname(e.target.value)} required />
                <MDBInput label='Email' type='email' className='mb-4' value={email} onChange={(e) => setemail(e.target.value)} required />
                <MDBInput label='Password' type='password' className='mb-4' value={password} onChange={(e) => setpassword(e.target.value)} required />
                <MDBInput label='Age' type='number' className='mb-4' value={age} onChange={(e) => setage(e.target.value)} required />
                <MDBInput label='Address' type='text' className='mb-4' value={address} onChange={(e) => setaddress(e.target.value)} required />
                <select className='form-control mb-4' value={gender} onChange={(e) => setgender(e.target.value)} required>
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
                <select className='form-control mb-4' value={role} onChange={(e) => setrole(e.target.value)} required>
                  <option value=''>Select Role</option>
                  <option value='admin'>Admin</option>
                  <option value='user'>User</option>
                  <option value='vendor'>Vendor</option>
                </select>
                <MDBBtn type='submit' className='mb-4' size='lg'>Register</MDBBtn>
              </form>
            </MDBCol>

            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default RegisterData;
