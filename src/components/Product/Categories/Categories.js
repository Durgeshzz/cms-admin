import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import FileManager from "../../Media/FileManager";
import Validate from "../../../utils/validation";
import api from "../../../apis/api";
import { siteUrl } from "../../../utils/utils";
import Tree from "rc-tree";
import "./styles.css";
import Loading from "../../Loading";
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'

class Categories extends React.Component {
  state = {
    showModal: false,
    multiple: false,
    logoImage: "",
    bannerImage: "",
    imageType: "",
    activePanel: "general",
    selectedCategory: "none",
    data: {
      name: "",
      searchable: false,
      status: false,
      url: "",
    },
    logoId: "",
    bannerId: "",
    parentId: "",
    errors: [],
    treeData: [],
    autoExpandParent: true,
    expandedKeys: [],
    allKeys: [], 
    submitting: false,
    _id: "",
    oldIndex: "",
    newIndex:"",
    parentCategoryId: "",
    alertType: "",
    alertMessage: "",
  };

  componentDidMount() {
    this.setState({submitting: true})
    var data = [];
    const {allKeys} = this.state
    const addKey = (root, parent) =>{
      var count = 0;
      root.children = root.childrenCategory
      var subFolders = root.children
      const subFolder = subFolders.filter(function(val){
        return val.childrenCategory
      })
      subFolder.forEach(sub=>{
        sub.key = parent+"-"+count
        sub.title = sub.name
        allKeys.push(sub.key)
        count++;
        addKey(sub, sub.key)
      })
    }
    
    api
      .get("/category/get")
      .then((res) => {
        res.data.data.forEach((val,index) => {
          val.key = "0-"+index
          val.title = val.name
          allKeys.push(val.key)
          addKey(val, val.key)
          data.push(val)
        });
        this.setState({ treeData: data, allKeys, submitting: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({submitting: false})
      });
  }
  onClose = ()=>{
    this.setState({alertMessage: "", alertType: ""})
  }
  setImageId = (id, multiple, image) => {
    if (this.state.imageType == "logo") {
      this.setState({ logoId: id, logoImage: image });
    } else if (this.state.imageType == "banner") {
      this.setState({ bannerId: id, bannerImage: image });
    }
  };
  setVal = (key, val) => {
    const { data } = this.state;
    data[key] = val;
    this.setState({ data });
  };
  handleSubmit = () => {
    const { data, errors, logoId, bannerId } = this.state;
    if(logoId != "" || bannerId != "") {
      if (!errors.includes("logo") && !Validate.validateNotEmpty(logoId)) {
        errors.push("logo");
        this.setState({ errors });
      } else if (
        errors.includes("logo") &&
        Validate.validateNotEmpty(logoId)
      ) {
        errors.splice(errors.indexOf("logo"), 1);
        this.setState({ errors });
      }
      if (!errors.includes("banner") && !Validate.validateNotEmpty(bannerId)) {
        errors.push("banner");
        this.setState({ errors });
      } else if (
        errors.includes("banner") &&
        Validate.validateNotEmpty(bannerId)
      ) {
        errors.splice(errors.indexOf("banner"), 1);
        this.setState({ errors });
      }
    }
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
      this.setState({submitting: true});
      if (this.state.selectedCategory != "none" && this.state.parentId == "") {
        api
          .put("/category", {
            data: this.state.data,
            logoId: this.state.logoId,
            bannerId: this.state.bannerId,
            _id: this.state.selectedCategory,
            requiredPermission: "Edit Categories",
          })
          .then((res) => {
            // console.log(res);
            toast.success('Cateogry updated successfully', {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              });
              this.setState({submitting: false})
              // this.resetData()
            // this.componentDidMount();
          })
          .catch((err) => {
            // console.log(err.response.data);
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
      if (
        this.state.selectedCategory != "none" &&
        this.state.parentId == this.state.selectedCategory
      ) {
        api
          .post("/category/sub", {
            data: this.state.data,
            logoId: this.state.logoId,
            bannerId: this.state.bannerId,
            parentId: this.state.parentId,
            requiredPermission: "Create Categories",
          })
          .then((res) => {
            // console.log(res);
            window.location.reload()
            this.setState({submitting: false})
          })
          .catch((err) => {
            // console.log(err.response.data);
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
      if (this.state.selectedCategory == "none" && this.state.parentId == "") {
        api
          .post("/category/root", {
            data: data,
            logoId: this.state.logoId,
            bannerId: this.state.bannerId,
            requiredPermission: "Create Categories",
          })
          .then((res) => {
            // console.log(res);
            toast.success('Root Category added successfully', {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              });
              this.setState({submitting: false})
              this.resetData()
            this.componentDidMount();

          })
          .catch((err) => {
            // console.log("error adding root category");
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
    }else{
      this.setState({ alertType: "fail", alertMessage: "Please fill the following: " + errors})

    }
  };
  handleDelete = () => {
    var data = {
      id: this.state.selectedCategory,
      requiredPermission: "Delete Categories",
    };
    api
      .delete("/category", { data })
      .then((res) => {
        // console.log(res);
        toast.success('Category deleted successfully', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
          this.resetData()
        this.componentDidMount();
      })
      .catch((err) => {
        // console.log(err.response.data);
        toast.error( `${err.response && err.response.data?err.response.data.message: "Could not delete category."}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      });
  };
  resetData = () => {
    const { data } = this.state;
    data.name = "";
    data.status = false;
    data.searchable = false;
    this.setState({
      data,
      logoId: "",
      logoImage: "",
      bannerId: "",
      bannerImage: "",
    });
  };
  ToggleActivePanel = () => {
    if (this.state.activePanel == "general") {
      return (
        <div className="tab-pane fade in active">
          <div className="row">
            <div className="col-md-8">
              {this.state.selectedCategory != "none" &&
              this.state.selectedCategory != this.state.parentId ? (
                <div id="id-field">
                  <div className="form-group">
                    <label
                      htmlFor="id"
                      className="col-md-3 control-label text-left"
                    >
                      ID
                    </label>
                    <div className="col-md-9">
                      <input
                        name="id"
                        className="form-control "
                        type="text"
                        value={this.state.selectedCategory}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Name<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="name"
                    className="form-control "
                    type="text"
                    value={this.state.data.name}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Searchable
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="searchable"
                      id="is_searchable"
                      checked={this.state.data.searchable}
                      onChange={(e) => {
                        this.setVal(e.target.name, !this.state.data.searchable);
                      }}
                    />
                    <label htmlFor="is_searchable">
                      Show this category in search box category list
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="status"
                      id="is_active"
                      checked={this.state.data.status}
                      onChange={(e) => {
                        this.setVal(e.target.name, !this.state.data.status);
                      }}
                    />
                    <label htmlFor="is_active">Enable the category</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "image") {
      return (
        <div className="tab-pane fade in active">
          <div className="logo">
            <div className="single-image-wrapper">
              <h4>Logo</h4>
              <button
                type="button"
                className="image-picker btn btn-default"
                onClick={() =>
                  this.setState({
                    multiple: false,
                    showModal: true,
                    imageType: "logo",
                  })
                }
              >
                <i className="fa fa-folder-open m-r-5" />
                Browse
              </button>
              <div className="clearfix" />
              <div className="single-image image-holder-wrapper clearfix">
                {this.state.logoImage ? (
                  <div className="image-holder">
                    <img
                      src={siteUrl + this.state.logoImage}
                      height={120}
                      width={120}
                    />
                     <button
                    type="button"
                    className="btn remove-image"
                    onClick={() => {
                      
                        this.setImageId("", false, "");
                        const {errors} = this.state
                        errors.splice(errors.indexOf("logo"), 1);
                        errors.splice(errors.indexOf("banner"), 1);
                        this.setState({ errors });
                  
                    }}
                  />
                  </div>
                ) : (
                  <div className="image-holder placeholder">
                    <i className="fa fa-picture-o" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="banner">
            <div className="single-image-wrapper">
              <h4>Banner</h4>
              <button
                type="button"
                className="image-picker btn btn-default"
                onClick={() =>
                  this.setState({
                    multiple: false,
                    showModal: true,
                    imageType: "banner",
                  })
                }
              >
                <i className="fa fa-folder-open m-r-5" />
                Browse
              </button>
              <div className="clearfix" />
              <div className="single-image image-holder-wrapper clearfix">
                {this.state.bannerImage ? (
                  <div className="image-holder">
                    <img
                      src={siteUrl + this.state.bannerImage}
                      height={120}
                      width={120}
                    />
                     <button
                    type="button"
                    className="btn remove-image"
                    onClick={() => {
                      
                        this.setImageId("", false, "");
                        const {errors} = this.state
                        errors.splice(errors.indexOf("logo"), 1);
                        errors.splice(errors.indexOf("banner"), 1);
                        this.setState({ errors });
                    }}
                  />
                  </div>
                ) : (
                  <div className="image-holder placeholder">
                    <i className="fa fa-picture-o" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "seo") {
      return (
        <div className="tab-pane fade in active">
          <div className="row">
            <div className="col-md-8">
              <div id="slug-field">
                <div className="form-group">
                  <label
                    htmlFor="slug"
                    className="col-md-3 control-label text-left"
                  >
                    URL
                  </label>
                  <div className="col-md-9">
                    <input
                      name="url"
                      className="form-control "
                      type="text"
                      value={this.state.data.url}
                      onChange={(e) => {
                        this.setVal(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  changeCategoryOrder = () =>{
    console.log("chang")
    api.post('/category/changeOrder', {newIndex: this.state.newIndex, oldIndex: this.state.oldIndex, parentCategoryId: this.state.parentCategoryId, id: this.state._id}).then(res=>{
      console.log(res)  
    }).then(err=>{
      console.log(err)
    })
  }
  onDragStart = (info) => {
    //console.log("start", info);
    let oldIndex = parseInt(info.node.pos[info.node.pos.length-1])
    let _id = info.node._id
    let parentCategoryId = info.node.parentCategory
    this.setState({_id, parentCategoryId, oldIndex})
  };


  onDrop = (info) => {
    console.log("drop", info);
    let down = false;
    let newIndex;
    let dragp = info.dragNode.pos[info.dragNode.pos.length-1]
    let nodep = info.node.pos[info.node.pos.length-1]
    if(dragp < nodep){
      down = true;
    }else{
      down = false;
    }
    if(info.dropPosition == 0){
      newIndex = 0;
    }else if(down){
      newIndex = info.dropPosition-1;
    }else if(!down){
      newIndex = info.dropPosition
    }
     console.log(newIndex)
    let parentCategoryId;
    if(info.node.parentCategory == null){
      parentCategoryId = null
    }else{
      parentCategoryId = info.node._id
    }
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (dropPosition === 0) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      treeData: data,
      newIndex,
      parentCategoryId
    }, ()=>{
      this.changeCategoryOrder()
    });
  };

  onExpand = (expandedKeys) => {
    // console.log("onExpand", expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onSelect = (selected, info) => {
    this.setState({
      selectedCategory: info.node._id,
      activePanel: "general",
      parentId: "",
      submitting: true
    });
    const url = "/category/get/" + info.node._id;
    const { data } = this.state;
    api
      .get(url)
      .then((res) => {
        // console.log(res.data.data);
        data.name = res.data.data.name;
        data.searchable = res.data.data.searchable;
        data.status = res.data.data.status;
        data.url = res.data.data.url;
        this.setState({
          data,
          logoId: res.data.data.logo ? res.data.data.logo._id : "",
          logoImage: res.data.data.logo ? res.data.data.logo.image : "",
          bannerId: res.data.data.banner ? res.data.data.banner._id : "",
          bannerImage: res.data.data.banner ? res.data.data.banner.image : "",
          submitting: false
        });
      })
      .catch((err) => {
        console.log("error fetching category");
      });
  };
  render() {
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
        <section className="content-header clearfix">
          <h3>Categories</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Categories</li>
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
        {getMessage(this.state.alertType, this.state.alertMessage, this.onClose)}
          <div className="box box-default">
            <div className="box-body clearfix">
              <div className="col-lg-3 col-md-4">
                <div className="row">
                  <button
                    className="btn btn-default add-root-category "
                    style={{ marginBottom: "5px" }}
                    onClick={() => {
                      window.location.reload();
                      // this.setState({ selectedCategory: "none" });
                      // this.resetData();
                    }}
                  >
                    Add Root Category
                  </button>
                  <button
                    className="btn btn-default add-sub-category disabled"
                    className={
                      this.state.selectedCategory == "none"
                        ? "btn btn-default add-sub-category disabled"
                        : "btn btn-default add-sub-category "
                    }
                    style={{ marginBottom: "5px" }}
                    onClick={() => {
                      this.setState({ parentId: this.state.selectedCategory });
                      this.resetData();
                    }}
                  >
                    Add Subcategory
                  </button>
                  <div className="m-b-10">
                    <a className="collapse-all" onClick={()=>{
                      this.setState({expandedKeys: []})
                    }}>Collapse All</a>
                    <span style={{ paddingLeft: "3px", paddingRight: "3px" }}>
                      |
                    </span>
                    <a className="expand-all" onClick={()=>{
                      this.setState({expandedKeys: this.state.allKeys})
                    }}>Expand All</a>
                  </div>
                  <div className="draggable-demo">
                    <div className="draggable-container">
                      <Tree
                        expandedKeys={this.state.expandedKeys}
                        onExpand={this.onExpand}
                        autoExpandParent={this.state.autoExpandParent}
                        onSelect={this.onSelect}
                        showLine
                        draggable
                        onDragStart={this.onDragStart}
                        onDrop={this.onDrop}
                        treeData={this.state.treeData}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-8">
                <div className="tab-wrapper category-details-tab">
                  <ul className="nav nav-tabs">
                    <li
                      className={
                        this.state.activePanel == "general"
                          ? "general-information-tab active"
                          : "general-information-tab"
                      }
                      onClick={(e) => {
                        this.setState({ activePanel: "general" });
                      }}
                    >
                      <a>General</a>
                    </li>
                    <li
                      className={
                        this.state.activePanel == "image"
                          ? "image-tab active"
                          : "image-tab"
                      }
                      onClick={(e) => {
                        this.setState({ activePanel: "image" });
                      }}
                    >
                      <a>Image</a>
                    </li>
                    {this.state.selectedCategory != "none" &&
                    this.state.selectedCategory != this.state.parentId ? (
                      <li
                        className={
                          this.state.activePanel == "seo"
                            ? "seo-tab active"
                            : "seo-tab"
                        }
                        onClick={(e) => {
                          this.setState({ activePanel: "seo" });
                        }}
                      >
                        <a>SEO</a>
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                  <form className="form-horizontal">
                    <div className="tab-content">
                      {this.ToggleActivePanel()}
                    </div>
                    <div className="form-group" style={{ marginTop: "10px" }}>
                      <div className="col-md-10">
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
                        {this.state.selectedCategory != "none" &&
                        this.state.selectedCategory != this.state.parentId ? (
                          <button
                            type="button"
                            className="btn btn-link text-red btn-delete p-l-0 "
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleDelete();
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default withRouter(Categories);
