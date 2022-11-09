import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import api from "../../../apis/api";
import "./tax.css";
import Validate from "../../../utils/validation";
import SortableContainer from '../../DND/SortableContainer'
import SortableItem from '../../DND/SortableItem'
import DragHandle from '../../DND/DragHandle'
import arrayMove from "array-move";
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'
import Loading from "../../Loading";
class CreateTax extends React.Component {
  state = {
    activePanel: "general",
    submitting: false,
    data: {
      taxClass: "",
      basedOn: "Shipping Address",
      rates: [
        {
          name: "",
          country: "",
          state: "",
          city: "",
          zip: "",
          rate: "",
        },
      ],
    },
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  };

  componentDidMount() {
    if (this.props.edit == "true") {
      this.setState({submitting: true})
      const url = "/tax/get/" + this.props.match.params.id;
      api.get(url).then(res=>{
        const {data} = this.state
        data.taxClass = res.data.data.taxClass
        data.basedOn = res.data.data.basedOn
        data.rates = []
        res.data.data.rates.map(val=>{
            let tmp = {}
            tmp.city = val.city
            tmp.country = val.country
            tmp.name = val.name
            tmp.state = val.state
            tmp.zip = val.zip
            tmp.rate = val.rate
            data.rates.push(tmp)
        })
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
  setValues = (name, val, idx) => {
    const { data } = this.state;
    data["rates"][idx][name] = val;
    this.setState({ data });
  };

  setVal = (key, val) => {
    const { data } = this.state;
    if (key == "filterable") {
      data["filterable"] = !this.state.data.filterable;
    } else {
      data[key] = val;
    }
    this.setState({ data });
  };
  handleAddRow = () => {
    const { data } = this.state;
    data["rates"].push({
      name: "",
      country: "",
      state: "",
      city: "",
      zip: "",
      rate: "",
    });
    this.setState({ data });
  };
  handleRemoveSpecificRow = (idx) => {
    const { data } = this.state;
    data["rates"].splice(idx, 1);
    this.setState({ data });
  };
  handleSubmit = () => {
    const { errors } = this.state;
    const { data } = this.state;

    if (!errors.includes("taxClass") && !Validate.validateNotEmpty(data["taxClass"])) {
      errors.push("taxClass");
      this.setState({ errors });
    } else if (
      errors.includes("taxClass") &&
      Validate.validateNotEmpty(data["taxClass"])
    ) {
      errors.splice(errors.indexOf("taxClass"), 1);
      this.setState({ errors });
    }
    
    // data.rates.forEach((val, idx)=>{
    //     for(var elem in val){
    //       if (!errors.includes(elem) && !Validate.validateNotEmpty(data["rates"][idx][elem])) {
    //         errors.push(elem);
    //         this.setState({ errors });
    //       } else if (
    //         errors.includes(elem) &&
    //         Validate.validateNotEmpty(data["rates"][idx][elem])
    //       ) {
    //         errors.splice(errors.indexOf(elem), 1);
    //         this.setState({ errors });
    //       }
    //     }
    //   })
   
    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({submitting: true})
      if (this.props.edit == "true") {
        api.put('/tax', {data: data, _id: this.props.match.params.id, requiredPermission: "Edit Tax"}).then(res=>{
          this.setState({submitting: false, alertType: "success", alertMessage: "Tax edited successfully."})

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
        api.post('/tax', {data: data, requiredPermission: "Create Tax"}).then(res=>{
          toast.success('Tax added successfully', {
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
    } else {
      this.setState({alertType: "fail", alertMessage: "Please fill the following: "+ errors})
    }
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    const {data} = this.state
    data.rates= arrayMove(data.rates, oldIndex, newIndex)
    this.setState({data})
  };
  tabContentToggle = () => {
    if (this.state.activePanel == "general") {
      return (
        <div className="tab-pane fade in active" id="general">
          <h3 className="tab-content-title">General</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Tax Class<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="taxClass"
                    className="form-control "
                    value={this.state.data.taxClass}
                    type="text"
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-3 control-label text-left"
                >
                  Based On<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <select
                    name="basedOn"
                    className="form-control custom-select-black "
                    value={this.state.data.basedOn}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  >
                    <option value="Shipping Address">Shipping Address</option>
                    <option value="Billing Address">Billing Address</option>
                    <option value="Store Address">Store Address</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "rates") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Rates</h3>
          <div className="tax-rates-wrapper" >
            <div className="table-responsive">
              <table className="options tax-rates table table-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th>Tax Name</th>
                    <th>Country</th>
                    <th className="state">State</th>
                    <th className="city">City</th>
                    <th className="zip">Zip</th>
                    <th className="rate">Rate %</th>
                    <th></th>
                  </tr>
                </thead>
                <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                <tbody id="tax-rates">
                  {this.state.data.rates.map((item, idx) => (
                    <SortableItem key={idx} index={idx}>

                    <tr className="tax-rate" key={idx}>
                      <td className="text-center">
                        <DragHandle />
                      </td>

                      <td className="tax-name">
                        <input
                          type="text"
                          name="name"
                          value={this.state.data.rates[idx].name}
                          className="form-control"
                          onChange={(e) => {
                            this.setValues(e.target.name, e.target.value, idx);
                          }}
                        />
                      </td>

                      <td className="country">
                        <select
                          className="custom-select-black"
                          name="country"
                          value={this.state.data.rates[idx].country}
                          onChange={(e) => {
                            this.setValues(e.target.name, e.target.value, idx);
                          }}
                        >
                          <option value="">Please Select</option>

                          <option value="BD">Bangladesh</option>
                          <option value="US">United States</option>
                        </select>
                      </td>

                      <td className="state">
                        <input
                          type="text"
                          name="state"
                          value={this.state.data.rates[idx].state}
                          className="form-control"
                          placeholder="*"
                          onChange={(e) => {
                            this.setValues(e.target.name, e.target.value, idx);
                          }}
                        />
                      </td>

                      <td className="city">
                        <input
                          type="text"
                          name="city"
                          value={this.state.data.rates[idx].city}
                          className="form-control"
                          placeholder="*"
                          onChange={(e) => {
                            this.setValues(e.target.name, e.target.value, idx);
                          }}
                        />
                      </td>

                      <td className="zip">
                        <input
                          type="text"
                          name="zip"
                          value={this.state.data.rates[idx].zip}
                          className="form-control"
                          placeholder="*"
                          onChange={(e) => {
                            this.setValues(e.target.name, e.target.value, idx);
                          }}
                        />
                      </td>

                      <td className="rate">
                        <input
                          type="number"
                          name="rate"
                          value={this.state.data.rates[idx].rate}
                          step="0.01"
                          min="0"
                          className="form-control"
                          onChange={(e) => {
                            this.setValues(e.target.name, e.target.value, idx);
                          }}
                        />
                      </td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-default delete-row"
                          data-toggle="tooltip"
                          name={idx}
                          data-title="Delete Value"
                          onClick={(e) => {
                            this.handleRemoveSpecificRow(idx);
                          }}
                        >
                          <i className="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                    </SortableItem>
                  ))}
                </tbody>
                </SortableContainer>
              </table>
            </div>
            <button
              type="button"
              className="btn btn-default"
              onClick={this.handleAddRow}
              style={{marginBottom: "10px"}}
            >
              Add New Rate
            </button>
          </div>
        </div>
      );
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={ "/taxes"} />
    }
    return (
      <div>
        <section className="content-header clearfix">
          {this.props.edit == "true" ? <h3>Edit Tax</h3> : <h3>Create Tax</h3>}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/taxes">Taxes</Link>
            </li>
            {this.props.edit == "true" ? (
              <li className="active">Edit Tax</li>
            ) : (
              <li className="active">Create Tax</li>
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
                  <div className="panel-group" id="BrandTabs">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a>Tax Information</a>
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
                                this.state.activePanel == "rates"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "rates" });
                              }}
                            >
                              <a data-toggle="tab">Rates</a>
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
                      <div className="col-md-2 col-md-10">
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

export default withRouter(CreateTax);
