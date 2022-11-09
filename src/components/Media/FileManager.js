import React from "react";
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
import './media.css'
import Loading from "../Loading";
import { toast } from 'react-toastify';
class FileManager extends React.Component {
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
    submitting: false,
    files: [],
    selectedRows: [],
    ImageIds: [],
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
        {
            name: "Select",
            selector: "_id",
            cell: row=><button type="button" className="btn btn-default select-media"  data-icon="fa-picture-o"  data-original-title="Select this file" onClick={(e)=>{
              e.preventDefault();
              this.setId(row._id, row.thumbnail, row.filename)
            }}>
            <i className="fa fa-check-square-o" />
          </button>
          
        }
      ],
    },
    requiredPermission: "Delete Media",
  };

  setId = (id, image, filename) =>{
    if(this.props.multiple){
      this.props.setMediaId(id, true, image, filename)
      toast.success('Media Item Added', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        });
    }else{
      this.props.setMediaId(id, false, image, filename)
      this.props.close()
    }
  }

  componentDidMount() {
    this.setState({submitting: true})
      document.querySelector('html').style.overflowY = "hidden";
      console.log(this.props.multiple)
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
        //console.log(err);
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
        //console.log(res);
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
        //console.log(res);
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
        //console.log(err);
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
  };
  handleImagePost = async() => {
    
     this.setState({submitting: true})
     const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
 
     for(let i = 0; i < this.state.files.length; i++){
       await delay()
       await this.handlePost(this.state.files[i])
       // console.log("loop")
     }
  };

  render() {
    const eventHandlers = {
      addedfile: (file) => this.handleFileAdded(file),
      removedfile: (file) => this.handleRemoveFile(file),
    };
    return (
      <div>
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
          <Loading show={this.state.submitting}/>
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
export default FileManager;
