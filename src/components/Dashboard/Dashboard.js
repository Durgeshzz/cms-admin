import React from "react";
import SideBar from "./SideBar";
import Wrapper from "./Wrapper";
import 'react-toastify/dist/ReactToastify.css';
class Dashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="left-side" />
        <SideBar />
        <Wrapper>
          {this.props.abc}
        </Wrapper>
      </React.Fragment>
    );
  }
}
export default Dashboard;
