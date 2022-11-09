import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import Checkbox from "@material-ui/core/Checkbox";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../../apis/api";
import { format } from "timeago.js";
import Loading from "../../Loading";
import { siteUrl } from "../../../utils/utils";
import { toast } from 'react-toastify';

class Brands extends React.Component {
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
          name: "Logo",
          selector: "logo",
          sortable: true,
          cell: row => <img height={50} width={50} src={row.logo? siteUrl + row.logo: "https://via.placeholder.com/60"}/>
        },
        {
          name: "Name",
          selector: "name",
          sortable: true,
        },
        {
          name: "Status",
          selector: "status",
          sortable: true,
          cell: row=><span className={row.status? "dot green": "dot red"}></span>
        },
        {
          name: "Created",
          selector: "created",
          sortable: true,
        },
      ],
    },
    requiredPermission: "Delete Brand",
    edit: "",
  };

  componentDidMount() {

    this.setState({submitting: true})
    const datalist = [];
    var i = 0;
    api
      .post("/brand/get")
      .then((res) => {
        res.data.data.map((val) => {
          var tmp = {
            id: val.ID,
            logo: val.logo? val.logo.image: false,
            name: val["name"],
            status: val["status"],
            created: format(val["createdAt"]),
            _id: val["_id"],
          };
          datalist.push(tmp);
        });
        const { tableData } = this.state;
        tableData["data"] = datalist;
        this.setState({ tableData, submitting: false });
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

  deleteSelectedItems = () => {
    this.setState({submitting: true})
    const { selectedRows } = this.state;
    const { requiredPermission } = this.state;
    const data = { id: selectedRows, requiredPermission };
    api
      .delete("/brand", { data })
      .then((res) => {
        this.setState({submitting: false})
        toast.success('Brand(s) deleted successfully', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
        this.componentDidMount();
      })
      .catch((err) => {
        this.setState({submitting: false})
        toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      });
  };

  render() {
    if (this.state.edit != "") {
      return <Redirect to={ "/brands/" + this.state.edit + "/edit"} />;
    }
    return (
      <div>
        <section className="content-header clearfix">
          <h3>Brands</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Brands</li>
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
          <div className="row">
            <div className="btn-group pull-right">
              <Link
                to="/brands/create"
                className="btn btn-primary btn-actions btn-create"
              >
                Create Brand
              </Link>
            </div>
          </div>
          
          <div className="box box-primary">
            <div className="box-body index-table" id="attributes-table">
              <div className="table-delete-button">
                <button
                  type="button"
                  className="btn btn-default btn-delete"
                  onClick={this.deleteSelectedItems}
                >
                  Delete
                </button>
              </div>
              <DataTableExtensions {...this.state.tableData}>
                <DataTable
                  noHeader
                  defaultSortField="id"
                  defaultSortAsc={true}
                  sortIcon={<SortIcon />}
                  selectableRowsComponent={Checkbox}
                  filterPlaceholder="Search"
                  export={false}
                  print={false}
                  onSelectedRowsChange={(selected) => {
                    const arr = [];
                    selected["selectedRows"].forEach((row) => {
                      arr.push(row._id);
                    });
                    this.setState({ selectedRows: arr });
                  }}
                  responsive
                  pagination
                  selectableRows
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
export default Brands;
