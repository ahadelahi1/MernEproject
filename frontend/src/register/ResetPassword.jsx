import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

export default function ResetPassword() {
  let [pswd, setPswd] = useState("");
  let [cpswd, setCPswd] = useState("");
  let {token} = useParams();
let nav = useNavigate()
  async function Reset(){
    try {
        if(pswd !== cpswd){
            toast.error("Conform Password must match with Password")
            return
        }
        await axios.put(`http://localhost:4000/ht/reset/${token}`,{
            pswd : pswd
        }).then((a) => {
            toast.success(a.data.msg)
            nav("/log")
          }).catch((E) => {
            toast.error(E)
          })
    } catch (error) {
        toast.error(error.response?.data.msg)
    }
  }

  return (
    <div>
      <div><div className="register-background">
        <ToastContainer />
        <div className="form-container">
          <h2>Reset Password</h2>
          <label htmlFor="email">Password*</label>
          <input type="text" id="email" name="email" value={pswd} onChange={(e) => setPswd(e.target.value)} required />

          <label htmlFor="email">Confirm Password*</label>
          <input type="text" id="email" name="email" value={cpswd} onChange={(e) => setCPswd(e.target.value)} required />


          <button type="button" className="submit-btn" onClick={Reset} >Reset</button>
        </div>
      </div></div>
    </div>
  )
}