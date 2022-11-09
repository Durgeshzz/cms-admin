import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import "./user.css";
import api from '../../apis/api'
import Validate from '../../utils/validation'
import MultiSelect from  'react-multiple-select-dropdown-lite'
import  'react-multiple-select-dropdown-lite/dist/index.css'
import PermissionGroup from './Roles/PermissionGroup'
import { toast } from 'react-toastify';
import {getMessage} from '../AlertMessage'
import Loading from "../Loading";

class CreateUser extends React.Component {
  
  state = {
    activePanel: "account",
    submitting: false,
    dropdownActive: false,
    options: [],
    rolesArray: [],
    data: {
      "First Name": "",
      "Last Name": "",
      "Email": "",
      "Password": "",
      "Confirm": "",
      Permissions: [
        {
          "name": "Index Attributes",
          "value": "Inherit"
      },
      {
          "name": "Create Attributes",
          "value": "Inherit"
      },
      {
          "name": "Edit Attributes",
          "value": "Inherit"
      },
      {
          "name": "Delete Attributes",
          "value": "Inherit"
      },
      {
          "name": "Index Attribute Set",
          "value": "Inherit"
      },
      {
          "name": "Create Attribute Set",
          "value": "Inherit"
      },
      {
          "name": "Edit Attribute Set",
          "value": "Inherit"
      },
      {
          "name": "Delete Attribute Set",
          "value": "Inherit"
      },
      {
          "name": "Index Brand",
          "value": "Inherit"
      },
      {
          "name": "Create Brand",
          "value": "Inherit"
      },
      {
          "name": "Edit Brand",
          "value": "Inherit"
      },
      {
          "name": "Delete Brand",
          "value": "Inherit"
      },
      {
          "name": "Index Categories",
          "value": "Inherit"
      },
      {
          "name": "Create Categories",
          "value": "Inherit"
      },
      {
          "name": "Edit Categories",
          "value": "Inherit"
      },
      {
          "name": "Delete Categories",
          "value": "Inherit"
      },
      {
          "name": "Index Coupons",
          "value": "Inherit"
      },
      {
          "name": "Create Coupons",
          "value": "Inherit"
      },
      {
          "name": "Edit Coupons",
          "value": "Inherit"
      },
      {
          "name": "Delete Coupons",
          "value": "Inherit"
      },
      {
          "name": "Index Currency Rates",
          "value": "Inherit"
      },
      {
          "name": "Edit Currency Rates",
          "value": "Inherit"
      },
      {
          "name": "Index Flash Sales",
          "value": "Inherit"
      },
      {
          "name": "Create Flash Sales",
          "value": "Inherit"
      },
      {
          "name": "Edit Flash Sales",
          "value": "Inherit"
      },
      {
          "name": "Delete Flash Sales",
          "value": "Inherit"
      },
      {
          "name": "Index Import",
          "value": "Inherit"
      },
      {
          "name": "Create Import",
          "value": "Inherit"
      },
      {
          "name": "Index Media",
          "value": "Inherit"
      },
      {
          "name": "Create Media",
          "value": "Inherit"
      },
      {
          "name": "Delete Media",
          "value": "Inherit"
      },
      {
          "name": "Index Menus",
          "value": "Inherit"
      },
      {
          "name": "Create Menus",
          "value": "Inherit"
      },
      {
          "name": "Edit Menus",
          "value": "Inherit"
      },
      {
          "name": "Delete Menus",
          "value": "Inherit"
      },
      {
          "name": "Index Menu Items",
          "value": "Inherit"
      },
      {
          "name": "Create Menu Items",
          "value": "Inherit"
      },
      {
          "name": "Edit Menu Items",
          "value": "Inherit"
      },
      {
          "name": "Delete Menu Items",
          "value": "Inherit"
      },
      {
          "name": "Index Options",
          "value": "Inherit"
      },
      {
          "name": "Create Options",
          "value": "Inherit"
      },
      {
          "name": "Edit Options",
          "value": "Inherit"
      },
      {
          "name": "Delete Options",
          "value": "Inherit"
      },
      {
          "name": "Index Order",
          "value": "Inherit"
      },
      {
          "name": "Show Order",
          "value": "Inherit"
      },
      {
          "name": "Edit Order",
          "value": "Inherit"
      },
      {
          "name": "Index Pages",
          "value": "Inherit"
      },
      {
          "name": "Create Pages",
          "value": "Inherit"
      },
      {
          "name": "Edit Pages",
          "value": "Inherit"
      },
      {
          "name": "Delete Pages",
          "value": "Inherit"
      },
      {
        "name": "Index Blogs",
        "value": "Inherit"
    },
    {
        "name": "Create Blogs",
        "value": "Inherit"
    },
    {
        "name": "Edit Blogs",
        "value": "Inherit"
    },
    {
        "name": "Delete Blogs",
        "value": "Inherit"
    },
      {
          "name": "Index Products",
          "value": "Inherit"
      },
      {
          "name": "Create Products",
          "value": "Inherit"
      },
      {
          "name": "Edit Products",
          "value": "Inherit"
      },
      {
          "name": "Delete Products",
          "value": "Inherit"
      },
      {
          "name": "Index Report",
          "value": "Inherit"
      },
      {
          "name": "Index Review",
          "value": "Inherit"
      },
      {
          "name": "Edit Review",
          "value": "Inherit"
      },
      {
          "name": "Delete Review",
          "value": "Inherit"
      },
      {
          "name": "Edit Settings",
          "value": "Inherit"
      },
      {
          "name": "Index Slider",
          "value": "Inherit"
      },
      {
          "name": "Create Slider",
          "value": "Inherit"
      },
      {
          "name": "Edit Slider",
          "value": "Inherit"
      },
      {
          "name": "Delete Slider",
          "value": "Inherit"
      },
      {
          "name": "Index Tag",
          "value": "Inherit"
      },
      {
          "name": "Create Tag",
          "value": "Inherit"
      },
      {
          "name": "Edit Tag",
          "value": "Inherit"
      },
      {
          "name": "Delete Tag",
          "value": "Inherit"
      },
      {
          "name": "Index Tax",
          "value": "Inherit"
      },
      {
          "name": "Create Tax",
          "value": "Inherit"
      },
      {
          "name": "Edit Tax",
          "value": "Inherit"
      },
      {
          "name": "Delete Tax",
          "value": "Inherit"
      },
      {
          "name": "Index Transaction",
          "value": "Inherit"
      },
      {
          "name": "Index Translation",
          "value": "Inherit"
      },
      {
          "name": "Edit Translation",
          "value": "Inherit"
      },
      {
          "name": "Index Users",
          "value": "Inherit"
      },
      {
          "name": "Create Users",
          "value": "Inherit"
      },
      {
          "name": "Edit Users",
          "value": "Inherit"
      },
      {
          "name": "Delete Users",
          "value": "Inherit"
      },
      {
          "name": "Index Roles",
          "value": "Inherit"
      },
      {
          "name": "Create Roles",
          "value": "Inherit"
      },
      {
          "name": "Edit Roles",
          "value": "Inherit"
      },
      {
          "name": "Delete Roles",
          "value": "Inherit"
      },
      {
          "name": "Edit Storefront",
          "value": "Inherit"
      },
      {
        "name": "Index Support",
        "value": "Inherit"
    },
    {
        "name": "Create Support",
        "value": "Inherit"
    },
    {
        "name": "Edit Support",
        "value": "Inherit"
    },
    {
        "name": "Delete Support",
        "value": "Inherit"
    }
      ],
    },
    RoleIds: [],
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  };

  setVal =(key, val, permName) => {
    const {data} = this.state
    if(key == "Permissions"){
      var flag = true;
      const {Permissions} = this.state.data
      Permissions.map((perm, index)=>{
        if(perm['name'] == permName){
          // Permissions.splice(perm, index)
          perm['value'] = val
          flag = false;
        }
      })
      if(flag){
        Permissions.push({name: permName, value: val})
      }
    }else{
      data[key] = val
    }
    this.setState({data})
  }

  handleSubmit = () =>{
    const {errors} = this.state
    const {data} = this.state
    if (!errors.includes("fname") && !Validate.validateNotEmpty(data["First Name"])) {
      errors.push("fname");
      this.setState({ errors });
    } else if (
      errors.includes("fname") &&
      Validate.validateNotEmpty(data["First Name"])
    ) {
      errors.splice(errors.indexOf("fname"), 1);
      this.setState({ errors });
    }
    if (!errors.includes("lname") && !Validate.validateNotEmpty(data["Last Name"])) {
      errors.push("lname");
      this.setState({ errors });
    } else if (
      errors.includes("lname") &&
      Validate.validateNotEmpty(data["Last Name"])
    ) {
      errors.splice(errors.indexOf("lname"), 1);
      this.setState({ errors });
    }
    if (!errors.includes("email") && !Validate.validateNotEmpty(data["Email"])) {
      errors.push("email");
      this.setState({ errors });
    } else if (
      errors.includes("email") &&
      Validate.validateNotEmpty(data["Email"])
    ) {
      errors.splice(errors.indexOf("email"), 1);
      this.setState({ errors });
    }
    if(this.props.edit != "true"){
      if (!errors.includes("password") && !Validate.validateNotEmpty(data["Password"])) {
        errors.push("password");
        this.setState({ errors });
      } else if (
        errors.includes("password") &&
        Validate.validateNotEmpty(data["Password"])
      ) {
        errors.splice(errors.indexOf("password"), 1);
        this.setState({ errors });
      }
      if (!errors.includes("confirm") && !Validate.validateNotEmpty(data["Confirm"])) {
        errors.push("confirm");
        this.setState({ errors });
      } else if (
        errors.includes("confirm") &&
        Validate.validateNotEmpty(data["Confirm"])
      ) {
        errors.splice(errors.indexOf("confirm"), 1);
        this.setState({ errors });
      }
    }

    
    if(!Validate.validateNotEmpty(this.state.errors)){
      this.setState({submitting: true})
      if(this.props.edit == "true"){
        api.put('/users',{data: data, RoleIds: this.state.RoleIds, _id: this.props.match.params.id, requiredPermission: "Edit Users"}).then(res=>{
          this.setState({submitting: false, alertType: "success", alertMessage: "User edited successfully."})
        }).catch(err=>{
          this.setState({submitting: false})
          toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
        })
      }else{
        api.post('/users', {data: data, RoleIds: this.state.RoleIds}).then(res=>{
          toast.success('User added successfully', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
          this.setState({redirect: true})
        }).catch(err=>{
          this.setState({submitting: false})
          toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
        })
      }
      
    }else{
      this.setState({alertType: "fail", alertMessage: "Please fill the following: "+ errors})
    }
  }

   componentDidMount(){
    const {options} = this.state
      api.post('/roles/get').then(res=>{
      res.data.data.forEach(x=>{
        let tmp = {}
        tmp['label'] = x.Name
        tmp['value'] = x._id
        tmp['_id'] = x._id
        options.push(tmp)

      })
    }).catch((err)=>{
      console.log(err)
    })
    if(this.props.edit == "true"){
      this.setState({submitting: true})
      const {data, RoleIds} = this.state
      const url = "/users/get/"+this.props.match.params.id
      api.get(url).then(res=>{
        data["First Name"] = res.data.data["First Name"]
        data["Last Name"] = res.data.data["Last Name"]
        data.Email = res.data.data.Email
        data.Permissions = res.data.data.Permissions
        res.data.data.Roles.forEach(role=>{
          RoleIds.push(role._id)
        })
        this.setState({data, RoleIds, submitting: false})
      }).catch((err)=>{
        this.setState({submitting: false})
        toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      })
     }
  }
  tabContentToggle = () => {
    if (this.state.activePanel == "account") {
      return (
        <div className="tab-pane fade in active" id="account">
          <h3 className="tab-content-title">Account</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  First Name<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="First Name"
                    className="form-control "
                    type="text"
                    value={this.state.data['First Name']}
                    onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Last Name<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Last Name"
                    className="form-control "
                    type="text"
                    value={this.state.data['Last Name']}
                    onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Email<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Email"
                    className="form-control "
                    type="email"
                    value={this.state.data['Email']}
                    onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="roles[]"
                  className="col-md-3 control-label text-left"
                >
                  Roles<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
               

      <MultiSelect
      onChange={(val)=>{
        this.setState({RoleIds: val.split(",")})
      }}
        options={this.state.options}
        defaultValue={this.state.RoleIds.toString()}
      />
                    </div>
                  </div>
                  {this.props.edit == "true"?"" : 
                  <React.Fragment>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Password<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Password"
                    className="form-control "
                    type="password"
                    value={this.state.data['Password']}
                    onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Confirm Password<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Confirm"
                    className="form-control "
                    type="password"
                    value={this.state.data["Confirm"]}
                    onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                  />
                </div>
              </div>
              </React.Fragment>
              }
              </div>
              </div>
            </div>
      );
    } else if (this.state.activePanel == "permissions") {
      return (
        <div className="tab-pane fade in active" id="permissions">
          <h3 className="tab-content-title">Permissions</h3>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="btn-group permission-parent-actions pull-right">
                <button type="button" className="btn btn-default allow-all"
                onClick={()=>{
                  const arr = document.querySelectorAll('[id $="-allow"]' )
                  for(var i = 0; i < arr.length; i++){
                    arr[i].click()
                  }
                }}>
                  Allow all
                </button>
                <button type="button" className="btn btn-default deny-all" onClick={()=>{
                  const arr = document.querySelectorAll('[id $="-deny"]' )
                  for(var i = 0; i < arr.length; i++){
                    arr[i].click()
                  }
                }}>
                  Deny all
                </button>
                <button type="button" className="btn btn-default inherit-all"
                onClick={()=>{
                  const arr = document.querySelectorAll('[id $="-inherit"]' )
                  for(var i = 0; i < arr.length; i++){
                    arr[i].click()
                  }
                }}>
                  Inherit all
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Attribute</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.attributes"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Attributes"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}
              />
              <PermissionGroup
                heading="admin.attribute_sets"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Attribute Set"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Brand</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.brands"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Brand"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Category</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.categories"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Categories"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Coupon</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.coupons"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Coupons"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Currency</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.currency_rates"
                attributes={["Index", "Edit"]}
                suffix="Currency Rates"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>FlashSale</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.flash_sales"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Flash Sales"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Import</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.importer"
                attributes={["Index", "Create"]}
                suffix="Import"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Media</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.media"
                attributes={["Index", "Create", "Delete"]}
                suffix="Media"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Menu</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.menus"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Menus"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
              <PermissionGroup
                heading="admin.menu_items"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Menu Items"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Option</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.options"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Options"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Order</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.orders"
                attributes={["Index", "Show", "Edit"]}
                suffix="Order"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Page</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.pages"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Pages"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
              <PermissionGroup
                heading="admin.blogs"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Blogs"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Product</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.products"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Products"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Report</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.reports"
                attributes={["Index"]}
                suffix="Report"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Review</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.reviews"
                attributes={["Index", "Edit", "Delete"]}
                suffix="Review"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Setting</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.settings"
                attributes={["Edit"]}
                suffix="Settings"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Slider</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.sliders"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Slider"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Tag</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.tags"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Tag"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Tax</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.taxes"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Tax"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Transaction</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.transactions"
                attributes={["Index"]}
                suffix="Transaction"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Translation</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.translations"
                attributes={["Index", "Edit"]}
                suffix="Translation"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>User</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.users"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Users"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
              <PermissionGroup
                heading="admin.roles"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Roles"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}


              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Complaints and Queries</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.support"
                attributes={["Index", "Create", "Edit", "Delete"]}
                suffix="Support"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
           
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="col-md-12">
                <div className="row">
                  <div className="permission-parent-head clearfix">
                    <h3>Storefront</h3>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <PermissionGroup
                heading="admin.storefront"
                attributes={["Edit"]}
                suffix="Storefront"
                setVal = {this.setVal}
                editPermissions = {this.state.data.Permissions}

              />
            </div>
          </div>
        </div>
      );
    }
  };
  onClose = ()=>{
    this.setState({alertMessage: "", alertType: ""})
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={"/users"} />;
    }
    return (
      <React.Fragment>
        <section className="content-header clearfix">
        {this.props.edit == "true"? <h3>Edit User</h3>: <h3>Create User</h3>}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            {this.props.edit == "true"? <li className="active">Edit User</li>: <li className="active">Create User</li>}
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
        {getMessage(this.state.alertType, this.state.alertMessage, this.onClose)}
          <form className="form-horizontal">
            <div className="accordion-content clearfix">
              <div className="col-lg-3 col-md-4">
                <div className="accordion-box">
                  <div className="panel-group" id="UserTabs">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a>User Information</a>
                        </h4>
                      </div>
                      <div
                        id="user_information"
                        className="panel-collapse collapse in"
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li
                              className={
                                this.state.activePanel == "account"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "account" });
                              }}
                            >
                              <a data-toggle="tab">Account</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "permissions"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "permissions" });
                              }}
                            >
                              <a data-toggle="tab">Permissions</a>
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
                          onClick={(e)=>{
                            e.preventDefault()
                            this.handleSubmit()
                          }}
                        >
                          Save
                        </button>
                        <p style={{opacity: "0.7"}}>Set permissions (if needed) before saving.</p>
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

export default withRouter(CreateUser);
