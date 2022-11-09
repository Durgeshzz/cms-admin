import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../../apis/api";
import { format } from "timeago.js";
import Loading from "../../Loading";
import { toast } from 'react-toastify';


class Transactions extends React.Component {
  state = {
    selectedRows: [],
    submitting: false,
    tableData: {
      columns: [
        {
          name: "Order Id",
          selector: "orderid",
          sortable: true,
          width: "120px",
          cell: row=><Link to={'/orders/'+row.order_id}>{row.orderid}</Link>
        },
        {
          name: "Transaction Id",
          selector: "transactionid",
          sortable: true,
        },
        {
          name: "Payment Method",
          selector: "paymentmethod",
          sortable: true,
        },
        {
          name: "Created",
          selector: "created",
          sortable: true,
        },
      ],
    },
  };

  componentDidMount() {
    this.setState({submitting: true})
    const datalist = [];
    var i = 0;
    api
      .post("/transaction/get")
      .then((res) => {
        res.data.data.map((val) => {
          i++;
          var tmp = {
            orderid: i,
            transactionid: "placeholder",
            paymentmethod: val.PaymentMethod,
            created: format(val["createdAt"]),
            order_id: val.OrderId,
            _id: val["_id"],
          };
          datalist.push(tmp);
        });
        const { tableData } = this.state;
        tableData["data"] = datalist;
        this.setState({ tableData, submitting: false });
      })
      .catch((err) => {
        this.setState({submitting:false})
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

  render() {
    return (
      <div>
        <section className="content-header clearfix">
          <h3>Transactions</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Transactions</li>
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
          <div className="box box-primary">
            <div className="box-body index-table" id="attributes-table">
              <DataTableExtensions {...this.state.tableData}>
                <DataTable
                  noHeader
                  defaultSortField="orderid"
                  defaultSortAsc={true}
                  sortIcon={<SortIcon />}
                  filterPlaceholder="Search"
                  responsive
                  pagination             
                  highlightOnHover
                />
              </DataTableExtensions>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Transactions;
