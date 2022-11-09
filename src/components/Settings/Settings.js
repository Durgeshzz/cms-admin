import React from "react";
import { Link } from "react-router-dom";
import api from "../../apis/api";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { countries, locales, timezone, currencies } from "../../utils/data";
import Validate from "../../utils/validation";
import Loading from "../Loading";
import { toast } from 'react-toastify';
import {getMessage} from '../AlertMessage'
class Settings extends React.Component {
  state = {
    submitting: false,
    customerRoles: [],
    activePanel: "general",
    activeTab: "generalsettings",
    data: {
      General: {
        SupportedCountries: [],
        DefaultCountry: "",
        SupportedLocales: [],
        DefaultLocale: "",
        DefaultTimezone: "",
        CustomerRoleId: "",
        RatingsAndReviews: false,
        AutoApproveReviews: false,
        CookieBar: false,
      },
      Maintenance: {
        MaintenanceMode: false,
      },
      Store: {
        StoreName: "",
        StoreTagline: "",
        StoreEmail: "",
        StorePhone: "",
        StoreAddress1: "",
        StoreAddress2: "",
        StoreCity: "",
        StoreCountry: "",
        StoreState: "",
        StoreZip: "",
        HideStorePhone: false,
        HideStoreEmail: false,
      },
      Currency: {
        SupportedCurrencies: [],
        DefaultCurrency: "",
        ExchangeRateService: {
          name: "",
          API_Key: "",
        },
        AutoRefresh: {
          Enable: false,
          Frequency: "",
        },
      },
      SMS: {
        SMSFrom: "",
        SMSService: {
          name: "",
          API_KEY: "",
          APISecret: "",
        },
        WelcomeSMS: false,
        NewOrderAdminSMS: false,
        NewOrderSMS: false,
        SMSOrderStatuses: [],
      },
      Mail: {
        MailFromAddress: "",
        MailFromName: "",
        MailHost: "",
        MailPort: "",
        MailUsername: "",
        MailPassword: "",
        MailEncryption: "",
        WelcomeEmail: false,
        NewOrderAdminEmail: false,
        InvoiceEmail: false,
        EmailOrderStatuses: [],
      },
      Newsletter: {
        Newsletter: false,
        MailchimpAPIkey: "",
        MailchimpListID: "",
      },
      CustomCSSJS: {
        Header: "",
        Footer: "",
      },
      SocialLogins: {
        Facebook: {
          Status: false,
          AppID: "",
          Appsecret: "",
          CallBackUrl: ""
        },
        Google: {
          Status: false,
          ClientID: "",
          ClientSecret: "",
          CallBackUrl: ""
        },
      },
      ShippingMethods: {
        FreeShipping: {
          Status: false,
          Label: "",
          MinimumAmount: "",
        },
        LocalPickup: {
          Status: false,
          Label: "",
          Cost: "",
        },
        FlatRate: {
          Status: false,
          Label: "",
          Cost: "",
        },
      },
      PaymentMethods: {
        Paypal: {
          Status: false,
          Label: "",
          Description: "",
          Sandbox: false,
          ClientId: "",
          Secret: "",
        },
        Stripe: {
          Status: false,
          Label: "",
          Description: "",
          PublishableKey: "",
          SecretKey: "",
        },
        Paytm: {
          Status: false,
          Label: "",
          Description: "",
          Sandbox: false,
          MerchantID: "",
          MerchantKey: "",
        },
        Razorpay: {
          Status: false,
          Label: "",
          Description: "",
          KeyID: "",
          KeySecret: "",
        },
        Instamojo: {
          Status: false,
          Label: "",
          Description: "",
          Sandbox: false,
          APIKey: "",
          AuthToken: "",
        },
        CashonDelivery: {
          Status: false,
          Label: "",
          Description: "",
        },
        BankTransfer: {
          Status: false,
          Label: "",
          Description: "",
          Instructions: "",
        },
        ChequeMoneyOrder: {
          Status: false,
          Label: "",
          Description: "",
          Instructions: "",
        },
      },
    },
    id: "",
    errors: [],
    alertType: "",
    alertMessage: "",
  };
  onClose = ()=>{
    this.setState({alertMessage: "", alertType: ""})
  }
  componentDidMount() {
    this.setState({submitting: true})
    api
      .post("/roles/get")
      .then((res) => {
        const { customerRoles } = this.state;
        res.data.data.forEach((role) => {
          let tmp = {
            label: role.Name,
            value: role._id,
          };
          customerRoles.push(tmp);
        });
        this.setState({ customerRoles });
      })
      .catch((err) => {
        console.log("error fetching roles");
      });
    api
      .post("/settings/get", {requiredPermission: "Edit Settings"})
      .then((res) => {
        const { data } = this.state;
        for (const [key, value] of Object.entries(res.data.data[0])) {
          
          if (key != "_id" && key != "__v") {
            data[key] = value;
          }
        }
        try{
          data.General.CustomerRoleId = this.state.data.General.CustomerRole._id
        }catch(err){
          data.General.CustomerRoleId = ""
        }
        data.General.CustomerRoleId = this.state.data.General.CustomerRole?this.state.data.General.CustomerRole._id:""
        this.setState({ data, id: res.data.data[0]._id, submitting: false });
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
  setVal2 = (key, key2, val) => {
    const { data } = this.state;
    data[key][key2] = val;
    this.setState({ data });
  };

  setVal = (key, key2, key3, val) => {
    const { data } = this.state;
    data[key][key2][key3] = val;
    this.setState({ data });
  };

  handleSubmit = () => {
    const { data, errors } = this.state;
    const requiredGeneral = [
      "SupportedCountries",
      "DefaultCountry",
      "SupportedLocales",
      "DefaultLocale",
      "DefaultTimezone",
      "CustomerRoleId",
    ];
    const requiredStore = ["StoreName", "StoreEmail", "StorePhone"];
    const requiredCurrency = ["SupportedCurrencies", "DefaultCurrency"];
    const requiredFacebook = ["AppID", "Appsecret", "CallBackUrl"];
    const requiredGoogle = ["ClientID", "ClientSecret", "CallBackUrl"];
    const requiredShipping = ["Label"];
    const paymentMethods = ["Label", "Description"];

    requiredGeneral.forEach((val) => {
      if (
        !errors.includes(val) &&
        !Validate.validateNotEmpty(data.General[val])
      ) {
        errors.push(val);
        this.setState({ errors });
      } else if (
        errors.includes(val) &&
        Validate.validateNotEmpty(data.General[val])
      ) {
        errors.splice(errors.indexOf(val), 1);
        this.setState({ errors });
      }
    });
    requiredStore.forEach((val) => {
      if (
        !errors.includes(val) &&
        !Validate.validateNotEmpty(data.Store[val])
      ) {
        errors.push(val);
        this.setState({ errors });
      } else if (
        errors.includes(val) &&
        Validate.validateNotEmpty(data.Store[val])
      ) {
        errors.splice(errors.indexOf(val), 1);
        this.setState({ errors });
      }
    });
    requiredCurrency.forEach((val) => {
      if (
        !errors.includes(val) &&
        !Validate.validateNotEmpty(data.Currency[val])
      ) {
        errors.push(val);
        this.setState({ errors });
      } else if (
        errors.includes(val) &&
        Validate.validateNotEmpty(data.Currency[val])
      ) {
        errors.splice(errors.indexOf(val), 1);
        this.setState({ errors });
      }
    });
    // if (
    //   data.Currency.ExchangeRateService.name != "" &&
    //   !errors.includes("Currency API Key") &&
    //   !Validate.validateNotEmpty(data.Currency.ExchangeRateService.APIKey)
    // ) {
    //   errors.push("Currency API Key");
    //   this.setState({ errors });
    // }
    //  else if (
    //   errors.includes("Currency API Key") &&
    //   Validate.validateNotEmpty(data.Currency.ExchangeRateService.APIKey)
    // ) {
    //   errors.splice(errors.indexOf("Currency API Key"), 1);
    //   this.setState({ errors });
    // } else if (data.Currency.ExchangeRateService.name == "") {
    //   errors.splice(errors.indexOf("Currency API Key"), 1);
    //   this.setState({ errors });
    // }
    if (
      data.Currency.AutoRefresh.Enable &&
      !errors.includes("frequency") &&
      !Validate.validateNotEmpty(data.Currency.AutoRefresh["Frequency"])
    ) {
      errors.push("frequency");
      this.setState({ errors });
    } else if (
      errors.includes("frequency") &&
      Validate.validateNotEmpty(data.Currency.AutoRefresh["Frequency"])
    ) {
      errors.splice(errors.indexOf("frequency"), 1);
      this.setState({ errors });
    } else if (
      !data.Currency.AutoRefresh.Enable &&
      errors.includes("frequency")
    ) {
      errors.splice(errors.indexOf("frequency"), 1);
      this.setState({ errors });
    }

    requiredFacebook.forEach((val) => {
      if (
        data.SocialLogins.Facebook.Status &&
        !errors.includes("facebook " + val) &&
        !Validate.validateNotEmpty(data.SocialLogins.Facebook[val])
      ) {
        errors.push("facebook " + val);
        this.setState({ errors });
      } else if (
        errors.includes("facebook " + val) &&
        Validate.validateNotEmpty(data.SocialLogins.Facebook[val])
      ) {
        errors.splice(errors.indexOf("facebook " + val), 1);
        this.setState({ errors });
      } else if (
        !data.SocialLogins.Facebook.Status &&
        errors.includes("facebook " + val)
      ) {
        errors.splice(errors.indexOf("facebook " + val), 1);
        this.setState({ errors });
      }
    });

    requiredGoogle.forEach((val) => {
      if (
        data.SocialLogins.Google.Status &&
        !errors.includes("facebook " + val) &&
        !Validate.validateNotEmpty(data.SocialLogins.Google[val])
      ) {
        errors.push("google " + val);
        this.setState({ errors });
      } else if (
        errors.includes("google " + val) &&
        Validate.validateNotEmpty(data.SocialLogins.Google[val])
      ) {
        errors.splice(errors.indexOf("google " + val), 1);
        this.setState({ errors });
      } else if (
        !data.SocialLogins.Google.Status &&
        errors.includes("google " + val)
      ) {
        errors.splice(errors.indexOf("google " + val), 1);
        this.setState({ errors });
      }
    });
    if (
      data.ShippingMethods.FreeShipping.Status &&
      !errors.includes("Free Shipping Label") &&
      !Validate.validateNotEmpty(data.ShippingMethods.FreeShipping["Label"])
    ) {
      errors.push("Free Shipping Label");
      this.setState({ errors });
    } else if (
      errors.includes("Free Shipping Label") &&
      Validate.validateNotEmpty(data.ShippingMethods.FreeShipping["Label"])
    ) {
      errors.splice(errors.indexOf("Free Shipping Label"), 1);
      this.setState({ errors });
    } else if (
      !data.ShippingMethods.FreeShipping.Status &&
      errors.includes("Free Shipping Label")
    ) {
      errors.splice(errors.indexOf("Free Shipping Label"), 1);
      this.setState({ errors });
    }
    requiredShipping.forEach((val) => {
      if (
        data.ShippingMethods.LocalPickup.Status &&
        !errors.includes("Local Shipping " + val) &&
        !Validate.validateNotEmpty(data.ShippingMethods.LocalPickup[val])
      ) {
        errors.push("Local Shipping " + val);
        this.setState({ errors });
      } else if (
        errors.includes("Local Shipping " + val) &&
        Validate.validateNotEmpty(data.ShippingMethods.LocalPickup[val])
      ) {
        errors.splice(errors.indexOf("Local Shipping " + val), 1);
        this.setState({ errors });
      } else if (
        !data.ShippingMethods.LocalPickup.Status &&
        errors.includes("Local Shipping " + val)
      ) {
        errors.splice(errors.indexOf("Local Shipping " + val), 1);
        this.setState({ errors });
      }
    });
    requiredShipping.forEach((val) => {
      if (
        data.ShippingMethods.FlatRate.Status &&
        !errors.includes("Flat Rate Shipping " + val) &&
        !Validate.validateNotEmpty(data.ShippingMethods.FlatRate[val])
      ) {
        errors.push("Flat Rate Shipping " + val);
        this.setState({ errors });
      } else if (
        errors.includes("Flat Rate Shipping " + val) &&
        Validate.validateNotEmpty(data.ShippingMethods.FlatRate[val])
      ) {
        errors.splice(errors.indexOf("Flat Rate Shipping " + val), 1);
        this.setState({ errors });
      } else if (
        !data.ShippingMethods.FlatRate.Status &&
        errors.includes("Flat Rate Shipping " + val)
      ) {
        errors.splice(errors.indexOf("Flat Rate Shipping " + val), 1);
        this.setState({ errors });
      }
    });
    Object.keys(data.PaymentMethods).forEach((key) => {
      paymentMethods.forEach((val) => {
        if (
          !errors.includes(key + " " + val) &&
          !Validate.validateNotEmpty(data.PaymentMethods[key][val])
        ) {
          errors.push(key + " " + val);
          this.setState({ errors });
        } else if (
          errors.includes(key + " " + val) &&
          Validate.validateNotEmpty(data.PaymentMethods[key][val])
        ) {
          errors.splice(errors.indexOf(key + " " + val), 1);
          this.setState({ errors });
        }
      });
    });
    
    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({submitting: true})
      api.put('/settings', {data: this.state.data, _id: this.state.id, requiredPermission: "Edit Settings"}).then(res=>{
        //console.log(res)
        this.setState({submitting: false, alertType: "success", alertMessage: "Settings updated."})

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
    } else {
      //console.log(errors);
      this.setState({ alertType: "fail", alertMessage: "Please fill the following: " + errors})
    }
  };
  tabContentToggle = () => {
    if (this.state.activePanel == "general") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">General</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Supported Countries<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      const { data } = this.state;
                      data.General.SupportedCountries = val.split(",");
                      this.setState({ data });
                    }}
                    options={countries}
                    defaultValue={this.state.data.General.SupportedCountries.toString()}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Default Country<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal2("General", "DefaultCountry", val);
                    }}
                    singleSelect={true}
                    largeData={true}
                    options={countries}
                    defaultValue={this.state.data.General.DefaultCountry}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Supported Locales<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      const { data } = this.state;
                      data.General.SupportedLocales = val.split(",");
                      this.setState({ data });
                    }}
                    options={locales}
                    defaultValue={this.state.data.General.SupportedLocales.toString()}
                  />{" "}
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Default Locale<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal2("General", "DefaultLocale", val);
                    }}
                    singleSelect={true}
                    largeData={true}
                    options={locales}
                    defaultValue={this.state.data.General.DefaultLocale}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Default TimeZone<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal2("General", "DefaultTimezone", val);
                    }}
                    singleSelect={true}
                    largeData={true}
                    options={timezone}
                    defaultValue={this.state.data.General.DefaultTimezone}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="customer_role"
                  className="col-md-3 control-label text-left"
                >
                  Customer Role<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal2("General", "CustomerRoleId", val);
                    }}
                    singleSelect={true}
                    options={this.state.customerRoles}
                    defaultValue={this.state.data.General.CustomerRoleId}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="reviews_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Reviews &amp; Ratings
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="reviews_enabled"
                      id="reviews_enabled"
                      checked={this.state.data.General.RatingsAndReviews}
                      onChange={() => {
                        const { data } = this.state;
                        data.General.RatingsAndReviews = !this.state.data
                          .General.RatingsAndReviews;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="reviews_enabled">
                      Allow customers to give reviews &amp; ratings
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="auto_approve_reviews"
                  className="col-md-3 control-label text-left"
                >
                  Auto Approve Reviews
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="auto_approve_reviews"
                      id="auto_approve_reviews"
                      checked={this.state.data.General.AutoApproveReviews}
                      onChange={() => {
                        const { data } = this.state;
                        data.General.AutoApproveReviews = !this.state.data
                          .General.AutoApproveReviews;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="auto_approve_reviews">
                      Customer reviews will be approved automatically
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="cookie_bar_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Cookie Bar
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="cookie_bar_enabled"
                      id="cookie_bar_enabled"
                      checked={this.state.data.General.CookieBar}
                      onChange={() => {
                        const { data } = this.state;
                        data.General.CookieBar = !this.state.data.General
                          .CookieBar;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="cookie_bar_enabled">
                      Show cookie bar in your website
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "maintenance") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Maintenance</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="maintenance_mode"
                  className="col-md-3 control-label text-left"
                >
                  Maintenance Mode
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="maintenance_mode"
                      id="maintenance_mode"
                      checked={this.state.data.Maintenance.MaintenanceMode}
                      onChange={() => {
                        const { data } = this.state;
                        data.Maintenance.MaintenanceMode = !this.state.data
                          .Maintenance.MaintenanceMode;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="maintenance_mode">
                      Put the application into maintenance mode
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "store") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Store</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="box-content clearfix">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store Name<span className="m-l-5 text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StoreName"
                      className="form-control "
                      type="text"
                      value={this.state.data.Store.StoreName}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store Tagline
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StoreTagline"
                      className="form-control "
                      rows={2}
                      type="text"
                      value={this.state.data.Store.StoreTagline}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store Email<span className="m-l-5 text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StoreEmail"
                      className="form-control "
                      type="text"
                      value={this.state.data.Store.StoreEmail}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store Phone<span className="m-l-5 text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StorePhone"
                      className="form-control "
                      type="text"
                      value={this.state.data.Store.StorePhone}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store Address 1
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StoreAddress1"
                      className="form-control "
                      type="text"
                      value={this.state.data.Store.StoreAddress1}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store Address 2
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StoreAddress2"
                      className="form-control "
                      type="text"
                      value={this.state.data.Store.StoreAddress2}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store City
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StoreCity"
                      className="form-control "
                      type="text"
                      value={this.state.data.Store.StoreCity}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="store_country"
                    className="col-md-3 control-label text-left"
                  >
                    Store Country
                  </label>
                  <div className="col-md-9">
                    <MultiSelect
                      onChange={(val) => {
                        this.setVal2("Store", "StoreCountry", val);
                      }}
                      singleSelect={true}
                      largeData={true}
                      options={countries}
                      defaultValue={this.state.data.Store.StoreCountry}
                    />
                  </div>
                </div>
                <div className="store-state input">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Store State
                    </label>
                    <div className="col-md-9">
                      <input
                        name="StoreState"
                        className="form-control "
                        type="text"
                        value={this.state.data.Store.StoreState}
                        onChange={(e) => {
                          this.setVal2("Store", e.target.name, e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Store Zip
                  </label>
                  <div className="col-md-9">
                    <input
                      name="StoreZip"
                      className="form-control "
                      type="text"
                      value={this.state.data.Store.StoreZip}
                      onChange={(e) => {
                        this.setVal2("Store", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="box-content clearfix">
                <h4 className="section-title">Privacy Settings</h4>
                <div className="form-group">
                  <label
                    htmlFor="store_phone_hide"
                    className="col-md-3 control-label text-left"
                  >
                    Hide Store Phone
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="store_phone_hide"
                        id="store_phone_hide"
                        checked={this.state.data.Store.HideStorePhone}
                        onChange={() => {
                          const { data } = this.state;
                          data.Store.HideStorePhone = !this.state.data.Store
                            .HideStorePhone;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="store_phone_hide">
                        Hide store phone from the storefront
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="store_email_hide"
                    className="col-md-3 control-label text-left"
                  >
                    Hide Store Email
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="store_email_hide"
                        id="store_email_hide"
                        checked={this.state.data.Store.HideStoreEmail}
                        onChange={() => {
                          const { data } = this.state;
                          data.Store.HideStoreEmail = !this.state.data.Store
                            .HideStoreEmail;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="store_email_hide">
                        Hide store email from the storefront
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "currency") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Currency</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Supported Currencies<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      const { data } = this.state;
                      data.Currency.SupportedCurrencies = val.split(",");
                      this.setState({ data });
                    }}
                    options={currencies}
                    defaultValue={this.state.data.Currency.SupportedCurrencies.toString()}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Default Currency<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal2("Currency", "DefaultCurrency", val);
                    }}
                    singleSelect={true}
                    largeData={true}
                    options={currencies}
                    defaultValue={this.state.data.Currency.DefaultCurrency}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Exchange Rate Service
                </label>
                <div className="col-md-9">
                  <select
                    name="name"
                    className="form-control custom-select-black "
                    value={this.state.data.Currency.ExchangeRateService.name}
                    onChange={(e) => {
                      this.setVal("Currency",
                      "ExchangeRateService",
                      "APIKey",
                      ""
                      )
                      this.setVal(
                        "Currency",
                        "ExchangeRateService",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  >
                    <option value="">Select Service</option>
                    <option value="Fixer">Fixer</option>
                    <option value="Forge">Forge</option>
                    <option value={"Currency Data Feed"}>
                      Currency Data Feed
                    </option>
                  </select>
                </div>
              </div>
              {this.state.data.Currency.ExchangeRateService.name != "" ? (
                <div className="currency-rate-exchange-service ">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      API/ Access Key<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="API_Key"
                        className="form-control "
                        type="password"
                        value={
                          this.state.data.Currency.ExchangeRateService.APIKey
                        }
                        onChange={(e) => {
                          this.setVal(
                            "Currency",
                            "ExchangeRateService",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="form-group">
                <label
                  htmlFor="auto_refresh_currency_rates"
                  className="col-md-3 control-label text-left"
                >
                  Auto Refresh
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="auto_refresh_currency_rates"
                      id="auto_refresh_currency_rates"
                      checked={this.state.data.Currency.AutoRefresh.Enable}
                      onChange={() => {
                        const { data } = this.state;
                        data.Currency.AutoRefresh.Enable = !this.state.data
                          .Currency.AutoRefresh.Enable;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="auto_refresh_currency_rates">
                      Enable auto-refreshing currency rates
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data.Currency.AutoRefresh.Enable ? (
                <div id="auto-refresh-frequency-field">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Frequency<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        name="Frequency"
                        className="form-control custom-select-black "
                        value={this.state.data.Currency.AutoRefresh.Frequency}
                        onChange={(e) => {
                          this.setVal(
                            "Currency",
                            "AutoRefresh",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      >
                        <option value="">Please Select</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "sms") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">SMS</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="box-content clearfix">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    SMS From
                  </label>
                  <div className="col-md-9">
                    <input
                      name="SMSFrom"
                      className="form-control "
                      type="text"
                      value={this.state.data.SMS.SMSFrom}
                      onChange={(e) => {
                        this.setVal2("SMS", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="sms_service"
                    className="col-md-3 control-label text-left"
                  >
                    SMS Service
                  </label>
                  <div className="col-md-9">
                    <select
                      name="name"
                      className="form-control custom-select-black "
                      id="sms_service"
                      value={this.state.data.SMS.SMSService.name}
                      onChange={(e) => {
                        this.setVal(
                          "SMS",
                          "SMSService",
                          e.target.name,
                          e.target.value
                        );
                        this.setVal("SMS", "SMSService", "API_KEY", "");
                        this.setVal("SMS", "SMSService", "APISecret", "");
                      }}
                    >
                      <option value>Select Service</option>
                      <option value="vonage">Vonage</option>
                      <option value="twilio">Twilio</option>
                    </select>
                  </div>
                </div>
                {this.state.data.SMS.SMSService.name == "vonage" ? (
                  <div className="sms-service ">
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        API Key<span className="m-l-5 text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          name="API_KEY"
                          className="form-control "
                          type="text"
                          value={this.state.data.SMS.SMSService.API_KEY}
                          onChange={(e) => {
                            this.setVal(
                              "SMS",
                              "SMSService",
                              e.target.name,
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        API Secret<span className="m-l-5 text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          name="APISecret"
                          className="form-control "
                          type="password"
                          value={this.state.data.SMS.SMSService.APISecret}
                          onChange={(e) => {
                            this.setVal(
                              "SMS",
                              "SMSService",
                              e.target.name,
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.state.data.SMS.SMSService.name == "twilio" ? (
                  <div className="sms-service ">
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        Account SID<span className="m-l-5 text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          name="API_KEY"
                          className="form-control "
                          type="text"
                          value={this.state.data.SMS.SMSService.API_KEY}
                          onChange={(e) => {
                            this.setVal(
                              "SMS",
                              "SMSService",
                              e.target.name,
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        Auth Token<span className="m-l-5 text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          name="APISecret"
                          className="form-control "
                          type="password"
                          value={this.state.data.SMS.SMSService.APISecret}
                          onChange={(e) => {
                            this.setVal(
                              "SMS",
                              "SMSService",
                              e.target.name,
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="box-content clearfix">
                <h4 className="section-title">
                  Customer Notification Settings
                </h4>
                <div className="form-group">
                  <label
                    htmlFor="welcome_sms"
                    className="col-md-3 control-label text-left"
                  >
                    Welcome SMS
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="welcome_sms"
                        id="welcome_sms"
                        checked={this.state.data.SMS.WelcomeSMS}
                        onChange={() => {
                          const { data } = this.state;
                          data.SMS.WelcomeSMS = !this.state.data.SMS.WelcomeSMS;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="welcome_sms">
                        Send welcome SMS after registration
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-content clearfix">
                <h4 className="section-title">Order Notification Settings</h4>
                <div className="form-group">
                  <label
                    htmlFor="new_order_admin_sms"
                    className="col-md-3 control-label text-left"
                  >
                    New Order Admin SMS
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="new_order_admin_sms"
                        id="new_order_admin_sms"
                        checked={this.state.data.SMS.NewOrderAdminSMS}
                        onChange={() => {
                          const { data } = this.state;
                          data.SMS.NewOrderAdminSMS = !this.state.data.SMS
                            .NewOrderAdminSMS;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="new_order_admin_sms">
                        Send new order notification to the admin
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="new_order_sms"
                    className="col-md-3 control-label text-left"
                  >
                    New Order SMS
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="new_order_sms"
                        id="new_order_sms"
                        checked={this.state.data.SMS.NewOrderSMS}
                        onChange={() => {
                          const { data } = this.state;
                          data.SMS.NewOrderSMS = !this.state.data.SMS
                            .NewOrderSMS;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="new_order_sms">
                        Send new order notification to the customer
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    SMS Order Statuses
                  </label>
                  <div className="col-md-9">
                    <MultiSelect
                      onChange={(val) => {
                        const { data } = this.state;
                        data.SMS.SMSOrderStatuses = val.split(",");
                        this.setState({ data });
                      }}
                      options={[
                        { label: "Canceled", value: "Canceled" },
                        { label: "Completed", value: "Completed" },
                        { label: "On Hold", value: "On Hold" },
                        { label: "Pending", value: "Pending" },
                        { label: "Pending Payment", value: "Pending Payment" },
                        { label: "Processing", value: "Processing" },
                        { label: "Refunded", value: "Refunded" },
                      ]}
                      defaultValue={this.state.data.SMS.SMSOrderStatuses.toString()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "mail") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Mail</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="box-content clearfix">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Mail From Address
                  </label>
                  <div className="col-md-9">
                    <input
                      name="MailFromAddress"
                      className="form-control "
                      type="text"
                      value={this.state.data.Mail.MailFromAddress}
                      onChange={(e) => {
                        this.setVal2("Mail", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Mail From Name
                  </label>
                  <div className="col-md-9">
                    <input
                      name="MailFromName"
                      className="form-control "
                      type="text"
                      value={this.state.data.Mail.MailFromName}
                      onChange={(e) => {
                        this.setVal2("Mail", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Mail Host
                  </label>
                  <div className="col-md-9">
                    <input
                      name="MailHost"
                      className="form-control "
                      type="text"
                      value={this.state.data.Mail.MailHost}
                      onChange={(e) => {
                        this.setVal2("Mail", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Mail Port
                  </label>
                  <div className="col-md-9">
                    <input
                      name="MailPort"
                      className="form-control "
                      type="text"
                      value={this.state.data.Mail.MailPort}
                      onChange={(e) => {
                        this.setVal2("Mail", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Mail Username
                  </label>
                  <div className="col-md-9">
                    <input
                      name="MailUsername"
                      className="form-control "
                      type="text"
                      value={this.state.data.Mail.MailUsername}
                      onChange={(e) => {
                        this.setVal2("Mail", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Mail Password
                  </label>
                  <div className="col-md-9">
                    <input
                      name="MailPassword"
                      className="form-control "
                      type="password"
                      value={this.state.data.Mail.MailPassword}
                      onChange={(e) => {
                        this.setVal2("Mail", e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Mail Encryption
                  </label>
                  <div className="col-md-9">
                    <select
                      name="MailEncryption"
                      className="form-control custom-select-black "
                      value={this.state.data.Mail.MailEncryption}
                      onChange={(e) => {
                        this.setVal2("Mail", e.target.name, e.target.value);
                      }}
                    >
                      <option value="">Please Select</option>
                      <option value="SSL">SSL</option>
                      <option value="Tls">Tls</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="box-content clearfix">
                <h4 className="section-title">
                  Customer Notification Settings
                </h4>
                <div className="form-group">
                  <label
                    htmlFor="welcome_email"
                    className="col-md-3 control-label text-left"
                  >
                    Welcome Email
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="welcome_email"
                        id="welcome_email"
                        checked={this.state.data.Mail.WelcomeEmail}
                        onChange={() => {
                          const { data } = this.state;
                          data.Mail.WelcomeEmail = !this.state.data.Mail
                            .WelcomeEmail;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="welcome_email">
                        Send welcome email after registration
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-content clearfix">
                <h4 className="section-title">Order Notification Settings</h4>
                <div className="form-group">
                  <label
                    htmlFor="admin_order_email"
                    className="col-md-3 control-label text-left"
                  >
                    New Order Admin Email
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="admin_order_email"
                        id="admin_order_email"
                        checked={this.state.data.Mail.NewOrderAdminEmail}
                        onChange={() => {
                          const { data } = this.state;
                          data.Mail.NewOrderAdminEmail = !this.state.data.Mail
                            .NewOrderAdminEmail;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="admin_order_email">
                        Send new order notification to the admin
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="invoice_email"
                    className="col-md-3 control-label text-left"
                  >
                    Invoice Email
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="invoice_email"
                        id="invoice_email"
                        checked={this.state.data.Mail.InvoiceEmail}
                        onChange={() => {
                          const { data } = this.state;
                          data.Mail.InvoiceEmail = !this.state.data.Mail
                            .InvoiceEmail;
                          this.setState({ data });
                        }}
                      />
                      <label htmlFor="invoice_email">
                        Send invoice email to the customer after checkout
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="email_order_statuses[]"
                    className="col-md-3 control-label text-left"
                  >
                    Email Order Statuses
                  </label>
                  <div className="col-md-9">
                    <MultiSelect
                      onChange={(val) => {
                        const { data } = this.state;
                        data.Mail.EmailOrderStatuses = val.split(",");
                        this.setState({ data });
                      }}
                      options={[
                        { label: "Canceled", value: "Canceled" },
                        { label: "Completed", value: "Completed" },
                        { label: "On Hold", value: "On Hold" },
                        { label: "Pending", value: "Pending" },
                        { label: "Pending Payment", value: "Pending Payment" },
                        { label: "Processing", value: "Processing" },
                        { label: "Refunded", value: "Refunded" },
                      ]}
                      defaultValue={this.state.data.Mail.EmailOrderStatuses.toString()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "newsletter") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Newsletter</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="newsletter_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Newsletter
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="newsletter_enabled"
                      id="newsletter_enabled"
                      checked={this.state.data.Newsletter.Newsletter}
                      onChange={() => {
                        const { data } = this.state;
                        data.Newsletter.Newsletter = !this.state.data.Newsletter
                          .Newsletter;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="newsletter_enabled">
                      Allow customers to subscribe to your newsletter
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data.Newsletter.Newsletter ? (
                <div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Mailchimp API Key
                    </label>
                    <div className="col-md-9">
                      <input
                        name="MailchimpAPIkey"
                        className="form-control "
                        type="password"
                        value={this.state.data.Newsletter.MailchimpAPIkey}
                        onChange={(e) => {
                          this.setVal2(
                            "Newsletter",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Mailchimp List ID
                    </label>
                    <div className="col-md-9">
                      <input
                        name="MailchimpListID"
                        className="form-control "
                        type="text"
                        value={this.state.data.Newsletter.MailchimpListID}
                        onChange={(e) => {
                          this.setVal2(
                            "Newsletter",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "customcssjs") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Custom CSS/JS</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Header
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Header"
                    className="form-control "
                    rows={10}
                    cols={10}
                    value={this.state.data.CustomCSSJS.Header}
                    onChange={(e) => {
                      this.setVal2(
                        "CustomCSSJS",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Footer
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Footer"
                    className="form-control "
                    rows={10}
                    cols={10}
                    value={this.state.data.CustomCSSJS.Footer}
                    onChange={(e) => {
                      this.setVal2(
                        "CustomCSSJS",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "facebook") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Facebook</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="facebook_login_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="facebook_login_enabled"
                      id="facebook_login_enabled"
                      checked={this.state.data.SocialLogins.Facebook.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.SocialLogins.Facebook.Status = !this.state.data
                          .SocialLogins.Facebook.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="facebook_login_enabled">
                      Enable Facebook Login
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data.SocialLogins.Facebook.Status ? (
                <div id="facebook-login-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      App ID<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="AppID"
                        className="form-control "
                        type="text"
                        value={this.state.data.SocialLogins.Facebook.AppID}
                        onChange={(e) => {
                          this.setVal(
                            "SocialLogins",
                            "Facebook",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      App Secret<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="Appsecret"
                        className="form-control "
                        type="password"
                        value={this.state.data.SocialLogins.Facebook.Appsecret}
                        onChange={(e) => {
                          this.setVal(
                            "SocialLogins",
                            "Facebook",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      CallBack URL<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="CallBackUrl"
                        className="form-control "
                        type="text"
                        value={this.state.data.SocialLogins.Facebook.CallBackUrl}
                        onChange={(e) => {
                          this.setVal(
                            "SocialLogins",
                            "Facebook",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "google") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Google</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="google_login_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="google_login_enabled"
                      id="google_login_enabled"
                      checked={this.state.data.SocialLogins.Google.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.SocialLogins.Google.Status = !this.state.data
                          .SocialLogins.Google.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="google_login_enabled">
                      Enable Google Login
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data.SocialLogins.Google.Status ? (
                <div id="google-login-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Client ID<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="ClientID"
                        className="form-control "
                        type="text"
                        value={this.state.data.SocialLogins.Google.ClientID}
                        onChange={(e) => {
                          this.setVal(
                            "SocialLogins",
                            "Google",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Client Secret<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="ClientSecret"
                        className="form-control "
                        type="password"
                        value={this.state.data.SocialLogins.Google.ClientSecret}
                        onChange={(e) => {
                          this.setVal(
                            "SocialLogins",
                            "Google",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      CallBack URL<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="CallBackUrl"
                        className="form-control "
                        type="text"
                        value={this.state.data.SocialLogins.Google.CallBackUrl}
                        onChange={(e) => {
                          this.setVal(
                            "SocialLogins",
                            "Google",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "freeshipping") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Free Shipping</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="free_shipping_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="free_shipping_enabled"
                      checked={
                        this.state.data.ShippingMethods.FreeShipping.Status
                      }
                      onChange={() => {
                        const { data } = this.state;
                        data.ShippingMethods.FreeShipping.Status = !this.state
                          .data.ShippingMethods.FreeShipping.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="free_shipping_enabled">
                      Enable Free Shipping
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.ShippingMethods.FreeShipping.Label}
                    onChange={(e) => {
                      this.setVal(
                        "ShippingMethods",
                        "FreeShipping",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Minimum Amount
                </label>
                <div className="col-md-9">
                  <input
                    name="MinimumAmount"
                    className="form-control "
                    type="number"
                    value={
                      this.state.data.ShippingMethods.FreeShipping
                        .MinimumAmount == null
                        ? ""
                        : this.state.data.ShippingMethods.FreeShipping
                            .MinimumAmount
                    }
                    onChange={(e) => {
                      this.setVal(
                        "ShippingMethods",
                        "FreeShipping",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "localpickup") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Local Pickup</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="local_pickup_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="local_pickup_enabled"
                      checked={
                        this.state.data.ShippingMethods.LocalPickup.Status
                      }
                      onChange={() => {
                        const { data } = this.state;
                        data.ShippingMethods.LocalPickup.Status = !this.state
                          .data.ShippingMethods.LocalPickup.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="local_pickup_enabled">
                      Enable Local Pickup
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.ShippingMethods.LocalPickup.Label}
                    onChange={(e) => {
                      this.setVal(
                        "ShippingMethods",
                        "LocalPickup",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Cost<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Cost"
                    className="form-control "
                    min={0}
                    type="number"
                    value={this.state.data.ShippingMethods.LocalPickup.Cost}
                    onChange={(e) => {
                      this.setVal(
                        "ShippingMethods",
                        "LocalPickup",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "flatrate") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Flat Rate</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="flat_rate_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="flat_rate_enabled"
                      checked={this.state.data.ShippingMethods.FlatRate.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.ShippingMethods.FlatRate.Status = !this.state.data
                          .ShippingMethods.FlatRate.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="flat_rate_enabled">Enable Flat Rate</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.ShippingMethods.FlatRate.Label}
                    onChange={(e) => {
                      this.setVal(
                        "ShippingMethods",
                        "FlatRate",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Cost<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Cost"
                    className="form-control "
                    min={0}
                    type="number"
                    value={this.state.data.ShippingMethods.FlatRate.Cost}
                    onChange={(e) => {
                      this.setVal(
                        "ShippingMethods",
                        "FlatRate",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "paypal") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">PayPal</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="paypal_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="paypal_enabled"
                      checked={this.state.data.PaymentMethods.Paypal.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Paypal.Status = !this.state.data
                          .PaymentMethods.Paypal.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="paypal_enabled">Enable PayPal</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.PaymentMethods.Paypal.Label}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Paypal",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="translatable[paypal_description]"
                  className="col-md-3 control-label text-left"
                >
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={this.state.data.PaymentMethods.Paypal.Description}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Paypal",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="paypal_test_mode"
                  className="col-md-3 control-label text-left"
                >
                  Sandbox
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Sandbox"
                      id="paypal_test_mode"
                      checked={this.state.data.PaymentMethods.Paypal.Sandbox}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Paypal.Sandbox = !this.state.data
                          .PaymentMethods.Paypal.Sandbox;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="paypal_test_mode">
                      Use sandbox for test payments
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data.PaymentMethods.Paypal.Status ? (
                <div id="paypal-fields">
                  <div className="form-group">
                    <label
                      htmlFor="paypal_client_id"
                      className="col-md-3 control-label text-left"
                    >
                      Client ID<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="ClientId"
                        className="form-control "
                        type="text"
                        value={this.state.data.PaymentMethods.Paypal.ClientId}
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Paypal",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="paypal_secret"
                      className="col-md-3 control-label text-left"
                    >
                      Secret<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="Secret"
                        className="form-control "
                        type="password"
                        value={this.state.data.PaymentMethods.Paypal.Secret}
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Paypal",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "stripe") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Stripe</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="stripe_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="stripe_enabled"
                      checked={this.state.data.PaymentMethods.Stripe.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Stripe.Status = !this.state.data
                          .PaymentMethods.Stripe.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="stripe_enabled">Enable Stripe</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.PaymentMethods.Stripe.Label}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Stripe",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={this.state.data.PaymentMethods.Stripe.Description}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Stripe",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              {this.state.data.PaymentMethods.Stripe.Status ? (
                <div id="stripe-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Publishable Key<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="PublishableKey"
                        className="form-control "
                        type="text"
                        value={
                          this.state.data.PaymentMethods.Stripe.PublishableKey
                        }
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Stripe",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Secret Key<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="SecretKey"
                        className="form-control "
                        type="password"
                        value={this.state.data.PaymentMethods.Stripe.SecretKey}
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Stripe",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "paytm") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Paytm</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="paytm_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="paytm_enabled"
                      checked={this.state.data.PaymentMethods.Paytm.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Paytm.Status = !this.state.data
                          .PaymentMethods.Paytm.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="paytm_enabled">Enable Paytm</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.PaymentMethods.Paytm.Label}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Paytm",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={this.state.data.PaymentMethods.Paytm.Description}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Paytm",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="paytm_test_mode"
                  className="col-md-3 control-label text-left"
                >
                  Sandbox
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Sandbox"
                      id="paytm_test_mode"
                      checked={this.state.data.PaymentMethods.Paytm.Sandbox}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Paytm.Sandbox = !this.state.data
                          .PaymentMethods.Paytm.Sandbox;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="paytm_test_mode">
                      Use sandbox for test payments
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data.PaymentMethods.Paytm.Status ? (
                <div id="paytm-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Merchant ID<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="MerchantID"
                        className="form-control "
                        type="text"
                        value={this.state.data.PaymentMethods.Paytm.MerchantID}
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Paytm",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Merchant Key<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="MerchantKey"
                        className="form-control "
                        type="password"
                        value={this.state.data.PaymentMethods.Paytm.MerchantKey}
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Paytm",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "razorpay") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Razorpay</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="razorpay_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="razorpay_enabled"
                      checked={this.state.data.PaymentMethods.Razorpay.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Razorpay.Status = !this.state.data
                          .PaymentMethods.Razorpay.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="razorpay_enabled">Enable Razorpay</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.PaymentMethods.Razorpay.Label}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Razorpay",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={this.state.data.PaymentMethods.Razorpay.Description}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Razorpay",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              {this.state.data.PaymentMethods.Razorpay.Status ? (
                <div id="razorpay-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Key Id<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="KeyID"
                        className="form-control "
                        type="text"
                        value={this.state.data.PaymentMethods.Razorpay.KeyID}
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Razorpay",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Key Secret<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="KeySecret"
                        className="form-control "
                        type="password"
                        value={
                          this.state.data.PaymentMethods.Razorpay.KeySecret
                        }
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Razorpay",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "instamojo") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Instamojo</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="instamojo_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="instamojo_enabled"
                      checked={this.state.data.PaymentMethods.Instamojo.Status}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Instamojo.Status = !this.state.data
                          .PaymentMethods.Instamojo.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="instamojo_enabled">Enable Instamojo</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.PaymentMethods.Instamojo.Label}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Instamojo",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={this.state.data.PaymentMethods.Instamojo.Description}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "Instamojo",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="instamojo_test_mode"
                  className="col-md-3 control-label text-left"
                >
                  Sandbox
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Sandbox"
                      id="instamojo_test_mode"
                      checked={this.state.data.PaymentMethods.Instamojo.Sandbox}
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.Instamojo.Sandbox = !this.state.data
                          .PaymentMethods.Instamojo.Sandbox;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="instamojo_test_mode">
                      Use sandbox for test payments
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data.PaymentMethods.Instamojo.Status ? (
                <div id="instamojo-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      API Key<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="APIKey"
                        className="form-control "
                        type="text"
                        value={this.state.data.PaymentMethods.Razorpay.APIKey}
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Instamojo",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Auth Token<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        name="AuthToken"
                        className="form-control "
                        type="password"
                        value={
                          this.state.data.PaymentMethods.Instamojo.AuthToken
                        }
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "Instamojo",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "cash") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Cash On Delivery</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="cod_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="cod_enabled"
                      checked={
                        this.state.data.PaymentMethods.CashonDelivery.Status
                      }
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.CashonDelivery.Status = !this.state
                          .data.PaymentMethods.CashonDelivery.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="cod_enabled">Enable Cash On Delivery</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.PaymentMethods.CashonDelivery.Label}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "CashonDelivery",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={
                      this.state.data.PaymentMethods.CashonDelivery.Description
                    }
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "CashonDelivery",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "banktransfer") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Bank Transfer</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="bank_transfer_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="bank_transfer_enabled"
                      checked={
                        this.state.data.PaymentMethods.BankTransfer.Status
                      }
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.BankTransfer.Status = !this.state
                          .data.PaymentMethods.BankTransfer.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="bank_transfer_enabled">
                      Enable Bank Transfer
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={this.state.data.PaymentMethods.BankTransfer.Label}
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "BankTransfer",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={
                      this.state.data.PaymentMethods.BankTransfer.Description
                    }
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "BankTransfer",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              {this.state.data.PaymentMethods.BankTransfer.Status ? (
                <div id="bank-transfer-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Instructions<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <textarea
                        name="Instructions"
                        className="form-control "
                        rows={3}
                        cols={10}
                        value={
                          this.state.data.PaymentMethods.BankTransfer
                            .Instructions
                        }
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "BankTransfer",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "check") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Check / Money Order</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="check_payment_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="Status"
                      id="check_payment_enabled"
                      checked={
                        this.state.data.PaymentMethods.ChequeMoneyOrder.Status
                      }
                      onChange={() => {
                        const { data } = this.state;
                        data.PaymentMethods.ChequeMoneyOrder.Status = !this
                          .state.data.PaymentMethods.ChequeMoneyOrder.Status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="check_payment_enabled">
                      Enable Check / Money Order
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Label<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="Label"
                    className="form-control "
                    type="text"
                    value={
                      this.state.data.PaymentMethods.ChequeMoneyOrder.Label
                    }
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "ChequeMoneyOrder",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Description<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <textarea
                    name="Description"
                    className="form-control "
                    rows={3}
                    cols={10}
                    value={
                      this.state.data.PaymentMethods.ChequeMoneyOrder
                        .Description
                    }
                    onChange={(e) => {
                      this.setVal(
                        "PaymentMethods",
                        "ChequeMoneyOrder",
                        e.target.name,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              {this.state.data.PaymentMethods.ChequeMoneyOrder ? (
                <div id="check-payment-fields">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Instructions<span className="m-l-5 text-red">*</span>
                    </label>
                    <div className="col-md-9">
                      <textarea
                        name="Instructions"
                        className="form-control "
                        rows={3}
                        cols={10}
                        value={
                          this.state.data.PaymentMethods.ChequeMoneyOrder
                            .Instructions
                        }
                        onChange={(e) => {
                          this.setVal(
                            "PaymentMethods",
                            "ChequeMoneyOrder",
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    }
  };
  render() {
    return (
      <div>
        <section className="content-header clearfix">
          <h3>Settings</h3>
          <ol className="breadcrumb">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li className="active">Settings</li>
          </ol>
        </section>
        <Loading show={this.state.submitting} />
        <section className="content">
        {getMessage(this.state.alertType, this.state.alertMessage, this.onClose)}
          <form className="form-horizontal">
            <div className="accordion-content clearfix">
              <div className="col-lg-3 col-md-4">
                <div className="accordion-box">
                  <div className="panel-group">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a
                            className={
                              this.state.activeTab == "generalsettings"
                                ? ""
                                : "collapsed"
                            }
                            data-toggle="collapse"
                            onClick={() => {
                              if (this.state.activeTab == "generalsettings") {
                                this.setState({ activeTab: "none" });
                              } else {
                                this.setState({ activeTab: "generalsettings" });
                              }
                            }}
                          >
                            General Settings
                          </a>
                        </h4>
                      </div>
                      <div
                        className={
                          this.state.activeTab == "generalsettings"
                            ? "panel-collapse collapse in"
                            : "panel-collapse collapse"
                        }
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li
                              className={
                                this.state.activePanel == "general"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "general" });
                              }}
                            >
                              <a data-toggle="tab">General</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "maintenance"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "maintenance" });
                              }}
                            >
                              <a data-toggle="tab">Maintenance</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "store"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "store" });
                              }}
                            >
                              <a data-toggle="tab">Store</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "currency"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "currency" });
                              }}
                            >
                              <a data-toggle="tab">Currency</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "sms" ? "active" : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "sms" });
                              }}
                            >
                              <a data-toggle="tab">SMS</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "mail" ? "active" : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "mail" });
                              }}
                            >
                              <a data-toggle="tab">Mail</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "newsletter"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "newsletter" });
                              }}
                            >
                              <a data-toggle="tab">NewsLetter</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "customcssjs"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "customcssjs" });
                              }}
                            >
                              <a data-toggle="tab">Custom CSS/JS</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a
                            className={
                              this.state.activeTab == "sociallogins"
                                ? ""
                                : "collapsed"
                            }
                            data-toggle="collapse"
                            onClick={() => {
                              if (this.state.activeTab == "sociallogins") {
                                this.setState({ activeTab: "none" });
                              } else {
                                this.setState({ activeTab: "sociallogins" });
                              }
                            }}
                          >
                            Social Logins
                          </a>
                        </h4>
                      </div>
                      <div
                        className={
                          this.state.activeTab == "sociallogins"
                            ? "panel-collapse collapse in"
                            : "panel-collapse collapse"
                        }
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li
                              className={
                                this.state.activePanel == "facebook"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "facebook" });
                              }}
                            >
                              <a data-toggle="tab">Facebook</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "google"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "google" });
                              }}
                            >
                              <a data-toggle="tab">Google</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a
                            className={
                              this.state.activeTab == "shippingmethods"
                                ? ""
                                : "collapsed"
                            }
                            data-toggle="collapse"
                            onClick={() => {
                              if (this.state.activeTab == "shippingmethods") {
                                this.setState({ activeTab: "none" });
                              } else {
                                this.setState({ activeTab: "shippingmethods" });
                              }
                            }}
                          >
                            Shipping Methods
                          </a>
                        </h4>
                      </div>
                      <div
                        className={
                          this.state.activeTab == "shippingmethods"
                            ? "panel-collapse collapse in"
                            : "panel-collapse collapse"
                        }
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li
                              className={
                                this.state.activePanel == "freeshipping"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "freeshipping" });
                              }}
                            >
                              <a data-toggle="tab">Free Shipping</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "localpickup"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "localpickup" });
                              }}
                            >
                              <a data-toggle="tab">Local Pickup</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "flatrate"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "flatrate" });
                              }}
                            >
                              <a data-toggle="tab">Flat Rate</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a
                            className={
                              this.state.activeTab == "paymentmethods"
                                ? ""
                                : "collapsed"
                            }
                            data-toggle="collapse"
                            onClick={() => {
                              if (this.state.activeTab == "paymentmethods") {
                                this.setState({ activeTab: "none" });
                              } else {
                                this.setState({ activeTab: "paymentmethods" });
                              }
                            }}
                          >
                            Payment Methods
                          </a>
                        </h4>
                      </div>
                      <div
                        className={
                          this.state.activeTab == "paymentmethods"
                            ? "panel-collapse collapse in"
                            : "panel-collapse collapse"
                        }
                      >
                        <div className="panel-body">
                          <ul className="accordion-tab nav nav-tabs">
                            <li
                              className={
                                this.state.activePanel == "paypal"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "paypal" });
                              }}
                            >
                              <a data-toggle="tab">PayPal</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "stripe"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "stripe" });
                              }}
                            >
                              <a data-toggle="tab">Stripe</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "paytm"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "paytm" });
                              }}
                            >
                              <a data-toggle="tab">Paytm</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "razorpay"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "razorpay" });
                              }}
                            >
                              <a data-toggle="tab">Razorpay</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "instamojo"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "instamojo" });
                              }}
                            >
                              <a data-toggle="tab">Instamojo</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "cash" ? "active" : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "cash" });
                              }}
                            >
                              <a data-toggle="tab">Cash On Delivery</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "banktransfer"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "banktransfer" });
                              }}
                            >
                              <a data-toggle="tab">Bank Transfer</a>
                            </li>
                            <li
                              className={
                                this.state.activePanel == "check"
                                  ? "active"
                                  : ""
                              }
                              onClick={(e) => {
                                this.setState({ activePanel: "check" });
                              }}
                            >
                              <a data-toggle="tab">Check / Money Order</a>
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
                      <div className="col-md-offset-2 col-md-10" >
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
    );
  }
}

export default Settings;
