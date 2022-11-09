import React from "react";
import { Link, withRouter } from "react-router-dom";
import api from "../../../apis/api";
import "../../Sales/Orders/order.css";
import Loading from "../../Loading";
import { toast } from "react-toastify";
import { getMessage } from "../../AlertMessage";
import { format } from "timeago.js";
import {siteUrl} from "../../../utils/utils";
class EditComplaint extends React.Component {
  state = {
    submitting: false,
    data: {
      Body: "",
      Subject: "",
      Country: "",
      Email: "",
      FullName: "",
      createdAt: "",
      Read: false,
      userId: "",
      orderId: "",
      imagesAttached: [],
    },
    alertType: "",
    alertMessage: "",
  };
  componentDidMount() {
    const url = "complaint/get/" + this.props.match.params.id;
    this.setState({ submitting: true });
    let data;
    api
      .get(url)
      .then((res) => {
        data = res.data.data;
        data.FullName =
          res.data.data.User?.["First Name"] +
          " " +
          res.data.data.User?.["Last Name"];
        data.Email = res.data.data.User?.["Email"];
        data.userId = res.data.data.User?._id;
        data.Country = res.data.data.Country;
        data.createdAt = res.data.data.createdAt;
        data.Read = res.data.data.Read;
        data.Subject = res.data.data.Subject;
        data.Body = res.data.data.Body;
        data.orderId = res.data.data.OrderId?._id;
        data.imagesAttached = res.data.data.Image;
        this.setState({ submitting: false, data });
      })
      .catch((err) => {
        toast.error(
          `${
            err.response && err.response.data
              ? err.response.data.message
              : "Something went wrong."
          }`,
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        this.setState({ submitting: false });
      });
  }
  handleStatusUpdate = () => {
    this.setState({ submitting: true });
    api
      .put("/complaint", {
        data: this.state.data,
        _id: this.props.match.params.id,
        requiredPermission: "Edit Order",
      })
      .then((res) => {
        //console.log(res)
        this.setState({
          submitting: false,
          alertType: "success",
          alertMessage: "Status updated successfully",
        });
      })
      .catch((err) => {
        this.setState({
          submitting: false,
          alertType: "fail",
          alertMessage: `${
            err.response && err.response.data
              ? err.response.data.message
              : "Something went wrong."
          }`,
        });
      });
  };
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  render() {
    return (
      <React.Fragment>
        <section className="content-header clearfix">
          <h3>Show Complaint</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/orders">Dashboard</Link>
            </li>
            <li>
              <Link to="/complaints">Complaints</Link>
            </li>
            <li className="active">Show Complaint</li>
          </ol>
        </section>
        <Loading show={this.state.submitting} />
        <section className="content">
          {getMessage(
            this.state.alertType,
            this.state.alertMessage,
            this.onClose
          )}
          <div className="order-wrapper">
            <div className="order-information-wrapper">
              <div className="order-information-buttons"></div>
              <h3 className="section-title">Complaint Information</h3>
              <div className="row">
                <div className="col-md-7">
                  <div className="account-information">
                    <h4>User Information</h4>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Customer Name</td>
                            <td>
                              <Link
                                to={
                                  "/users/" + this.state.data.userId + "/edit"
                                }
                              >
                                {this.state.data.FullName}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>Customer Email</td>
                            <td>{this.state.data.Email}</td>
                          </tr>
                          <tr>
                            <td>Customer Country</td>
                            <td>{this.state.data.Country}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-md-9 " style={{ paddingTop: "2em" }}>
                  <div className="order clearfix">
                    <h4>Complaint Information</h4>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Query Posted </td>
                            <td>{format(this.state.data.createdAt)}</td>
                          </tr>
                          <tr>
                            <td>Query Status</td>
                            <td>
                              <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-10">
                                  <select
                                    className="form-control custom-select-black"
                                    value={this.state.data.Read}
                                    onChange={(e) => {
                                      const { data } = this.state;
                                      data.Read = e.target.value;
                                      this.setState({ data }, () =>
                                        this.handleStatusUpdate()
                                      );
                                    }}
                                  >
                                    <option value={false}>Active</option>
                                    <option value={true}>Solved</option>
                                  </select>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Order </td>
                            <td>
                              <Link to={"/orders/" + this.state.data.orderId}>
                                {this.state.data.orderId}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>Subject</td>
                            <td>{this.state.data.Subject}</td>
                          </tr>
                          <tr>
                            <td>Body</td>
                            <td>{this.state.data.Body}</td>
                          </tr>
                          <tr>
                            <td>Images Attached</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-md-9 " style={{ paddingTop: "2em" }}>
                  <div className="order clearfix">
                    <h4>Images Attached</h4>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                        
                          <tr>
                            <td>
                                {this.state.data.imagesAttached.map((image,key)=>{
                                    return  <a href={siteUrl + image.path} target="_blank" key={key}>
                                    <img
                                      src={siteUrl + image.path}
                                      width="150"
                                      height="150"
                                      style={{ margin: "5px" }}
                                    ></img>
                                  </a>
                                })}
                             
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
             
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default withRouter(EditComplaint);
