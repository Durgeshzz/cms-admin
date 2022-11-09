import React from "react";
import { Link, withRouter } from "react-router-dom";
import api from "../../../apis/api";
import Validate from "../../../utils/validation";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import FileManager from "../../Media/FileManager";
import Loading from "../../Loading";
import { siteUrl } from "../../../utils/utils";
import { toast } from "react-toastify";
import { getMessage } from "../../AlertMessage";

class StoreFront extends React.Component {
  state = {
    showModal: false,
    multiple: false,
    submitting: false,
    imageFor: "",
    activePanel: "general",
    activeTab: "generalsettings",
    pagesOptions: [],
    sliderOptions: [],
    tagOptions: [],
    categoryOptions: [],
    brandsOptions: [],
    productOptions: [],
    menuOptions: [],
    flashsaleOptions: [],
    data: {
      SocialLinks: {
        Facebook: "",
        Twitter: "",
        Instagram: "",
        Youtube: "",
      },
      Features: {
        SectionStatus: false,
        Features: [
          {
            Title: "",
            SubTitle: "",
            Icon: "",
          },
          {
            Title: "",
            SubTitle: "",
            Icon: "",
          },
          {
            Title: "",
            SubTitle: "",
            Icon: "",
          },
          {
            Title: "",
            SubTitle: "",
            Icon: "",
          },
        ],
      },
      Newsletter: {
        BackgroundImageId: "",
        image: "",
      },
      Logo: {
        FaviconId: "",
        HeaderLogoId: "",
        MailLogoId: "",
        image: {
          FaviconId: "",
          MailLogoId: "",
          MailLogoId: "",
        },
      },
      ProductPage: {
        CalltoActionURL: "",
        OpenInNewWindow: false,
        ImageId: "",
        image: "",
      },
      General: {
        WelcomeText: "",
        ThemeColor: "",
        CustomThemeColor: "#000000",
        MailThemeColor: "",
        CustomMailThemeColor: "#000000",
        SliderId: "",
        Address: "",
        TermsConditionsPageId: "",
        PrivacyPolicyPageId: "",
      },
      Footer: {
        FooterTagsIds: [],
        FooterCopyrightText: "",
        AcceptedPaymentMethodsImageId: "",
        image: "",
      },
      "Slider Banners": {
        Name: "Slider Banners",
        Banners: [
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
        ],
      },
      "Three Column Full Width Banners": {
        Name: "Three Column Full Width Banners",
        SectionStatus: false,
        BackgroundId: "",
        BackgroundIdImage: "",
        Banners: [
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
        ],
      },
      "Two column banners": {
        Name: "Two column banners",
        SectionStatus: false,
        Banners: [
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
        ],
      },
      "Three Column Banners": {
        Name: "Three Column Banners",
        SectionStatus: false,
        Banners: [
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
        ],
      },
      "One Column Banner": {
        Name: "One Column Banner",
        SectionStatus: false,
        Banners: [
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
        ],
      },
      "Six Column Banner": {
        Name: "Six Column Banner",
        SectionStatus: false,
        Banners: [
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
          {
            CalltoActionURL: "",
            OpenInNewWindow: false,
            ImageId: "",
            image: "",
          },
        ],
      },
      FeaturedCategories: {
        SectionStatus: true,
        SectionTitle: "",
        SectionSubtitle: "",
        Categories: [
          {
            CategoryId: "",
            Type: "",
            ProductIds: [],
          },
          {
            CategoryId: "",
            Type: "",
            ProductIds: [],
          },
          {
            CategoryId: "",
            Type: "",
            ProductIds: [],
          },
          {
            CategoryId: "",
            Type: "",
            ProductIds: [],
          },
          // {
          //   CategoryId: "",
          //   Type: "",
          //   ProductIds: [],
          // },
          // {
          //   CategoryId: "",
          //   Type: "",
          //   ProductIds: [],
          // },
        ],
      },
      TopBrands: {
        TopBrandsIds: [],
        SectionStatus: false,
      },
      TopCategories: {
        TopCategoriesIds: [],
        SectionStatus: false,
      },
      "Product Tabs One": {
        Name: "Product Tabs One",
        SectionStatus: false,
        Tabs: [
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
        ],
      },
      "Product Tabs Two": {
        Name: "Product Tabs Two",
        SectionStatus: false,
        Title: "",
        Tabs: [
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
        ],
      },
      "Product Grid": {
        Name: "Product Grid",
        SectionStatus: false,
        Tabs: [
          {
            Title: "",
            Type: "",
            CategoryId: "",
            Category: {},
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            Category: {},
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            Category: {},
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            Category: {},
            ProductIds: [],
          },
        ],
      },
      "Product Most Viewed": {
        Name: "Product Most Viewed",
        SectionStatus: false,
        Title: "",
        Tabs: [
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          }
        ],
      },
      FlashSaleVerticalProducts: {
        Title: "",
        ActiveCampaignId: "",
        SectionStatus: true,
        VerticalProducts: [
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
          {
            Title: "",
            Type: "",
            CategoryId: "",
            ProductsLimit: "",
            ProductIds: [],
          },
        ],
      },
      Menus: {
        NavbarText: "",
        FooterMenuOneTitle: "",
        FooterMenuTwoTitle: "",
        PrimaryMenuId: "",
        CategoryMenuId: "",
        FooterMenuOneId: "",
        FooterMenuTwoId: "",
      },
    },
    clientReviewData: {
      title: "",
      sectionstatus: false,
      banners: [
        {
          img: "",
          image:"",
          smallimage:"",
          smallimg: "",
          title: "",
          body: "",
        },
        {
          img: "",
          image:"",
          smallimage:"",
          smallimg: "",
          title: "",
          body: "",
        },
        {
          img: "",
          image:"",
          smallimage:"",
          smallimg: "",
          title: "",
          body: "",
        },
        {
          img: "",
          image:"",
          smallimage:"",
          smallimg: "",
          title: "",
          body: "",
        },
        {
          img: "",
          image:"",
          smallimage:"",
          smallimg: "",
          title: "",
          body: "",
        },
        {
          img: "",
          image:"",
          smallimage:"",
          smallimg: "",
          title: "",
          body: "",
        }
      ],
    },
    _id: "",
    errors: [],
    alertType: "",
    alertMessage: "",
  };
  onClose = () => {
    this.setState({ alertMessage: "", alertType: "" });
  };
  componentDidMount() {
    this.setState({ submitting: true });

    api
      .post("page/get")
      .then((res) => {
        const { pagesOptions } = this.state;
        res.data.data.forEach((val) => {
          let tmp = {
            label: val.name,
            value: val._id,
          };
          if (val.status) pagesOptions.push(tmp);
        });
        this.setState({ pagesOptions });
      })
      .catch((err) => {
        console.log("error fetching pages");
      });
    api
      .post("/slides/get")
      .then((res) => {
        const { sliderOptions } = this.state;
        res.data.data.forEach((val) => {
          let tmp = {
            label: val.Name,
            value: val._id,
          };
          sliderOptions.push(tmp);
        });
        this.setState({ sliderOptions });
      })
      .catch((err) => {
        console.log("error fetching sliders");
      });
    api
      .post("/tag/get")
      .then((res) => {
        const { tagOptions } = this.state;
        res.data.data.forEach((val) => {
          let tmp = {
            label: val.name,
            value: val._id,
          };
          tagOptions.push(tmp);
        });
        this.setState({ tagOptions });
      })
      .catch((err) => {
        console.log("error fetching tags");
      });
    const { categoryOptions } = this.state;
    const addToCategories = (x, sub) => {
      let tmp = {};
      let name = "";
      for (var i = 0; i < sub.length; i++) {
        name += "|-- ";
      }
      tmp["label"] = name + x.name;
      tmp["value"] = x._id;
      categoryOptions.push(tmp);
      if (x.childrenCategory.length > 0) {
        sub.push("sub");
        x.childrenCategory.forEach((y) => {
          addToCategories(y, sub);
        });
      } else {
        return;
      }
    };
    api
      .get("/category/get")
      .then((res) => {
        res.data.data.forEach((val) => {
          addToCategories(val, []);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.setState({ categoryOptions });

    api
      .post("/brand/get/")
      .then((res) => {
        const { brandsOptions } = this.state;
        res.data.data.forEach((val) => {
          let tmp = {
            label: val.name,
            value: val._id,
          };
          if (val.status) brandsOptions.push(tmp);
        });
        this.setState({ brandsOptions });
      })
      .catch((err) => {
        console.log("error fetching pages");
      });
    api
      .post("/product/get")
      .then((res) => {
        const { productOptions } = this.state;
        res.data.data.map((val) => {
          let tmp = {};
          tmp.value = val._id;
          tmp.label = val.name;
          if (val.status) productOptions.push(tmp);
        });
        this.setState({ productOptions });
      })
      .catch((err) => {
        console.log("error fetching products");
      });

    api
      .post("/menu/get")
      .then((res) => {
        const { menuOptions } = this.state;
        res.data.data.forEach((val) => {
          let tmp = {
            label: val.name,
            value: val._id,
          };
          if (val.status) menuOptions.push(tmp);
        });
        this.setState({ menuOptions });
      })
      .catch((err) => {
        console.log("error fetching menus");
      });

    api
      .post("/flashsale/get")
      .then((res) => {
        const { flashsaleOptions } = this.state;
        res.data.data.forEach((val) => {
          let tmp = {
            label: val.campaignName,
            value: val._id,
          };
          flashsaleOptions.push(tmp);
        });
        this.setState({ flashsaleOptions });
      })
      .catch((err) => {
        console.log("error fetching flashsale");
      });
      api.post('/banner/get').then(res=>{
        let data = {...this.state.clientReviewData,...res.data.data[0]};
        data.banners.forEach(banner=>{
          banner.image = banner.img?banner.img.image:""
          banner.smallimage = banner.smallimg?banner.smallimg.image:""
        })

        this.setState({clientReviewData: data})
      }).catch(err => console.log("error banner"))
    api
      .get("/storefront/get")
      .then((res) => {
        const { data } = this.state;
        const fetched = res.data.data[0];
        //console.log(fetched.Products);
        data.General = {
          ...data.General,
          ...fetched.General,
          SliderId: fetched.General.Slider ? fetched.General.Slider._id : "",
          PrivacyPolicyPageId: fetched.General.PrivacyPolicyPage
            ? fetched.General.PrivacyPolicyPage._id
            : "",
          TermsConditionsPageId: fetched.General.TermsConditionsPage
            ? fetched.General.TermsConditionsPage._id
            : "",
        };
        data.Logo = {
          FaviconId: fetched.Logo.Favicon ? fetched.Logo.Favicon._id : "",
          MailLogoId: fetched.Logo.MailLogo ? fetched.Logo.MailLogo._id : "",
          HeaderLogoId: fetched.Logo.HeaderLogo
            ? fetched.Logo.HeaderLogo._id
            : "",
          image: {
            HeaderLogoId: fetched.Logo.HeaderLogo
              ? fetched.Logo.HeaderLogo.image
              : "",
            MailLogoId: fetched.Logo.MailLogo
              ? fetched.Logo.MailLogo.image
              : "",
            FaviconId: fetched.Logo.Favicon ? fetched.Logo.Favicon.image : "",
          },
        };
        data.Menus = {
          ...data.Menus,
          ...fetched.Menus,
          PrimaryMenuId: fetched.Menus.PrimaryMenu
            ? fetched.Menus.PrimaryMenu._id
            : "",
          CategoryMenuId: fetched.Menus.CategoryMenu
            ? fetched.Menus.CategoryMenu._id
            : "",
          FooterMenuOneId: fetched.Menus.FooterMenuOne
            ? fetched.Menus.FooterMenuOne._id
            : "",
          FooterMenuTwoId: fetched.Menus.FooterMenuTwo
            ? fetched.Menus.FooterMenuTwo._id
            : "",
        };
        data.Footer = {
          FooterCopyrightText: fetched.Footer.FooterCopyrightText,
          AcceptedPaymentMethodsImageId: fetched.Footer
            .AcceptedPaymentMethodsImage
            ? fetched.Footer.AcceptedPaymentMethodsImage._id
            : "",
          image: fetched.Footer.AcceptedPaymentMethodsImage
            ? fetched.Footer.AcceptedPaymentMethodsImage.image
            : "",
          FooterTagsIds:
            fetched.Footer.FooterTags.length > 0
              ? fetched.Footer.FooterTags.map(function (ids) {
                  return ids._id;
                })
              : [],
        };

        data.SocialLinks = { ...fetched.SocialLinks };
        data.ProductPage = {
          ...fetched.ProductPage,
          ImageId: fetched.ProductPage.Image
            ? fetched.ProductPage.Image._id
            : "",
          image: fetched.ProductPage.Image
            ? fetched.ProductPage.Image.image
            : "",
        };
        data.Features = { ...data.Features, ...fetched.Features };
        fetched.FeaturedCategories.Categories.forEach((val) => {
          val.CategoryId = val.Category ? val.Category._id : "";
          val.ProductIds = val.Products;
        });
        data.FeaturedCategories = {
          ...data.FeaturedCategories,
          ...fetched.FeaturedCategories,
        };
        data.TopBrands = {
          ...data.TopBrands,
          ...fetched.TopBrands,
          TopBrandsIds:
            fetched.TopBrands.TopBrands.length > 0
              ? fetched.TopBrands.TopBrands.map(function (ids) {
                  return ids._id;
                })
              : [],
        };
        data.TopCategories = {
          ...data.TopCategories,
          ...fetched.TopCategories,
          TopCategoriesIds:
            fetched.TopCategories.TopCategories.length > 0
              ? fetched.TopCategories.TopCategories.map(function (ids) {
                  return ids._id;
                })
              : [],
        };
        data.Newsletter = {
          BackgroundImageId: fetched.Newsletter.BackgroundImage
            ? fetched.Newsletter.BackgroundImage._id
            : "",
          image: fetched.Newsletter.BackgroundImage
            ? fetched.Newsletter.BackgroundImage.image
            : "",
        };
        fetched.FlashSaleVerticalProducts.VerticalProducts.forEach((val) => {
          val.ProductIds = val.Products;
        });
        data.FlashSaleVerticalProducts = {
          ...data.FlashSaleVerticalProducts,
          ...fetched.FlashSaleVerticalProducts,
          ActiveCampaignId: fetched.FlashSaleVerticalProducts.ActiveCampaign,
        };
        fetched.Products.forEach((val) => {
          val.Tabs.forEach((tab) => {
            tab.ProductIds = tab.Products;
            tab.CategoryId = tab.Category?._id;
          });
          data[val.Name] = { ...data[val.Name], ...val };
        });
        fetched.Banners.forEach((ban) => {
          ban.Banners.forEach((val) => {
            if (val.Image) {
              val.ImageId = val.Image._id;
              val.image = val.Image.image;
            }
          });
          if (ban.Name == "Three Column Full Width Banners" && ban.Background) {
            ban.BackgroundId = ban.Background._id;
            ban.BackgroundIdImage = ban.Background.image;
          }
          data[ban.Name] = { ...data[ban.Name], ...ban };
        });
        if (fetched.General.ThemeColor[0] == "#") {
          data.General.CustomThemeColor = fetched.General.ThemeColor;
          data.General.ThemeColor = "custom color";
        }
        if (fetched.General.MailThemeColor[0] == "#") {
          data.General.CustomMailThemeColor = fetched.General.MailThemeColor;
          data.General.MailThemeColor = "custom color";
        }
        this.setState({ data, _id: fetched._id, submitting: false });
      })
      .catch((err) => {
        console.log("error fetching storefront details");
        this.setState({ submitting: false });
      });
  }
  setVal = (val, key, key2) => {
    const { data } = this.state;
    data[key][key2] = val;
    this.setState({ data });
  };
  setClientVal = (val, key, key2, idx) => {
    const { clientReviewData } = this.state;
    if (key2 != "") clientReviewData[key][idx][key2] = val;
    else clientReviewData[key] = val;
    this.setState({ clientReviewData });
  };
  setArr = (val, key, key2, idx, key3) => {
    const { data } = this.state;
    data[key][key2][idx][key3] = val;
    this.setState({ data });
  };
  setImageId = (id, multiple, image) => {
    const { data, imageFor, clientReviewData } = this.state;
    if (this.state.activePanel == "newsletter") {
      data.Newsletter[imageFor] = id;
      data.Newsletter.image = image;
    } else if (this.state.activePanel == "logo") {
      data.Logo[imageFor] = id;
      data.Logo.image[imageFor] = image;
    } else if (this.state.activePanel == "productpage") {
      data.ProductPage[imageFor] = id;
      data.ProductPage.image = image;
    } else if (this.state.activePanel == "footer") {
      data.Footer[imageFor] = id;
      data.Footer.image = image;
    } else if (this.state.activePanel == "sliderbanners") {
      data["Slider Banners"].Banners[imageFor].ImageId = id;
      data["Slider Banners"].Banners[imageFor].image = image;
    } else if (this.state.activePanel == "threecolfullwidth") {
      if (imageFor == "BackgroundId") {
        data["Three Column Full Width Banners"].BackgroundId = id;
        data["Three Column Full Width Banners"].BackgroundIdImage = image;
      } else {
        data["Three Column Full Width Banners"].Banners[imageFor].imageId = id;
        data["Three Column Full Width Banners"].Banners[imageFor].image = image;
      }
    } else if (this.state.activePanel == "twocolbanners") {
      data["Two column banners"].Banners[imageFor].ImageId = id;
      data["Two column banners"].Banners[imageFor].image = image;
    } else if (this.state.activePanel == "threecolbanners") {
      data["Three Column Banners"].Banners[imageFor].ImageId = id;
      data["Three Column Banners"].Banners[imageFor].image = image;
    } else if (this.state.activePanel == "onecolbanner") {
      data["One Column Banner"].Banners[imageFor].ImageId = id;
      data["One Column Banner"].Banners[imageFor].image = image;
    } else if (this.state.activePanel == "sixcolbanners") {
      data["Six Column Banner"].Banners[imageFor].ImageId = id;
      data["Six Column Banner"].Banners[imageFor].image = image;
    }else if(this.state.activePanel == "clientreview"){
      let arr = imageFor.split(",")
      let key;
      if(arr[0] == "img"){
        key="image"
      }else key = "smallimage"
      clientReviewData.banners[arr[1]][arr[0]] = id
      clientReviewData.banners[arr[1]][key] = image
    }
    this.setState({ data,clientReviewData });
  };

  handleSubmit = () => {
    const { errors } = this.state;
    const { data } = this.state;
    const Banners = [];
    const Products = [];
    Banners.push(
      data["Slider Banners"],
      data["Three Column Full Width Banners"],
      data["Two column banners"],
      data["Three Column Banners"],
      data["One Column Banner"],
      data["Six Column Banner"]
    );
    Products.push(
      data["Product Tabs One"],
      data["Product Grid"],
      data["Product Tabs Two"],
      data["Product Most Viewed"]
    );
    if (this.state.data.General.MailThemeColor == "custom color") {
      data.General.MailThemeColor =
        this.state.data.General.CustomMailThemeColor;
    }
    if (this.state.data.General.ThemeColor == "custom color") {
      data.General.ThemeColor = this.state.data.General.CustomThemeColor;
    }

    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({ submitting: true });
      api
        .put("/storefront", {
          General: data.General,
          Logo: data.Logo,
          Menus: data.Menus,
          Footer: data.Footer,
          Newsletter: data.Newsletter,
          Features: data.Features,
          ProductPage: data.ProductPage,
          SocialLinks: data.SocialLinks,
          FeaturedCategories: data.FeaturedCategories,
          TopBrands: data.TopBrands,
          TopCategories: data.TopCategories,
          FlashSaleVerticalProducts: data.FlashSaleVerticalProducts,
          Banners: Banners,
          Products: Products,
          requiredPermission: "Edit Storefront",
          _id: this.state._id,
        })
        .then((res) => {
          //console.log(res);
          this.setState({
            submitting: false,
            alertType: "success",
            alertMessage: "Storefront settings updated.",
          });
        })
        .catch((err) => {
          this.setState({ submitting: false });
          toast.error(
            `${
              err.response && err.response.data
                ? err.response.data.message
                : "Something went wrong."
            }`,
            {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        });
        api.put('/banner',{data: this.state.clientReviewData, requiredPermission: "Edit Storefront", id: this.state.clientReviewData._id}).then(res=>{
        }).catch(err=>{
          toast.error(
            `${
              err.response && err.response.data
                ? err.response.data.message
                : "Something went wrong."
            }`,
            {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        })
    } else {
      this.setState({
        alertType: "fail",
        alertMessage: "Please fill the following: " + errors,
      });
    }
  };

  tabContentToggle = () => {
    if (this.state.activePanel == "general") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">General</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Welcome Text
                </label>
                <div className="col-md-9">
                  <input
                    name="WelcomeText"
                    className="form-control "
                    type="text"
                    value={this.state.data.General.WelcomeText}
                    onChange={(e) => {
                      this.setVal(e.target.value, "General", e.target.name);
                    }}
                  />
                </div>
              </div>
              {/* <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Theme Color
                </label>
                <div className="col-md-9">
                  <select
                    name="ThemeColor"
                    className="form-control custom-select-black "
                    value={this.state.data.General.ThemeColor}
                    onChange={(e) => {
                      this.setVal(e.target.value, "General", e.target.name);
                    }}
                  >
                    <option value="blue">Blue</option>
                    <option value="bondi-blue">Bondi Blue</option>
                    <option value="cornflower">Cornflower</option>
                    <option value="violet">Violet</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                    <option value="black">Black</option>
                    <option value="indigo">Indigo</option>
                    <option value="magenta">Magenta</option>
                    <option value={"custom color"}>Custom Color</option>
                  </select>
                </div>
              </div> */}
              {/* <div
                className={
                  this.state.data.General.ThemeColor == "custom color"
                    ? ""
                    : "hide"
                }
              >
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Custom Theme Color
                  </label>
                  <div className="col-md-9">
                    <input
                      name="CustomThemeColor"
                      className="form-control "
                      type="color"
                      value={this.state.data.General.CustomThemeColor}
                      onChange={(e) => {
                        this.setVal(e.target.value, "General", e.target.name);
                      }}
                    />
                  </div>
                </div>
              </div> */}
              {/* <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Mail Theme Color
                </label>
                <div className="col-md-9">
                  <select
                    name="MailThemeColor"
                    className="form-control custom-select-black "
                    value={this.state.data.General.MailThemeColor}
                    onChange={(e) => {
                      this.setVal(e.target.value, "General", e.target.name);
                    }}
                  >
                    <option value="blue">Blue</option>
                    <option value="bondi-blue">Bondi Blue</option>
                    <option value="cornflower">Cornflower</option>
                    <option value="violet">Violet</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                    <option value="black">Black</option>
                    <option value="indigo">Indigo</option>
                    <option value="magenta">Magenta</option>
                    <option value={"custom color"}>Custom Color</option>
                  </select>
                </div>
              </div>
              <div
                className={
                  this.state.data.General.MailThemeColor == "custom color"
                    ? ""
                    : "hide"
                }
              >
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Custom Mail Theme Color
                  </label>
                  <div className="col-md-9">
                    <input
                      name="CustomMailThemeColor"
                      className="form-control "
                      type="color"
                      value={this.state.data.General.CustomMailThemeColor}
                      onChange={(e) => {
                        this.setVal(e.target.value, "General", e.target.name);
                      }}
                    />
                  </div>
                </div>
              </div> */}
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Slider
                </label>
                <div className="col-md-9">
                  <select
                    name="SliderId"
                    className="form-control custom-select-black "
                    value={this.state.data.General.SliderId}
                    onChange={(e) => {
                      this.setVal(e.target.value, "General", e.target.name);
                    }}
                  >
                    <option value="">Please Select</option>
                    {this.state.sliderOptions.map((val, idx) => (
                      <option key={idx} value={val.value}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Terms &amp; Conditions Page
                </label>
                <div className="col-md-9">
                  <select
                    name="TermsConditionsPageId"
                    className="form-control custom-select-black "
                    value={this.state.data.General.TermsConditionsPageId}
                    onChange={(e) => {
                      this.setVal(e.target.value, "General", e.target.name);
                    }}
                  >
                    <option value="">Please Select</option>
                    {this.state.pagesOptions.map((val, idx) => (
                      <option key={idx} value={val.value}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Privacy Policy Page
                </label>
                <div className="col-md-9">
                  <select
                    name="PrivacyPolicyPageId"
                    className="form-control custom-select-black "
                    value={this.state.data.General.PrivacyPolicyPageId}
                    onChange={(e) => {
                      this.setVal(e.target.value, "General", e.target.name);
                    }}
                  >
                    <option value>Please Select</option>
                    {this.state.pagesOptions.map((val, idx) => (
                      <option key={idx} value={val.value}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Address
                </label>
                <div className="col-md-9">
                  <input
                    name="Address"
                    className="form-control "
                    type="text"
                    value={this.state.data.General.Address}
                    onChange={(e) => {
                      this.setVal(e.target.value, "General", e.target.name);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "logo") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Logo</h3>
          <div className="single-image-wrapper">
            <h4>Favicon</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() => {
                this.setState({
                  showModal: true,
                  multiple: false,
                  imageFor: "FaviconId",
                });
              }}
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
              {this.state.data.Logo.image.FaviconId ? (
                <div className="image-holder">
                  <img
                    src={siteUrl + this.state.data.Logo.image.FaviconId}
                    height={120}
                    width={120}
                  />
                  <button
                    type="button"
                    className="btn remove-image"
                    onClick={() => {
                      this.setState({ imageFor: "FaviconId" }, () => {
                        this.setImageId("", false, "");
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="image-holder placeholder">
                  <i className="fa fa-picture-o" />
                </div>
              )}
            </div>
          </div>
          <div className="media-picker-divider" />
          <div className="single-image-wrapper">
            <h4>Header Logo</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() => {
                this.setState({
                  showModal: true,
                  multiple: false,
                  imageFor: "HeaderLogoId",
                });
              }}
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
              {this.state.data.Logo.image.HeaderLogoId ? (
                <div className="image-holder">
                  <img
                    src={siteUrl + this.state.data.Logo.image.HeaderLogoId}
                    height={120}
                    width={120}
                  />
                  <button
                    type="button"
                    className="btn remove-image"
                    onClick={() => {
                      this.setState({ imageFor: "HeaderLogoId" }, () => {
                        this.setImageId("", false, "");
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="image-holder placeholder">
                  <i className="fa fa-picture-o" />
                </div>
              )}
            </div>
          </div>
          <div className="media-picker-divider" />
          <div className="single-image-wrapper">
            <h4>Mail Logo</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() => {
                this.setState({
                  showModal: true,
                  multiple: false,
                  imageFor: "MailLogoId",
                });
              }}
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
              {this.state.data.Logo.image.MailLogoId ? (
                <div className="image-holder">
                  <img
                    src={siteUrl + this.state.data.Logo.image.MailLogoId}
                    height={120}
                    width={120}
                  />
                  <button
                    type="button"
                    className="btn remove-image"
                    onClick={() => {
                      this.setState({ imageFor: "MailLogoId" }, () => {
                        this.setImageId("", false, "");
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="image-holder placeholder">
                  <i className="fa fa-picture-o" />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "menus") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Menus</h3>
          <div className="row">
            <div className="col-md-8">
              {/* <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Navbar Text
                </label>
                <div className="col-md-9">
                  <input
                    name="NavbarText"
                    className="form-control "
                    type="text"
                    value={this.state.data.Menus.NavbarText}
                    onChange={(e) => {
                      this.setVal(e.target.value, "Menus", e.target.name);
                    }}
                  />
                </div>
              </div> */}
              <div className="form-group">
                <label
                  htmlFor="storefront_primary_menu"
                  className="col-md-3 control-label text-left"
                >
                  Primary Menu
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal(val, "Menus", "PrimaryMenuId");
                    }}
                    singleSelect={true}
                    options={this.state.menuOptions}
                    defaultValue={this.state.data.Menus.PrimaryMenuId}
                  />
                </div>
              </div>
              {/* <div className="form-group">
                <label
                  htmlFor="storefront_category_menu"
                  className="col-md-3 control-label text-left"
                >
                  Category Menu
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal(val, "Menus", "CategoryMenuId");
                    }}
                    singleSelect={true}
                    options={this.state.menuOptions}
                    defaultValue={this.state.data.Menus.CategoryMenuId}
                  />
                </div>
              </div> */}
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Footer Menu One Title
                </label>
                <div className="col-md-9">
                  <input
                    name="FooterMenuOneTitle"
                    className="form-control "
                    type="text"
                    value={this.state.data.Menus.FooterMenuOneTitle}
                    onChange={(e) => {
                      this.setVal(e.target.value, "Menus", e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="storefront_footer_menu_one"
                  className="col-md-3 control-label text-left"
                >
                  Footer Menu One
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal(val, "Menus", "FooterMenuOneId");
                    }}
                    singleSelect={true}
                    options={this.state.menuOptions}
                    defaultValue={this.state.data.Menus.FooterMenuOneId}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Footer Menu Two Title
                </label>
                <div className="col-md-9">
                  <input
                    name="FooterMenuTwoTitle"
                    className="form-control "
                    type="text"
                    value={this.state.data.Menus.FooterMenuTwoTitle}
                    onChange={(e) => {
                      this.setVal(e.target.value, "Menus", e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="storefront_footer_menu_two"
                  className="col-md-3 control-label text-left"
                >
                  Footer Menu Two
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setVal(val, "Menus", "FooterMenuTwoId");
                    }}
                    singleSelect={true}
                    options={this.state.menuOptions}
                    defaultValue={this.state.data.Menus.FooterMenuTwoId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "footer") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Footer</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="box-content clearfix">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Footer Tags
                  </label>
                  <div className="col-md-9">
                    <MultiSelect
                      onChange={(val) => {
                        const { data } = this.state;
                        data.Footer.FooterTagsIds = val.split(",");
                        this.setState({ data });
                      }}
                      options={this.state.tagOptions}
                      defaultValue={this.state.data.Footer.FooterTagsIds.toString()}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Footer Copyright Text
                  </label>
                  <div className="col-md-9">
                    <input
                      name="FooterCopyrightText"
                      className="form-control "
                      type="text"
                      value={this.state.data.Footer.FooterCopyrightText}
                      onChange={(e) => {
                        this.setVal(e.target.value, "Footer", e.target.name);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="box-content clearfix">
                <div className="single-image-wrapper">
                  <h4>Accepted Payment Methods Image</h4>
                  <button
                    type="button"
                    className="image-picker btn btn-default"
                    onClick={() => {
                      this.setState({
                        showModal: true,
                        multiple: false,
                        imageFor: "AcceptedPaymentMethodsImageId",
                      });
                    }}
                  >
                    <i className="fa fa-folder-open m-r-5" />
                    Browse
                  </button>
                  <div className="clearfix" />
                  <div className="single-image image-holder-wrapper clearfix">
                    {this.state.data.Footer.image ? (
                      <div className="image-holder">
                        <img
                          src={siteUrl + this.state.data.Footer.image}
                          height={120}
                          width={120}
                        />
                        <button
                          type="button"
                          className="btn remove-image"
                          onClick={() => {
                            this.setState(
                              { imageFor: "AcceptedPaymentMethodsImageId" },
                              () => {
                                this.setImageId("", false, "");
                              }
                            );
                          }}
                        />
                      </div>
                    ) : (
                      <div className="image-holder placeholder">
                        <i className="fa fa-picture-o" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "newsletter") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Newsletter</h3>
          <div className="single-image-wrapper">
            <h4>Background Image</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() => {
                this.setState({
                  showModal: true,
                  multiple: false,
                  imageFor: "BackgroundImageId",
                });
              }}
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
              {this.state.data.Newsletter.image ? (
                <div className="image-holder">
                  <img
                    src={siteUrl + this.state.data.Newsletter.image}
                    height={120}
                    width={120}
                  />
                  <button
                    type="button"
                    className="btn remove-image"
                    onClick={() => {
                      this.setState({ imageFor: "BackgroundImageId" }, () => {
                        this.setImageId("", false, "");
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="image-holder placeholder">
                  <i className="fa fa-picture-o" />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "features") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Features</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="storefront_features_section_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_features_section_enabled"
                      checked={this.state.data.Features.SectionStatus}
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data.Features.SectionStatus,
                          "Features",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_features_section_enabled">
                      Enable features section
                    </label>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              {this.state.data.Features.Features.map((val, idx) => (
                <div className="box-content" key={idx}>
                  <h4 className="section-title">Feature {idx + 1}</h4>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Title
                    </label>
                    <div className="col-md-9">
                      <input
                        name="Title"
                        className="form-control "
                        type="text"
                        value={this.state.data.Features.Features[idx].Title}
                        onChange={(e) => {
                          this.setArr(
                            e.target.value,
                            "Features",
                            "Features",
                            idx,
                            e.target.name
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Subtitle
                    </label>
                    <div className="col-md-9">
                      <input
                        name="SubTitle"
                        className="form-control "
                        type="text"
                        value={this.state.data.Features.Features[idx].SubTitle}
                        onChange={(e) => {
                          this.setArr(
                            e.target.value,
                            "Features",
                            "Features",
                            idx,
                            e.target.name
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Icon
                    </label>
                    <div className="col-md-9">
                      <input
                        name="Icon"
                        className="form-control "
                        type="text"
                        value={this.state.data.Features.Features[idx].Icon}
                        onChange={(e) => {
                          this.setArr(
                            e.target.value,
                            "Features",
                            "Features",
                            idx,
                            e.target.name
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "productpage") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Product Page</h3>
          <div className="accordion-box-content">
            <div className="tab-content clearfix">
              <div className="panel-wrap">
                <div className="panel">
                  <div className="panel-header">
                    <h5>Product Page Banner</h5>
                  </div>
                  <div className="panel-body">
                    <div
                      className="panel-image"
                      onClick={() => {
                        this.setState({
                          showModal: true,
                          multiple: false,
                          imageFor: "ImageId",
                        });
                      }}
                    >
                      {this.state.data.ProductPage.image ? (
                        <img
                          src={siteUrl + this.state.data.ProductPage.image}
                        />
                      ) : (
                        <div className="placeholder">
                          <i className="fa fa-picture-o" />
                        </div>
                      )}
                    </div>
                    <div className="panel-content clearfix">
                      <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                          <div className="form-group">
                            <label>Call to Action URL</label>
                            <input
                              type="text"
                              name="CalltoActionURL"
                              className="form-control"
                              value={
                                this.state.data.ProductPage.CalltoActionURL
                              }
                              onChange={(e) => {
                                this.setVal(
                                  e.target.value,
                                  "ProductPage",
                                  e.target.name
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-6">
                          <div className="checkbox">
                            <input
                              type="checkbox"
                              name="OpenInNewWindow"
                              id="storefront_product_page_banner-open-in-new-window"
                              checked={
                                this.state.data.ProductPage.OpenInNewWindow
                              }
                              onChange={(e) => {
                                this.setVal(
                                  !this.state.data.ProductPage.OpenInNewWindow,
                                  "ProductPage",
                                  e.target.name
                                );
                              }}
                            />
                            <label htmlFor="storefront_product_page_banner-open-in-new-window">
                              Open in new window
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "sociallinks") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Social Links</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Facebook
                </label>
                <div className="col-md-9">
                  <input
                    name="Facebook"
                    className="form-control "
                    type="text"
                    value={this.state.data.SocialLinks.Facebook}
                    onChange={(e) => {
                      this.setVal(e.target.value, "SocialLinks", e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Twitter
                </label>
                <div className="col-md-9">
                  <input
                    name="Twitter"
                    className="form-control "
                    type="text"
                    value={this.state.data.SocialLinks.Twitter}
                    onChange={(e) => {
                      this.setVal(e.target.value, "SocialLinks", e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Instagram
                </label>
                <div className="col-md-9">
                  <input
                    name="Instagram"
                    className="form-control "
                    type="text"
                    value={this.state.data.SocialLinks.Instagram}
                    onChange={(e) => {
                      this.setVal(e.target.value, "SocialLinks", e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Youtube
                </label>
                <div className="col-md-9">
                  <input
                    name="Youtube"
                    className="form-control "
                    type="text"
                    value={this.state.data.SocialLinks.Youtube}
                    onChange={(e) => {
                      this.setVal(e.target.value, "SocialLinks", e.target.name);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "sliderbanners") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Slider Banners</h3>
          <div className="accordion-box-content">
            <div className="tab-content clearfix">
              <div className="panel-wrap">
                {this.state.data["Slider Banners"].Banners.map((val, idx) => (
                  <div className="panel" key={idx}>
                    <div className="panel-header">
                      <h5>Banner {idx + 1}</h5>
                    </div>
                    <div className="panel-body">
                      <div
                        className="panel-image"
                        onClick={() => {
                          this.setState({
                            showModal: true,
                            multiple: false,
                            imageFor: idx,
                          });
                        }}
                      >
                        {this.state.data["Slider Banners"].Banners[idx]
                          .image ? (
                          <img
                            src={
                              siteUrl +
                              this.state.data["Slider Banners"].Banners[idx]
                                .image
                            }
                          />
                        ) : (
                          <div className="placeholder">
                            <i className="fa fa-picture-o" />
                          </div>
                        )}
                      </div>
                      <div className="panel-content clearfix">
                        <div className="row">
                          <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                            <div className="form-group">
                              <label htmlFor="storefront_slider_banner_1-call-to-action-url">
                                Call to Action URL
                              </label>
                              <input
                                type="text"
                                name="CalltoActionURL"
                                className="form-control"
                                value={
                                  this.state.data["Slider Banners"].Banners[idx]
                                    .CalltoActionURL
                                }
                                onChange={(e) => {
                                  this.setArr(
                                    e.target.value,
                                    "Slider Banners",
                                    "Banners",
                                    idx,
                                    e.target.name
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-12 col-sm-6">
                            <div className="checkbox">
                              <input
                                type="checkbox"
                                name="OpenInNewWindow"
                                id={
                                  "storefront_slider_banner-open-in-new-window" +
                                  idx
                                }
                                checked={
                                  this.state.data["Slider Banners"].Banners[idx]
                                    .OpenInNewWindow
                                }
                                onChange={(e) => {
                                  this.setArr(
                                    !this.state.data["Slider Banners"].Banners[
                                      idx
                                    ].OpenInNewWindow,
                                    "Slider Banners",
                                    "Banners",
                                    idx,
                                    e.target.name
                                  );
                                }}
                              />
                              <label
                                htmlFor={
                                  "storefront_slider_banner-open-in-new-window" +
                                  idx
                                }
                              >
                                Open in new window
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "threecolfullwidth") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Three Column Full Width Banners</h3>
          <div className="accordion-box-content">
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Section Status
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="SectionStatus"
                        id="storefront_three_column_full_width_banners_enabled"
                        checked={
                          this.state.data["Three Column Full Width Banners"]
                            .SectionStatus
                        }
                        onChange={(e) => {
                          this.setVal(
                            !this.state.data["Three Column Full Width Banners"]
                              .SectionStatus,
                            "Three Column Full Width Banners",
                            e.target.name
                          );
                        }}
                      />
                      <label htmlFor="storefront_three_column_full_width_banners_enabled">
                        Enable three column full width banners section
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content clearfix">
              <div className="panel-wrap">
                <div className="single-image-wrapper">
                  <h4>Background</h4>
                  <button
                    type="button"
                    className="image-picker btn btn-default"
                    onClick={() => {
                      this.setState({
                        showModal: true,
                        multiple: false,
                        imageFor: "BackgroundId",
                      });
                    }}
                  >
                    <i className="fa fa-folder-open m-r-5" />
                    Browse
                  </button>
                  <div className="clearfix" />
                  <div className="single-image image-holder-wrapper clearfix">
                    {this.state.data["Three Column Full Width Banners"]
                      .BackgroundIdImage ? (
                      <div className="image-holder">
                        <img
                          src={
                            siteUrl +
                            this.state.data["Three Column Full Width Banners"]
                              .BackgroundIdImage
                          }
                          height={120}
                          width={120}
                        />
                        <button
                          type="button"
                          className="btn remove-image"
                          onClick={() => {
                            this.setState({ imageFor: "BackgroundId" }, () => {
                              this.setImageId("", false, "");
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <div className="image-holder placeholder">
                        <i className="fa fa-picture-o" />
                      </div>
                    )}
                  </div>
                </div>
                {this.state.data["Three Column Full Width Banners"].Banners.map(
                  (val, idx) => (
                    <div className="panel" key={idx}>
                      <div className="panel-header">
                        <h5>Banner {idx + 1}</h5>
                      </div>
                      <div className="panel-body">
                        <div
                          className="panel-image"
                          onClick={() => {
                            this.setState({
                              showModal: true,
                              multiple: false,
                              imageFor: idx,
                            });
                          }}
                        >
                          {this.state.data["Three Column Full Width Banners"]
                            .Banners[idx].image ? (
                            <img
                              src={
                                siteUrl +
                                this.state.data[
                                  "Three Column Full Width Banners"
                                ].Banners[idx].image
                              }
                            />
                          ) : (
                            <div className="placeholder">
                              <i className="fa fa-picture-o" />
                            </div>
                          )}
                        </div>
                        <div className="panel-content clearfix">
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                              <div className="form-group">
                                <label htmlFor="storefront_slider_banner_1-call-to-action-url">
                                  Call to Action URL
                                </label>
                                <input
                                  type="text"
                                  name="CalltoActionURL"
                                  className="form-control"
                                  value={
                                    this.state.data[
                                      "Three Column Full Width Banners"
                                    ].Banners[idx].CalltoActionURL
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      e.target.value,
                                      "Three Column Full Width Banners",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6">
                              <div className="checkbox">
                                <input
                                  type="checkbox"
                                  name="OpenInNewWindow"
                                  id={
                                    "three_slider_banner-open-in-new-window" +
                                    idx
                                  }
                                  checked={
                                    this.state.data[
                                      "Three Column Full Width Banners"
                                    ].Banners[idx].OpenInNewWindow
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      !this.state.data[
                                        "Three Column Full Width Banners"
                                      ].Banners[idx].OpenInNewWindow,
                                      "Three Column Full Width Banners",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={
                                    "three_slider_banner-open-in-new-window" +
                                    idx
                                  }
                                >
                                  Open in new window
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "featuredcategories") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Featured Categories</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_featured_categories_section_enabled"
                      checked={
                        this.state.data.FeaturedCategories.SectionStatus
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data.FeaturedCategories.SectionStatus,
                          "FeaturedCategories",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_featured_categories_section_enabled">
                      Enable featured categories section
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Title
                </label>
                <div className="col-md-9">
                  <input
                    name="SectionTitle"
                    className="form-control "
                    type="text"
                    value={this.state.data.FeaturedCategories.SectionTitle}
                    onChange={(e) => {
                      this.setVal(
                        e.target.value,
                        "FeaturedCategories",
                        e.target.name
                      );
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Subtitle
                </label>
                <div className="col-md-9">
                  <input
                    name="SectionSubtitle"
                    className="form-control "
                    type="text"
                    value={this.state.data.FeaturedCategories.SectionSubtitle}
                    onChange={(e) => {
                      this.setVal(
                        e.target.value,
                        "FeaturedCategories",
                        e.target.name
                      );
                    }}
                  />
                </div>
              </div>
              {this.state.data.FeaturedCategories.Categories.map((val, idx) => (
                <div className="box-content clearfix" key={idx}>
                  <h4 className="section-title">Category {idx + 1}</h4>
                  <div className="form-group">
                    <label
                      htmlFor="storefront_featured_categories_section_category_1_category_id"
                      className="col-md-3 control-label text-left"
                    >
                      Category
                    </label>
                    <div className="col-md-9">
                      <MultiSelect
                        onChange={(val) => {
                          this.setArr(
                            val,
                            "FeaturedCategories",
                            "Categories",
                            idx,
                            "CategoryId"
                          );
                        }}
                        singleSelect={true}
                        largeData={true}
                        options={this.state.categoryOptions}
                        defaultValue={
                          this.state.data.FeaturedCategories.Categories[idx]
                            .CategoryId
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Type
                    </label>
                    <div className="col-md-9">
                      <select
                        name="Type"
                        className="form-control custom-select-black product-type"
                        value={
                          this.state.data.FeaturedCategories.Categories[idx]
                            .Type
                        }
                        onChange={(e) => {
                          this.setArr(
                            [],
                            "FeaturedCategories",
                            "Categories",
                            idx,
                            "ProductIds"
                          );
                          this.setArr(
                            e.target.value,
                            "FeaturedCategories",
                            "Categories",
                            idx,
                            "Type"
                          );
                        }}
                      >
                        <option value="">Please Select</option>
                        <option value={"Category Products"}>
                          Category Products
                        </option>
                        <option value={"Custom Products"}>
                          Custom Products
                        </option>
                      </select>
                    </div>
                  </div>
                  {this.state.data.FeaturedCategories.Categories[idx].Type ==
                  "Custom Products" ? (
                    <div className="custom-products">
                      <div className="form-group">
                        <label
                          htmlFor="storefront_featured_categories_section_category_1_products[]-selectized"
                          className="col-md-3 control-label text-left"
                        >
                          Products
                        </label>
                        <div className="col-md-9">
                          <MultiSelect
                            onChange={(val) => {
                              this.setArr(
                                val.split(","),
                                "FeaturedCategories",
                                "Categories",
                                idx,
                                "ProductIds"
                              );
                            }}
                            largeData={true}
                            options={this.state.productOptions}
                            defaultValue={this.state.data.FeaturedCategories.Categories[
                              idx
                            ].ProductIds.map(function (ids) {
                              return ids._id;
                            }).toString()}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "producttabs1") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Product Tabs One</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_product_tabs_1_section_enabled"
                      checked={
                        this.state.data["Product Tabs One"].SectionStatus
                      }
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data["Product Tabs One"].SectionStatus,
                          "Product Tabs One",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_product_tabs_1_section_enabled">
                      Enable product tabs one section
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data["Product Tabs One"].Tabs.map((val, idx) => (
                <div className="box-content clearfix" key={idx}>
                  <h4 className="section-title">Tab {idx + 1}</h4>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Title
                    </label>
                    <div className="col-md-9">
                      <input
                        name="Title"
                        className="form-control "
                        type="text"
                        value={
                          this.state.data["Product Tabs One"].Tabs[idx].Title
                        }
                        onChange={(e) => {
                          this.setArr(
                            e.target.value,
                            "Product Tabs One",
                            "Tabs",
                            idx,
                            e.target.name
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Type
                    </label>
                    <div className="col-md-9">
                      <select
                        name="Type"
                        className="form-control custom-select-black product-type"
                        value={
                          this.state.data["Product Tabs One"].Tabs[idx].Type
                        }
                        onChange={(e) => {
                          this.setArr(
                            "",
                            "Product Tabs One",
                            "Tabs",
                            idx,
                            "CategoryId"
                          );
                          this.setArr(
                            "",
                            "Product Tabs One",
                            "Tabs",
                            idx,
                            "ProductsLimit"
                          );
                          this.setArr(
                            [],
                            "Product Tabs One",
                            "Tabs",
                            idx,
                            "ProductIds"
                          );
                          this.setArr(
                            e.target.value,
                            "Product Tabs One",
                            "Tabs",
                            idx,
                            e.target.name
                          );
                        }}
                      >
                        <option value="">Please Select</option>
                        <option value={"Category Products"}>
                          Category Products
                        </option>
                        <option value={"Latest Products"}>
                          Latest Products
                        </option>
                        {/* <option value={"Recently Viewed Products"}>
                          Recently Viewed Products
                        </option> */}
                        <option value={"Custom Products"}>
                          Custom Products
                        </option>
                      </select>
                    </div>
                  </div>
                  {this.state.data["Product Tabs One"].Tabs[idx].Type ==
                  "Category Products" ? (
                    <div className="category-products ">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Category
                        </label>
                        <div className="col-md-9">
                          <MultiSelect
                            onChange={(val) => {
                              this.setArr(
                                val,
                                "Product Tabs One",
                                "Tabs",
                                idx,
                                "CategoryId"
                              );
                            }}
                            singleSelect={true}
                            largeData={true}
                            options={this.state.categoryOptions}
                            defaultValue={
                              this.state.data["Product Tabs One"].Tabs[idx]
                                .Category?._id
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.data["Product Tabs One"].Tabs[idx].Type ==
                    "Latest Products" ||
                  this.state.data["Product Tabs One"].Tabs[idx].Type ==
                    "Recently Viewed Products" ? (
                    <div className="products-limit">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Products Limit
                        </label>
                        <div className="col-md-9">
                          <input
                            name="ProductsLimit"
                            className="form-control "
                            type="number"
                            value={
                              this.state.data["Product Tabs One"].Tabs[idx]
                                .ProductsLimit
                            }
                            onChange={(e) => {
                              this.setArr(
                                e.target.value,
                                "Product Tabs One",
                                "Tabs",
                                idx,
                                e.target.name
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.data["Product Tabs One"].Tabs[idx].Type ==
                  "Custom Products" ? (
                    <div className="custom-products ">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Products
                        </label>
                        <div className="col-md-9">
                          <MultiSelect
                            onChange={(val) => {
                              this.setArr(
                                val.split(","),
                                "Product Tabs One",
                                "Tabs",
                                idx,
                                "ProductIds"
                              );
                            }}
                            largeData={true}
                            options={this.state.productOptions}
                            defaultValue={this.state.data[
                              "Product Tabs One"
                            ].Tabs[idx].ProductIds.toString()}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "topbrands") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Top Brands</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_top_brands_section_enabled"
                      checked={this.state.data.TopBrands.SectionStatus}
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data.TopBrands.SectionStatus,
                          "TopBrands",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_top_brands_section_enabled">
                      Enable brands section
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Top Brands
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      const { data } = this.state;
                      data.TopBrands.TopBrandsIds = val.split(",");
                      this.setState({ data });
                    }}
                    options={this.state.brandsOptions}
                    defaultValue={this.state.data.TopBrands.TopBrandsIds.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "flashsale") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">
            Flash Sale &amp; Vertical Products
          </h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="storefront_flash_sale_and_vertical_products_section_enabled"
                  className="col-md-3 control-label text-left"
                >
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_flash_sale_and_vertical_products_section_enabled"
                      checked={
                        this.state.data.FlashSaleVerticalProducts.SectionStatus
                      }
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data.FlashSaleVerticalProducts
                            .SectionStatus,
                          "FlashSaleVerticalProducts",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_flash_sale_and_vertical_products_section_enabled">
                      Enable flash sale &amp; vertical products section
                    </label>
                  </div>
                </div>
              </div>
              <div className="box-content clearfix">
                <h4 className="section-title">Flash Sale</h4>
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Title
                  </label>
                  <div className="col-md-9">
                    <input
                      name="Title"
                      className="form-control "
                      type="text"
                      value={this.state.data.FlashSaleVerticalProducts.Title}
                      onChange={(e) => {
                        this.setVal(
                          e.target.value,
                          "FlashSaleVerticalProducts",
                          e.target.name
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="storefront_active_flash_sale_campaign"
                    className="col-md-3 control-label text-left"
                  >
                    Active Campaign
                  </label>
                  <div className="col-md-9">
                    <MultiSelect
                      onChange={(val) => {
                        this.setVal(
                          val,
                          "FlashSaleVerticalProducts",
                          "ActiveCampaignId"
                        );
                      }}
                      singleSelect={true}
                      largeData={true}
                      options={this.state.flashsaleOptions}
                      defaultValue={
                        this.state.data.FlashSaleVerticalProducts
                          .ActiveCampaignId
                      }
                    />
                  </div>
                </div>
              </div>
              {this.state.data.FlashSaleVerticalProducts.VerticalProducts.map(
                (val, idx) => (
                  <div className="box-content clearfix" key={idx}>
                    <h4 className="section-title">
                      Vertical Products {idx + 1}
                    </h4>
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        Title
                      </label>
                      <div className="col-md-9">
                        <input
                          name="Title"
                          className="form-control "
                          type="text"
                          value={
                            this.state.data.FlashSaleVerticalProducts
                              .VerticalProducts[idx].Title
                          }
                          onChange={(e) => {
                            this.setArr(
                              e.target.value,
                              "FlashSaleVerticalProducts",
                              "VerticalProducts",
                              idx,
                              e.target.name
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        Type
                      </label>
                      <div className="col-md-9">
                        <select
                          name="Type"
                          className="form-control custom-select-black product-type"
                          value={
                            this.state.data.FlashSaleVerticalProducts
                              .VerticalProducts[idx].Type
                          }
                          onChange={(e) => {
                            this.setArr(
                              "",
                              "FlashSaleVerticalProducts",
                              "VerticalProducts",
                              idx,
                              "CategoryId"
                            );
                            this.setArr(
                              "",
                              "FlashSaleVerticalProducts",
                              "VerticalProducts",
                              idx,
                              "ProductsLimit"
                            );
                            this.setArr(
                              [],
                              "FlashSaleVerticalProducts",
                              "VerticalProducts",
                              idx,
                              "ProductIds"
                            );
                            this.setArr(
                              e.target.value,
                              "FlashSaleVerticalProducts",
                              "VerticalProducts",
                              idx,
                              e.target.name
                            );
                          }}
                        >
                          <option value="">Please Select</option>
                          <option value={"Category Products"}>
                            Category Products
                          </option>
                          <option value={"Latest Products"}>
                            Latest Products
                          </option>
                          <option value={"Recently Viewed Products"}>
                            Recently Viewed Products
                          </option>
                          <option value={"Custom Products"}>
                            Custom Products
                          </option>
                        </select>
                      </div>
                    </div>
                    {this.state.data.FlashSaleVerticalProducts.VerticalProducts[
                      idx
                    ].Type == "Category Products" ? (
                      <div className="category-products ">
                        <div className="form-group">
                          <label className="col-md-3 control-label text-left">
                            Category
                          </label>
                          <div className="col-md-9">
                            <MultiSelect
                              onChange={(val) => {
                                this.setArr(
                                  val,
                                  "FlashSaleVerticalProducts",
                                  "VerticalProducts",
                                  idx,
                                  "CategoryId"
                                );
                              }}
                              singleSelect={true}
                              largeData={true}
                              options={this.state.categoryOptions}
                              defaultValue={
                                this.state.data.FlashSaleVerticalProducts
                                  .VerticalProducts[idx].CategoryId
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.data.FlashSaleVerticalProducts.VerticalProducts[
                      idx
                    ].Type == "Latest Products" ||
                    this.state.data.FlashSaleVerticalProducts.VerticalProducts[
                      idx
                    ].Type == "Recently Viewed Products" ? (
                      <div className="products-limit">
                        <div className="form-group">
                          <label className="col-md-3 control-label text-left">
                            Products Limit
                          </label>
                          <div className="col-md-9">
                            <input
                              name="ProductsLimit"
                              className="form-control "
                              type="number"
                              value={
                                this.state.data.FlashSaleVerticalProducts
                                  .VerticalProducts[idx].ProductsLimit
                              }
                              onChange={(e) => {
                                this.setArr(
                                  e.target.value,
                                  "FlashSaleVerticalProducts",
                                  "VerticalProducts",
                                  idx,
                                  e.target.name
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.data.FlashSaleVerticalProducts.VerticalProducts[
                      idx
                    ].Type == "Custom Products" ? (
                      <div className="custom-products ">
                        <div className="form-group">
                          <label className="col-md-3 control-label text-left">
                            Products
                          </label>
                          <div className="col-md-9">
                            <MultiSelect
                              onChange={(val) => {
                                this.setArr(
                                  val.split(","),
                                  "FlashSaleVerticalProducts",
                                  "VerticalProducts",
                                  idx,
                                  "ProductIds"
                                );
                              }}
                              largeData={true}
                              options={this.state.productOptions}
                              defaultValue={this.state.data.FlashSaleVerticalProducts.VerticalProducts[
                                idx
                              ].ProductIds.toString()}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "twocolbanners") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Two column banners</h3>
          <div className="accordion-box-content">
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Section Status
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="SectionStatus"
                        id="storefront_two_column_banners_enabled"
                        checked={
                          this.state.data["Two column banners"].SectionStatus
                        }
                        onChange={(e) => {
                          this.setVal(
                            !this.state.data["Two column banners"]
                              .SectionStatus,
                            "Two column banners",
                            e.target.name
                          );
                        }}
                      />
                      <label htmlFor="storefront_two_column_banners_enabled">
                        Enable two column banners section
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content clearfix">
              <div className="panel-wrap">
                {this.state.data["Two column banners"].Banners.map(
                  (val, idx) => (
                    <div className="panel" key={idx}>
                      <div className="panel-header">
                        <h5>Banner {idx + 1}</h5>
                      </div>
                      <div className="panel-body">
                        <div
                          className="panel-image"
                          onClick={() => {
                            this.setState({
                              showModal: true,
                              multiple: false,
                              imageFor: idx,
                            });
                          }}
                        >
                          {this.state.data["Two column banners"].Banners[idx]
                            .image ? (
                            <img
                              src={
                                siteUrl +
                                this.state.data["Two column banners"].Banners[
                                  idx
                                ].image
                              }
                            />
                          ) : (
                            <div className="placeholder">
                              <i className="fa fa-picture-o" />
                            </div>
                          )}
                        </div>
                        <div className="panel-content clearfix">
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                              <div className="form-group">
                                <label htmlFor="storefront_slider_banner_1-call-to-action-url">
                                  Call to Action URL
                                </label>
                                <input
                                  type="text"
                                  name="CalltoActionURL"
                                  className="form-control"
                                  value={
                                    this.state.data["Two column banners"]
                                      .Banners[idx].CalltoActionURL
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      e.target.value,
                                      "Two column banners",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6">
                              <div className="checkbox">
                                <input
                                  type="checkbox"
                                  name="OpenInNewWindow"
                                  id={
                                    "Twocolumnbanners-open-in-new-window" + idx
                                  }
                                  checked={
                                    this.state.data["Two column banners"]
                                      .Banners[idx].OpenInNewWindow
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      !this.state.data["Two column banners"]
                                        .Banners[idx].OpenInNewWindow,
                                      "Two column banners",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={
                                    "Twocolumnbanners-open-in-new-window" + idx
                                  }
                                >
                                  Open in new window
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "productgrid") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Product Grid</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_product_tabs_1_section_enabled"
                      checked={this.state.data["Product Grid"].SectionStatus}
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data["Product Grid"].SectionStatus,
                          "Product Grid",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_product_tabs_1_section_enabled">
                      Enable Product Grid section
                    </label>
                  </div>
                </div>
              </div>
              {this.state.data["Product Grid"].Tabs.map((val, idx) => {
                return (
                  <div className="box-content clearfix" key={idx}>
                    <h4 className="section-title">Tab {idx + 1}</h4>
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        Title
                      </label>
                      <div className="col-md-9">
                        <input
                          name="Title"
                          className="form-control "
                          type="text"
                          value={
                            this.state.data["Product Grid"].Tabs[idx].Title
                          }
                          onChange={(e) => {
                            this.setArr(
                              e.target.value,
                              "Product Grid",
                              "Tabs",
                              idx,
                              e.target.name
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label text-left">
                        Type
                      </label>
                      <div className="col-md-9">
                        <select
                          name="Type"
                          className="form-control custom-select-black product-type"
                          value={this.state.data["Product Grid"].Tabs[idx].Type}
                          onChange={(e) => {
                            this.setArr(
                              "",
                              "Product Grid",
                              "Tabs",
                              idx,
                              "CategoryId"
                            );
                            this.setArr(
                              "",
                              "Product Grid",
                              "Tabs",
                              idx,
                              "ProductsLimit"
                            );
                            this.setArr(
                              [],
                              "Product Grid",
                              "Tabs",
                              idx,
                              "ProductIds"
                            );
                            this.setArr(
                              e.target.value,
                              "Product Grid",
                              "Tabs",
                              idx,
                              e.target.name
                            );
                          }}
                        >
                          {/* <option value="">Please Select</option> */}
                          <option value={"Category Products"}>
                            Category Products
                          </option>
                          {/* <option value={"Latest Products"}>
                          Latest Products
                        </option>
                        <option value={"Recently Viewed Products"}>
                          Recently Viewed Products
                        </option>
                        <option value={"Custom Products"}>
                          Custom Products
                        </option> */}
                        </select>
                      </div>
                    </div>
                    {this.state.data["Product Grid"].Tabs[idx].Type ==
                    "Category Products" ? (
                      <div className="category-products ">
                        <div className="form-group">
                          <label className="col-md-3 control-label text-left">
                            Category
                          </label>
                          <div className="col-md-9">
                            <MultiSelect
                              onChange={(val) => {
                                this.setArr(
                                  val,
                                  "Product Grid",
                                  "Tabs",
                                  idx,
                                  "CategoryId"
                                );
                              }}
                              singleSelect={true}
                              largeData={true}
                              options={this.state.categoryOptions}
                              defaultValue={
                                this.state.data["Product Grid"].Tabs[idx]
                                  .Category?._id
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.data["Product Grid"].Tabs[idx].Type ==
                      "Latest Products" ||
                    this.state.data["Product Grid"].Tabs[idx].Type ==
                      "Recently Viewed Products" ? (
                      <div className="products-limit">
                        <div className="form-group">
                          <label className="col-md-3 control-label text-left">
                            Products Limit
                          </label>
                          <div className="col-md-9">
                            <input
                              name="ProductsLimit"
                              className="form-control "
                              type="number"
                              value={
                                this.state.data["Product Grid"].Tabs[idx]
                                  .ProductsLimit
                              }
                              onChange={(e) => {
                                this.setArr(
                                  e.target.value,
                                  "Product Grid",
                                  "Tabs",
                                  idx,
                                  e.target.name
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.data["Product Grid"].Tabs[idx].Type ==
                    "Custom Products" ? (
                      <div className="custom-products ">
                        <div className="form-group">
                          <label className="col-md-3 control-label text-left">
                            Products
                          </label>
                          <div className="col-md-9">
                            <MultiSelect
                              onChange={(val) => {
                                this.setArr(
                                  val.split(","),
                                  "Product Grid",
                                  "Tabs",
                                  idx,
                                  "ProductIds"
                                );
                              }}
                              largeData={true}
                              options={this.state.productOptions}
                              defaultValue={this.state.data[
                                "Product Grid"
                              ].Tabs[idx].ProductIds.toString()}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "threecolbanners") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Three Column Banners</h3>
          <div className="accordion-box-content">
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Section Status
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="SectionStatus"
                        checked={
                          this.state.data["Three Column Banners"].SectionStatus
                        }
                        onChange={(e) => {
                          this.setVal(
                            !this.state.data["Three Column Banners"]
                              .SectionStatus,
                            "Three Column Banners",
                            e.target.name
                          );
                        }}
                        id="storefront_three_column_banners_enabled"
                      />
                      <label htmlFor="storefront_three_column_banners_enabled">
                        Enable three column banners section
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content clearfix">
              <div className="panel-wrap">
                {this.state.data["Three Column Banners"].Banners.map(
                  (val, idx) => (
                    <div className="panel" key={idx}>
                      <div className="panel-header">
                        <h5>Banner {idx + 1}</h5>
                      </div>
                      <div className="panel-body">
                        <div
                          className="panel-image"
                          onClick={() => {
                            this.setState({
                              showModal: true,
                              multiple: false,
                              imageFor: idx,
                            });
                          }}
                        >
                          {this.state.data["Three Column Banners"].Banners[idx]
                            .image ? (
                            <img
                              src={
                                siteUrl +
                                this.state.data["Three Column Banners"].Banners[
                                  idx
                                ].image
                              }
                            />
                          ) : (
                            <div className="placeholder">
                              <i className="fa fa-picture-o" />
                            </div>
                          )}
                        </div>
                        <div className="panel-content clearfix">
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                              <div className="form-group">
                                <label htmlFor="storefront_slider_banner_1-call-to-action-url">
                                  Call to Action URL
                                </label>
                                <input
                                  type="text"
                                  name="CalltoActionURL"
                                  className="form-control"
                                  value={
                                    this.state.data["Three Column Banners"]
                                      .Banners[idx].CalltoActionURL
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      e.target.value,
                                      "Three Column Banners",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6">
                              <div className="checkbox">
                                <input
                                  type="checkbox"
                                  name="OpenInNewWindow"
                                  id={
                                    "three_col_banner-open-in-new-window" + idx
                                  }
                                  checked={
                                    this.state.data["Three Column Banners"]
                                      .Banners[idx].OpenInNewWindow
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      !this.state.data["Three Column Banners"]
                                        .Banners[idx].OpenInNewWindow,
                                      "Three Column Banners",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={
                                    "three_col_banner-open-in-new-window" + idx
                                  }
                                >
                                  Open in new window
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "producttabs2") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Product Tabs Two</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_product_tabs_1_section_enabled"
                      checked={
                        this.state.data["Product Tabs Two"].SectionStatus
                      }
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data["Product Tabs Two"].SectionStatus,
                          "Product Tabs Two",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_product_tabs_1_section_enabled">
                      Enable Product Tabs Two section
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Title
                </label>
                <div className="col-md-9">
                  <input
                    name="Title"
                    className="form-control "
                    type="text"
                    value={this.state.data["Product Tabs Two"].Title}
                    onChange={(e) => {
                      this.setVal(
                        e.target.value,
                        "Product Tabs Two",
                        e.target.name
                      );
                    }}
                  />
                </div>
              </div>
              {this.state.data["Product Tabs Two"].Tabs.map((val, idx) => (
                <div className="box-content clearfix" key={idx}>
                  <h4 className="section-title">Tab {idx + 1}</h4>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Title
                    </label>
                    <div className="col-md-9">
                      <input
                        name="Title"
                        className="form-control "
                        type="text"
                        value={
                          this.state.data["Product Tabs Two"].Tabs[idx].Title
                        }
                        onChange={(e) => {
                          this.setArr(
                            e.target.value,
                            "Product Tabs Two",
                            "Tabs",
                            idx,
                            e.target.name
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Type
                    </label>
                    <div className="col-md-9">
                      <select
                        name="Type"
                        className="form-control custom-select-black product-type"
                        value={
                          this.state.data["Product Tabs Two"].Tabs[idx].Type
                        }
                        onChange={(e) => {
                          this.setArr(
                            "",
                            "Product Tabs Two",
                            "Tabs",
                            idx,
                            "CategoryId"
                          );
                          this.setArr(
                            "",
                            "Product Tabs Two",
                            "Tabs",
                            idx,
                            "ProductsLimit"
                          );
                          this.setArr(
                            [],
                            "Product Tabs Two",
                            "Tabs",
                            idx,
                            "ProductIds"
                          );
                          this.setArr(
                            e.target.value,
                            "Product Tabs Two",
                            "Tabs",
                            idx,
                            e.target.name
                          );
                        }}
                      >
                        <option value="">Please Select</option>
                        <option value={"Category Products"}>
                          Category Products
                        </option>
                        <option value={"Latest Products"}>
                          Latest Products
                        </option>
                        {/* <option value={"Recently Viewed Products"}>
                          Recently Viewed Products
                        </option> */}
                        <option value={"Custom Products"}>
                          Custom Products
                        </option>
                      </select>
                    </div>
                  </div>
                  {this.state.data["Product Tabs Two"].Tabs[idx].Type ==
                  "Category Products" ? (
                    <div className="category-products ">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Category
                        </label>
                        <div className="col-md-9">
                          <MultiSelect
                            onChange={(val) => {
                              this.setArr(
                                val,
                                "Product Tabs Two",
                                "Tabs",
                                idx,
                                "CategoryId"
                              );
                            }}
                            singleSelect={true}
                            largeData={true}
                            options={this.state.categoryOptions}
                            defaultValue={
                              this.state.data["Product Tabs Two"].Tabs[idx]
                                .Category?._id
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.data["Product Tabs Two"].Tabs[idx].Type ==
                    "Latest Products" ||
                  this.state.data["Product Tabs Two"].Tabs[idx].Type ==
                    "Recently Viewed Products" ? (
                    <div className="products-limit">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Products Limit
                        </label>
                        <div className="col-md-9">
                          <input
                            name="ProductsLimit"
                            className="form-control "
                            type="number"
                            value={
                              this.state.data["Product Tabs Two"].Tabs[idx]
                                .ProductsLimit
                            }
                            onChange={(e) => {
                              this.setArr(
                                e.target.value,
                                "Product Tabs Two",
                                "Tabs",
                                idx,
                                e.target.name
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.data["Product Tabs Two"].Tabs[idx].Type ==
                  "Custom Products" ? (
                    <div className="custom-products ">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Products
                        </label>
                        <div className="col-md-9">
                          <MultiSelect
                            onChange={(val) => {
                              this.setArr(
                                val.split(","),
                                "Product Tabs Two",
                                "Tabs",
                                idx,
                                "ProductIds"
                              );
                            }}
                            largeData={true}
                            options={this.state.productOptions}
                            defaultValue={this.state.data[
                              "Product Tabs Two"
                            ].Tabs[idx].ProductIds.toString()}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "productmostviewed") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Product Most Viewed</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_product_tabs_1_section_enabled"
                      checked={
                        this.state.data["Product Most Viewed"].SectionStatus
                      }
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data["Product Most Viewed"].SectionStatus,
                          "Product Most Viewed",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_product_tabs_1_section_enabled">
                      Enable Product Most Viewed section
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Title
                </label>
                <div className="col-md-9">
                  <input
                    name="Title"
                    className="form-control "
                    type="text"
                    value={this.state.data["Product Most Viewed"].Title}
                    onChange={(e) => {
                      this.setVal(
                        e.target.value,
                        "Product Most Viewed",
                        e.target.name
                      );
                    }}
                  />
                </div>
              </div>
              {this.state.data["Product Most Viewed"].Tabs.map((val, idx) => (
                <div className="box-content clearfix" key={idx}>
                  <h4 className="section-title">Tab {idx + 1}</h4>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Title
                    </label>
                    <div className="col-md-9">
                      <input
                        name="Title"
                        className="form-control "
                        type="text"
                        value={
                          this.state.data["Product Most Viewed"].Tabs[idx].Title
                        }
                        onChange={(e) => {
                          this.setArr(
                            e.target.value,
                            "Product Most Viewed",
                            "Tabs",
                            idx,
                            e.target.name
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Type
                    </label>
                    <div className="col-md-9">
                      <select
                        name="Type"
                        className="form-control custom-select-black product-type"
                        value={
                          this.state.data["Product Most Viewed"].Tabs[idx].Type
                        }
                        onChange={(e) => {
                          this.setArr(
                            "",
                            "Product Most Viewed",
                            "Tabs",
                            idx,
                            "CategoryId"
                          );
                          this.setArr(
                            "",
                            "Product Most Viewed",
                            "Tabs",
                            idx,
                            "ProductsLimit"
                          );
                          this.setArr(
                            [],
                            "Product Most Viewed",
                            "Tabs",
                            idx,
                            "ProductIds"
                          );
                          this.setArr(
                            e.target.value,
                            "Product Most Viewed",
                            "Tabs",
                            idx,
                            e.target.name
                          );
                        }}
                      >
                        <option value="">Please Select</option>
                        <option value={"Category Products"}>
                          Category Products
                        </option>
                        <option value={"Latest Products"}>
                          Latest Products
                        </option>
                        {/* <option value={"Recently Viewed Products"}>
                          Recently Viewed Products
                        </option> */}
                        <option value={"Custom Products"}>
                          Custom Products
                        </option>
                      </select>
                    </div>
                  </div>
                  {this.state.data["Product Most Viewed"].Tabs[idx].Type ==
                  "Category Products" ? (
                    <div className="category-products ">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Category
                        </label>
                        <div className="col-md-9">
                          <MultiSelect
                            onChange={(val) => {
                              this.setArr(
                                val,
                                "Product Most Viewed",
                                "Tabs",
                                idx,
                                "CategoryId"
                              );
                            }}
                            singleSelect={true}
                            largeData={true}
                            options={this.state.categoryOptions}
                            defaultValue={
                              this.state.data["Product Most Viewed"].Tabs[idx]
                                .Category?._id
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.data["Product Most Viewed"].Tabs[idx].Type ==
                    "Latest Products" ||
                  this.state.data["Product Most Viewed"].Tabs[idx].Type ==
                    "Recently Viewed Products" ? (
                    <div className="products-limit">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Products Limit
                        </label>
                        <div className="col-md-9">
                          <input
                            name="ProductsLimit"
                            className="form-control "
                            type="number"
                            value={
                              this.state.data["Product Most Viewed"].Tabs[idx]
                                .ProductsLimit
                            }
                            onChange={(e) => {
                              this.setArr(
                                e.target.value,
                                "Product Most Viewed",
                                "Tabs",
                                idx,
                                e.target.name
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.data["Product Most Viewed"].Tabs[idx].Type ==
                  "Custom Products" ? (
                    <div className="custom-products ">
                      <div className="form-group">
                        <label className="col-md-3 control-label text-left">
                          Products
                        </label>
                        <div className="col-md-9">
                          <MultiSelect
                            onChange={(val) => {
                              this.setArr(
                                val.split(","),
                                "Product Most Viewed",
                                "Tabs",
                                idx,
                                "ProductIds"
                              );
                            }}
                            largeData={true}
                            options={this.state.productOptions}
                            defaultValue={this.state.data[
                              "Product Most Viewed"
                            ].Tabs[idx].ProductIds.toString()}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }else if (this.state.activePanel == "onecolbanner") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">One Column Banner</h3>
          <div className="accordion-box-content">
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Section Status
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="SectionStatus"
                        checked={
                          this.state.data["One Column Banner"].SectionStatus
                        }
                        onChange={(e) => {
                          this.setVal(
                            !this.state.data["One Column Banner"].SectionStatus,
                            "One Column Banner",
                            e.target.name
                          );
                        }}
                        id="storefront_one_column_banner_enabled"
                      />
                      <label htmlFor="storefront_one_column_banner_enabled">
                        Enable One column banner section
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content clearfix">
              <div className="panel-wrap">
                {this.state.data["One Column Banner"].Banners.map(
                  (val, idx) => (
                    <div className="panel" key={idx}>
                      <div className="panel-header">
                        <h5>Banner {idx + 1}</h5>
                      </div>
                      <div className="panel-body">
                        <div
                          className="panel-image"
                          onClick={() => {
                            this.setState({
                              showModal: true,
                              multiple: false,
                              imageFor: idx,
                            });
                          }}
                        >
                          {this.state.data["One Column Banner"].Banners[idx]
                            .image ? (
                            <img
                              src={
                                siteUrl +
                                this.state.data["One Column Banner"].Banners[
                                  idx
                                ].image
                              }
                            />
                          ) : (
                            <div className="placeholder">
                              <i className="fa fa-picture-o" />
                            </div>
                          )}
                        </div>
                        <div className="panel-content clearfix">
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                              <div className="form-group">
                                <label htmlFor="storefront_slider_banner_1-call-to-action-url">
                                  Call to Action URL
                                </label>
                                <input
                                  type="text"
                                  name="CalltoActionURL"
                                  className="form-control"
                                  value={
                                    this.state.data["One Column Banner"]
                                      .Banners[idx].CalltoActionURL
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      e.target.value,
                                      "One Column Banner",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6">
                              <div className="checkbox">
                                <input
                                  type="checkbox"
                                  name="OpenInNewWindow"
                                  id={
                                    "one_slider_banner-open-in-new-window" + idx
                                  }
                                  checked={
                                    this.state.data["One Column Banner"]
                                      .Banners[idx].OpenInNewWindow
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      !this.state.data["One Column Banner"]
                                        .Banners[idx].OpenInNewWindow,
                                      "One Column Banner",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={
                                    "one_slider_banner-open-in-new-window" + idx
                                  }
                                >
                                  Open in new window
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "topcategories") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Popular Categories</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Section Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="SectionStatus"
                      id="storefront_top_brands_section_enabled"
                      checked={this.state.data.TopCategories.SectionStatus}
                      onChange={(e) => {
                        this.setVal(
                          !this.state.data.TopCategories.SectionStatus,
                          "TopCategories",
                          e.target.name
                        );
                      }}
                    />
                    <label htmlFor="storefront_top_brands_section_enabled">
                      Enable popular categories section
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Popular Categories
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      const { data } = this.state;
                      data.TopCategories.TopCategoriesIds = val.split(",");
                      this.setState({ data });
                    }}
                    options={this.state.categoryOptions}
                    defaultValue={this.state.data.TopCategories.TopCategoriesIds.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "sixcolbanners") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Six Column Banners</h3>
          <div className="accordion-box-content">
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Section Status
                  </label>
                  <div className="col-md-9">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="SectionStatus"
                        checked={
                          this.state.data["Six Column Banner"].SectionStatus
                        }
                        onChange={(e) => {
                          this.setVal(
                            !this.state.data["Six Column Banner"].SectionStatus,
                            "Six Column Banner",
                            e.target.name
                          );
                        }}
                        id="storefront_three_column_banners_enabled"
                      />
                      <label htmlFor="storefront_three_column_banners_enabled">
                        Enable six column banners section
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content clearfix">
              <div className="panel-wrap">
                {this.state.data["Six Column Banner"].Banners.map(
                  (val, idx) => (
                    <div className="panel" key={idx}>
                      <div className="panel-header">
                        <h5>Banner {idx + 1}</h5>
                      </div>
                      <div className="panel-body">
                        <div
                          className="panel-image"
                          onClick={() => {
                            this.setState({
                              showModal: true,
                              multiple: false,
                              imageFor: idx,
                            });
                          }}
                        >
                          {this.state.data["Six Column Banner"].Banners[idx]
                            .image ? (
                            <img
                              src={
                                siteUrl +
                                this.state.data["Six Column Banner"].Banners[
                                  idx
                                ].image
                              }
                            />
                          ) : (
                            <div className="placeholder">
                              <i className="fa fa-picture-o" />
                            </div>
                          )}
                        </div>
                        <div className="panel-content clearfix">
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                              <div className="form-group">
                                <label htmlFor="storefront_slider_banner_1-call-to-action-url">
                                  Call to Action URL
                                </label>
                                <input
                                  type="text"
                                  name="CalltoActionURL"
                                  className="form-control"
                                  value={
                                    this.state.data["Six Column Banner"]
                                      .Banners[idx].CalltoActionURL
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      e.target.value,
                                      "Six Column Banner",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6">
                              <div className="checkbox">
                                <input
                                  type="checkbox"
                                  name="OpenInNewWindow"
                                  id={
                                    "three_col_banner-open-in-new-window" + idx
                                  }
                                  checked={
                                    this.state.data["Six Column Banner"]
                                      .Banners[idx].OpenInNewWindow
                                  }
                                  onChange={(e) => {
                                    this.setArr(
                                      !this.state.data["Six Column Banner"]
                                        .Banners[idx].OpenInNewWindow,
                                      "Six Column Banner",
                                      "Banners",
                                      idx,
                                      e.target.name
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={
                                    "three_col_banner-open-in-new-window" + idx
                                  }
                                >
                                  Open in new window
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "clientreview") {
      return (
        <div className="tab-pane fade active in">
          <h3 className="tab-content-title">Client Reviews</h3>
          <div className="accordion-box-content">
            <div className="tab-content clearfix">
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Section Status
                    </label>
                    <div className="col-md-9">
                      <div className="checkbox">
                        <input
                          type="checkbox"
                          name="SectionStatus"
                          id="storefront_featured_categories_section_enabled"
                          checked={this.state.clientReviewData.sectionstatus}
                          onChange={(e) => {
                            this.setClientVal(
                              !this.state.clientReviewData.sectionstatus,
                              "sectionstatus",
                              ""
                            );
                          }}
                        />
                        <label htmlFor="storefront_featured_categories_section_enabled">
                          Enable client review section
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label text-left">
                      Section Title
                    </label>
                    <div className="col-md-9">
                      <input
                        name="SectionTitle"
                        className="form-control "
                        type="text"
                        value={this.state.clientReviewData.title}
                        onChange={(e) => {
                          this.setClientVal(e.target.value, "title", "");
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-wrap">
                <div className="panel">
                  <div className="panel-header">
                    <h5>Images & Reviews</h5>
                  </div>
                  {this.state.clientReviewData.banners.map((banner, key) => {
                    return (
                      <div className="panel-body" key={key}>
                        <div
                          className="panel-img-wrapper"
                          style={{ display: "flex" }}
                        >
                          <div className="form-group">
                            <label>Background Image</label>

                            <div
                              className="panel-image"
                              onClick={() => {
                                this.setState({
                                  showModal: true,
                                  multiple: false,
                                  imageFor: "img,"+key,
                                });
                              }}
                            >
                              {banner.img ? (
                                <img
                                  src={
                                    siteUrl + banner.image
                                  }
                                />
                              ) : (
                                <div className="placeholder">
                                  <i className="fa fa-picture-o" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Client Image</label>

                            <div
                              className="panel-image"
                              onClick={() => {
                                this.setState({
                                  showModal: true,
                                  multiple: false,
                                  imageFor: "smallimg,"+key,
                                });
                              }}
                            >
                              {banner.smallimg ? (
                                <img
                                  src={
                                    siteUrl + banner.smallimage
                                  }
                                />
                              ) : (
                                <div className="placeholder">
                                  <i className="fa fa-picture-o" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className="panel-content clearfix "
                          style={{ marginLeft: 0 }}
                        >
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-6 clearfix">
                              <div className="form-group">
                                <label>Client, Place</label>
                                <input
                                  type="text"
                                  name="title"
                                  className="form-control"
                                  value={
                                    banner.title
                                  }
                                  onChange={(e) => {
                                    this.setClientVal(
                                      e.target.value,
                                      "banners",
                                      e.target.name, 
                                      key
                                    );
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label>Review</label>
                                <textarea
                                  name="body"
                                  className="form-control"
                                  value={
                                    banner.body
                                  }
                                  onChange={(e) => {
                                    this.setClientVal(
                                      e.target.value,
                                      "banners",
                                      e.target.name, 
                                      key
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  render() {
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
            <h3>Storefront</h3>
            <ol className="breadcrumb">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="active">Storefront</li>
            </ol>
          </section>
          <Loading show={this.state.submitting} />
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
                                  this.setState({
                                    activeTab: "generalsettings",
                                  });
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
                                  this.state.activePanel == "logo"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "logo" });
                                }}
                              >
                                <a data-toggle="tab">Logo</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "menus"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "menus" });
                                }}
                              >
                                <a data-toggle="tab">Menus</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "footer"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "footer" });
                                }}
                              >
                                <a data-toggle="tab">Footer</a>
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
                                <a data-toggle="tab">Newsletter</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "features"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "features" });
                                }}
                              >
                                <a data-toggle="tab">Features</a>
                              </li>
                              {/* <li
                                className={
                                  this.state.activePanel == "productpage"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "productpage" });
                                }}
                              >
                                <a data-toggle="tab">Product Page</a>
                              </li> */}
                              <li
                                className={
                                  this.state.activePanel == "sociallinks"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "sociallinks" });
                                }}
                              >
                                <a data-toggle="tab">Social Links</a>
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
                                this.state.activeTab == "homepagesections"
                                  ? ""
                                  : "collapsed"
                              }
                              data-toggle="collapse"
                              onClick={() => {
                                if (
                                  this.state.activeTab == "homepagesections"
                                ) {
                                  this.setState({ activeTab: "none" });
                                } else {
                                  this.setState({
                                    activeTab: "homepagesections",
                                  });
                                }
                              }}
                            >
                              Home Page Sections
                            </a>
                          </h4>
                        </div>
                        <div
                          className={
                            this.state.activeTab == "homepagesections"
                              ? "panel-collapse collapse in"
                              : "panel-collapse collapse"
                          }
                        >
                          <div className="panel-body">
                            <ul className="accordion-tab nav nav-tabs">
                              {/* <li
                                className={
                                  this.state.activePanel == "sliderbanners"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "sliderbanners",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Slider Banners</a>
                              </li> */}
                              {/* <li
                                className={
                                  this.state.activePanel == "threecolfullwidth"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "threecolfullwidth",
                                  });
                                }}
                              >
                                <a data-toggle="tab">
                                  Three Column Full Width Banners
                                </a>
                              </li> */}
                              <li
                                className={
                                  this.state.activePanel == "featuredcategories"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "featuredcategories",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Featured Categories</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "topbrands"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState(
                                    { activePanel: "general" },
                                    () => {
                                      this.setState({
                                        activePanel: "topbrands",
                                      });
                                    }
                                  );
                                }}
                              >
                                <a data-toggle="tab">Top Brands</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "topcategories"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState(
                                    { activePanel: "general" },
                                    () => {
                                      this.setState({
                                        activePanel: "topcategories",
                                      });
                                    }
                                  );
                                }}
                              >
                                <a data-toggle="tab">Popular Categories</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "producttabs1"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "producttabs1",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Product Tabs One</a>
                              </li>

                              {/* <li
                                className={
                                  this.state.activePanel == "flashsale"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "flashsale" });
                                }}
                              >
                                <a data-toggle="tab">
                                  Flash Sale &amp; Vertical Products
                                </a>
                              </li> */}
                              {/* <li
                                className={
                                  this.state.activePanel == "twocolbanners"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "twocolbanners",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Two Column Banners</a>
                              </li> */}
                              <li
                                className={
                                  this.state.activePanel == "productgrid"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "productgrid" });
                                }}
                              >
                                {/* <a data-toggle="tab">Product Grid</a> */}
                                <a data-toggle="tab">Category Row</a>
                              </li>
                              {/* <li
                                className={
                                  this.state.activePanel == "threecolbanners"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "threecolbanners",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Three Column Banners</a>
                              </li> */}
                              <li
                                className={
                                  this.state.activePanel == "producttabs2"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "producttabs2",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Product Tabs Two</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "productmostviewed"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "productmostviewed",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Product Most Viewed</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "clientreview"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "clientreview",
                                  });
                                }}
                              >
                                <a data-toggle="tab"> Client Reviews</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "onecolbanner"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "onecolbanner",
                                  });
                                }}
                              >
                                <a data-toggle="tab"> Banner</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "sixcolbanners"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "sixcolbanners",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Six Image Banner</a>
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
                        <div className=" col-md-10" style={{ display: "flex" }}>
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
                          {/* <Loading show={this.state.submitting} /> */}
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

export default withRouter(StoreFront);
