import React from "react";
import "./menu.css";
import { Link, Redirect, withRouter } from "react-router-dom";
import Loading from "../Loading";
import Validate from "../../utils/validation";
import api from "../../apis/api";
import Tree from "rc-tree";
import {getMessage} from '../AlertMessage'
import { toast } from 'react-toastify';
class CreateMenu extends React.Component {
  state = {
    submitting: false,
    treeData: [
      {
        title: "title",
        expanded: true,
        children: [
          {
            title: "Hello",
          },
        ],
      },
    ],
    data: {
      name: "",
      status: false,
    },
    edit: "",
    errors: [],
    treeData: [],
    autoExpandParent: true,
    expandedKeys: [],
    allKeys: [],
    _id: "",
    oldIndex: "",
    newIndex:"",
    parentMenuId: "",
    alertType: "",
    alertMessage: "",
    redirect: false,
    newId: ""
  };
  componentDidMount = () => {
    var dataTemp = [];
    const { allKeys } = this.state;
    const addKey = (root, parent) => {
      var count = 0;
      root.children = root.childrenMenu;
      var subFolders = root.children;
      const subFolder = subFolders.filter(function (val) {
        return val.childrenMenu;
      });
      subFolder.forEach((sub) => {
        sub.key = parent + "-" + count;
        sub.title = (
          <li className="dd-item">
            <div className="">{sub.name}</div>
            <div className=" btn-group" role="group">
              <a className="btn edit-menu-item "  onClick={()=>{
                this.setState({edit: sub._id})
              }}>
                <i className="fa fa-pencil" />
              </a>
              <button type="button" className="btn delete-menu-item" onClick={(e)=>{
                    e.preventDefault()
                    this.handleDelete(sub._id)
                  }}>
                <i className="fa fa-times" />
              </button>
            </div>
          </li>
        );
        allKeys.push(sub.key);
        count++;
        addKey(sub, sub.key);
      });
    };
    if (this.props.edit == "true") {
      const url = "menu/get/" + this.props.match.params.id;
      const { data } = this.state;
      api
        .get(url)
        .then((res) => {
          data.name = res.data.data.name;
          data.status = res.data.data.status;
          allKeys.push("0-0")
          res.data.data.menuItems.forEach((item, index) => {
            item.key = "0-0-" + index;
            item.title = (
              <li className="dd-item">
                <div className="">{item.name}</div>
                <div className=" btn-group" role="group">
                  <a className="btn edit-menu-item "  onClick={()=>{
                this.setState({edit: item._id})
              }}>
                    <i className="fa fa-pencil" />
                  </a>
                  <button type="button" className="btn delete-menu-item" onClick={(e)=>{
                    e.preventDefault()
                    this.handleDelete(item._id)
                  }}>
                    <i className="fa fa-times" />
                  </button>
                </div>
              </li>
            );
            allKeys.push(item.key);
            addKey(item, item.key);
            dataTemp.push(item);
          });

          this.setState({ data, allKeys, expandedKeys: allKeys, treeData: [{title: (<li className="dd-item">
          <div className="">Root</div>
          <div className=" btn-group" role="group" style={{opacity: 0}}>
        
            <button type="button" className="btn delete-menu-item">
              <i className="fa fa-times" />
            </button>
          </div>
        </li>), key:"0-0", parentMenu: null, draggable:"false", children:[...dataTemp]}] });
        })
        .catch((err) => {
          console.log("error fetching details");
        });
    }
  };
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  handleDelete = (id) =>{
    this.setState({submitting: true })
    api.delete('/menu/menuitem', {data: {_id: id, requiredPermission: "Delete Menu Items"}}).then(res=>{
      this.setState({submitting: false})
        toast.success('Menu Item deleted successfully', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      this.componentDidMount()
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

  setVal = (name, val) => {
    const { data } = this.state;
    data[name] = val;
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

    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({ submitting: true });
      if (this.props.edit == "true") {
        api
          .put("/menu", {
            data: this.state.data,
            _id: this.props.match.params.id,
            requiredPermission: "Edit Menus",
          })
          .then((res) => {
            this.setState({submitting: false, alertType: "success", alertMessage: "Menu edited successfully."})

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
      } else {
        api
          .post("/menu", {
            data: this.state.data,
            requiredPermission: "Create Menus",
          })
          .then((res) => {
            this.setState({ submitting: false, redirect: true, newId: res.data.data._id });
            toast.success('Menu added successfully', {
              position: "bottom-right",
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              });
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
    } else {
      this.setState({alertType: "fail", alertMessage: "Please fill the following: "+ errors})

    }
  };
  onDragStart = (info) => {
    //console.log("start", info.node);
    let oldIndex = parseInt(info.node.pos[info.node.pos.length-1])
    let _id = info.node._id
    let parentMenuId = info.node.parentMenuId
    this.setState({_id, parentMenuId, oldIndex})
    
  };
  changeMenuOrder = () =>{
    api.post('/menu/menuitem/changeOrder', {newIndex: this.state.newIndex, oldIndex: this.state.oldIndex, parentMenuId: this.state.parentMenuId, id: this.state._id}).then(res=>{
      console.log(res)
    }).then(err=>{
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
  onDrop = (info) => {
    //console.log("drop", info);
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
    // console.log(info)
    let parentMenuId;
    if(info.node.parentMenu == null){
      parentMenuId = null
    }else{
      parentMenuId = info.node._id
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
      // Drop on the gap (insert before or insert after)
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
      parentMenuId,
      newIndex
    },()=>{{
      this.changeMenuOrder()
    }});
  };

  onExpand = (expandedKeys) => {
    // console.log("onExpand", expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    if (this.state.edit != "") {
      return <Redirect to={"/menus/" + this.props.match.params.id + "/items/"+this.state.edit+"/edit"} />;
    }else if(this.state.redirect){
      return <Redirect to={"/menus/"+this.state.newId+"/edit"}/>
    }
    return (
      <React.Fragment>
        <section className="content-header clearfix">
        {this.props.edit == "true" ? (
            <h3>Edit Menu</h3>
          ) : (
            <h3>Create Item</h3>
          )}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/menus">Menus</Link>
            </li>
            {this.props.edit == "true"? (<li className="active">Edit Menu</li>):(<li className="active">Create Menu</li>)}
            
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
            <div className="row">
              <div className="col-md-6">
                {this.props.edit == "true" ? (
                  <React.Fragment>
                    <div className="btn-group pull-right m-b-15">
                      <Link
                        to={
                          "/menus/" +
                          this.props.match.params.id +
                          "/items/create"
                        }
                        className="btn btn-primary"
                      >
                        Create Menu Item
                      </Link>
                    </div>

                    <div className="box box-primary overflow-hidden">
                      <div className="box-body">
                        <div className="dd">
                          <ol className="dd-list">
                            <Tree
                              expandedKeys={this.state.expandedKeys}
                              onExpand={this.onExpand}
                              selectable={false}
                              autoExpandParent={this.state.autoExpandParent}
                              showLine
                              draggable
                              onDragStart={this.onDragStart}
                              onDrop={this.onDrop}
                              treeData={this.state.treeData}
                              showIcon={false}
                            />
                          </ol>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="alert alert-info">
                    Please save the menu first to add menu items.
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <div className="box box-primary">
                  <div className="box-body">
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
                              this.setVal(
                                e.target.name,
                                !this.state.data.status
                              );
                            }}
                          />
                          <label htmlFor="is_active">Enable the menu</label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div
                        className="col-md-offset-3 col-md-9"
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

export default withRouter(CreateMenu);
