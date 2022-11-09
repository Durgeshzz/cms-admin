import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import api from "../../apis/api";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Validate from "../../utils/validation";
import Loading from "../Loading";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import FileManager from '../Media/FileManager'
import { siteUrl } from "../../utils/utils";
import { toast } from 'react-toastify';
import {getMessage} from '../AlertMessage'

class CreateMenuItem extends React.Component {
  state = {
    submitting: false,
    showModal: false,
    multiple: false,
    categoryOptions: [],
    pageOptions: [],
    menuItemsOptions: [],
    activePanel: "general",
    data: {
      name: "",
      type: "Category",
      parentMenu: null,
      icon: "",
      target: "",
      fluidMenu: false,
      status: false,
      url: ""
    },
    CategoryId: "",
    PageId: "",
    parentMenuId: "",
    ImageId: "",
    image: "",
    menuId: "",
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false,
    selectDataLoad: this.props.edit=="true"?false:true
  };
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  componentDidMount() {
    
    const {categoryOptions} = this.state
    const addToCategories = (x, sub) =>{
      let tmp = {}
      let name = ""
      for(var i = 0; i < sub.length; i++){
        name+="|-- "
      }
      tmp['label'] = name+ x.name
      tmp['value'] = x._id
      if(x.status)
      categoryOptions.push(tmp)
      if(x.childrenCategory.length > 0){
        sub.push("sub")
        x.childrenCategory.forEach(y=>{
          addToCategories(y, sub)
        })      
      }else{
        return
      }
      
    }
     api.get('/category/get').then(res=>{
      res.data.data.forEach(val=>{
        addToCategories(val, []) 
      })
    }).catch((err)=>{
      console.log(err)
    })
    this.setState({categoryOptions})

    api.post('page/get').then(res=>{
      const {pageOptions} = this.state
      res.data.data.forEach(val=>{
        let tmp = {
          label: val.name,
          value: val._id
        }
        if(val.status)
          pageOptions.push(tmp)
      })
      this.setState({pageOptions})
    }).catch(err=>{
      console.log("error fetching pages")
    })

    const url = "menu/get/"+this.props.match.params.id
    api.get(url).then(res=>{
      const {menuItemsOptions} = this.state
      res.data.data.menuItems.forEach(val=>{
        let tmp = {
          label: val.name,
          value: val._id
        }
        if(this.props.edit == "true" && val._id == this.props.match.params.id2){
          
        } else{
          if(val.status)
          menuItemsOptions.push(tmp)
        }
      })
      this.setState({menuItemsOptions})
      
    }).catch(err=>{
      console.log("error fetching menu items")
    })

    if (this.props.edit == "true") {
      this.setState({submitting: true})
      const url2 = "menu/menuitem/get/"+this.props.match.params.id2
      api.get(url2).then(res=>{
        const {data} = this.state
        data.name = res.data.data.name
        data.type = res.data.data.type
        data.icon = res.data.data.icon?res.data.data.icon: ""
        data.fluidMenu = res.data.data.fluidMenu
        data.target = res.data.data.target
        data.status = res.data.data.status
        if(res.data.data.parentMenu){
          this.setState({parentMenuId: res.data.data.parentMenu._id})
        }

        res.data.data.page?this.setState({PageId: res.data.data.page._id, selectDataLoad: true}): res.data.data.category?this.setState({CategoryId: res.data.data.category._id, selectDataLoad: true}):data.url = res.data.data.url
        this.setState({data, submitting: false, ImageId: res.data.data.image?res.data.data.image._id:"", image: res.data.data.image?res.data.data.image.image:""})
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

  setImageId = (id, multiple, image) => {
    this.setState({ImageId: id, image: image})
  }
  setVal = (key, val) => {
    const { data } = this.state;
    data[key] = val;
    this.setState({ data });
  };

  handleSubmit = () => {
    const { errors } = this.state;
    const { data, CategoryId, PageId } = this.state;
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

    if (!errors.includes("type") && !Validate.validateNotEmpty(data["type"])) {
      errors.push("type");
      this.setState({ errors });
    } else if (
      errors.includes("type") &&
      Validate.validateNotEmpty(data["type"])
    ) {
      errors.splice(errors.indexOf("type"), 1);
      this.setState({ errors });
    }
    
    if (data.type == "Category" && !errors.includes("category") && !Validate.validateNotEmpty(CategoryId)) {
      errors.splice(errors.indexOf("url"), 1);
      errors.splice(errors.indexOf("page"), 1);
      errors.push("category");
      this.setState({ errors });
    } else if (
      errors.includes("category") &&
      Validate.validateNotEmpty(CategoryId)
    ) {
      errors.splice(errors.indexOf("category"), 1);
      this.setState({ errors });
    }
    if (data.type == "Page" && !errors.includes("page") && !Validate.validateNotEmpty(PageId)) {
      errors.splice(errors.indexOf("url"), 1);
      errors.splice(errors.indexOf("category"), 1);
      errors.push("page");
      this.setState({ errors });
    } else if (
      errors.includes("page") &&
      Validate.validateNotEmpty(PageId)
    ) {
      errors.splice(errors.indexOf("page"), 1);
      this.setState({ errors });
    }
    if (data.type == "URL" && !errors.includes("url") && !Validate.validateNotEmpty(data["url"])) {
      errors.splice(errors.indexOf("page"), 1);
      errors.splice(errors.indexOf("category"), 1);
      errors.push("url");
      this.setState({ errors });
    } else if (
      errors.includes("url") &&
      Validate.validateNotEmpty(data["url"])
    ) {
      errors.splice(errors.indexOf("url"), 1);
      this.setState({ errors });
    }

    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({ submitting: true });
      if (this.props.edit == "true") {
        api.put('/menu/menuitem', {data: this.state.data, CategoryId: this.state.CategoryId, PageId: this.state.PageId, parentMenuId: this.state.parentMenuId, ImageId: this.state.ImageId, menuId: this.props.match.params.id, requiredPermission: "Edit Menu Items", _id: this.props.match.params.id2}).then(res=>{
          this.setState({submitting: false, alertType: "success", alertMessage: "Menu Item edited successfully."})

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
      } else {
        api.post('/menu/menuitem', {data: this.state.data, CategoryId: this.state.CategoryId, PageId: this.state.PageId, parentMenuId: this.state.parentMenuId, ImageId: this.state.ImageId, menuId: this.props.match.params.id, requiredPermission: "Create Menu Items"}).then(res=>{
          this.setState({ submitting: false, redirect: true });
          toast.success('Menu Item added successfully', {
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
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
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">General</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Name<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="name"
                    className="form-control "
                    type="text"
                    value={this.state.data.name}
                    onChange={(e)=>{
                      this.setVal(e.target.name, e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Type<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <select
                    name="type"
                    className="form-control custom-select-black "
                    value={this.state.data.type}
                    onChange={(e)=>{
                      this.setState({PageId : "", CategoryId: ""})
                      this.setVal("url", "")
                      this.setVal(e.target.name, e.target.value)
                    }}
                  >
                    <option value="Category">Category</option>
                    <option value="Page">Page</option>
                    <option value="URL">URL</option>
                  </select>
                </div>
              </div>
              {this.state.selectDataLoad && this.state.data.type == "Category"? 
              <div className="link-field category-field ">
                <div className="form-group">
                  <label
                    className="col-md-3 control-label text-left"
                  >
                    Category<span className="m-l-5 text-red">*</span>
                  </label>
                  <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setState({CategoryId: val})
                    }}
                    singleSelect={true}
                    options={this.state.categoryOptions}
                    defaultValue={this.state.CategoryId}
                  />
                  </div>
                </div>
              </div>
              : this.state.data.type == "Page"? 
              <div className="link-field page-field ">
                <div className="form-group">
                  <label
                    htmlFor="page_id"
                    className="col-md-3 control-label text-left"
                  >
                    Page<span className="m-l-5 text-red">*</span>
                  </label>
                  <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setState({PageId: val})
                    }}
                    singleSelect={true}
                    options={this.state.pageOptions}
                    defaultValue={this.state.PageId}
                  />
                  </div>
                </div>
              </div>
              :
              <div className="link-field url-field ">
                <div className="form-group">
                  <label
                    className="col-md-3 control-label text-left"
                  >
                    URL<span className="m-l-5 text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      name="url"
                      className="form-control "
                      type="text"
                      value={this.state.data.url}
                      onChange={(e)=>{
                        this.setVal(e.target.name, e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
    }
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Icon
                </label>
                <div className="col-md-9">
                  <input
                    name="icon"
                    className="form-control "
                    type="text"
                    value={this.state.data.icon}
                    onChange={(e)=>{
                      this.setVal(e.target.name, e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Fluid Menu
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="fluidMenu"
                      id="is_fluid"
                      checked={this.state.data.fluidMenu}
                      onChange={(e)=>{
                        this.setVal(e.target.name, !this.state.data.fluidMenu)
                      }}
                    />
                    <label htmlFor="is_fluid">This is a full width menu</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Target
                </label>
                <div className="col-md-9">
                  <select
                    name="target"
                    className="form-control custom-select-black "
                    value={this.state.data.target}
                    onChange={(e)=>{
                      this.setVal(e.target.name, e.target.value)
                    }}
                  >
                    <option value="_self">Same Tab</option>
                    <option value="_blank">New Tab</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Parent Menu Item
                </label>
                <div className="col-md-9">
                <MultiSelect
                    onChange={(val) => {
                      this.setState({parentMenuId: val})
                    }}
                    singleSelect={true}
                    options={this.state.menuItemsOptions}
                    defaultValue={this.state.parentMenuId}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="status"
                      id="is_active"
                      checked={this.state.data.status}
                      onChange={(e)=>{
                        this.setVal(e.target.name, !this.state.data.status)
                      }}
                    />
                    <label htmlFor="is_active">Enable the menu item</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "image") {
      return (
        <div className="tab-pane fade active in" >
          <h3 className="tab-content-title">Image</h3>
          <div className="single-image-wrapper">
            <h4>Background Image</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={()=>{
                this.setState({showModal: true, multiple: false})
              }}
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
               {this.state.image? <div className="image-holder">
                <img src={siteUrl+this.state.image} height={120} width={120}/>
                <button
                  type="button"
                  className="btn remove-image"
                  onClick={()=>{
                      this.setImageId("", false, "")
                    
                  }}
                />
                </div>: <div className="image-holder placeholder">
                <i className="fa fa-picture-o" />
              </div>}
            </div>
          </div>
        </div>
      );
    }
  };
  render() {
    if(this.state.redirect){
      return <Redirect to={"/menus/"+this.props.match.params.id+"/edit"}/>
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
            setMediaId={
              this.state.activePanel == "downloads"
                ? this.setDownloadId
                : this.setImageId
            }
            close={() => {
              document.querySelector("html").style.overflowY = "auto";

              this.setState({ showModal: false });
            }}
          />
        </Modal>
        <section className="content-header clearfix">
          {this.props.edit == "true" ? (
            <h3>Edit Menu Item</h3>
          ) : (
            <h3>Create Menu Item</h3>
          )}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/menus">Menus</Link>
            </li>
            <li>
              <Link to={"/menus/"+this.props.match.params.id+"/edit"}>Edit Menu</Link>
            </li>

            {this.props.edit == "true" ? (
              <li className="active">Edit Menu Item</li>
            ) : (
              <li className="active">Create Menu Item</li>
            )}
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
                  <div className="panel-group" id="BrandTabs">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a>Menu Item Information</a>
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
                                this.state.activePanel == "image"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "image" });
                              }}
                            >
                              <a data-toggle="tab">Image</a>
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
                      <div
                        className="col-md-2 col-md-10"
                      >
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
      </React.Fragment>
    );
  }
}

export default withRouter(CreateMenuItem);
