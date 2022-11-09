import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import Validate from '../../../utils/validation'
import api from '../../../apis/api'
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import FileManager from "../../Media/FileManager";
import Loading from '../../Loading'
import { siteUrl } from "../../../utils/utils";
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'
class CreateBrand extends React.Component {
  state = {
    imageType: "",
    submitting: false,
    logoImage: "",
    bannerImage: "",
    showModal: false,
    multiple: false,
    activePanel: "general",
    data: {
      name: "",
      status: false,
      metaTitle: "",
      metaDescription: "",
      url: ""
    },
    logo: "",
    banner: "",
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  };
  setImageId = (id, multiple,image) => {  
    if(this.state.imageType == "logo"){
      this.setState({ logo: id, logoImage:  image });
    }else if(this.state.imageType == "banner"){
      this.setState({ banner: id, bannerImage:  image });
    }
  };
  componentDidMount(){
    if(this.props.edit == "true"){
      this.setState({submitting: true})
      const url = "/brand/get/" +  this.props.match.params.id
      api.get(url).then(res=>{
        const {data} = this.state
        data.name = res.data.data.name
        data.status = res.data.data.status
        data.url = res.data.data.url
        data.metaTitle = res.data.data.metaTitle
        data.metaDescription = res.data.data.metaDescription
        this.setState({data, banner: res.data.data.banner?res.data.data.banner._id: "", bannerImage: res.data.data.banner?res.data.data.banner.image:"", logo: res.data.data.logo?res.data.data.logo._id:"", logoImage: res.data.data.logo?res.data.data.logo.image:"", submitting: false})
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
  setVal = (key, val) => {
    const { data } = this.state;
    data[key] = val;
    this.setState({ data });
  };
  handleSubmit = () =>{
    const { errors } = this.state;
    const { data } = this.state;

    if (!errors.includes("name") && !Validate.validateNotEmpty(data["name"])) {
      errors.push("name");
      this.setState({ errors });
    } else if (
      errors.includes("name") &&
      Validate.validateNotEmpty(data["name"])
    ) {
      errors.splice(errors.indexOf("name"), 1);
      this.setState({ errors });
    }
 

    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({submitting: true})
      if(this.props.edit == "true"){
        api.put('/brand', {data: data, _id: this.props.match.params.id, logo: this.state.logo, banner: this.state.banner, requiredPermission: "Edit Brand"}).then(res=>{
          
          this.setState({submitting: false, alertType: "success", alertMessage: "Brand edited successfully."})
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
        api.post('/brand', {data: data, logo: this.state.logo, banner: this.state.banner, requiredPermission: "Create Brand"}).then(res=>{
          //console.log(res)
          toast.success('Brand added successfully', {
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

  tabContentToggle = () => {
    if (this.state.activePanel == "general") {
      return (
        <div className="tab-pane fade in active">
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
                    value={this.state.data.name}
                    type="text"
                    onChange={(e)=>this.setVal(e.target.name, e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="is_active"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="status"
                      checked={this.state.data.status}
                      id="is_active"
                      onChange={()=>{
                        const {data} = this.state
                        data.status = !this.state.data.status
                        this.setState({data})
                      }}
                    />
                    <label htmlFor="is_active">Enable the brand</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "images") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Images</h3>
          <div className="single-image-wrapper">
            <h4>Logo</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() =>
                
                this.setState({ multiple: false, showModal: true, imageType: "logo" })
              }
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
            {this.state.logoImage? <div className="image-holder"><img src={siteUrl+this.state.logoImage} height={120} width={120}/></div>: <div className="image-holder placeholder">
                <i className="fa fa-picture-o" />
              </div>}
            </div>
          </div>
          <div className="media-picker-divider" />
          <div className="single-image-wrapper">
            <h4>Banner</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() =>
                this.setState({ multiple: false, showModal: true, imageType: "banner" })
              }
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
            {this.state.bannerImage? <div className="image-holder"><img src={siteUrl+this.state.bannerImage} height={120} width={120}/></div>: <div className="image-holder placeholder">
                <i className="fa fa-picture-o" />
              </div>}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "seo") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">SEO</h3>
          <div className="row">
            <div className="col-md-8">
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
                                type="text"
                                value={this.state.data.url}
                                onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                              />
                            </div>
                          </div>:""}
              <div className="form-group">
                <label
                  htmlFor="meta-title"
                  className="col-md-3 control-label text-left"
                >
                  Meta Title
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    name="metaTitle"
                    className="form-control"
                    value={this.state.data.metaTitle}
                    onChange={(e)=>this.setVal(e.target.name, e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="meta-description"
                  className="col-md-3 control-label text-left"
                >
                  Meta Description
                </label>
                <div className="col-md-9">
                  <textarea
                    name="metaDescription"
                    className="form-control"
                    rows={10}
                    cols={10}
                    value={this.state.data.metaDescription}
                    onChange={(e)=>this.setVal(e.target.name, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={ "/brands"} />
    }
    return (
      <React.Fragment>
         <Modal
          open={this.state.showModal}
          onClose={() => {
            document.querySelector("html").style.overflowY = "auto";

            this.setState({ showModal: false });
          }}
        >
          <div className="modal-header">
            <h4 className="modal-title">File Manager</h4>
          </div>
          <FileManager
            multiple={this.state.multiple}
            setMediaId={this.setImageId}
            close={() => {
              document.querySelector("html").style.overflowY = "auto";

              this.setState({ showModal: false });
            }}
          />
        </Modal>
      <div>
        <section className="content-header clearfix">
        {this.props.edit == "true"? <h3>Edit Brand</h3>: <h3>Create Brand</h3>}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/brands">Brands</Link>
            </li>
            {this.props.edit == "true"? <li className="active">Edit Brand</li>: <li className="active">Create Brand</li>}
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
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
                  <div className="panel-group" id="BrandTabs">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a>Brand Information</a>
                        </h4>
                      </div>
                      <div
                        id="brand_information"
                        className="panel-collapse collapse in"
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li
                              className={
                                this.state.activePanel == "general"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "general" });
                              }}
                            >
                              <a data-toggle="tab">General</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "images"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "images" });
                              }}
                            >
                              <a data-toggle="tab">Images</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "seo" ? "active" : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "seo" });
                              }}
                            >
                              <a data-toggle="tab">SEO</a>
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
                    {this.tabContentToggle()}
                    <div className="form-group">
                      <div className="col-md-offset-2 col-md-10 " style={{display: "flex"}}>
                        <button
                          type="submit"
                          className="btn btn-primary"
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
      </div>
      </React.Fragment>
    );
  }
}

export default withRouter(CreateBrand);
