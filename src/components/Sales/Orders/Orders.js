import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../../apis/api";
import { format } from "timeago.js";
import { toast } from 'react-toastify';
import Loading from '../../Loading'
class Orders extends React.Component {
  state = {
    selectedRows: [],
    submitting: false,
    tableData: {
      columns: [
        {
          name: "Id",
          selector: "id",
          sortable: true,
          width: "65px"
        },
        {
          name: "Customer Name",
          selector: "customername",
          sortable: true,
        },
        {
          name: "Customer Email",
          selector: "customeremail",
          sortable: true,
        },
        {
          name: "Status",
          selector: "status",
          sortable: true,
        },
        {
          name: "Total",
          selector: "total",
          sortable: true,
        },
        {
          name: "Created",
          selector: "created",
          sortable: true,
        },
      ],
    },
    edit: "",
  };

  componentDidMount() {
    this.setState({submitting: true})
    const datalist = [];
    var i = 0;
    api.post('/order/get', {requiredPermission: "Show Order"}).then(res=>{
      res.data.data.map((val) => {
        i++;
              var tmp = {
                id: i,
                customername: val.User?val.User["First Name"]+" "+val.User["Last Name"]: "--",
                customeremail:val.User? val.User.Email: "--",
                status: val.Status,
                total: val.Total,
                created: format(val["createdAt"]),
                _id: val["_id"],
              };
              datalist.push(tmp);
            });
            const { tableData } = this.state;
            tableData["data"] = datalist;
            this.setState({ tableData, submitting: false });
      
    }).catch(err=>{
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

  render() {
    if (this.state.edit != "") {
      return <Redirect to={"/orders/" + this.state.edit} />;
    }
    return (
      <div>
        <section className="content-header clearfix">
          <h3>Orders</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Orders</li>
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
          <div className="box box-primary">
            <div className="box-body index-table" id="attributes-table">
              <DataTableExtensions {...this.state.tableData}>
                <DataTable
                  noHeader
                  defaultSortField="id"
                  defaultSortAsc={true}
                  sortIcon={<SortIcon />}
                  filterPlaceholder="Search"
                  responsive
                  pagination
                  onRowClicked={(index) => {
                    this.setState({ edit: index._id });
                  }}
                  pointerOnHover
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
export default Orders;
