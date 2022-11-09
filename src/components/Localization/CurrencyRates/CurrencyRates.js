import React from "react";
import { Link, Redirect } from "react-router-dom";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/SortRounded";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import api from "../../../apis/api";
import { format } from "timeago.js";
import { toast } from 'react-toastify';
import Loading from "../../Loading";
class CurrencyRates extends React.Component {
  state = {
    submitting: false,
    tableData: {
      columns: [
      
        {
          name: "Currency",
          selector: "currency",
          sortable: true,
        },
        {
          name: "Code",
          selector: "code",
          sortable: true,
          
        },
        {
          name: "Rate",
          selector: "rate",
          sortable: true,
        },
        {
            name: "Last Updated",
            selector: "lastUpdated",
            sortable: true,
        }
      ],
      data: []
    },
    edit: ""
  };

  componentDidMount() {
    this.setState({submitting: true})
    const datalist = [];
    api.get('/currency/get').then(res=>{
      //console.log(res.data.data)
      res.data.data.map((val) => {
        var tmp = {
          currency: val.Name,
          code: val.Code,
          rate: val.Rate,
          lastUpdated: format(val["updatedAt"]),
          _id: val["_id"],
        };
        datalist.push(tmp);
      });
      const { tableData } = this.state;
      tableData["data"] = datalist;
      this.setState({ tableData, submitting: false});
    }).catch(err=>{
      toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        });
      this.setState({submitting: false})
    })
  }

  refreshRates = () =>{
    this.setState({submitting: true})
    api.get('/currency').then(res=>{
      this.setState({submitting: false})
      toast.success('Currency rates refreshed.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        });
      this.componentDidMount()
    }).catch(err=>{
      toast.error( `${err.response && err.response.data?err.response.data.message: "Something went wrong."}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        });
      this.setState({submitting: false})
    })
  }

  render() {
    if (this.state.edit != "") {
      return <Redirect to={"/currency-rates/" + this.state.edit + "/edit"} />;
    }
    return (
      <React.Fragment>
        <section className="content-header clearfix">
          <h3>Currency Rates</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="active">Currency Rates</li>
          </ol>
        </section>
      <Loading show={this.state.submitting}/>
        <section className="content">
        <div className="row">
            <div className="btn-group pull-right">
              <a onClick={(e)=>{
                this.refreshRates()
              }}
                className="btn btn-primary btn-actions btn-create"
              >
                Refresh Rates
              </a>
            </div>
          </div>
          <div className="box box-primary">
            <div className="box-body index-table" >
              
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
      </React.Fragment>
    );
  }
}
export default CurrencyRates;
