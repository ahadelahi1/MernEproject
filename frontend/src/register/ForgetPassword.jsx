import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function Forgot_Password() {
    try {
      const response = await axios.post("http://localhost:4000/api/user/forgot", {
        e: email
      });

      toast.success(response.data.msg);
      setEmail("");

    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Email does not exist");
      } else {
        toast.error(error.response?.data?.msg || "Something went wrong");
      }
    }
  }

  return (
    <MDBContainer fluid className="p-4" style={{ backgroundColor: 'white' }}>
      <ToastContainer />
      <MDBCard className='text-black m-5'>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Forgot Password</p>

              <div className="d-flex flex-row align-items-center mb-4 ">
                <MDBIcon fas icon="envelope me-3" size='lg' />
                <MDBInput
                  label='Your Email'
                  id='form2'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <MDBBtn className='mb-4' size='lg' onClick={Forgot_Password}>
                Send Link
              </MDBBtn>

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
