import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import Checkbox from "@material-ui/core/Checkbox";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../apis/api";
import { format } from 'timeago.js';
import Loading from '../Loading'
import { toast } from 'react-toastify';

class Users extends React.Component {
  state={
    selectedRows: [],
    submitting: false,
    tableData: {
      columns: [
        {
          name: 'Id',
          selector: 'id',
          sortable: true,
          width: "60px"
        },
        {
          name: 'First Name',
          selector: 'firstName',
          sortable: true,
        },
        {
          name: 'Last Name',
          selector: 'lastName',
          sortable: true,
        },
        {
          name: 'Email',
          selector: 'email',
          sortable: true,
        },
        {
          name: 'Last Login',
          selector: 'lastLogin',
          sortable: true,
        },
        {
          name: 'Created',
          selector: 'created',
          sortable: true,
        }
      ],
      data: [],
    },
    edit: "",
    requiredPermission: "Delete Users"
  }

  componentDidMount() {
    this.setState({submitting: true})
    const datalist = [];
    var i = 0;
    api
      .post("/users/get",{})
      .then((res) => {
        res.data.data.map((val) => {
          i++;
          var tmp = {
            id: i,
            firstName: val["First Name"],
            lastName: val["Last Name"],
            email: val["Email"],
            lastLogin: format(val["LastLogin"]),
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
 
  deleteSelectedItems = () =>{
    this.setState({submitting: true})
    const {selectedRows} = this.state
    const {requiredPermission} = this.state
    const data = {id: selectedRows, requiredPermission}
    api.delete('/users', {data}).then(res=>{
      toast.success(`User(s) deleted successfully.`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        });
      this.componentDidMount()
    }).catch(err=>{
      this.setState({submitting: false})
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
      return <Redirect to={"/users/" + this.state.edit + "/edit"} />;
    }
    return (
      <React.Fragment>
        <section className="content-header clearfix">
          <h3>Users</h3>
          <ol className="breadcrumb">
            <li>
              <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li className="active">Users</li>
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
          <div className="row">
            <div className="btn-group pull-right">
              <Link
                to="/users/create"
                className="btn btn-primary btn-actions btn-create"
              >
                Create User
              </Link>
            </div>
          </div>
          <div className="box box-primary">
            <div className="box-body index-table" id="users-table">
              <div className="table-delete-button">

                <button type="button" className="btn btn-default btn-delete" onClick={this.deleteSelectedItems}>Delete</button>
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
        <div id="notification-toast" />
        <div
          className="modal fade"
          id="keyboard-shortcuts-modal"
          // tabIndex={-1}
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <a
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  ×
                </a>
                <h4 className="modal-title">
                  Available keyboard shortcuts on this page
                </h4>
              </div>
              <div className="modal-body">
                <dl className="dl-horizontal">
                  <dt>
                    <code>?</code>
                  </dt>
                  <dd>This Menu</dd>
                </dl>
                <dl className="dl-horizontal">
                  <dt>
                    <code>c</code>
                  </dt>
                  <dd>Create User</dd>
                </dl>
                <dl className="dl-horizontal">
                  <dt>
                    <code>Del</code>
                  </dt>
                  <dd>Delete User</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Users;
