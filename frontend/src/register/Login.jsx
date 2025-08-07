import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

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

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const nav = useNavigate();

  async function LoginLogic() {
    try {
      if (!email || !password) {
        toast.error("All fields are required");
        return;
      }

      const res = await axios.post("http://localhost:4000/api/user/login", {
        email,
        password
      });

      setemail("");
      setpassword("");
      localStorage.setItem("UserInfo", JSON.stringify(res.data.user));
      toast.success(res.data.msg);
      nav("/register");
    } catch (error) {
      toast.error(error.response?.data.msg || "Login failed");
    }
  }

  return (
    <MDBContainer fluid className="p-4">
      <ToastContainer />
      <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>

              <div className="d-flex flex-row align-items-center mb-4 ">
                <MDBIcon fas icon="envelope me-3" size='lg' />
                <MDBInput
                  label='Your Email'
                  id='form2'
                  type='email'
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size='lg' />
                <MDBInput
                  label='Password'
                  id='form3'
                  type='password'
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>

              <MDBBtn className='mb-4' size='lg' onClick={LoginLogic}>
                Sign In
              </MDBBtn>

              <Link className="mt-3" to="/fp">Forget Password</Link>

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
