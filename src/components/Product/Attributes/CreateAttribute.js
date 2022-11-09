import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import api from "../../../apis/api";
import "./attribute.css";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Validate from "../../../utils/validation";
import Loading from "../../Loading";
import SortableContainer from '../../DND/SortableContainer'
import SortableItem from '../../DND/SortableItem'
import DragHandle from '../../DND/DragHandle'
import arrayMove from "array-move";
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'

class CreateAttribute extends React.Component {
  state = {
    activePanel: "general",
    submitting: false,
    categoryOptions: [],
    attributesSets: [],
    data: {
      name: "",
      attributeSetId: "",
      filterable: false,
      value: [""],
    },
    CategoryIds: [],
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  };
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  componentDidMount() {
    api
    .get("/category/get")
    .then((res) => {
      res.data.data.forEach((val) => {
        addToCategories(val, []);
      });
    })
    .catch((err) => {
      console.log(err);
    });
    if (this.props.edit == "true") {
      this.setState({submitting: true})

      const url = "/attribute/get/" + this.props.match.params.id;
      const { data } = this.state;
      api
        .get(url)
        .then((res) => {
          console.log(res.data.data);
          data.name = res.data.data.name;
          data.attributeSetId = res.data.data.attributeSet;
          data.filterable = res.data.data.filterable;
          data.value = res.data.data.value;
          this.setState({ data,CategoryIds: res.data.data.categories, submitting: false});
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
    const { attributesSets } = this.state;
    api
      .post("/attributeset/get")
      .then((res) => {
        res.data.data.map((val) => {
          attributesSets.push(val);
          this.setState({ attributesSets });
        });
      })
      .catch((err) => {
        console.log("error fetching attri sets");
      });

    const { categoryOptions } = this.state;
    const addToCategories = (x, sub) => {
      let tmp = {};
      let name = "";
      for (var i = 0; i < sub.length; i++) {
        name += "| - - ";
      }
      tmp["label"] = name + x.name;
      tmp["value"] = x._id;
      categoryOptions.push(tmp);
      if (x.childrenCategory.length > 0) {
        sub.push("sub");
        x.childrenCategory.forEach((y) => {
          addToCategories(y, sub);
        });
      } else {
        return;
      }
    };


    this.setState({ categoryOptions });
  }
  setValues = (idx, val) => {
    const { data } = this.state;
    data["value"][idx] = val;
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
    data["value"].push("");
    this.setState({ data });
  };
  handleRemoveSpecificRow = (idx) => {
    const { data } = this.state;
    data["value"].splice(idx, 1);
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
    if (
      !errors.includes("attributeSetId") &&
      !Validate.validateNotEmpty(data["attributeSetId"])
    ) {
      errors.push("attributeSetId");
      this.setState({ errors });
    } else if (
      errors.includes("attributeSetId") &&
      Validate.validateNotEmpty(data["attributeSetId"])
    ) {
      errors.splice(errors.indexOf("attributeSetId"), 1);
      this.setState({ errors });
    }
    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({ submitting: true });
      if (this.props.edit == "true") {
        api
          .put("/attribute", {
            data: this.state.data,
            _id: this.props.match.params.id,
            categoryIds: this.state.CategoryIds,
            requiredPermission: "Edit Attributes",
          })
          .then((res) => {
            this.setState({submitting: false, alertType: "success", alertMessage: "Attribute edited successfully."})

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
          .post("/attribute", {
            data: this.state.data,
            categoryIds: this.state.CategoryIds,
            requiredPermission: "Create Attributes",
          })
          .then((res) => {
            toast.success('Attribute added successfully', {
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
    data.value= arrayMove(data.value, oldIndex, newIndex)
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
                  htmlFor="attribute_set_id"
                  className="col-md-3 control-label text-left"
                >
                  Attribute Set<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <select
                    name="attributeSetId"
                    className="form-control custom-select-black "
                    value={this.state.data.attributeSetId}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  >
                    <option value="">Please Select</option>
                    {this.state.attributesSets.map((val, key) => (
                      <option value={val._id} key={key}>
                        {val.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="categories[]"
                  className="col-md-3 control-label text-left"
                >
                  Categories
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val)=>{
                      this.setState({CategoryIds: val.split(',')})
                    }}
                    options={this.state.categoryOptions}
                    defaultValue={
                      this.state.CategoryIds.toString()
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="filterable"
                  className="col-md-3 control-label text-left"
                >
                  Filterable
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="filterable"
                      id="filterable"
                      checked={this.state.data.filterable}
                      onChange={() => {
                        const { data } = this.state;
                        data.filterable = !this.state.data.filterable;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="filterable">
                      Use this attribute for filtering products
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "values") {
      return (
        <div className="tab-pane fade in active" id="values">
          <h3 className="tab-content-title">Values</h3>
          <div id="attribute-values-wrapper">
            <div className="table-responsive">
              <table className="options table table-bordered">
                <thead>
                  <tr>
                    <th />
                    <th>Value</th>
                    <th />
                  </tr>
                </thead>
                <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                  <tbody id="attribute-values">
                  {this.state.data.value.map((item, idx) => (
                    <SortableItem key={idx} index={idx}>
                    <tr
                      key={idx}
                   >
                      <td className="text-center">
                       
                        <DragHandle />
                      </td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name={idx}
                            value={this.state.data.value[idx]}
                            className="form-control"
                            onChange={(e) => {
                              this.setValues(e.target.name, e.target.value);
                            }}
                          />
                        </div>
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
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={ "/attributes"} />
    }
    return (
      <div>
        <section className="content-header clearfix">
          {this.props.edit == "true" ? (
            <h3>Edit Attribute</h3>
          ) : (
            <h3>Create Attribute</h3>
          )}
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/attributes">Attributes</Link>
            </li>
            {this.props.edit == "true" ? (
              <li className="active">Edit Attribute</li>
            ) : (
              <li className="active">Create Attribute</li>
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
                          <a>Attribute Information</a>
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
      </div>
    );
  }
}

export default withRouter(CreateAttribute);
