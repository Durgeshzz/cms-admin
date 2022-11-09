import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../../apis/api";
import { toast } from 'react-toastify';
class Translations extends React.Component {
  state = {
    tableData: {
      columns: [
      
        {
          name: "Key",
          selector: "key",
          sortable: true,
        },
        {
          name: "Arabic",
          selector: "arabic",
          sortable: true,
          
        },
        {
          name: "English",
          selector: "english",
          sortable: true,
        },
      ],
      data: [{
          key: 'account::attributes.addresses.address_1',
          english: 'Empty',
          arabic: 'Address Line 1'
      }]
    },
  };

  componentDidMount() {
 
  }

  render() {
    
    return (
      <React.Fragment>
        <section className="content-header clearfix">
          <h3>Translations (UI ONLY)</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Translations</li>
          </ol>
        </section>

        <section className="content">
          <div className="box box-primary">
            <div className="box-body index-table" id="attributes-table">
              
              <DataTableExtensions {...this.state.tableData}>
                <DataTable
                  noHeader
                  defaultSortField="key"
                  defaultSortAsc={true}
                  sortIcon={<SortIcon />}
                  filterPlaceholder="Search"
                  export={false}
                  print={false}
                  responsive
                  pagination
                  highlightOnHover
                />
              </DataTableExtensions>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
export default Translations;
