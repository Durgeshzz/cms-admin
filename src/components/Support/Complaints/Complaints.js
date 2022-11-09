import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../../apis/api";
import { format } from "timeago.js";
import Loading from '../../Loading'
import { toast } from 'react-toastify';
class Complaint extends React.Component {
  state = {
    selectedRows: [],
    submitting: false,
    tableData: {
      columns: [
        {
          name: "Id",
          selector: "id",
          sortable: true,
          width: "60px"
        },
        {
          name: "Name",
          selector: "name",
          sortable: true,
        },
        {
          name: "Email",
          selector: "email",
          sortable: true,
        },
        {
            name: "Country",
            selector: "country",
            sortable: true,
        },
        {
            name: "Solved",
            selector: "replied",
            sortable: true,
            cell: row=><span className={row.replied == "true"? "dot green": "dot red"}></span>
          },
        {
          name: "Created",
          selector: "created",
          sortable: true,
        },
      ],
      data: [],
    },
    requiredPermission: "Delete Options",
    edit: "",
    ID: ""
  };

  componentDidMount() {
    this.setState({submitting: true})
    const datalist = [];
    api
      .post("/complaint/get", {requiredPermission: "Index Support"})
      .then((res) => {
        res.data.data.map((val) => {
          var tmp = {
            id: val.ID,
            name: val.User?.["First Name"]+" "+val.User?.["Last Name"],
            email: val.User?.["Email"],
            country: val["Country"],
            replied: val["Read"],
            created: format(val["createdAt"]),
            _id: val["_id"],
          };
          datalist.push(tmp);
        });
        const { tableData } = this.state;
        tableData["data"] = datalist;
        this.setState({ tableData, submitting: false});
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
  }

  render() {
    if (this.state.edit != "") {
      return <Redirect to={"/complaints/" + this.state.edit} />;
    }
    return (
      <div>
        <section className="content-header clearfix">
          <h3>Complaints</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Complaints</li>
          </ol>
        </section>
        <section className="content">
          <Loading show={this.state.submitting}/>
          <div className="box box-primary">
            <div className="box-body index-table" id="attributes-table">
             
              <DataTableExtensions {...this.state.tableData}>
                <DataTable
                  noHeader
                  defaultSortField="id"
                  defaultSortAsc={true}
                  sortIcon={<SortIcon />}
                  filterPlaceholder="Search"
                  export={false}
                  print={false}
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
export default Complaint;
