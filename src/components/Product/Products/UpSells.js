import React from "react";
import "./products.css";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import Checkbox from "@material-ui/core/Checkbox";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { format } from "timeago.js";
import api from'../../../apis/api'



class UpSells extends React.Component{

    render(){
        return(
            <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Up-Sells</h3>
          <div className="table-responsive">
          <div className="box box-primary">
            <div className="box-body index-table">
              <div className="table-delete-button">
                {/* <button
                  type="button"
                  className="btn btn-default btn-delete"
                  onClick={this.deleteSelectedItems}
                >
                  Delete
                </button> */}
              </div>
              <DataTableExtensions {...this.props.tableData}>
                <DataTable
                  noHeader
                  defaultSortField="id"
                  defaultSortAsc={true}
                  sortIcon={<SortIcon />}
                  selectableRowsComponent={Checkbox}
                  filterPlaceholder="Search"
                  export={false}
                  print={false}
                  selectableRowSelected={row=>{return this.props.getIds.includes(row._id)}}
                  onSelectedRowsChange={(selected) => {
                    const arr = []
                    selected["selectedRows"].forEach((row) => {
                      arr.push(row._id)
                    });
                    this.props.setIds(arr)
                  }}
                  responsive
                  pagination
                  selectableRows
                  onRowClicked={(index) => {
                    this.props.setEdit(index._id)
                  }}
                  pointerOnHover
                  highlightOnHover
                />
              </DataTableExtensions>
            </div>
          </div>
           </div>
        </div>
        )
    }
}
export default UpSells;