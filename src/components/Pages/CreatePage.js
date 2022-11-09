import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import Validate from "../../utils/validation";
import api from "../../apis/api";
import BraftEditor from "braft-editor";
import table from "braft-extensions/dist/table";
import "braft-editor/dist/index.css";
import "braft-extensions/dist/table.css";
import imageCompression from "browser-image-compression";
import { siteUrl } from "../../utils/utils";
import { toast } from 'react-toastify';
import Loading from '../Loading'
import { getMessage } from "../AlertMessage";

const options = {
    defaultColumns: 3,
    defaultRows: 2,
    withDropdown: false,
    columnResizable: true,
    exportAttrString: "",
  };
  
  BraftEditor.use(table(options));

class CreatePage extends React.Component {
  state = {
    activePanel: "general",
    submitting: false,
    data: {
      name: "",
      body: "",
      url: "",
      status: false,
      metaTitle: "",
      metaDescription: ""
    },
    editorState: BraftEditor.createEditorState(),
    errors: [],
    redirect: false,
    alertType: "",
    alertMessage: ""
  };
  componentDidMount() {
    if (this.props.edit == "true") {
      this.setState({submitting: true})
      const url = "/page/get/" + this.props.match.params.id;
      api
        .get(url)
        .then((res) => {
            const { data} = this.state
            data.name = res.data.data.name
            data.body = res.data.data.body
            data.url = res.data.data.url
            data.status = res.data.data.status
            data.metaTitle = res.data.data.metaTitle
            data.metaDescription = res.data.data.metaDescription
            this.setState({submitting: false,data, editorState: BraftEditor.createEditorState(res.data.data.body)})
        })
        .catch((err) => {
          toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
            this.setState({submitting: false})
        });
    }
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.setVal("body", this.state.editorState.toHTML());
  };
  uploadImageEditor = async (param) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(param.file, options);
    var formData = new FormData();
    await formData.append("image", compressedFile);
    api
      .post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.data);
        param.success({
          url: siteUrl + res.data.data.image,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  setVal = (key, val) => {
    const { data } = this.state;
    data[key] = val;
    this.setState({ data });
  };
  handleSubmit = () => {
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
    if (!errors.includes("body") && data["body"] == "<p></p>") {
      errors.push("body");
      this.setState({ errors });
    } else if (
      errors.includes("body") &&
      Validate.validateNotEmpty(data["body"])
    ) {
      errors.splice(errors.indexOf("body"), 1);
      this.setState({ errors });
    }
    if(this.props.edit == "true"){
        if (!errors.includes("url") && !Validate.validateNotEmpty(data["url"])) {
            errors.push("url");
            this.setState({ errors });
          } else if (
            errors.includes("url") &&
            Validate.validateNotEmpty(data["url"])
          ) {
            errors.splice(errors.indexOf("url"), 1);
            this.setState({ errors });
          }
    }
    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({submitting: true})
      if (this.props.edit == "true") {
        api.put('/page', {data: data, _id: this.props.match.params.id, requiredPermission: "Edit Pages"}).then(res=>{
            this.setState({submitting: false, alertType: "success", alertMessage: "Page edited successfully."})
            
        }).catch(err=>{
            //console.log("error editing page")
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
      } else {
      api.post('/page', {data: data, requiredPermission: "Create Pages"}).then(res=>{
        toast.success('Page added successfully', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
          this.setState({redirect: true})
          this.setState({submitting: false})
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
    } else {
      this.setState({alertType: "fail", alertMessage: "Please fill the following: "+ errors})
    }
  };

  tabContentToggle = () => {
    if (this.state.activePanel == "general") {
        const {editorState} = this.state
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">General</h3>
          <div className="form-group">
            <label  className="col-md-2 control-label text-left">
              Name<span className="m-l-5 text-red">*</span>
            </label>
            <div className="col-md-10">
              <input
                name="name"
                className="form-control "
                labelcol={2}
                type="text"
                value={this.state.data.name}
                onChange={(e)=>{
                    this.setVal(e.target.name, e.target.value)
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="body" className="col-md-2 control-label text-left">
              Body<span className="m-l-5 text-red">*</span>
            </label>
            <div className="col-md-10">
            <BraftEditor
                language="en"
                value={editorState}
                media={{ uploadFn: (param) => this.uploadImageEditor(param) }}
                onChange={(editorState) => this.onChange(editorState)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
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
                      name="is_active"
                      id="is_active"
                      checked={this.state.data.status}
                      onChange={()=>{
                          const {data} = this.state
                          data.status = !this.state.data.status
                          this.setState({data})
                      }}
                    />
                    <label htmlFor="is_active">Enable the page</label>
                  </div>
                </div>
              </div>
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
                {this.props.edit == "true"?<div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  URL<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    name="url"
                    className="form-control"
                    value={this.state.data.url}
                onChange={(e)=>{
                    this.setVal(e.target.name, e.target.value)
                }}
                  />
                </div>
              </div> : ""}
              <div className="form-group">
                <label
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
                onChange={(e)=>{
                    this.setVal(e.target.name, e.target.value)
                }}
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
                onChange={(e)=>{
                    this.setVal(e.target.name, e.target.value)
                }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  render() {
    if(this.state.redirect){
      return <Redirect to={"/pages"} />;
    }
    return (
      <div>
        <section className="content-header clearfix">
          {this.props.edit == "true" ? (
            <h3>Edit Page</h3>
          ) : (
            <h3>Create Page</h3>
          )}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/pages">Pages</Link>
            </li>
            {this.props.edit == "true" ? (
              <li className="active">Edit Page</li>
            ) : (
              <li className="active">Create Page</li>
            )}
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
                  <div className="panel-group">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a>Page Information</a>
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
                                this.state.activePanel == "seo" ? "active" : ""
                              }
                              onClick={(e) => {
                                this.setState({
                                  activePanel: "seo",
                                });
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
                      <div className="col-md-offset-2 col-md-10">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            this.handleSubmit();
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
    );
  }
}

export default withRouter(CreatePage);
