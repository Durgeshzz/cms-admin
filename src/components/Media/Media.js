import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import Checkbox from "@material-ui/core/Checkbox";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../apis/api";
import { format } from "timeago.js";
import DropzoneComponent from "react-dropzone-component";
import "react-dropzone-component/styles/filepicker.css";
import "dropzone/dist/min/dropzone.min.css";
import {siteUrl} from '../../utils/utils'
import { toast } from 'react-toastify';
import Loading from '../Loading'
class Media extends React.Component {
  constructor(props) {
    super(props);

    this.djsConfig = {
      addRemoveLinks: true,
      autoProcessQueue: false,
    };

    this.componentConfig = {
      postUrl: "#",
    };

  }
  state = {
    files: [],
    selectedRows: [],
    submitting: false,
    tableData: {
      columns: [
        {
          name: "Id",
          selector: "id",
          sortable: true,
          width: "65px",
        },
        {
          name: "Thumbnail",
          selector: "thumbnail",
          sortable: true,
          cell: (row) => (
            <img
              src={siteUrl + row.thumbnail}
              height={60}
              width={60}
            />
          ),
          width: "110px",
        },
        {
          name: "Filename",
          selector: "filename",
          sortable: true,
        },
        {
          name: "Created",
          selector: "created",
          sortable: true,
        },
      ],
    },
    requiredPermission: "Delete Media",
  };

  componentDidMount() {
    this.setState({submitting: true})
    const datalist = [];
    var i = 0;
    api
      .post("/media/get")
      .then((res) => {
        res.data.data.map((val) => {
          i++;
          var tmp = {
            id: i,
            thumbnail: val.image,
            filename: val.fileName,
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
        toast.error('Something went wrong.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      });
  }

  deleteSelectedItems = () => {
    this.setState({submitting: true})
    const { selectedRows } = this.state;
    const { requiredPermission } = this.state;
    const data = { id: selectedRows, requiredPermission };
    api
      .delete("/media", { data })
      .then((res) => {
        toast.success('Media Item(s) deleted successfully', {
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
        toast.error('Something went wrong.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      });
  };
  handleFileAdded = (file) => {
    const { files } = this.state;
    files.push(file);
    this.setState({ files });
  };
  handleRemoveFile = (file) => {
    const { files } = this.state;
    files.splice(file, 1);
    this.setState({ files });
  };

  handlePost =  (file) => {
    var formData = new FormData();
     formData.append("image", file);
    api
      .post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log("success")
        toast.success('Media item(s) added successfully', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
        this.componentDidMount()
      })
      .catch((err) => {
        console.log(err)
        this.setState({submitting: false})
        toast.error('Something went wrong.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      });
  };
  handleImagePost = async() => {
    this.setState({submitting: true})
    const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

    for(let i = 0; i < this.state.files.length; i++){
      await delay()
      await this.handlePost(this.state.files[i])
      // console.log("loop")
    }
    //   this.state.files.map( async(file) => {
    //      await this.handlePost(file);
    //      console.log("loop");
    //  });    
          
  };

  render() {
    const eventHandlers = {
      addedfile: (file) => this.handleFileAdded(file),
      removedfile: (file) => this.handleRemoveFile(file),
    };
    return (
      <div>
        <section className="content-header clearfix">
          <h3>Media</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Media</li>
          </ol>
        </section>
        <Loading show={this.state.submitting}/>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <DropzoneComponent
                config={this.componentConfig}
                djsConfig={this.djsConfig}
                eventHandlers={eventHandlers}
                action="#"
              />
              <button
                className="btn image-upload"
                onClick={() => {
                   this.handleImagePost();
                }}
              >
                Click to Save
              </button>
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
export default Media;
