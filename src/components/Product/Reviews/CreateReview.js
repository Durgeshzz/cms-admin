import React from "react";
import { Link, withRouter,Redirect } from "react-router-dom";
import api from "../../../apis/api";
import Validate from "../../../utils/validation";
import Loading from "../../Loading";
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'

class CreateReview extends React.Component {
  state = {
    submitting: false,
    data: {
      reviewerName: "",
      rating: 0,
      comment: "",
      status: false
    },
    productId: "",
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  };
  componentDidMount() {
    if (this.props.edit == "true") {
      this.setState({submitting: true})
      const url = "/review/get/" + this.props.match.params.id;
      const { data } = this.state;
       api
        .get(url)
        .then((res) => {
          data.reviewerName = res.data.data.reviewerName
          data.status = res.data.data.status
          data.comment = res.data.data.comment
          data.rating = res.data.data.rating
          
          this.setState({data, productId: res.data.data.product?.["_id"], submitting: false})
        })
        .catch((err) => {
          this.setState({submitting: false})
          console.log(err)
          toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
        });
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
  handleSubmit = () => {
    const { errors } = this.state;
    const { data } = this.state;

    if (!errors.includes("reviewerName") && !Validate.validateNotEmpty(data["reviewerName"])) {
      errors.push("reviewerName");
      this.setState({ errors });
    } else if (
      errors.includes("reviewerName") &&
      Validate.validateNotEmpty(data["reviewerName"])
    ) {
      errors.splice(errors.indexOf("reviewerName"), 1);
      this.setState({ errors });
    }
    if (!errors.includes("rating") && data["rating"] == 0) {
        errors.push("rating");
        this.setState({ errors });
      } else if (
        errors.includes("rating") &&
        data["rating"] != 0
      ) {
        errors.splice(errors.indexOf("rating"), 1);
        this.setState({ errors });
      }
      if (!errors.includes("comment") && !Validate.validateNotEmpty(data["comment"])) {
        errors.push("comment");
        this.setState({ errors });
      } else if (
        errors.includes("comment") &&
        Validate.validateNotEmpty(data["comment"])
      ) {
        errors.splice(errors.indexOf("comment"), 1);
        this.setState({ errors });
      }
    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({submitting: true})
      if (this.props.edit == "true") {
        const _id = this.props.match.params.id;
        api
          .put("/review", { data, _id, productId: this.state.productId, requiredPermission: "Edit Review" })
          .then((res) => {
            this.setState({submitting: false, alertType: "success", alertMessage: "Review edited successfully."})

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
        toast.warn( "You were not supposed to be there.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
        this.setState({redirect: true})
      }
    } else {
      this.setState({alertType: "fail", alertMessage: "Please fill the following: "+ errors})
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={ "/reviews"} />
    }
    return (
      <React.Fragment>
        <section className="content-header clearfix">
          <h3>Edit Review</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/reviews">Reviews</Link>
            </li>
            <li className="active">Edit Review</li>
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
                          <a>Review Information</a>
                        </h4>
                      </div>
                      <div
                        id="tag_information"
                        className="panel-collapse collapse in"
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li className="active ">
                              <a>General</a>
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
                    <div className="tab-pane fade in active" >
                      <h3 className="tab-content-title">general</h3>
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form-group">
                            <label
                              htmlFor="rating"
                              className="col-md-3 control-label text-left"
                            >
                              Rating<span className="m-l-5 text-red">*</span>
                            </label>
                            <div className="col-md-9">
                              <select
                                name="rating"
                                className="form-control custom-select-black "
                                id="rating"
                                value={this.state.data.rating}
                                onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                              >
                                <option value="0">Please Select</option>
                                <option value="1" >
                                  1
                                </option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <label
                              className="col-md-3 control-label text-left"
                            >
                              Reviewer Name
                              <span className="m-l-5 text-red">*</span>
                            </label>
                            <div className="col-md-9">
                              <input
                                name="reviewerName"
                                className="form-control "
                                type="text"
                                value={this.state.data.reviewerName}
                                onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label
                              className="col-md-3 control-label text-left"
                            >
                              Comment<span className="m-l-5 text-red">*</span>
                            </label>
                            <div className="col-md-9">
                              <textarea
                                name="comment"
                                className="form-control "
                                rows={10}
                                cols={10}
                                value={this.state.data.comment}
                                onChange={(e)=>{this.setVal(e.target.name, e.target.value)}}

                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label
                              htmlFor="is_approved"
                              className="col-md-3 control-label text-left"
                            >
                              Status
                            </label>
                            <div className="col-md-9">
                              <div className="checkbox">
                              
                                <input
                                  type="checkbox"
                                  name="status"
                                  id="is_approved"
                                  checked={this.state.data.status}
                                  onChange={()=>{
                                      const {data} = this.state
                                      data.status = !this.state.data.status
                                      this.setState({data})
                                  }}
                                />
                                <label htmlFor="is_approved">
                                  Approve this review
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="col-md-offset-2 col-md-10" style={{display: "flex"}}>
                        <button
                          className="btn btn-primary "
                          style={{ marginTop: "5px" }}
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
export default withRouter(CreateReview);
