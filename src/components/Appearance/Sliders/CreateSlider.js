import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import api from "../../../apis/api";
import Validate from "../../../utils/validation";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import FileManager from "../../Media/FileManager";
import {siteUrl} from '../../../utils/utils'
import "./slider.css";
import SortableContainer from '../../DND/SortableContainer'
import SortableItem from '../../DND/SortableItem'
import DragHandle from '../../DND/DragHandle'
import arrayMove from "array-move";
import Loading from '../../Loading'
import { toast } from 'react-toastify';
import {getMessage} from '../../AlertMessage'

class CreateSlide extends React.Component {
  state = {
    showModal: false,
    multiple: false,
    idx: "",
    imageTab: "general",
    activePanel: "slides",
    submitting: false,
    data: {
      Name: "",
      Settings: {
        Speed: "",
        Fade: false,
        Autoplay: false,
        AutoplaySpeed: "",
        Dots: false,
        Arrows: false,
      },
    },
    slides: [
      {
        imageId: "",
        image: "",
        General: {
          Caption1: "",
          Caption2: "",
          Direction: "left",
          CallToActionText: "",
          CallToActionUrl: "",
          NewWindow: false,
        },
        Options: [
          {
            target: "Caption 1",
            Delay: "",
            Effect: "",
          },
          {
            target: "Caption 2",
            Delay: "",
            Effect: "",
          },
          {
            target: "Caption To Action",
            Delay: "",
            Effect: "",
          }
        ],
        target: "Caption 1",
        slideTab: "general",
      },
    ],
    errors: [],
    alertType: "",
    alertMessage: "",
    redirect: false
  };
  setData = (val, key1, key2) => {
    const { data } = this.state;
    if (key2) {
      data[key1][key2] = val;
    } else {
      data[key1] = val;
    }
    this.setState({ data });
  };
  componentDidMount() {
    if (this.props.edit == "true") {
      this.setState({submitting: true})
      const {data, slides} = this.state
      const url = "/slides/get/" + this.props.match.params.id;
      api.get(url).then(res=>{
        
        slides.splice(0,1)
        res.data.data.Slides.forEach(slide=>{
          let tmp = {
            imageId: slide.Image?slide.Image._id:"",
            image: slide.Image?slide.Image.image:"",
            General: slide.General,
            Options: [],
            slideTab: "general",
          }
          slide.Options.forEach(val=>{
            let tmp2 = {
              Delay: val.Delay,
              Effect: val.Effect,
              target: val.target
            }
            tmp.Options.push(tmp2)
          })
          slides.push(tmp)
        })
        data.Name = res.data.data.Name
        data.Settings = res.data.data.Settings
        this.setState({data, slides, submitting: false})
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
  }
  setSlide = (val, key, key2, idx) =>{
    const { slides} = this.state 
    slides[idx][key][key2] =val
    this.setState({slides})
  }
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  setImageId = (id, multiple, image) => {
    const {slides, idx} = this.state
    slides[idx].imageId = id
    slides[idx].image = image
    this.setState(slides)
  };

  handleAddRow = () => {
    const { slides } = this.state;
    slides.push({
      imageId: "",
      General: {
        Caption1: "",
        Caption2: "",
        Direction: "",
        CallToActionText: "",
        CallToActionURL: "",
        NewWindow: false,
      },
      Options: [
        {
          target: "Caption 1",
          Delay: "",
          Effect: "",
        },
        {
          target: "Caption 2",
          Delay: "",
          Effect: "",
        },
        {
          target: "Caption To Action",
          Delay: "",
          Effect: "",
        }
      ],
      slideTab: "general"
    })
    this.setState({ slides });
  };
  handleRemoveSpecificRow = (idx) => {
    const { slides } = this.state;
    slides.splice(idx,1)
    this.setState({ slides });
  };
  handleSubmit = () => {
    const { errors } = this.state;
    const { data } = this.state;

    if (!errors.includes("name") && !Validate.validateNotEmpty(data["Name"])) {
      errors.push("name");
      this.setState({ errors });
    } else if (
      errors.includes("name") &&
      Validate.validateNotEmpty(data["Name"])
    ) {
      errors.splice(errors.indexOf("name"), 1);
      this.setState({ errors });
    }

    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({submitting: true})
      if (this.props.edit == "true") {
        api.put('/slides', {data: this.state.data, slides: this.state.slides, requiredPermission: "Edit Slider", _id: this.props.match.params.id}).then(res=>{
          this.setState({submitting: false, alertType: "success", alertMessage: "Slider edited successfully."})

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
      } else {
        api.post('/slides', {data: this.state.data, slides: this.state.slides, requiredPermission: "Create Slider"}).then(res=>{
          toast.success('Slider added successfully', {
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
          this.setState({submitting: false, redirect: true})
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
    } else {
      this.setState({alertType: "fail", alertMessage: "Please fill the following: "+ errors})

    }
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    let arr= arrayMove(this.state.slides, oldIndex, newIndex)
    this.setState({slides: arr})
  };
  tabContentToggle = () => {
    if (this.state.activePanel == "slides") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Slides</h3>
          <div id="slides-wrapper" className="clearfix">
          <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
            <div>
            {this.state.slides.map((slide,idx)=>(
             <SortableItem key={idx} index={idx}>

            <div className="slide" key={idx}>
              <div className="slide-header clearfix">
                <DragHandle />
                <span className="pull-left">Image Slide</span>
                <button type="button" className="delete-slide btn pull-right" onClick={()=>{this.handleRemoveSpecificRow(idx)}}>
                  <i className="fa fa-times" />
                </button>
              </div>
              <div className="slide-body">
                
                {this.state.slides[idx].image != ""? <div className="slide-image" onClick={()=>{
                  this.setState({showModal: true, multiple: false, idx: idx})
                }} ><img src={siteUrl+this.state.slides[idx].image} height={120} width={120}/></div>: <div className="slide-image" onClick={()=>{
                  this.setState({showModal: true, multiple: false, idx: idx})
                }} >
                <i className="fa fa-picture-o" />
              </div>}
                <div className="slide-tabs tab-wrapper">
                  <ul className="nav nav-tabs">
                    <li className={this.state.slides[idx].slideTab == "general"? "active": ""} onClick={()=>{
                      const {slides} = this.state
                      slides[idx].slideTab = "general"
                      this.setState({slides})
                    }}>
                      <a
                      >
                        General
                      </a>
                    </li>
                    <li className={this.state.slides[idx].slideTab == "options"? "active": ""} onClick={()=>{
                      const {slides} = this.state
                      slides[idx].slideTab = "options"
                      this.setState({slides})
                    }}>
                      <a
                      >
                        Options
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {this.state.slides[idx].slideTab == "general"? 
                    <div
                      className="tab-pane fade in clearfix active"
                    >
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <label htmlFor="slides-0-caption-1">
                              Caption 1
                            </label>
                            <input
                              type="text"
                              name="Caption1"
                              className="form-control"
                              value={this.state.slides[idx].General.Caption1}
                              onChange={(e)=>{
                                this.setSlide(e.target.value, "General", e.target.name, idx)
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <label htmlFor="slides-0-caption-2">
                              Caption 2
                            </label>
                            <input
                              type="text"
                              name="Caption2"
                              className="form-control"
                              value={this.state.slides[idx].General.Caption2}
                              onChange={(e)=>{
                                this.setSlide(e.target.value, "General", e.target.name, idx)
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <label htmlFor="slides-0-direction">
                              Direction
                            </label>
                            <select
                              name="Direction"
                              className="form-control"
                              value={this.state.slides[idx].General.Direction}
                              onChange={(e)=>{
                                this.setSlide(e.target.value, "General", e.target.name, idx)
                              }}
                            >
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <label htmlFor="slides[0][call-to-action-text]">
                              Call to Action Text
                            </label>
                            <input
                              type="text"
                              name="CallToActionText"
                              className="form-control"
                              value={this.state.slides[idx].General.CallToActionText}
                              onChange={(e)=>{
                                this.setSlide(e.target.value, "General", e.target.name, idx)
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <label htmlFor="slides-0-call-to-action-url">
                              Call to Action URL
                            </label>
                            <input
                              type="text"
                              name="CallToActionURL"
                              className="form-control"
                              value={this.state.slides[idx].General.CallToActionURL}
                              onChange={(e)=>{
                                this.setSlide(e.target.value, "General", e.target.name, idx)
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                          <div className="checkbox">
                            <input
                              type="checkbox"
                              name="NewWindow"
                              id={"slides-0-open-in-new-window"+idx}
                              checked={this.state.slides[idx].General.NewWindow}
                              onChange={(e)=>{
                                this.setSlide(!this.state.slides[idx].General.NewWindow, "General", e.target.name, idx)
                              }}
                            />
                            <label htmlFor={"slides-0-open-in-new-window"+idx}>
                              Open in new window
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>: 
                    <div
                      className="tab-pane fade in clearfix active"
                    >
                      <select className="change-option-block custom-select-black pull-right" value={this.state.slides[idx].target} onChange={(e)=>{
                        const {slides} = this.state
                        slides[idx].target = e.target.value
                        this.setState({slides})
                      }}>
                        <option value={"Caption 1"}>
                          Caption 1
                        </option>
                        <option value={"Caption 2"}>Caption 2</option>
                        <option value={"Call To Action"}>Call to Action</option>
                      </select>
                     
                      <div
                        className="slide-options caption-1"
                        style={{ display: "block" }}
                      >
                        <h4>{this.state.slides[idx].target}</h4>
                        <div className="form-group">
                          <div className="col-md-12 p-l-0">
                            <label
                              className="control-label col-lg-2 col-md-3 col-sm-3 col-xs-12 text-left p-l-0"
                            >
                              Delay
                            </label>
                            <div className="col-lg-4 col-md-7 col-sm-6 col-xs-7 p-l-0">
                              <input
                                type="number"
                                name="Delay"
                                className="form-control"
                                placeholder="0s"
                                value={this.state.slides[idx].target == "Caption 1"? this.state.slides[idx].Options[0].Delay: (this.state.slides[idx].target == "Caption 2"? this.state.slides[idx].Options[1].Delay: this.state.slides[idx].Options[2].Delay)}
                                onChange={(e)=>{
                                  const {slides} = this.state
                                  this.state.slides[idx].target == "Caption 1"? slides[idx].Options[0].Delay = e.target.value : (this.state.slides[idx].target == "Caption 2"? slides[idx].Options[1].Delay = e.target.value: slides[idx].Options[2].Delay = e.target.value) 
                                  this.setState({slides})
                                }}
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-md-12 p-l-0">
                            <label
                              className="control-label col-lg-2 col-md-3 col-sm-3 col-xs-12 text-left p-l-0"
                            >
                              Effect
                            </label>
                            <div className="col-lg-4 col-md-7 col-sm-6 col-xs-7 p-l-0">
                              <select
                                name="Effect"
                                className="form-control custom-select-black"
                                value={this.state.slides[idx].target == "Caption 1"? this.state.slides[idx].Options[0].Effect: (this.state.slides[idx].target == "Caption 2"? this.state.slides[idx].Options[1].Effect: this.state.slides[idx].Options[2].Effect)}
                                onChange={(e)=>{
                                  const {slides} = this.state
                                  this.state.slides[idx].target == "Caption 1"? slides[idx].Options[0].Effect = e.target.value : (this.state.slides[idx].target == "Caption 2"? slides[idx].Options[1].Effect = e.target.value: slides[idx].Options[2].Effect = e.target.value) 
                                  this.setState({slides})
                                }}
                              ><option value="">Please Select</option>
                                <option value="fadeInUp">fadeInUp</option>
                                <option value="fadeInDown">fadeInDown</option>
                                <option value="fadeInLeft">fadeInLeft</option>
                                <option value="fadeInRight">fadeInRight</option>
                                <option value="lightSpeedIn">
                                  lightSpeedIn
                                </option>
                                <option value="slideInUp">slideInUp</option>
                                <option value="slideInDown">slideInDown</option>
                                <option value="slideInLeft">slideInLeft</option>
                                <option value="slideInRight">
                                  slideInRight
                                </option>
                                <option value="zoomIn">zoomIn</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                 
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            </SortableItem>
            ))}
            </div>
            </SortableContainer>
          </div>
          <div className="form-group">
            <button type="button" className="add-slide btn btn-default m-l-15" onClick={()=>{this.handleAddRow()}}>
              Add Slide
            </button>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "settings") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Settings</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Name<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Name"
                    className="form-control "
                    type="text"
                    value={this.state.data.Name}
                    onChange={(e) => {
                      this.setData(e.target.value, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Speed
                </label>
                <div className="col-md-9">
                  <input
                    name="Speed"
                    className="form-control "
                    placeholder="300ms"
                    type="number"
                    step={100}
                    value={this.state.data.Settings.Speed}
                    onChange={(e) => {
                      this.setData(e.target.value, "Settings", e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="fade"
                  className="col-md-3 control-label text-left"
                >
                  Fade
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Fade"
                      id="fade"
                      checked={this.state.data.Settings.Fade}
                      onChange={(e) => {
                        this.setData(
                          !this.state.data.Settings.Fade,
                          "Settings",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="fade">Fade slides instead of sliding</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="autoplay"
                  className="col-md-3 control-label text-left"
                >
                  Autoplay
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Autoplay"
                      id="autoplay"
                      checked={this.state.data.Settings.Autoplay}
                      onChange={(e) => {
                        this.setData(
                          !this.state.data.Settings.Autoplay,
                          "Settings",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="autoplay">Enable autoplay</label>
                  </div>
                </div>
              </div>
              <div className="autoplay-speed-field ">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Autoplay Speed
                  </label>
                  <div className="col-md-9">
                    <input
                      name="AutoplaySpeed"
                      className="form-control "
                      placeholder="3000ms"
                      type="number"
                      step={100}
                      value={this.state.data.Settings.AutoplaySpeed}
                      onChange={(e) => {
                        this.setData(e.target.value, "Settings", e.target.name);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="dots"
                  className="col-md-3 control-label text-left"
                >
                  Dots
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Dots"
                      id="dots"
                      checked={this.state.data.Settings.Dots}
                      onChange={(e) => {
                        this.setData(
                          !this.state.data.Settings.Dots,
                          "Settings",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="dots">Show slider dots</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="arrows"
                  className="col-md-3 control-label text-left"
                >
                  Arrows
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Arrows"
                      id="arrows"
                      checked={this.state.data.Settings.Arrows}
                      onChange={(e) => {
                        this.setData(
                          !this.state.data.Settings.Arrows,
                          "Settings",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="arrows">Show Prev/Next arrows</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={ "/sliders"} />
    }
    return (
      <React.Fragment>
        <Modal
          open={this.state.showModal}
          onClose={() => {
            document.querySelector("html").style.overflowY = "auto";

            this.setState({ showModal: false });
          }}
        >
          <div className="modal-header">
            <h4 className="modal-title">File Manager</h4>
          </div>
          <FileManager
            multiple={this.state.multiple}
            setMediaId={
              this.state.activePanel == "downloads"
                ? this.setDownloadId
                : this.setImageId
            }
            close={() => {
              document.querySelector("html").style.overflowY = "auto";

              this.setState({ showModal: false });
            }}
          />
        </Modal>
        <div>
          <section className="content-header clearfix">
            {this.props.edit == "true" ? (
              <h3>Edit Slider</h3>
            ) : (
              <h3>Create Slider</h3>
            )}
            <ol className="breadcrumb">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/sliders">Sliders</Link>
              </li>
              {this.props.edit == "true" ? (
                <li className="active">Edit Slider</li>
              ) : (
                <li className="active">Create slider</li>
              )}
            </ol>
          </section>
          <Loading show={this.state.submitting}/>
          <section className="content">
          {getMessage(
            this.state.alertType,
            this.state.alertMessage,
            this.onClose
          )}
            <form className="form-horizontal">
              <div className="accordion-content clearfix">
                <div className="col-lg-3 col-md-4">
                  <div className="accordion-box">
                    <div className="panel-group">
                      <div className="panel panel-default">
                        <div className="panel-heading">
                          <h4 className="panel-title">
                            <a>Slider Information</a>
                          </h4>
                        </div>
                        <div className="panel-collapse collapse in">
                          <div className="panel-body">
                            <ul className="accordion-tab nav nav-tabs">
                              <li
                                className={
                                  this.state.activePanel == "slides"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "slides" });
                                }}
                              >
                                <a data-toggle="tab">Slides</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "settings"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "settings" });
                                }}
                              >
                                <a data-toggle="tab">Settings</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 col-md-8">
                  <div className="accordion-box-content">
                    <div className="tab-content clearfix">
                      {this.tabContentToggle()}
                      <div className="form-group">
                        <div className="col-md-2 col-md-10">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleSubmit();
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(CreateSlide);
