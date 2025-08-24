
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv").config();
let secure_info = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSKEY
  }
});
let all_func = {
  Register: async function (req, res) {
    try {
      let { name, email, password, age, address, role, gender } = req.body;

      // Duplicate Email Check
      const exist = await User.findOne({ email:email });
      if (exist) {
        return res.status(400).json({ msg: "Email already exists" });
      }

      // Password Hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // User Save
      let save_data = new User({
        name,
        email,
        password: hashedPassword,
        age,
        address,
        role,
        gender
      });

      await save_data.save();

      // ✅ Nodemailer Setup
     

      // ✅ Email Body
      let EmailBodyInfo = {
        to: email,
        from: process.env.EMAIL,
        subject: "Account Registered Successfully",
        html: `<h3>Hello ${name}</h3><p>Your account has been registered successfully.</p>`
      };

      // ✅ Send Mail
      secure_info.sendMail(EmailBodyInfo, function (err, info) {
        if (err) {
          console.log("Email error:", err);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      // ✅ Response
      res.status(201).json({ msg: "User Registered Successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server Error", error: error.message });
    }
  },

Login: async function (req,res){
  try {
    let {email, password} = req.body;
    let email_check= await User.findOne({email :email})
    if(!email_check){
      return res.status(404).json({msg : "Email not found"})
    }

    let password_check = bcrypt.compareSync(password ,email_check.password)
    if(!password_check){
      return res.status(404).json({msg : "password is invalid"})
    }

    // ✅ Token banate waqt same secret use karo jo .env me hai
    let token = jwt.sign(
      { id: email_check._id },
      process.env.JWT_SECRET,   // yeh env variable rakho
      { expiresIn: "5h" }
    );

    res.status(200).json({
      token,
      user : {
        id : email_check._id,
        name : email_check.name,
        email: email_check.email
      },
      msg : "Login Successfully"
    });

  } catch (error) {
    res.status(500).json({msg : error.message})
    console.log(error.message)
  }
},

  forget_password : async function(req,res){
    try {
      let {e} = req.body
      let email_check = await User.findOne({email : e})
      if(!email_check){
        res.status(404).json({msg : "Email Not Exist"})
      }
      let token = jwt.sign({id : email_check.id}, process.env.KEY, {expiresIn : "1h"})
      let url = `http://localhost:3000/re/${token}`

      let email_body = {
        to : email_check.email,
        from : process.env.EMAIL,
        subject: "Reset Password Link",
        html :`<p>Hi ${email_check.name} <br/> Your Password Reset Link is given below 
        <a href=${url}>Click Here<a></p>`
      }
      secure_info.sendMail(email_body, function(e,i){
        if(e){
          console.log(e)
        }
      })
      res.status(200).json({msg: "Email Sent Successfully"})

    } catch (error) {
      res.status(504).json({msg: error.message})
    }
  },
  
  reset_password: async function(req, res) {
    try {
      let { token } = req.params;
      let { pswd } = req.body;
  
      let check_token = jwt.verify(token, process.env.KEY); // decode → verify
  
      let haspswd = bcrypt.hashSync(pswd, 12);
  
      await User.findByIdAndUpdate(check_token.id, {
        password: haspswd
      });
  
      res.status(200).json({ msg: "Password reset successful" }); // ADD THIS
    } catch (error) {
      res.status(504).json({ msg: error.message });
    }
  },

getVisitors: async function (req, res) {
  try {
    let { search, gender, sort } = req.query;
    let filter = { role: "user" };

    // 🔍 Search by name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 🚻 Filter by gender
    if (gender && gender !== "all") {
      filter.gender = gender;
    }

    let query = User.find(filter).select("-password -__v");

    // 📊 Sort by age
    if (sort === "asc") {
      query = query.sort({ age: 1 });
    } else if (sort === "desc") {
      query = query.sort({ age: -1 });
    }

    const visitors = await query;
    res.json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ msg: "Failed to fetch visitors", error: error.message });
  }
},
getVisitors: async function (req, res) {
  try {
    let { search, gender, sort } = req.query;
    let filter = { role: "user" };

    // 🔍 Search by name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 🚻 Filter by gender
    if (gender && gender !== "all") {
      filter.gender = gender;
    }

    let query = User.find(filter).select("-password -__v");

    // 📊 Sort by age
    if (sort === "asc") {
      query = query.sort({ age: 1 });
    } else if (sort === "desc") {
      query = query.sort({ age: -1 });
    }

    const visitors = await query;
    res.json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ msg: "Failed to fetch visitors", error: error.message });
  }
},




  
  

}




        
 


module.exports = all_func;
