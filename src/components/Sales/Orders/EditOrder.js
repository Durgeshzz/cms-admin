import React from "react";
import { Link, withRouter } from "react-router-dom";
import api from "../../../apis/api";
import "./order.css";
import Loading from '../../Loading'
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'
class EditOrder extends React.Component {
  state={
    submitting: false,
    orderDate: "--",
    orderStatus: "Processing",
    shippingMethod: "--",
    shippingPrice: "--",
    paymentMethod: "--",
    currency: "--",
    currencyRate: "--",
    customerName: "--",
    customerEmail: "--",
    Phone: "--",
    customerGroup: "Registered",
    billingAddress: {
      Name: "--",
      Line1: "--",
      Line2: "--",
      Country: "--"
    },
    shippingAddress: {
      Name: "--",
      Line1: "--",
      Line2: "--",
      Country: "--"
    },
    items: [
      {
        LineTotal: "--",
        Qty: "--",
        Product: {
          Name: "--",
          _id: "--",
          price: "--"
        }
      }
    ],
    subTotal: "--",
    discount: "--",
    Total: "--",
    alertType: "",
    alertMessage: "",
  }
  componentDidMount(){
    const url = "order/get/" + this.props.match.params.id
    this.setState({submitting: true})
    api.post(url,  {requiredPermission: "Show Order"}).then(res=>{
      const val = res.data.data
      var arr = []
      val.ItemsOrdered.forEach(item=>{
        let tmp= {
          LineTotal: item.LineTotal,
          Qty: item.Quantity,
          Product: {
            Name: item.Product?item.Product.name:"",
            _id: item.Product?item.Product._id:"",
            price: item.Product?item.Product.price:""
          },
          Stock: item.Stock
        }
        arr.push(tmp)
      })
      this.setState({Phone: val.Phone,shippingAddress: val.Address.ShippingAddress, billingAddress: val.Address.BillingAddress, orderDate: val.createdAt.substr(0,10).split("-").reverse().join("-"), shippingMethod: val.ShippingMethod, shippingPrice: val.ShippingPrice, paymentMethod: val.PaymentMethod,orderStatus: val.Status, customerName: val.User?val.User["First Name"]+" "+val.User["Last Name"]: "--", customerEmail: val.User?val.User.Email: "--", items: arr, subTotal: val.SubTotal, discount: val.Discount, Total: val.Total, submitting: false})
    }).catch(err=>{
      console.log("error fetching order details")
      this.setState({submitting: false})
    })
  }
  handleStatusUpdate = ()=>{
    this.setState({submitting: true})
    api.put('/order', {data: {Status: this.state.orderStatus}, _id: this.props.match.params.id, requiredPermission: "Edit Order"}).then(res=>{
      //console.log(res)
      this.setState({submitting: false, alertType: "success", alertMessage: "Status updated successfully"})
    }).catch(err=>{
      this.setState({submitting: false, alertType: "fail", alertMessage: `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`})
    })
  }
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  render() {
    return (
      <React.Fragment>
        <section className="content-header clearfix">
          <h3>Show Order</h3>
          <ol className="breadcrumb">
            <li>
              <Link to='/orders'>Dashboard</Link>
            </li>
            <li>
              <Link to='/orders'>
                Orders
              </Link>
            </li>
            <li className="active">Show Order</li>
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
        {getMessage(
            this.state.alertType,
            this.state.alertMessage,
            this.onClose
          )}
          <div className="order-wrapper">
            <div className="order-information-wrapper">
              <div className="order-information-buttons">
                {/* <a
                  href="#"
                  className="btn btn-default"
                  target="_blank"
                  data-toggle="tooltip"
                  title="Print"
                >
                  <i className="fa fa-print" aria-hidden="true" />
                </a> */}
                {/* <form
                  method="POST"
                >
                  
                  <button
                    type="submit"
                    className="btn btn-default"
                    data-toggle="tooltip"
                    title="Send Email"
                  >
                    <i className="fa fa-envelope-o" aria-hidden="true" />
                  </button>
                </form> */}
              </div>
              <h3 className="section-title">Order &amp; Account Information</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="order clearfix">
                    <h4>Order Information</h4>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Order Date</td>
                            <td>{this.state.orderDate}</td>
                          </tr>
                          <tr>
                            <td>Order Status</td>
                            <td>
                              <div className="row">
                                <div className="col-lg-9 col-md-10 col-sm-10">
                                  <select
                                    className="form-control custom-select-black"
                                    value={this.state.orderStatus}
                                    onChange={(e)=>{
                                      this.setState({orderStatus: e.target.value},()=> this.handleStatusUpdate())
                                    }}

                                  >
                                    <option value="Canceled">Canceled</option>
                                    <option value="Completed" >
                                      Completed
                                    </option>
                                    <option value={"On Hold"}>On Hold</option>
                                    <option value="Pending">Pending</option>
                                    <option value={"Pending Payment"}>
                                      Pending Payment
                                    </option>
                                    <option value="Processing">
                                      Processing
                                    </option>
                                    <option value="Refunded">Refunded</option>
                                  </select>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Shipping Method</td>
                            <td>{this.state.shippingMethod}</td>
                          </tr>
                          <tr>
                            <td>Payment Method</td>
                            <td>{this.state.paymentMethod}</td>
                          </tr>
                          <tr>
                            <td>Currency</td>
                            <td>{this.state.currency}</td>
                          </tr>
                          <tr>
                            <td>Currency Rate</td>
                            <td>{this.state.currencyRate}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="account-information">
                    <h4>Account Information</h4>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Customer Name</td>
                            <td>{this.state.customerName}</td>
                          </tr>
                          <tr>
                            <td>Customer Email</td>
                            <td>{this.state.customerEmail}</td>
                          </tr>
                          <tr>
                            <td>Customer Phone</td>
                            <td>{this.state.Phone}</td>
                          </tr>
                          <tr>
                            <td>Customer Group</td>
                            <td>{this.state.customerGroup}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="address-information-wrapper">
              <h3 className="section-title">Address Information</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="billing-address">
                    <h4 className="pull-left">Billing Address</h4>
                    <span>
                      {this.state.billingAddress.Name}
                      <br />
                      {this.state.billingAddress.AddressLine1}
                      <br />
                      {this.state.billingAddress.AddressLine2}
                      <br />
                      {this.state.billingAddress.Country}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="shipping-address">
                    <h4 className="pull-left">Shipping Address</h4>
                    <span>
                      {this.state.shippingAddress.Name}
                      <br />
                      {this.state.shippingAddress.AddressLine1}
                      <br />
                      {this.state.shippingAddress.AddressLine2}
                      <br />
                      {this.state.shippingAddress.Country}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="items-ordered-wrapper">
              <h3 className="section-title">Items Ordered</h3>
              <div className="row">
                <div className="col-md-12">
                  <div className="items-ordered">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.items.map((item, idx)=>(
                            <tr key={idx}>
                            <td>
                              <Link to={"/products/"+ item.Product._id+"/edit"}>
                                {item.Product.Name}
                              </Link>
                              {item.Stock && item.Stock.name &&
                              <span style={{fontSize: "12px"}}>{"options: "+ item.Stock.name.split("-")}</span>
                              }
                            </td>
                            <td>{item.Product.price}</td>
                            <td>{item.Qty}</td>
                            <td>{item.LineTotal}</td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-totals-wrapper">
              <div className="row">
                <div className="order-totals pull-right">
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Subtotal</td>
                          <td className="text-right">{this.state.subTotal}</td>
                        </tr>
                        <tr>
                          <td>{this.state.shippingMethod}</td>
                          <td className="text-right">{this.state.shippingPrice}</td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td className="text-right">{this.state.Total}</td>
                        </tr>
                      </tbody>
                    </table>
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

export default withRouter(EditOrder);
