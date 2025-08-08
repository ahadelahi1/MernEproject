import React, { useState } from 'react';
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
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const [pswd, setPswd] = useState("");
  const [cpswd, setCPswd] = useState("");
  const { token } = useParams();
  const nav = useNavigate();

  async function Reset() {
    try {
      if (pswd !== cpswd) {
        toast.error("Confirm Password must match with Password");
        return;
      }

      await axios.post(`http://localhost:4000/api/user/reset/${token}`, {
        pswd: pswd
      }).then((res) => {
        toast.success(res.data.msg);
        nav("/log");
      }).catch((err) => {
        toast.error(err.response?.data?.msg || "Something went wrong");
      });

    } catch (error) {
      toast.error(error.response?.data?.msg || "Server Error");
    }
  }

  return (
    <MDBContainer fluid style={{ backgroundColor: 'white' }}>
      <ToastContainer />
      <MDBCard className='text-black m-5'>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Reset Password</p>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size='lg' />
                <MDBInput
                  label='New Password'
                  id='form5'
                  type='password'
                  value={pswd}
                  onChange={(e) => setPswd(e.target.value)}
                />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="key me-3" size='lg' />
                <MDBInput
                  label='Confirm Password'
                  id='form6'
                  type='password'
                  value={cpswd}
                  onChange={(e) => setCPswd(e.target.value)}
                />
              </div>

              <MDBBtn className='mb-4' size='lg' onClick={Reset}>Reset</MDBBtn>

            </MDBCol>

            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage
                src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp'
                fluid />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
