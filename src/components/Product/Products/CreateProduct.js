import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import "./products.css";
import { format } from "timeago.js";
import BraftEditor from "braft-editor";
import table from "braft-extensions/dist/table";
import "braft-editor/dist/index.css";
import "braft-extensions/dist/table.css";
import api from "../../../apis/api";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import FileManager from "../../Media/FileManager";
import Related from "./Related";
import UpSells from "./UpSells";
import CrossSells from "./CrossSells";
import Validate from "../../../utils/validation";
import Loading from "../../Loading";
import { siteUrl } from "../../../utils/utils";
import { getMessage } from "../../AlertMessage";
import SortableContainer from "../../DND/SortableContainer";
import SortableItem from "../../DND/SortableItem";
import DragHandle from "../../DND/DragHandle";
import arrayMove from "array-move";
import { toast } from "react-toastify";

const options = {
  defaultColumns: 3,
  defaultRows: 2,
  withDropdown: false,
  columnResizable: true,
  exportAttrString: "",
};

BraftEditor.use(table(options));

class CreateProduct extends React.Component {
  state = {
    submitting: false,
    tableData: {
      columns: [
        {
          name: "Id",
          selector: "id",
          sortable: true,
          width: "60px",
        },
        {
          name: "Thumbnail",
          selector: "thumbnail",
          sortable: true,
          cell: (row) => (
            <img
              src={
                row.thumbnail
                  ? siteUrl + row.thumbnail
                  : "https://via.placeholder.com/60"
              }
              height={60}
              width={60}
            />
          ),
          width: "110px",
        },
        {
          name: "Name",
          selector: "name",
          sortable: true,
        },
        {
          name: "Price",
          selector: "price",
          sortable: true,
        },
        {
          name: "Status",
          selector: "status",
          sortable: true,
          cell: (row) => (
            <span className={row.status ? "dot green" : "dot red"}></span>
          ),
        },
        {
          name: "Created",
          selector: "created",
          sortable: true,
        },
      ],
      data: [],
    },
    showModal: false,
    multiple: false,
    categoryOptions: [],
    tagOptions: [],
    brands: [],
    taxes: [],
    baseImage: "",
    additionalImages: [],
    downloadFilenames: [],
    attributesOptions: {},
    optionsGlobal: [],
    selectedGlobalOption: {},
    activePanel: "general",
    activeTab: "basic",
    data: {
      name: "",
      taxClass: "",
      virtual: false,
      status: false,
      description: "",
      price: "",
      specialPrice: "",
      specialPriceType: "Fixed",
      speacialPriceStart: "",
      specialPriceEnd: "",
      inventoryManagement: false,
      Qty: "",
      SKU: "",
      stockAvailability: true,
      metaTitle: "",
      metaDescription: "",
      shortDescription: "",
      productNewFrom: "",
      productNewTo: "",
      options: [],
    },
    brandId: "",
    categoryIds: [],
    tagIds: [],
    baseImageId: "",
    additionalImageIds: [],
    relatedProductIds: [],
    upSellsIds: [],
    crossSellsIds: [],
    downloadsIds: [""],
    attributes: [
      {
        attributeId: "",
        value: [],
      },
    ],
    options: [
      // {
      //   name: "",
      //   type: "",
      //   required: false,
      //   value: [
      //     {
      //       label: "",
      //       price: "",
      //       priceType: "",
      //     },
      //   ],
      // },
    ],
    edit: "",
    errors: [],
    editorState: BraftEditor.createEditorState(),
    alertType: "",
    alertMessage: "",
    redirect: false,
    stocks: [],
    optionchange: false
  };

  componentDidMount() {
    const { brands } = this.state;
    api
      .post("/brand/get")
      .then((res) => {
        res.data.data.map((val) => {
          let tmp = {};
          tmp = {
            name: val.name,
            id: val._id,
          };
          if (val.status) brands.push(tmp);
        });
        this.setState({ brands });
      })
      .catch((err) => {
        console.log("error fetching brands");
      });
    const { taxes } = this.state;
    api
      .post("/tax/get")
      .then((res) => {
        res.data.data.map((val) => {
          let tmp = {};
          tmp = {
            name: val.taxClass,
            id: val._id,
          };
          taxes.push(tmp);
        });
        this.setState({ taxes });
      })
      .catch((err) => {
        console.log("error fetching brands");
      });
    const { categoryOptions } = this.state;
    const { tagOptions } = this.state;
    const addToCategories = (x, sub) => {
      let tmp = {};
      let name = "";
      for (var i = 0; i < sub.length; i++) {
        name += "| - - ";
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
      .post("/tag/get")
      .then((res) => {
        res.data.data.forEach((val) => {
          let tmp = {};
          tmp = {
            label: val.name,
            value: val._id,
          };
          tagOptions.push(tmp);
        });
      })
      .catch((err) => {
        console.log("Error fetching tags");
      });
    this.setState({ tagOptions });
    const datalist = [];
    var i = 0;
    api
      .post("/product/get")
      .then((res) => {
        res.data.data.map((val) => {
          i++;
          var tmp = {
            id: i,
            thumbnail: val.baseImage ? val.baseImage.image : false,
            name: val["name"],
            price: val["price"],
            status: val.status,
            created: format(val["createdAt"]),
            upsells: this.state.upSellsIds.includes(val._id) ? true : false,
            crosssells: this.state.crossSellsIds.includes(val._id)
              ? true
              : false,
            _id: val["_id"],
          };
          datalist.push(tmp);
        });
        const { tableData } = this.state;
        tableData["data"] = datalist;
        this.setState({ tableData });
      })
      .catch((err) => {
        console.log(err);
      });

    api
      .post("/attribute/get")
      .then((res) => {
        const { attributesOptions } = this.state;
        res.data.data.map((val) => {
          let tmp = {
            attribute: val.name,
            values: val.value,
            id: val._id,
          };
          if (!(val.attributeSet.name in attributesOptions)) {
            attributesOptions[val.attributeSet.name] = [];
          }

          attributesOptions[val.attributeSet.name].push(tmp);
        });
        this.setState({ attributesOptions });
      })
      .catch((err) => {
        console.log("cannot fetch attribute");
      });
    api
      .post("/option/get")
      .then((res) => {
        const { optionsGlobal } = this.state;
        res.data.data.forEach((val) => {
          let tmp = {
            name: val.name,
            type: val.type,
            value: [],
          };
          val.values.forEach((item) => {
            let tmp2 = {
              label: item.label,
              price: item.price,
              priceType: item.priceType,
            };
            tmp.value.push(tmp2);
          });
          optionsGlobal.push(tmp);
        });
        this.setState({ optionsGlobal });
      })
      .catch((err) => {
        console.log("error fetching options");
      });
    if (this.props.edit == "true") {
      this.setState({ submitting: true });
      const url = "/product/get/" + this.props.match.params.id;
      api
        .get(url)
        .then((res) => {
          //console.log(res.data.data.inventoryManagement)
          let tmp = {
            name: res.data.data.name,
            taxClass: res.data.data.taxClass,
            virtual: res.data.data.virtual,
            status: res.data.data.status,
            description: res.data.data.description,
            price: res.data.data.price,
            specialPrice: res.data.data.specialPrice,
            specialPriceType: res.data.data.specialPriceType,
            specialPriceStart:
              res.data.data.specialPriceStart == null
                ? ""
                : res.data.data.specialPriceStart.substr(0, 10),
            specialPriceEnd:
              res.data.data.specialPriceEnd == null
                ? ""
                : res.data.data.specialPriceEnd.substr(0, 10),
            inventoryManagement: res.data.data.inventoryManagement,
            Qty: res.data.data.Qty,
            SKU: res.data.data.SKU,
            stockAvailability: res.data.data.stockAvailability,
            metaTitle: res.data.data.metaTitle ? res.data.data.metaTitle : "",
            metaDescription: res.data.data.metaDescription
              ? res.data.data.metaDescription
              : "",
            shortDescription: res.data.data.shortDescription
              ? res.data.data.shortDescription
              : "",
            productNewFrom:
              res.data.data.productNewFrom == null
                ? ""
                : res.data.data.productNewFrom.substr(0, 10),
            productNewTo:
              res.data.data.productNewTo == null
                ? ""
                : res.data.data.productNewTo.substr(0, 10),
            options: res.data.data.options,
            
          };
          const {
            tagIds,
            categoryIds,
            additionalImageIds,
            additionalImages,
            downloadFilenames,
            downloadsIds,
            relatedProductIds,
            upSellsIds,
            crossSellsIds,
          } = this.state;
          res.data.data.tags.forEach((tag) => {
            tagIds.push(tag._id);
          });
          res.data.data.categories.forEach((category) => {
            categoryIds.push(category._id);
          });

          if (res.data.data.additionalImages.length > 0) {
            res.data.data.additionalImages.forEach((image) => {
              additionalImageIds.push(image._id);
              additionalImages.push(image.image);
            });
          }
          if (res.data.data.attributes.length > 0) {
            const attributesNew = [];
            res.data.data.attributes.forEach((attr) => {
              let tmp = {
                attributeId: attr.attribute._id,
                value: attr.value,
              };
              attributesNew.push(tmp);
            });
            this.setState({ attributes: attributesNew });
          }
          if (res.data.data.downloads.length > 0) {
            downloadFilenames.splice(0, 1);
            downloadsIds.splice(0, 1);
            res.data.data.downloads.forEach((down) => {
              downloadFilenames.push(down.fileName);
              downloadsIds.push(down._id);
            });
          }
          if (res.data.data.relatedProducts.length > 0) {
            res.data.data.relatedProducts.forEach((prod) => {
              relatedProductIds.push(prod._id);
            });
          }
          if (res.data.data.upSells.length > 0) {
            res.data.data.upSells.forEach((prod) => {
              upSellsIds.push(prod._id);
            });
          }
          if (res.data.data.crossSells.length > 0) {
            res.data.data.crossSells.forEach((prod) => {
              crossSellsIds.push(prod._id);
            });
          }
          this.setState({
            submitting: false,
            data: tmp,
            relatedProductIds,
            upSellsIds,
            crossSellsIds,
            downloadFilenames,
            downloadsIds,
            brandId: res.data.data.brand ? res.data.data.brand._id : "",
            baseImage: res.data.data.baseImage
              ? res.data.data.baseImage.image
              : "",
            baseImageId: res.data.data.baseImage
              ? res.data.data.baseImage._id
              : "",
            additionalImageIds,
            additionalImages,
            editorState: BraftEditor.createEditorState(
              res.data.data.description
            ),
            options: res.data.data.options,
            tagIds,
            categoryIds,
          });
        })
        .catch((err) => {
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
      api
        .post("/product/stock/byproduct/get", {
          productId: this.props.match.params.id,
          requiredPermission: "Create Products",
        })
        .then((res) => {
          //console.log(res.data.data);
          const {stocks} = this.state
          res.data.data.forEach((stk=>{
            let temp = {
              stockId: stk._id,
              name: stk.name,
              price: this.state.data.price,
              qty: stk.qty
            }
            stocks.push(temp);
          }))
          this.setState({ stock: res.data.data,stocks });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } 
  setVal = (key, val) => {
    const { data } = this.state;
    data[key] = val;
    this.setState({ data });
  };
  setImageId = (id, multiple, image) => {
    if (multiple) {
      const { additionalImageIds } = this.state;
      const { additionalImages } = this.state;
      additionalImageIds.push(id);
      additionalImages.push(image);
      this.setState({ additionalImageIds, additionalImages });
    } else {
      this.setState({ baseImageId: id, baseImage: image });
    }
  };
  removeImageId = (id, multiple, image) => {
    if(multiple){
      const { additionalImageIds } = this.state;
      const { additionalImages } = this.state;
      additionalImageIds.splice(id,1)
      additionalImages.splice(id,1);
      this.setState({ additionalImageIds, additionalImages });
    }
  }
  setDownloadId = (id, multiple, image, filename) => {
    const { downloadsIds, downloadFilenames } = this.state;
    downloadsIds[downloadsIds.length - 1] = id;
    downloadFilenames.push(filename);
    this.setState({ downloadsIds });
  };
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.setVal("description", editorState.toHTML());
  };
  handleSubmit = () => {
    const { data, errors } = this.state;
    const required = ["name", "description", "price"];
    required.forEach((val) => {
      if (
        !errors.includes(val) &&
        !Validate.validateNotEmpty(data[val].toString())
      ) {
        errors.push(val);
        this.setState({ errors });
      } else if (errors.includes(val) && Validate.validateNotEmpty(data[val])) {
        errors.splice(errors.indexOf(val), 1);
        this.setState({ errors });
      }
    });
    if (!errors.includes("description") && data["description"] == "<p></p>") {
      errors.push("description");
      this.setState({ errors });
    } else if (
      errors.includes("description") &&
      Validate.validateNotEmpty(data["description"])
    ) {
      errors.splice(errors.indexOf("description"), 1);
      this.setState({ errors });
    }
    if (!Validate.validateNotEmpty(this.state.errors)) {
      this.setState({ submitting: true });
      data.options = this.state.options;
      const downloadsIdsNew = this.state.downloadsIds.filter((val) => {
        return val != "";
      });
      const attributesNew = this.state.attributes.filter((val) => {
        if (val.attributeId != "" && val.value.length > 0) {
          return val;
        }
      });
      if (this.props.edit == "true") {
        
        api
          .put("/product", {
            data: this.state.data,
            brandId: this.state.brandId,
            tagIds: this.state.tagIds,
            categoryIds: this.state.categoryIds,
            relatedProductIds: this.state.relatedProductIds,
            upSellsIds: this.state.upSellsIds,
            crossSellsIds: this.state.crossSellsIds,
            attributes: attributesNew,
            baseImageId: this.state.baseImageId,
            additionalImageIds: this.state.additionalImageIds,
            downloadsIds: downloadsIdsNew,
            requiredPermission: "Edit Products",
            _id: this.props.match.params.id,
          })
          .then((res) => {
            if(this.state.optionchange){
              api
              .post("/product/stock/create", {
                productId: res.data.data._id,
                requiredPermission: "Edit Products",
              })
              .then((res2) => {
                toast.success("Stock has been refreshed.", {
                  position: "bottom-right",
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
                window.location.reload();
              })
              .catch((err) => {
                toast.error(
                  `${
                    err.response && err.response.data
                      ? err.response.data.message
                      : "Could not add stock to product."
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
            }
            
            api.post("/product/stock/qty",{stocks: this.state.stocks,requiredPermission: "Edit Products"}).then(res=>{
              // console.log(res)
            }).catch(err=>console.log(err))
            this.setState({
              submitting: false,
              alertType: "success",
              alertMessage: "Product edited successfully.",
            });
          })
          .catch((err) => {
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
            this.setState({ submitting: false });
          });
      } else {
        api
          .post("/product", {
            data: this.state.data,
            brandId: this.state.brandId,
            tagIds: this.state.tagIds,
            categoryIds: this.state.categoryIds,
            relatedProductIds: this.state.relatedProductIds,
            upSellsIds: this.state.upSellsIds,
            crossSellsIds: this.state.crossSellsIds,
            attributes: attributesNew,
            baseImageId: this.state.baseImageId,
            additionalImageIds: this.state.additionalImageIds,
            downloadsIds: downloadsIdsNew,
            requiredPermission: "Create Products",
          })
          .then((res) => {
            let id = res.data.data._id;
            if (res.data.data.inventoryManagement) {
              api
                .post("/product/stock/create", {
                  productId: id,
                  requiredPermission: "Create Products",
                })
                .then((res2) => {
                  //console.log(res2);
                  toast.success("Stock added successfully.", {
                    position: "bottom-right",
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                })
                .catch((err) => {
                  toast.error(
                    `${
                      err.response && err.response.data
                        ? err.response.data.message
                        : "Could not add stock to product."
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
            }
            toast.success("Product added successfully.", {
              position: "bottom-right",
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            this.setState({ submitting: false, redirect: true });
          })
          .catch((err) => {
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
            this.setState({ submitting: false });
          });
      }
    } else {
      this.setState({
        alertType: "fail",
        alertMessage: "Please fill the following: " + errors,
      });
    }
  };
  uploadImageEditor = async (param) => {
    // const options = {
    //   maxSizeMB: 0.5,
    //   maxWidthOrHeight: 1920,
    //   useWebWorker: true,
    // };
    // const compressedFile = await imageCompression(param.file, options);
    var formData = new FormData();
    await formData.append("image", param.file);
    api
      .post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        param.success({
          url: siteUrl + res.data.data.image,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleAddRowDownload = () => {
    const { downloadsIds } = this.state;
    downloadsIds.push("");
    this.setState({ downloadsIds });
  };
  handleRemoveSpecificRowDownload = (idx) => {
    const { downloadsIds, downloadFilenames } = this.state;
    downloadsIds.splice(idx, 1);
    downloadFilenames.splice(idx, 1);
    this.setState({ downloadsIds, downloadFilenames });
  };
  handleAddRowAttribute = () => {
    const { attributes } = this.state;
    attributes.push({
      attributeId: "",
      value: "",
    });
    this.setState({ attributes });
  };
  handleRemoveSpecificRowAttribute = (idx) => {
    const { attributes } = this.state;
    attributes.splice(idx, 1);
    this.setState({ attributes, activePanel: "general" }, () => {
      this.setState({ activePanel: "attributes" });
    });
  };
  handleAddRowOption = () => {
    const { options } = this.state;
    options.push({
      name: "",
      type: "",
      required: false,
      value: [
        {
          label: "",
          price: "",
          priceType: "",
        },
      ],
    });
    this.setState({ options,optionchange: true });
  };
  handleRemoveSpecificRowOption = (idx) => {
    const { options } = this.state;
    options.splice(idx, 1);
    this.setState({ options, optionchange: true });
  };
  handleAddNewOptionValue = (idx) => {
    const { options } = this.state;
    options[idx].value.push({
      label: "",
      price: "",
      priceType: "",
    });
    this.setState({ options, optionchange: true });
  };
  handleRemoveSpecificOptionValue = (idx, idx2) => {
    const { options } = this.state;
    options[idx].value.splice(idx2, 1);
    this.setState({ options, optionchange: true });
  };
  onDownloadSortEnd = ({ oldIndex, newIndex }) => {
    let arr = arrayMove(this.state.downloadsIds, oldIndex, newIndex);
    let arr2 = arrayMove(this.state.downloadFilenames, oldIndex, newIndex);
    this.setState({ downloadsIds: arr, downloadFilenames: arr2 });
  };
  onAttributeSortEnd = ({ oldIndex, newIndex }) => {
    let arr = arrayMove(this.state.attributes, oldIndex, newIndex);
    this.setState({ attributes: arr });
  };
  onOptionSortEnd = ({ oldIndex, newIndex }) => {
    let arr = arrayMove(this.state.options, oldIndex, newIndex);
    this.setState({ options: arr, optionchange: true });
  };
  onOptionTypeSortEnd = (oldIndex, newIndex, idx) => {
    const { options } = this.state;
    options[idx].value = arrayMove(
      this.state.options[idx].value,
      oldIndex,
      newIndex
    );
    this.setState({ options, optionchange: true });
  };
  OptionTypeToggle = (idx) => {
    if (
      this.state.options[idx].type == "Dropdown" ||
      this.state.options[idx].type == "Checkbox" ||
      this.state.options[idx].type == "Custom Checkbox" ||
      this.state.options[idx].type == "Radio Button" ||
      this.state.options[idx].type == "Custom Radio Button" ||
      this.state.options[idx].type == "Multiple Select"
    ) {
      return (
        <div className="option-values clearfix">
          <div className="option-select m-b-15">
            <div className="table-responsive">
              <table className="options table table-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th>Label</th>
                    <th>Price</th>
                    <th>Price Type</th>
                    <th></th>
                  </tr>
                </thead>
                <SortableContainer
                  onSortEnd={({ oldIndex, newIndex }) => {
                    this.onOptionTypeSortEnd(oldIndex, newIndex, idx);
                  }}
                  useDragHandle
                >
                  <tbody id="select-values">
                    {this.state.options[idx].value.map((item, idx2) => (
                      <SortableItem key={idx2} index={idx2}>
                        <tr key={idx2} className="option-row">
                          <td className="text-center">
                            <DragHandle />
                          </td>
                          <td>
                            <div className="form-group">
                              <input
                                type="text"
                                name="label"
                                value={
                                  this.state.options[idx].value[idx2].label
                                }
                                className="form-control"
                                onChange={(e) => {
                                  const { options } = this.state;
                                  options[idx].value[idx2][e.target.name] =
                                    e.target.value;
                                  this.setState({ options });
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="form-group">
                              <input
                                type="text"
                                name="price"
                                value={
                                  this.state.options[idx].value[idx2].price
                                }
                                className="form-control"
                                onChange={(e) => {
                                  const { options } = this.state;
                                  options[idx].value[idx2][e.target.name] =
                                    e.target.value;
                                  this.setState({ options });
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <select
                              name="priceType"
                              className="form-control custom-select-black"
                              value={
                                this.state.options[idx].value[idx2].priceType
                              }
                              onChange={(e) => {
                                const { options } = this.state;
                                options[idx].value[idx2][e.target.name] =
                                  e.target.value;
                                this.setState({ options });
                              }}
                            >
                              <option value="fixed">Fixed</option>
                              <option value="percent">Percent</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-default delete-row"
                              onClick={(e) => {
                                this.handleRemoveSpecificOptionValue(idx, idx2);
                              }}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      </SortableItem>
                    ))}
                  </tbody>
                </SortableContainer>
              </table>
            </div>
            <button
              type="button"
              className="btn btn-default"
              onClick={() => this.handleAddNewOptionValue(idx)}
            >
              Add New Value
            </button>
          </div>
        </div>
      );
    } else if (
      this.state.options[idx].type == "Field" ||
      this.state.options[idx].type == "Textarea" ||
      this.state.options[idx].type == "Date" ||
      this.state.options[idx].type == "Date Time" ||
      this.state.options[idx].type == "Time"
    ) {
      return (
        <div className="option-values clearfix">
          <div className="table-responsive option-text">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Price</th>
                  <th>Price Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="option-row">
                  <td>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      value={this.state.options[idx].value[0].price}
                      onChange={(e) => {
                        const { options } = this.state;
                        options[idx].value[0][e.target.name] = e.target.value;
                        this.setState({ options });
                      }}
                    />
                  </td>
                  <td>
                    <select
                      name="priceType"
                      className="form-control custom-select-black"
                      value={this.state.options[idx].value[0].priceType}
                      onChange={(e) => {
                        const { options } = this.state;
                        options[idx].value[0][e.target.name] = e.target.value;
                        this.setState({ options });
                      }}
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percent">Percent</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };
  tabContentToggle = () => {
    if (this.state.activePanel == "general") {
      const { editorState } = this.state;
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">General</h3>
          <div className="form-group">
            <label htmlFor="name" className="col-md-2 control-label text-left">
              Name<span className="m-l-5 text-red">*</span>
            </label>
            <div className="col-md-10">
              <input
                name="name"
                className="form-control "
                type="text"
                value={this.state.data.name}
                onChange={(e) => {
                  this.setVal(e.target.name, e.target.value);
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="description"
              className="col-md-2 control-label text-left"
            >
              Description<span className="m-l-5 text-red">*</span>
            </label>
            <div className="col-md-10">
              <BraftEditor
                language="en"
                value={editorState}
                media={{ uploadFn: (param) => this.uploadImageEditor(param) }}
                onChange={(editorState) => this.onChange(editorState)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="brand_id"
                  className="col-md-3 control-label text-left"
                >
                  Brand
                </label>
                <div className="col-md-9">
                  <select
                    name="brandId"
                    className="form-control custom-select-black "
                    value={this.state.brandId?this.state.brandId:""}
                    onChange={(e) => {
                      this.setState({ brandId: e.target.value });
                    }}
                  >
                    <option value="">Please Select</option>
                    {this.state.brands.map((val, key) => {
                      return (
                        <option key={key} value={val.id}>
                          {val.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="categories[]"
                  className="col-md-3 control-label text-left"
                >
                  Categories
                </label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setState({ categoryIds: val.split(",") });
                    }}
                    options={this.state.categoryOptions}
                    defaultValue={this.state.categoryIds.toString()}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="tax_class_id"
                  className="col-md-3 control-label text-left"
                >
                  Tax Class
                </label>
                <div className="col-md-9">
                  <select
                    name="taxClass"
                    className="form-control custom-select-black "
                    value={this.state.data.taxClass?this.state.data.taxClass:""}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  >
                    <option value="">Please Select</option>
                    {this.state.taxes.map((val, key) => {
                      return (
                        <option key={key} value={val.id}>
                          {val.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">Tags</label>
                <div className="col-md-9">
                  <MultiSelect
                    onChange={(val) => {
                      this.setState({ tagIds: val.split(",") });
                    }}
                    options={this.state.tagOptions}
                    defaultValue={this.state.tagIds.toString()}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="virtual"
                  className="col-md-3 control-label text-left"
                >
                  Virtual
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="virtual"
                      id="virtual"
                      checked={this.state.data.virtual}
                      onChange={(e) => {
                        const { data } = this.state;
                        data.virtual = !this.state.data.virtual;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="virtual">
                      The product won't be shipped
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="is_active"
                  className="col-md-3 control-label text-left"
                >
                  Status
                </label>
                <div className="col-md-9">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="status"
                      id="is_active"
                      checked={this.state.data.status}
                      onChange={(e) => {
                        const { data } = this.state;
                        data.status = !this.state.data.status;
                        this.setState({ data });
                      }}
                    />
                    <label htmlFor="is_active">Enable the product</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "price") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Price</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label
                  htmlFor="price"
                  className="col-md-3 control-label text-left"
                >
                  Price<span className="m-l-5 text-red">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    name="price"
                    className="form-control "
                    min={0}
                    type="number"
                    value={this.state.data.price}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Special Price
                </label>
                <div className="col-md-9">
                  <input
                    name="specialPrice"
                    className="form-control "
                    min={0}
                    type="number"
                    value={this.state.data.specialPrice || ""}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="special_price_type"
                  className="col-md-3 control-label text-left"
                >
                  Special Price Type
                </label>
                <div className="col-md-9">
                  <select
                    name="specialPriceType"
                    className="form-control custom-select-black "
                    value={this.state.data.specialPriceType}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Percent">Percent</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Special Price Start
                </label>
                <div className="col-md-9">
                  <input
                    name="specialPriceStart"
                    className="form-control datetime-picker"
                    type="date"
                    value={this.state.data.specialPriceStart}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Special Price End
                </label>
                <div className="col-md-9">
                  <input
                    name="specialPriceEnd"
                    className="form-control datetime-picker"
                    type="date"
                    value={this.state.data.specialPriceEnd}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "inventory") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Inventory</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">SKU</label>
                <div className="col-md-9">
                  <input
                    name="SKU"
                    className="form-control "
                    type="text"
                    value={this.state.data.SKU}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Inventory Management
                </label>
                <div className="col-md-9">
                  <select
                    name="inventoryManagement"
                    className="form-control custom-select-black "
                    value={this.state.data.inventoryManagement}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  >
                    <option value={false}>Don't Track Inventory</option>
                    <option value={true}>Track Inventory</option>
                  </select>
                </div>
              </div>

              <div
                className={this.state.data.inventoryManagement ? "" : "hide"}
              >
                <div className="form-group">
                  <label
                    htmlFor="qty"
                    className="col-md-3 control-label text-left"
                  >
                    Qty<span className="m-l-5 text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      name="Qty"
                      className="form-control "
                      type="number"
                      min={0}
                      value={this.state.data.Qty?this.state.data.Qty:0}
                      onChange={(e) => {
                        this.setVal(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Stock Availability
                </label>
                <div className="col-md-9">
                  <select
                    name="stockAvailability"
                    className="form-control custom-select-black "
                    value={this.state.data.stockAvailability}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  >
                    <option value={true}>In Stock</option>
                    <option value={false}>Out of Stock</option>
                  </select>
                </div>
              </div>
              {this.state.stocks.length > 0 && this.state.data.inventoryManagement && (
                <div className="form-group">
                  <label className="col-md-3 control-label text-left">
                    Add Stock
                  </label>
                  <div
                    className="table-responsive "
                    style={{ height: "250px", overflowY: "auto" }}
                  >
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.stocks.map((item, key) => {
                          return (
                            <tr key={key}>
                              <td className="p-2">{item.name}</td>
                              <td className="p-2">
                                <input
                                  name="stockqty"
                                  className="form-control "
                                  type="number"
                                  min={0}
                                  placeholder={"Qty"}
                                  value={item.qty}
                                  onChange={(e) => {
                                    const {stocks} = this.state
                                    stocks[key].qty = e.target.value
                                    this.setState({stocks})
                                  }}
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  name="stockprice"
                                  className="form-control "
                                  type="number"
                                  min={0}
                                  placeholder={"Price"}
                                  value={item.price}
                                  onChange={(e) => {
                                    const {stocks} = this.state
                                    stocks[key].price = e.target.value
                                    this.setState({stocks})
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ color: "#777", padding: "0.5em" }}>
                    * Stock resets everytime the product options are changed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "images") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Images</h3>
          <div className="single-image-wrapper">
            <h4>Base Image</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() =>
                this.setState({ multiple: false, showModal: true })
              }
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="clearfix" />
            <div className="single-image image-holder-wrapper clearfix">
              {this.state.baseImage ? (
                <div className="image-holder">
                  <img
                    src={siteUrl + this.state.baseImage}
                    height={120}
                    width={120}
                  />
                   <button
                    type="button"
                    className="btn remove-image"
                    onClick={() => {
                      
                        this.setImageId("", false, "");
                  
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
          <div className="multiple-images-wrapper">
            <h4>Additional Images</h4>
            <button
              type="button"
              className="image-picker btn btn-default"
              onClick={() => this.setState({ multiple: true, showModal: true })}
            >
              <i className="fa fa-folder-open m-r-5" />
              Browse
            </button>
            <div className="multiple-images">
              <div className="col-md-12">
                <div className="row">
                  <div className="image-list image-holder-wrapper clearfix">
                    {this.state.additionalImages.length > 0 ? (
                      this.state.additionalImages.map((image, key) => {
                        return (
                          <div className="image-holder" key={key}>
                            <img
                              src={siteUrl + image}
                              height={120}
                              width={120}
                            />
                            <button
                              type="button"
                              className="btn remove-image"
                              onClick={() => {
                                  this.removeImageId(key, true, "")
                              }}
                  />
                          </div>
                        );
                      })
                    ) : (
                      <div className="image-holder placeholder cursor-auto">
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
    } else if (this.state.activePanel == "seo") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">SEO</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Meta Title
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    name="metaTitle"
                    className="form-control"
                    value={this.state.data.metaTitle}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="meta-description"
                  className="col-md-3 control-label text-left"
                >
                  Meta Description
                </label>
                <div className="col-md-9">
                  <textarea
                    name="metaDescription"
                    className="form-control"
                    rows={10}
                    cols={10}
                    value={this.state.data.metaDescription}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "attributes") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Attributes</h3>
          <div id="product-attributes-wrapper">
            <div className="table-responsive">
              <table className="options table table-bordered">
                <thead className="hidden-xs">
                  <tr>
                    <th />
                    <th>Attribute</th>
                    <th>Values</th>
                    <th />
                  </tr>
                </thead>
                <SortableContainer
                  onSortEnd={this.onAttributeSortEnd}
                  useDragHandle
                >
                  <tbody id="product-attributes">
                    {this.state.attributes.map((val, idx) => (
                      <SortableItem key={idx} index={idx}>
                        <tr key={idx}>
                          <td className="text-center">
                            <DragHandle />
                          </td>
                          <td>
                            <div className="form-group">
                              <label className="visible-xs">Attribute</label>
                              <select
                                name="attributeID"
                                className="form-control attribute custom-select-black"
                                value={this.state.attributes[idx].attributeId}
                                onChange={(e) => {
                                  const { attributes } = this.state;
                                  const arr =
                                    e.target.options[
                                      e.target.selectedIndex
                                    ].dataset.values.split(",");

                                  attributes[idx].attributeId = e.target.value;
                                  let tmparr = [];
                                  arr.map((val) => {
                                    let tmp = {
                                      label: val,
                                      value: val,
                                    };
                                    tmparr.push(tmp);
                                  });
                                  attributes[idx].value = [];
                                  attributes[idx].options = tmparr;
                                  this.setState({ attributes });
                                }}
                              >
                                <option value="">Please Select</option>
                                {Object.entries(
                                  this.state.attributesOptions
                                ).map(([key, val], idx2) => (
                                  <optgroup label={key} key={idx2}>
                                    {val.map((option, idx3) => (
                                      <option
                                        value={option.id}
                                        key={idx3}
                                        data-values={option.values}
                                      >
                                        {option.attribute}
                                      </option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="form-group">
                              <MultiSelect
                                options={this.state.attributes[idx].options}
                                onChange={(val) => {
                                  const { attributes } = this.state;
                                  attributes[idx].value = val.split(",");
                                  this.setState({ attributes });
                                }}
                                defaultValue={this.state.attributes[
                                  idx
                                ].value.toString()}
                              />
                            </div>
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-default delete-row"
                              data-toggle="tooltip"
                              onClick={(e) => {
                                this.handleRemoveSpecificRowAttribute(idx);
                              }}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      </SortableItem>
                    ))}
                  </tbody>
                </SortableContainer>
              </table>
            </div>
            <button
              type="button"
              className="btn btn-default"
              id="add-new-attribute"
              onClick={(e) => {
                this.handleAddRowAttribute();
              }}
            >
              Add New Attribute
            </button>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "options") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Options</h3>
          <SortableContainer onSortEnd={this.onOptionSortEnd} useDragHandle>
            <div id="options-group" className="sortable">
              {this.state.options.map((val, idx) => (
                <SortableItem key={idx} index={idx}>
                  <div
                    className="content-accordion panel-group options-group-wrapper"
                    id="option-0"
                    key={idx}
                  >
                    <div className="panel panel-default option">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a>
                            <DragHandle />
                            <span id="option-name" className="pull-left">
                              {this.state.options[idx].name != ""
                                ? this.state.options[idx].name
                                : "New Option"}
                            </span>
                          </a>
                        </h4>
                      </div>
                      <div className="panel-collapse collapse in">
                        <div className="panel-body">
                          <div className="new-option clearfix">
                            <div className="col-lg-6 col-md-12 p-l-0">
                              <div className="form-group">
                                <label htmlFor="option-0-name">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.options[idx].name}
                                  className="form-control option-name-field"
                                  onChange={(e) => {
                                    const { options } = this.state;
                                    options[idx].name = e.target.value;
                                    this.setState({ options });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-12 p-l-0">
                              <div className="form-group">
                                <label>Type</label>
                                <select
                                  name="type"
                                  value={this.state.options[idx].type}
                                  className="form-control custom-select-black"
                                  onChange={(e) => {
                                    const { options } = this.state;
                                    options[idx].type = e.target.value;
                                    this.setState({ options, optionchange: true });
                                  }}
                                >
                                  <option value="">Please Select</option>
                                  <optgroup label="Text">
                                    <option value="Field">Field</option>
                                    <option value="Textarea">Textarea</option>
                                  </optgroup>
                                  <optgroup label="Select">
                                    <option value="Dropdown">Dropdown</option>
                                    <option value="Checkbox">Checkbox</option>
                                    <option value={"Custom Checkbox"}>
                                      Custom Checkbox
                                    </option>
                                    <option value={"Radio Button"}>
                                      Radio Button
                                    </option>
                                    <option value={"Custom Radio Button"}>
                                      Custom Radio Button
                                    </option>
                                    <option value={"Multiple Select"}>
                                      Multiple Select
                                    </option>
                                  </optgroup>
                                  <optgroup label="Date">
                                    <option value="Date">Date</option>
                                    <option value="Date Time">
                                      Date &amp; Time
                                    </option>
                                    <option value="Time">Time</option>
                                  </optgroup>
                                </select>
                              </div>
                            </div>
                            <div className="checkbox">
                              <input
                                type="checkbox"
                                name="required"
                                className="form-control"
                                id={"option-0-is-required" + idx}
                                checked={this.state.options[idx].required}
                                onChange={() => {
                                  const { options } = this.state;
                                  options[idx].required =
                                    !this.state.options[idx].required;
                                  this.setState({ options, optionchange: true });
                                }}
                              />
                              <label htmlFor={"option-0-is-required" + idx}>
                                Required
                              </label>
                            </div>
                            <button
                              type="button"
                              className="btn btn-default delete-option pull-right"
                              onClick={() => {
                                this.handleRemoveSpecificRowOption(idx);
                              }}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </div>
                          <div className="clearfix" />
                          {this.OptionTypeToggle(idx)}
                        </div>
                      </div>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContainer>

          <div className="box-footer no-border p-t-0">
            <div className="form-group pull-left">
              <div className="col-md-10">
                <button
                  type="button"
                  className="btn btn-default m-r-10"
                  onClick={() => {
                    this.handleAddRowOption();
                  }}
                >
                  Add New Option
                </button>
              </div>
            </div>
            <div className="add-global-option clearfix pull-right">
              <div className="form-group pull-left">
                <select
                  className="form-control custom-select-black"
                  onChange={(e) => {
                    this.setState({
                      selectedGlobalOption:
                        this.state.optionsGlobal[e.target.value],
                    });
                  }}
                >
                  <option value="">Select Global Option</option>
                  {this.state.optionsGlobal.map((val, key) => (
                    <option value={key} key={key}>
                      {val.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-default"
                onClick={() => {
                  const { options } = this.state;
                  options.push(this.state.selectedGlobalOption);
                  this.setState({ options, selectedGlobalOption: {}, optionchange: true });
                }}
              >
                Add Global Option
              </button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "relatedProducts") {
      return (
        <Related
          tableData={this.state.tableData}
          setEdit={(id) => this.setState({ edit: id })}
          setIds={(ids) => {
            this.setState({ relatedProductIds: ids });
          }}
          getIds={this.state.relatedProductIds}
        />
      );
    } else if (this.state.activePanel == "upSells") {
      return (
        <UpSells
          tableData={this.state.tableData}
          setEdit={(id) => this.setState({ edit: id })}
          setIds={(ids) => {
            this.setState({ upSellsIds: ids });
          }}
          getIds={this.state.upSellsIds}
        />
      );
    } else if (this.state.activePanel == "crossSells") {
      return (
        <CrossSells
          tableData={this.state.tableData}
          setEdit={(id) => this.setState({ edit: id })}
          setIds={(ids) => {
            this.setState({ crossSellsIds: ids });
          }}
          getIds={this.state.crossSellsIds}
        />
      );
    } else if (this.state.activePanel == "additional") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Additional</h3>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Short Description
                </label>
                <div className="col-md-9">
                  <textarea
                    name="shortDescription"
                    className="form-control "
                    rows={10}
                    cols={10}
                    value={this.state.data.shortDescription}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Product New From
                </label>
                <div className="col-md-9">
                  <input
                    name="productNewFrom"
                    className="form-control datetime-picker"
                    type="date"
                    value={this.state.data.productNewFrom}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label text-left">
                  Product New To
                </label>
                <div className="col-md-9">
                  <input
                    name="productNewTo"
                    className="form-control datetime-picker"
                    type="date"
                    value={this.state.data.productNewTo}
                    onChange={(e) => {
                      this.setVal(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.activePanel == "downloads") {
      return (
        <div className="tab-pane fade in active">
          <h3 className="tab-content-title">Downloads</h3>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "\n    .slide {\n        border: 1px solid #e9e9e9;\n        border-radius: 3px;\n        margin-bottom: 15px;\n    }\n\n    .slide .slide-header {\n        padding: 15px;\n        background: #f6f6f7;\n        border-bottom: 1px solid #e9e9e9;\n    }\n\n    .slide .slide-header span {\n        font-size: 16px;\n    }\n\n    .slide .slide-body {\n        position: relative;\n        padding: 15px;\n    }\n\n    .product-downloads-wrapper .slide {\n        margin-bottom: 20px;\n    }\n\n    .product-downloads-wrapper .table > tbody > tr > td {\n        vertical-align: middle;\n    }\n\n    .product-downloads-wrapper .options .drag-icon {\n        margin-top: 3px;\n    }\n\n    .product-downloads-wrapper .choose-file-group {\n        display: flex;\n    }\n\n    .product-downloads-wrapper .download-name {\n        flex-grow: 1;\n    }\n\n    .product-downloads-wrapper .btn-choose-file {\n        margin-left: 8px;\n    }\n\n    @media  screen and (max-width: 767px) {\n        .product-downloads-wrapper .table > tbody > tr {\n            border-top: 1px solid #e9e9e9;\n        }\n\n        .product-downloads-wrapper .table > tbody > tr > td:nth-child(2),\n        .product-downloads-wrapper .table > tbody > tr > td:nth-child(3) {\n            display: block;\n            border: none;\n            width: auto;\n            padding-left: 15px;\n            padding-right: 15px;\n            text-align: left;\n            vertical-align: initial;\n        }\n\n        .product-downloads-wrapper .table > tbody > tr > td:nth-child(3) {\n            padding-bottom: 15px;\n        }\n\n        .product-downloads-wrapper .options .drag-icon {\n            margin-top: 0;\n        }\n    }\n",
            }}
          />
          <div
            id="product-downloads-wrapper"
            className="product-downloads-wrapper clearfix"
          >
            <div className="slide">
              <div className="slide-header clearfix">
                <span className="pull-left">Downloadable Files</span>
              </div>
              <div className="slide-body">
                <div className="table-responsive">
                  <table className="options table table-bordered">
                    <thead className="hidden-xs">
                      <tr>
                        <th />
                        <th>File</th>
                        <th />
                      </tr>
                    </thead>
                    <SortableContainer
                      onSortEnd={this.onDownloadSortEnd}
                      useDragHandle
                    >
                      <tbody>
                        {this.state.downloadsIds.map((val, idx) => (
                          <SortableItem key={idx} index={idx}>
                            <tr key={idx}>
                              <td className="text-center">
                                <DragHandle />
                              </td>
                              <td>
                                <div className="form-group">
                                  <label className="visible-xs">File</label>
                                  <div className="choose-file-group">
                                    <input
                                      type="text"
                                      value={this.state.downloadFilenames[idx]}
                                      className="form-control download-name"
                                      readOnly={true}
                                    />
                                    <span
                                      className="btn btn-default btn-choose-file"
                                      onClick={() =>
                                        this.setState({
                                          multiple: false,
                                          showModal: true,
                                        })
                                      }
                                    >
                                      Choose
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-default delete-row"
                                  data-toggle="tooltip"
                                  data-title="Delete File"
                                  onClick={() =>
                                    this.handleRemoveSpecificRowDownload(idx)
                                  }
                                >
                                  <i className="fa fa-trash" />
                                </button>
                              </td>
                            </tr>
                          </SortableItem>
                        ))}
                      </tbody>
                    </SortableContainer>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => {
                    this.handleAddRowDownload();
                  }}
                >
                  Add New File
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  closeAlert = () => {
    this.setState({ alertType: "" });
  };
  render() {
    if (this.state.edit != "") {
      return <Redirect to={"/products/" + this.state.edit + "/edit"} />;
    } else if (this.state.redirect) {
      return <Redirect to={"/products"} />;
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
              <h3>Edit Product</h3>
            ) : (
              <h3>Create Product</h3>
            )}
            <ol className="breadcrumb">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              {this.props.edit == "true" ? (
                <li className="active">Edit Product</li>
              ) : (
                <li className="active">Create Product</li>
              )}
            </ol>
          </section>
          <Loading show={this.state.submitting} />
          <section className="content">
            {getMessage(
              this.state.alertType,
              this.state.alertMessage,
              this.closeAlert
            )}
            <form className="form-horizontal">
              <div className="accordion-content clearfix">
                <div className="col-lg-3 col-md-4">
                  <div className="accordion-box">
                    <div className="panel-group" id="ProductTabs">
                      <div className="panel panel-default">
                        <div className="panel-heading">
                          <h4 className="panel-title">
                            <a
                              className={
                                this.state.activeTab == "basic"
                                  ? ""
                                  : "collapsed"
                              }
                              data-toggle="collapse"
                              data-parent="#ProductTabs"
                              onClick={() => {
                                if (this.state.activeTab == "basic") {
                                  this.setState({ activeTab: "none" });
                                } else {
                                  this.setState({ activeTab: "basic" });
                                }
                              }}
                            >
                              Basic Information
                            </a>
                          </h4>
                        </div>
                        <div
                          id="basic_information"
                          className={
                            this.state.activeTab == "basic"
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
                                  this.state.activePanel == "price"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "price" });
                                }}
                              >
                                <a data-toggle="tab">Price</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "inventory"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "inventory" });
                                }}
                              >
                                <a data-toggle="tab">Inventory</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "images"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "images" });
                                }}
                              >
                                <a data-toggle="tab">Images</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "downloads"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "downloads" });
                                }}
                              >
                                <a data-toggle="tab">Downloads</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "seo"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "seo" });
                                }}
                              >
                                <a data-toggle="tab">SEO</a>
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
                                this.state.activeTab == "advance"
                                  ? ""
                                  : "collapsed"
                              }
                              data-toggle="collapse"
                              data-parent="#ProductTabs"
                              onClick={() => {
                                if (this.state.activeTab == "advance") {
                                  this.setState({ activeTab: "none" });
                                } else {
                                  this.setState({ activeTab: "advance" });
                                }
                              }}
                            >
                              Advanced Information
                            </a>
                          </h4>
                        </div>
                        <div
                          id="advanced_information"
                          className={
                            this.state.activeTab == "advance"
                              ? "panel-collapse collapse in"
                              : "panel-collapse collapse"
                          }
                        >
                          <div className="panel-body">
                            <ul className="accordion-tab nav nav-tabs">
                              <li
                                className={
                                  this.state.activePanel == "attributes"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "attributes" });
                                }}
                              >
                                <a data-toggle="tab">Attributes</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "options"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "options" });
                                }}
                              >
                                <a data-toggle="tab">Options</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "relatedProducts"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({
                                    activePanel: "relatedProducts",
                                  });
                                }}
                              >
                                <a data-toggle="tab">Related Products</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "upSells"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "upSells" });
                                }}
                              >
                                <a data-toggle="tab">Up-Sells</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "crossSells"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "crossSells" });
                                }}
                              >
                                <a data-toggle="tab">Cross-Sells</a>
                              </li>
                              <li
                                className={
                                  this.state.activePanel == "additional"
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) => {
                                  this.setState({ activePanel: "additional" });
                                }}
                              >
                                <a data-toggle="tab">Additional</a>
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
                        <div
                          className=" col-md-10"
                          style={{ marginTop: "10px" }}
                        >
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

export default withRouter(CreateProduct);
