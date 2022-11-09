import React from "react";
import "./login.css";
import { Link, Redirect } from "react-router-dom";
import api from '../../apis/api';
import Validate from '../../utils/validation'
import {setUser, setUserName, setUserSession} from '../../utils/session'
import Loading from "../Loading";
import { setAuthToken, setUserDetails, setName } from "../../utils/local";
import { toast } from "react-toastify";


class Login extends React.Component {
  state = {
    data: {
      Email: "",
      Password: ""
    },
    submitting: false,
    rememberMe: false,
    redirect: false,
    errors: []
  }
  setVal = (key, val) =>{
    const {data} = this.state
    data[key] = val;
    this.setState({data})
  }
  handleSubmit = () => {
    this.setState({submitting: true})
    const {errors} = this.state
    const email = this.state.data["Email"]
    const password = this.state.data["Password"]
    if(!Validate.validateNotEmpty(email)){
      errors.push("Email")
      this.setState({errors})
    }
    if(!Validate.validateNotEmpty(password)){
      errors.push("Password")
      this.setState({errors})
    }
    if (
      !errors.includes("Email") &&
      !Validate.validateEmail(email) &&
      Validate.validateNotEmpty(email)
    ) {
      errors.push("Email");
      this.setState({ errors });
    } else if (
      errors.includes("Email") &&
      Validate.validateEmail(email) &&
      Validate.validateNotEmpty(email)
    ) {
      errors.splice(errors.indexOf("Email"), 1);
      this.setState({ errors });
    }
    if (
      errors.includes("Password") &&
      Validate.validateNotEmpty(password)
    ) {
      errors.splice(errors.indexOf("Password"), 1);
      this.setState({ errors });
    }

    console.log(this.state.errors)

    if(!Validate.validateNotEmpty(this.state.errors)){
      const {data} = this.state
      api.post('/users/login', {data: data}).then((res)=>{
        console.log(res.data.data)
        setUserSession(res.data.data.token)
        setUser(res.data.data._id)
        setUserName(res.data.data["First Name"])
        if(this.state.rememberMe){
           setAuthToken(res.data.data.token)
           setUserDetails(res.data.data._id)
           setName(res.data.data["First Name"])
        }
        window.location.href="/dashboard"

      }).catch(error=>{
        toast.error(
          `${
            error.response && error.response.data
              ? error.response.data.message
              : "Something went wrong."
          }`,
          {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        if(error.response.status === 422){
          console.log("Wrong Email or paass")
        }else if(error.response.status === 500){
          console.log("Something went wrong")
        }
        this.setState({submitting: false})
      })
    } 
  }
  render(){
    if (this.state.redirect) {
      return <Redirect to="/dashboard"/>;
    }
  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="bg-blue">
          <div className="reflection" />
        </div>
        <div className="form-inner clearfix">
          <h3 className="text-center">SloKart</h3>
          <form>
            <div className="form-group">
              <label htmlFor="Email">
                Email<span>*</span>
              </label>
              <input
                type="text"
                name="Email"
                className="form-control"
                placeholder="Email"
                onChange={(e)=>{
                  this.setVal(e.target.name, e.target.value)
                }}
              />
              <div className="input-icon">
                <i className="fa fa-envelope-o" aria-hidden="true" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="Password">
                Password<span>*</span>
              </label>
              <input
                type="password"
                className="form-control"
                name="Password"
                placeholder="Password"
                onChange={(e)=>{
                  this.setVal(e.target.name, e.target.value)
                }}
              />
              <div className="input-icon">
                <i className="fa fa-lock" aria-hidden="true" />
              </div>
            </div>
            <button  className="btn btn-primary" data-loading onClick={(e)=>{
              e.preventDefault()
              this.handleSubmit()
            }}>
              Login
            </button>
            <div className="clearfix" />
            <div className="check pull-left">
              <input
                type="checkbox"
                name="rememberMe"
                id="remember-me"
                onChange={(e=>{this.setState({rememberMe: !this.state.rememberMe})})}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            {/* <Link to="/reset-password" className="text-center pull-right">
              forgot password?
            </Link> */}
          </form>
            <Loading show={this.state.submitting}/>
        </div>
      </div>
    </div>
  );
  }
};
export default Login;
