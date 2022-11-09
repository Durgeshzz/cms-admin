import React from "react";
import "./login.css";
import { Link } from "react-router-dom";


const ResetPassword = () => {
  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="bg-blue">
          <div className="reflection" />
        </div>
        <div className="form-inner reset-password clearfix">
          <h3 className="text-center">Reset Password</h3>
          <p className="text-center">
            Enter your account email to receive a link allowing you to reset
            your password.
          </p>
          <form
          >
           
            <div className="form-group">
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="Email"
                autofocus
              />
              <div className="input-icon">
                <i className="fa fa-envelope-o" aria-hidden="true" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" data-loading>
              Reset Password
            </button>
          </form>
          <Link className="text-center" to="/">
            I remembered my password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
