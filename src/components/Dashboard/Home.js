import React from "react";
import api from "../../apis/api";
import {  Redirect } from "react-router-dom";
import Loading from '../Loading'

class Home extends React.Component {
  state = {
    totalOrders: 0,
    totalProducts: 0,
    latestOrders: [],
    latestReviews: [],
    totalCustomers: 0,
    totalSales: 0,
    url: "",
    submitting: false
  };
  componentDidMount() {
    this.setState({submitting: true})

    api
      .get("/dashboard/orders")
      .then((res) => {
        this.setState({ totalOrders: res.data.data, submitting: false });
        
      })
      .catch((err) => {
        console.log("error");
        this.setState({submitting: false})
      });
    api
      .get("/dashboard/products")
      .then((res) => {
        this.setState({ totalProducts: res.data.data, submitting: false });
      })
      .catch((err) => {
        console.log("error");
        this.setState({submitting: false})

      });
      api
      .get("/dashboard/sales")
      .then((res) => {
        this.setState({ totalSales: res.data.data, submitting: false });
      })
      .catch((err) => {
        console.log("error");
        this.setState({submitting: false})

      });
    api
      .get("/dashboard/latest/reviews")
      .then((res) => {
        this.setState({ latestReviews: res.data.data, submitting: false });
      })
      .catch((err) => {
        console.log("error");
        this.setState({submitting: false})

      });
    api
      .get("/dashboard/latest/orders")
      .then((res) => {
        this.setState({ latestOrders: res.data.data, submitting: false });
      })
      .catch((err) => {
        console.log("error");
        this.setState({submitting: false})

      });
      api.post('/dashboard/customers', {"RoleId": "60b743903a7c3249d0a5f975"}).then(res=>{
        this.setState({totalCustomers: res.data.data})
      }).catch(err=>{
        console.log(err)
      })

  }
  render() {
    if (this.state.url != "") {
      return <Redirect to={this.state.url} />;
    }
    return (
      <div>
        <section className="content-header clearfix">
          <h2 className="pull-left">Dashboard</h2>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
          <div className="grid clearfix">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="single-grid total-sales">
                  <h4>Total Sales</h4>
                  <i className="fa fa-money pull-left" aria-hidden="true" />
                  <span className="pull-right">₹{this.state.totalSales}</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="single-grid total-orders">
                  <h4>Total Orders</h4>
                  <i
                    className="fa fa-shopping-cart pull-left"
                    aria-hidden="true"
                  />
                  <span className="pull-right">{this.state.totalOrders}</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="single-grid total-products">
                  <h4>Total Products</h4>
                  <i className="fa fa-cubes" aria-hidden="true" />
                  <span className="pull-right">{this.state.totalProducts}</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="single-grid total-customers">
                  <h4>Total Customers</h4>
                  <i className="fa fa-users pull-left" aria-hidden="true" />
                  <span className="pull-right">{this.state.totalCustomers}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              {/* <div className="sales-analytics">
                <div className="grid-header clearfix">
                  <h4>
                    <i className="fa fa-bar-chart" aria-hidden="true" />
                    Sales Analystics
                  </h4>
                </div>
                <div className="canvas">
                  <canvas className="chart" width={400} height={250} />
                </div>
              </div> */}
              <div className="dashboard-panel">
                <div className="grid-header">
                  <h4>
                    <i className="fa fa-shopping-cart" aria-hidden="true" />
                    Latest Orders
                  </h4>
                </div>
                <div className="clearfix" />
                <div className="table-responsive anchor-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                      {this.state.latestOrders.map((val,idx)=>(
                      <tr className="dashboard-table-row" key={idx} onClick={()=>{
                        this.setState({url: "/orders/"+val._id})
                      }}>
                        <td>
                            {val.ID}
                          
                        </td>
                        <td>
                            {val.User?val.User['First Name']: "User Deleted"} 
                        </td>
                        <td>
                            {val.Status}
                        </td>
                        <td>
                        ₹ {val.Total}
                        </td>
                      </tr>
                      ))}
                    </thead>
                    
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              {/* <div className="dashboard-panel">
                <div className="grid-header">
                  <h4>
                    <i className="fa fa-search" aria-hidden="true" />
                    Latest Search Terms
                  </h4>
                </div>
                <div className="clearfix" />
                <div className="table-responsive search-terms">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Keyword</th>
                        <th>Results</th>
                        <th>Hits</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>knsjnvsdv</td>
                        <td>0</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>footwear\</td>
                        <td>0</td>
                        <td>4</td>
                      </tr>
                      <tr>
                        <td>footwear</td>
                        <td>0</td>
                        <td>2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
              <div className="dashboard-panel">
                <div className="grid-header">
                  <h4>
                    <i className="fa fa-comments-o" aria-hidden="true" />
                    Latest Reviews
                  </h4>
                </div>
                <div className="clearfix" />
                <div className="table-responsive anchor-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Customer</th>
                        <th>Rating</th>
                      </tr>
                      {this.state.latestReviews.map((val,idx)=>(
                      <tr className="dashboard-table-row" key={idx} onClick={()=>{
                        this.setState({url: "/reviews/"+val._id +"/edit"})
                      }}>
                        <td>
                            {val.product?val.product.name:""}
                          
                        </td>
                        <td>
                            {val.reviewerName} 
                        </td>
                        <td>
                            {val.rating}
                        </td>
                      </tr>
                      ))}
                    </thead>
                    
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Home;
