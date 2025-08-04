import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

export default function ForgotPAssword() {
  let [email, setEmail] = useState("");

  async function Forgot_Password() {
    try {
      await axios.post("http://localhost:4000/ht/forgot", {
        e: email
      }).then((a) => {
        toast.success(a.data.msg)
        setEmail("")
      }).catch((E) => {
        toast.error(E)
      })
    } catch (error) {
      if (error.status === 404) {
        toast.error("Email Does not Exist")
      }
      else {
        toast.error(error.response?.data.msg)
      }
    }
  }
  return (
    <div>
      <div><div className="register-background">
        <ToastContainer />
        <div className="form-container">
          <h2>Forget Password</h2>
          <label htmlFor="email">Email*</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="button" className="submit-btn" onClick={Forgot_Password} >Send Link</button>
        </div>
      </div></div>
    </div>
  )
}