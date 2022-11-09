import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import api from "../../../apis/api";
import Validate from '../../../utils/validation'
import Loading from '../../Loading'
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'

class CreateTag extends React.Component {
  state = {
    submitting: false,
    data: {
      "name": "",
      "url": ""
    },
    requiredPermission: "Create Tag",
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  }
  componentDidMount(){
    if(this.props.edit == "true"){
      this.setState({submitting: true})
      const url = "/tag/get/" + this.props.match.params.id
      const {data} = this.state
        api.get(url).then(res=>{
        data.name = res.data.data.name
        data.url = res.data.data.url
        this.setState({data, submitting: false})
      }).catch(err=>{
        toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
          this.setState({submitting: false})
      })
    }
  }
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  setVal = (key,val) => {
    const {data} = this.state
    data[key] = val;
    this.setState({data})
  }
  handleSubmit = () =>{
    const {errors} = this.state
    const {data} = this.state
   
    if (
      !errors.includes("name") &&
      !Validate.validateNotEmpty(data['name'])
    ) {
      errors.push("name");
      this.setState({ errors });
    } else if (
      errors.includes("name") &&
      Validate.validateNotEmpty(data['name'])
    ) {
      errors.splice(errors.indexOf("name"), 1);
      this.setState({ errors });
    }
    if(this.props.edit == "true"){
      if (
        !errors.includes("url") &&
        !Validate.validateNotEmpty(data['url'])
      ) {
        errors.push("url");
        this.setState({ errors });
      } else if (
        errors.includes("url") &&
        Validate.validateNotEmpty(data['url'])
      ) {
        errors.splice(errors.indexOf("url"), 1);
        this.setState({ errors });
      }
    }
    if(!Validate.validateNotEmpty(this.state.errors)){
      this.setState({submitting: true})
      if(this.props.edit == "true"){
        const _id = this.props.match.params.id
        api.put('/tag', {data, _id, requiredPermission: "Edit Tag"}).then(res=>{
          this.setState({submitting: false, alertType: "success", alertMessage: "Tag edited successfully."})

        }).catch(err=>{
          toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
          this.setState({submitting: false})


        })
      }else{
        const {requiredPermission} = this.state
        api.post('/tag',{data: data, requiredPermission}).then(res=>{
          toast.success('Tag added successfully', {
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
          this.setState({submitting: false, redirect: true})

        }).catch(err=>{
          toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
          this.setState({submitting: false})


        })
      }
    
    }else{
      this.setState({alertType: "fail", alertMessage: "Please fill the following: "+ errors})
    }
    
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={ "/tags"} />
    }
    return (
      <React.Fragment>
        <section className="content-header clearfix">
        {this.props.edit == "true"? <h3>Edit Tag</h3>: <h3>Create Tag</h3>}
          <ol className="breadcrumb">
            <li>
              <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li>
              <Link to='/tags'>Tags</Link>
            </li>
            {this.props.edit == "true"? <li className="active">Edit Tag</li>: <li className="active">Create Tag</li>}
          </ol>
        </section>
        <Loading show={this.state.submitting} />

        <section className="content">
        {getMessage(
            this.state.alertType,
            this.state.alertMessage,
            this.onClose
          )}
          <form className="form-horizontal">
            <div className="accordion-content clearfix">
              <div className="col-lg-3 col-md-4">
                <div className="accordion-box">
                  <div className="panel-group" id="TagTabs">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a>Tag Information</a>
                        </h4>
                      </div>
                      <div
                        id="tag_information"
                        className="panel-collapse collapse in"
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li className="active ">
                              <a >
                                General
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-8">
                <div className="accordion-box-content">
                  <div className="tab-content clearfix">
                    <div className="tab-pane fade in active" id="general">
                      <h3 className="tab-content-title">General</h3>
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form-group">
                            <label
                              htmlFor="name"
                              className="col-md-3 control-label text-left"
                            >
                              Name<span className="m-l-5 text-red">*</span>
                            </label>
                            <div className="col-md-9">
                              <input
                                name="name"
                                className="form-control "
                                id="name"
                                type="text"
                                value={this.state.data.name}
                                onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                              />
                            </div>
                          </div>
                          {this.props.edit == "true"? <div className="form-group">
                            <label
                              htmlFor="name"
                              className="col-md-3 control-label text-left"
                            >
                              Url<span className="m-l-5 text-red">*</span>
                            </label>
                            <div className="col-md-9">
                              <input
                                name="url"
                                className="form-control "
                                id="name"
                                type="text"
                                value={this.state.data.url}
                                onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                              />
                            </div>
                          </div>:""}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-offset-2 col-md-10" style={{display: "flex"}}>
                        <button
                          className="btn btn-primary "
                          onClick={(e)=>{
                            e.preventDefault()
                            this.handleSubmit()
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </React.Fragment>
    );
  }
}
export default withRouter(CreateTag);
