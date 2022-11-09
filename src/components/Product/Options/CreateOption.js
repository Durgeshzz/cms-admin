import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import api from "../../../apis/api";
import "./options.css";
import Validate from "../../../utils/validation";
import Loading from '../../Loading'
import SortableContainer from '../../DND/SortableContainer'
import SortableItem from '../../DND/SortableItem'
import DragHandle from '../../DND/DragHandle'
import arrayMove from "array-move";
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'
class CreateOption extends React.Component {
  state = {
    activePanel: "general",
    submitting: false,
    data: {
      name: "",
      type: "",
      required: false,
      values: [
        {
          label: "",
          price: "",
          priceType: "Fixed",
        },
      ],
    },
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  };

  componentDidMount() {
    if(this.props.edit == "true"){
      this.setState({submitting: true})
      const url = "/option/get/" + this.props.match.params.id
      api.get(url).then(res=>{
        const {data} = this.state
        data.name = res.data.data.name
        data.type = res.data.data.type
        data.required = res.data.data.required
        data.values = res.data.data.values
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
  setValues = (name, val, multi, idx) => {
    const { data } = this.state;
    if (multi) {
      data["values"][idx][name] = val;
    } else {
      data["values"][0][name] = val;
    }
    this.setState({ data });
  };

  setVal = (key, val) => {
    const { data } = this.state;
    if (key == "required") {
      data["required"] = !this.state.data.filterable;
    } else {
      data[key] = val;
    }
    this.setState({ data });
  };
  handleAddRow = () => {
    const { data } = this.state;
    data["values"].push({
      label: "",
      price: "",
      priceType: "",
    });
    this.setState({ data });
  };
  handleRemoveSpecificRow = (idx) => {
    const { data } = this.state;
    data["values"].splice(idx, 1);
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

    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({submitting: true})
      if (this.props.edit == "true") {
        api.put('/option', {
          data: this.state.data,
          _id: this.props.match.params.id,
          requiredPermission: "Edit Options"
        }).then(res=>{
          this.setState({submitting: false, alertType: "success", alertMessage: "Option edited successfully."})


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
        api
          .post("/option", {
            data: this.state.data,
            requiredPermission: "Create Options",
          })
          .then((res) => {
            toast.success('Option added successfully', {
              position: "bottom-right",
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              });
            this.setState({submitting: false, redirect: true})

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
  onSortEnd = ({ oldIndex, newIndex }) => {
    const {data} = this.state
    data.values= arrayMove(data.values, oldIndex, newIndex)
    this.setState({data})
  };
  typeToggle = () => {
    if (
      this.state.data.type == "Dropdown" ||
      this.state.data.type == "Checkbox" ||
      this.state.data.type == "Custom Checkbox" ||
      this.state.data.type == "Radio Button" ||
      this.state.data.type == "Custom Radio Button" ||
      this.state.data.type == "Multiple Select"
    ) {
      return (
        <div className="option-values clearfix" id="option-values">
          <div className="option-select m-b-15">
            <div className="table-responsive">
              <table className="options table table-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th>Label</th>
                    <th>Price</th>
                    <th>Price Type</th>
                    <th></th>
                  </tr>
                </thead>
                <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                <tbody id="select-values">
                  {this.state.data.values.map((item, idx) => (
                    <SortableItem key={idx} index={idx}>

                    <tr key={idx} className="option-row">
                      <td className="text-center">
                       <DragHandle />
                      </td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name="label"
                            value={this.state.data.values[idx].label}
                            className="form-control"
                            onChange={(e) => {
                              this.setValues(
                                e.target.name,
                                e.target.value,
                                true,
                                idx
                              );
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name="price"
                            value={this.state.data.values[idx].price}
                            className="form-control"
                            onChange={(e) => {
                              this.setValues(
                                e.target.name,
                                e.target.value,
                                true,
                                idx
                              );
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <select
                          name="priceType"
                          className="form-control custom-select-black"
                          value={this.state.data.values[idx].priceType}
                          onChange={(e) => {
                            this.setValues(
                              e.target.name,
                              e.target.value,
                              true,
                              idx
                            );
                          }}
                        >
                          <option value="fixed">Fixed</option>
                          <option value="percent">Percent</option>
                        </select>
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
            >
              Add New Value
            </button>
          </div>
        </div>
      );
    } else if (
      this.state.data.type == "Field" ||
      this.state.data.type == "Textarea" ||
      this.state.data.type == "Date" ||
      this.state.data.type == "Date Time" ||
      this.state.data.type == "Time"
    ) {
      return (
        <div className="option-values clearfix" >
          <div className="table-responsive option-text">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Price</th>
                  <th>Price Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="option-row">
                  <td>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      value={this.state.data.values[0].price}
                      onChange={(e) => {
                        this.setValues(e.target.name, e.target.value, false);
                      }}
                    />
                  </td>
                  <td>
                    <select
                      name="priceType"
                      className="form-control custom-select-black"
                      value={this.state.data.values[0].priceType}
                      onChange={(e) => {
                        this.setValues(e.target.name, e.target.value, false);
                      }}
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percent">Percent</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };
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
                    id="name"
                    value={this.state.data.name}
                    type="text"
                    onChange={(e) => this.setVal(e.target.name, e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group required">
                <label
                  htmlFor="type"
                  className="col-md-3 control-label text-left"
                >
                  Type<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <select
                    name="type"
                    className="form-control custom-select-black"
                    id="type"
                    value={this.state.data.type}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  >
                    <option value="">Please Select</option>
                    <optgroup label="Text">
                      <option value="Field">Field</option>
                      <option value="Textarea">Textarea</option>
                    </optgroup>
                    <optgroup label="Select">
                      <option value="Dropdown">Dropdown</option>
                      <option value="Checkbox">Checkbox</option>
                      <option value={"Custom Checkbox"}>Custom Checkbox</option>
                      <option value={"Radio Button"}>Radio Button</option>
                      <option value={"Custom Radio Button"}>
                        Custom Radio Button
                      </option>
                      <option value={"Multiple Select"}>Multiple Select</option>
                    </optgroup>
                    <optgroup label="Date">
                      <option value="Date">Date</option>
                      <option value="Date Time">Date &amp; Time</option>
                      <option value="Time">Time</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="is_required"
                  className="col-md-3 control-label text-left"
                >
                  Required
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="is_required"
                      id="is_required"
                      checked={this.state.data.required}
                      onChange={() => {
                        const { data } = this.state;
                        data.required = !this.state.data.required;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="is_required">This option is required</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "values") {
      if (this.state.data.type == "") {
        return (
          <div className="tab-pane fade in active" id="values">
            <h3 className="tab-content-title">Values</h3>
            <div className="option-values clearfix" id="option-values">
              <div className="alert alert-info" id="option-values-info">
                Please select an option type.
              </div>
            </div>
          </div>
        );
      } else
        return (
          <div className="tab-pane fade in active" id="values">
            <h3 className="tab-content-title">Values</h3>

            {this.typeToggle()}
          </div>
        );
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={ "/options"} />
    }
    return (
      <div>
        <section className="content-header clearfix">
        {this.props.edit == "true"? <h3>Edit Option</h3>: <h3>Create Option</h3>}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/options">Options</Link>
            </li>
            {this.props.edit == "true"? <li className="active">Edit Option</li>: <li className="active">Create Option</li>}
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
                          <a>Option Information</a>
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
                                this.state.activePanel == "values"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "values" });
                              }}
                            >
                              <a data-toggle="tab">Values</a>
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

export default withRouter(CreateOption);
