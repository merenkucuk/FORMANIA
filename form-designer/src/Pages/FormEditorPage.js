import "../App.css";
import CompNavbar from "../Components/CompNavbar";
import List from "devextreme-react/list";
import React from "react";
import { useState, useEffect, useRef } from "react";
import Draggable from "../Draggable";
import Form, { Item } from "devextreme-react/form";
import Button from "devextreme-react/button";
import { Switch } from "devextreme-react/switch";
import BranchingPopup from "../Components/BranchingPopup";
import SelectBoxOptionsPopup from "../Components/SelectBoxOptionsPopup";
import notify from "devextreme/ui/notify";
import RadioButtonOptionsPopup from "../Components/RadioButtonOptionsPopup";
import { useLocation } from "react-router-dom";
import CommonFunctions from "../Components/CommonFunctions";
import ColorBox from "devextreme-react/color-box";

function FormEditorPage() {
  const [branchingPopupVisible, setBranchingPopupVisible] = useState(false);
  const [selectBoxOptionsPopupVisible, setSelectBoxOptionsPopupVisible] =
    useState(false);
  const [radioButtonOptionsPopupVisible, setRadioButtonOptionsPopupVisible] =
    useState(false);
  const { state } = useLocation();
  const showBranchingPopup = () => {
    setBranchingPopupVisible(true);
  };
  const hideBranchingPopup = () => {
    setBranchingPopupVisible(false);
  };

  const showSelectBoxOptionsPopup = () => {
    setSelectBoxOptionsPopupVisible(true);
  };

  const hideSelectBoxOptionsPopup = () => {
    setSelectBoxOptionsPopupVisible(false);
  };

  const showRadioButtonOptionsPopup = () => {
    setRadioButtonOptionsPopupVisible(true);
  };

  const hideRadioButtonOptionsPopup = () => {
    setRadioButtonOptionsPopupVisible(false);
  };

  var allComponents = [
    "TextArea",
    "InputBox",
    "Switch",
    "CheckBox",
    "FileUploader",
    //"StarRating",
    "RadioButtonGroup",
    "SelectBox",
  ];

  const [addedComponents, setAddedComponents] = useState([]);

  useEffect(() => {
    var branching = {};
    var SelectBoxOptions = {};
    var RadioButtonOptions = {};
    var pages = { Page1: {} };
    var data = JSON.parse(state);
    for (var key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }
      var page = data[key];
      pages[key] = page;
    }
    for (var pageNo in pages) {
      var page = pages[pageNo];
      if (page && page.components && page.components.length > 0) {
        for (var i = 0; i < page.components.length; i++) {
          var component = page.components[i];
          if (component.hasBranching == "true") {
            var branchesForThatComponent = JSON.parse(
              JSON.stringify(component.branches)
            );
            branching[component.name] = branchesForThatComponent;
          }
          if (component.name.startsWith("SelectBox")) {
            var selectBoxOptionsForThatComponent = JSON.parse(
              JSON.stringify(component.other.options)
            );
            SelectBoxOptions[component.name] = selectBoxOptionsForThatComponent;
          }
          if (component.name.startsWith("RadioButtonGroup")) {
            var radioButtonOptionsForThatComponent = JSON.parse(
              JSON.stringify(component.other.options)
            );
            RadioButtonOptions[component.name] =
              radioButtonOptionsForThatComponent;
          }
        }
      }
    }

    localStorage.branching = JSON.stringify(branching);
    localStorage.SelectBoxOptions = JSON.stringify(SelectBoxOptions);
    localStorage.RadioButtonOptions = JSON.stringify(RadioButtonOptions);
    localStorage.pages = JSON.stringify(pages);
    localStorage.setItem("currentPage", "Page1");
    commonFunctions.changePage(null, "Page1");
  }, []);

  localStorage.setItem("holdedItem", "h");
  var formData = {
    Name: "",
    Color: "",
    Width: "",
    Height: "",
    LocationX: "",
    LocationY: "",
    isRequired: "",
    isVisible: "",
  };
  var formDataOthers = {};
  const commonFunctions = new CommonFunctions(formData, formDataOthers);

  if (!("currentSelectedComponentName" in localStorage)) {
    localStorage.setItem("currentSelectedComponentName", formData.Name);
  }

  var otherPropertiesFormVisibility = false;

  const onItemHold = (e) => {
    localStorage.setItem("holdedItem", e.itemData);
  };

  const ListItem = (data) => {
    var classname = "";
    if (data == "TextArea") {
      classname = "dx-icon-font";
    } else if (data == "InputBox") {
      classname = "dx-icon-edit";
    } else if (data == "Switch") {
      classname = "dx-icon-pinright";
    } else if (data == "CheckBox") {
      classname = "dx-icon-todo";
    } else if (data == "FileUploader") {
      classname = "dx-icon-textdocument";
    } else if (data == "RadioButtonGroup") {
      classname = "dx-icon-isblank";
    } else if (data == "SelectBox") {
      classname = "dx-icon-fields";
    }
    return (
      <div
        draggable="true"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <b style={{ color: "navy" }}>{data}</b>
        <i
          className={classname}
          style={{ fontSize: "18px", color: "wheat" }}
        ></i>
      </div>
    );
  };

  const ListItem2 = (data) => {
    return (
      <div draggable="false">
        <b style={{ color: "navy" }}>{data}</b>
      </div>
    );
  };

  var formTemplateElement = useRef();
  var addedComponentsList = useRef();
  var configurationForm = useRef();
  var otherPropertiesForm = useRef();
  var branchingSwitch = useRef();
  var branchingButton = useRef();

  useEffect(() => {
    branchingButton.current.instance.option("disabled", true);
  }, []);

  useEffect(() => {
    formTemplateElement.current.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    formTemplateElement.current.addEventListener("drop", function (e) {
      e.preventDefault();
      var holdedItem = localStorage.getItem("holdedItem");
      const node = getItem(holdedItem);
      if (node != null) {
        node.addEventListener("click", commonFunctions.handleComponentClick);
        formTemplateElement.current.appendChild(node);
        var addedComponents =
          addedComponentsList.current.instance.option("items");
        if (addedComponents.includes(holdedItem)) {
          var ind = 1;
          while (true) {
            if (addedComponents.includes(holdedItem + "_" + ind)) {
              ind += 1;
              continue;
            } else {
              addedComponents.push(holdedItem + "_" + ind);
              node.setAttribute("id", holdedItem + "_" + ind);
              break;
            }
          }
        } else {
          addedComponents.push(holdedItem);
          node.setAttribute("id", holdedItem);
        }
        localStorage.setItem("holdedItem", "h");
        addedComponentsList.current.instance.option("items", addedComponents);
      }
    });
  }, [formTemplateElement, addedComponentsList]);

  function getItem(holdedItem) {
    const draggable = new Draggable();
    if (holdedItem == "Switch") {
      const node = document.createElement("label");
      node.classList.add("switch");
      const node2 = document.createElement("input");
      node2.setAttribute("type", "checkbox");
      const node3 = document.createElement("span");
      node3.classList.add("slider");
      node3.classList.add("round");
      node.appendChild(node2);
      node.appendChild(node3);
      node.className = "draggableDiv";
      draggable.dragElement(node);
      node.setAttribute("hasBranching", false);
      node.setAttribute("branchingEnabled", false);
      node.style.maxWidth = "500px";
      node.style.maxHeight = "500px";
      node.addEventListener("mousemove", commonFunctions.checkCursor);
      return node;
    } else if (holdedItem == "TextArea") {
      const node = document.createElement("textarea");
      node.className = "draggableDiv";
      draggable.dragElement(node);
      node.setAttribute("hasBranching", false);
      node.setAttribute("readonly", true);
      node.style.maxWidth = "500px";
      node.style.maxHeight = "500px";
      node.addEventListener("mousemove", commonFunctions.checkCursor);
      return node;
    } else if (holdedItem == "InputBox") {
      const node = document.createElement("textarea");
      node.className = "draggableDiv";
      draggable.dragElement(node);
      node.setAttribute("hasBranching", true);
      node.setAttribute("branchingEnabled", false);
      node.setAttribute("readonly", true);
      node.style.maxWidth = "500px";
      node.style.maxHeight = "500px";
      node.addEventListener("mousemove", commonFunctions.checkCursor);
      return node;
    } else if (holdedItem == "CheckBox") {
      const node = document.createElement("label");
      const node2 = document.createElement("input");
      node2.setAttribute("type", "checkbox");
      node2.style.width = "36px";
      node2.style.height = "36px";
      node.appendChild(node2);
      node.className = "draggableDiv";
      draggable.dragElement(node);
      node.setAttribute("hasBranching", false);
      node.setAttribute("branchingEnabled", false);
      node.style.maxWidth = "500px";
      node.style.maxHeight = "500px";
      node.addEventListener("mousemove", commonFunctions.checkCursor);
      return node;
    } else if (holdedItem === "FileUploader") {
      const fileUploaderButton = document.createElement("div");
      fileUploaderButton.className = "draggableDiv";
      fileUploaderButton.style.width = "100px";
      fileUploaderButton.style.height = "30px";
      fileUploaderButton.style.backgroundColor = "lightblue";
      fileUploaderButton.style.border = "1px solid black";
      fileUploaderButton.style.textAlign = "center";
      fileUploaderButton.style.cursor = "move";
      fileUploaderButton.innerText = "File Uploader";
      fileUploaderButton.style.maxWidth = "500px";
      fileUploaderButton.style.maxHeight = "500px";
      fileUploaderButton.addEventListener(
        "mousemove",
        commonFunctions.checkCursor
      );
      draggable.dragElement(fileUploaderButton);
      return fileUploaderButton;
    } else if (holdedItem === "StarRating") {
      const starRatingContainer = document.createElement("div");
      starRatingContainer.className = "draggableDiv";
      starRatingContainer.style.display = "inline-block";
      starRatingContainer.style.fontSize = "30px";
      const stars = [];
      // Yıldızların oluşturulması ve olay dinleyicilerinin atanması
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.className = "star";
        star.innerText = "☆";
        star.style.cursor = "pointer";
        star.style.color = "gray";
        star.addEventListener("mouseover", () => {
          highlightStars(i);
        });
        star.addEventListener("mouseout", () => {
          resetStars();
        });
        star.addEventListener("click", () => {
          setRating(i);
        });
        stars.push(star);
        starRatingContainer.appendChild(star);
      }
      // Yıldızların vurgulanması
      function highlightStars(index) {
        for (let i = 0; i < index; i++) {
          stars[i].style.color = "gold";
        }
      }
      // Yıldızların sıfırlanması
      function resetStars() {
        for (let i = 0; i < stars.length; i++) {
          if (stars[i].classList.contains("selected")) {
            stars[i].style.color = "gold";
          } else {
            stars[i].style.color = "gray";
          }
        }
      }
      // Derecelendirmenin ayarlanması
      function setRating(rating) {
        for (let i = 0; i < stars.length; i++) {
          if (i < rating) {
            stars[i].classList.add("selected");
            stars[i].style.color = "gold";
            stars[i].innerText = "★";
          } else {
            stars[i].classList.remove("selected");
          }
        }
      }
      draggable.dragElement(starRatingContainer);
      formTemplateElement.current.appendChild(starRatingContainer);
      return starRatingContainer;
    } else if (holdedItem === "RadioButtonGroup") {
      var radioButtonGroup = document.createElement("div");
      radioButtonGroup.className = "draggableDiv";
      radioButtonGroup.style.display = "flex";
      radioButtonGroup.style.justifyContent = "space-evenly";
      var radioButton = document.createElement("input");
      radioButton.setAttribute("type", "radio");
      radioButton.setAttribute("name", commonFunctions.getRandomString(5));
      radioButtonGroup.appendChild(radioButton);
      radioButtonGroup.appendChild(radioButton.cloneNode(true));
      radioButtonGroup.setAttribute("hasBranching", false);
      radioButtonGroup.setAttribute("branchingEnabled", false);
      radioButtonGroup.style.maxWidth = "500px";
      radioButtonGroup.style.maxHeight = "500px";
      radioButtonGroup.addEventListener(
        "mousemove",
        commonFunctions.checkCursor
      );
      draggable.dragElement(radioButtonGroup);
      return radioButtonGroup;
    } else if (holdedItem == "SelectBox") {
      var div = document.createElement("div");
      const node = document.createElement("select");
      node.style.width = "100%";
      node.style.height = "100%";
      div.className = "draggableDiv";
      draggable.dragElement(div);
      div.setAttribute("hasBranching", false);
      div.setAttribute("branchingEnabled", false);
      div.style.maxWidth = "500px";
      div.style.maxHeight = "500px";
      div.addEventListener("mousemove", commonFunctions.checkCursor);
      div.appendChild(node);
      return div;
    } else {
      return null;
    }
  }

  function handleItemClick(e) {
    commonFunctions.makeDashed(document.getElementById(e.itemData));
    commonFunctions.formData.Name = e.itemData;
    const element = document.getElementById(e.itemData);
    if (element.hasAttribute("isRequired")) {
      commonFunctions.formData.isRequired =
        element.getAttribute("isRequired") === "true";
    } else {
      commonFunctions.formData.isRequired = false;
    }
    if (element.hasAttribute("isVisible")) {
      commonFunctions.formData.isVisible =
        element.getAttribute("isVisible") === "true";
    } else {
      commonFunctions.formData.isVisible = true;
    }
    commonFunctions.formData.Width = element.offsetWidth;
    commonFunctions.formData.Height = element.offsetHeight;
    commonFunctions.formData.LocationX =
      element.getBoundingClientRect().left - 464;
    commonFunctions.formData.LocationY =
      element.getBoundingClientRect().top - 70;
    commonFunctions.formData.Color = window
      .getComputedStyle(element, null)
      .getPropertyValue("background-color");
    configurationForm.current.instance.updateData(commonFunctions.formData);
    commonFunctions.setVisibilityOfOtherForm(commonFunctions.formData.Name);
    commonFunctions.setFormDataOthers(
      commonFunctions.formData.Name,
      element,
      "item"
    );
    commonFunctions.setBranchingPartVisibility(element);
    localStorage.setItem(
      "currentSelectedComponentName",
      commonFunctions.formData.Name
    );
    branchingSwitch.current.instance.option(
      "value",
      element.getAttribute("branchingEnabled") == "true"
    );
  }

  function handleItemDeleted(e) {
    if (addedComponentsList.current.props.dataSource.length == 0) {
      commonFunctions.setVisibilityOfOtherForm("");
    }
    const element = document.getElementById(e.itemData);
    formTemplateElement.current.removeChild(element);
  }

  function customizeItem(item) {
    if (item.dataField == "Name") {
      item.editorOptions = {
        readOnly: true,
      };
    } else if (item.dataField == "Width" || item.dataField == "Height") {
      item.editorType = "dxNumberBox";
      item.editorOptions = {
        min: 0,
        max: 500,
      };
    } else if (item.dataField == "LocationX") {
      item.editorType = "dxNumberBox";
      item.editorOptions = {
        readOnly: true,
      };
    } else if (item.dataField == "LocationY") {
      item.editorType = "dxNumberBox";
      item.editorOptions = {
        readOnly: true,
      };
    } else if (item.dataField == "Color") {
      item.editorType = "dxColorBox";
      item.editorOptions = {};
    } else if (item.dataField == "isRequired") {
      item.editorType = "dxCheckBox";
    } else if (item.dataField == "isVisible") {
      item.editorType = "dxCheckBox";
    }
  }

  function handleResetButton(e) {
    commonFunctions.formData.Color = "rgb(241,241,241)";
    commonFunctions.formData.LocationY = 0;
    commonFunctions.formData.LocationX = 0;
    commonFunctions.formData.Width = 208;
    commonFunctions.formData.Height = 48;
    commonFunctions.formData.isRequired = false;
    commonFunctions.formData.isVisible = true;
    configurationForm.current.instance.updateData(commonFunctions.formData);
    if (commonFunctions.formData.Name.startsWith("TextArea")) {
      commonFunctions.formDataOthers.Text = "";
    } else if (formData.Name.startsWith("InputBox")) {
      commonFunctions.formDataOthers.Hint = "";
    }
    otherPropertiesForm.current.instance.updateData(
      commonFunctions.formDataOthers
    );
    branchingSwitch.current.instance.option("value", false);
    handleChangeButton(e);
  }

  function handleChangeButton(e) {
    const element = document.getElementById(commonFunctions.formData.Name);
    if (element != null) {
      if (formData.Name.startsWith("CheckBox")) {
        element.firstChild.style.width =
          Math.min(
            commonFunctions.formData.Height,
            commonFunctions.formData.Width
          ) -
          8 +
          "px";
        element.firstChild.style.height =
          Math.min(
            commonFunctions.formData.Height,
            commonFunctions.formData.Width
          ) -
          8 +
          "px";
      } else if (commonFunctions.formData.Name.startsWith("TextArea")) {
        element.innerText = commonFunctions.formDataOthers.Text;
      } else if (commonFunctions.formData.Name.startsWith("InputBox")) {
        element.setAttribute(
          "placeholder",
          commonFunctions.formDataOthers.Hint
        );
      } else if (commonFunctions.formData.Name.startsWith("FileUploader")) {
        if (commonFunctions.formDataOthers.allowedTypes.length == 0) {
          notify(
            "Please choose at least 1 file type for FileUploader.",
            "error",
            2000
          );
          return;
        }
        element.setAttribute(
          "allowedtypes",
          commonFunctions.formDataOthers.allowedTypes
        );
      } else if (commonFunctions.formData.Name.startsWith("SelectBox")) {
        element.firstChild.style.backgroundColor = formData.Color;
      } else if (commonFunctions.formData.Name.startsWith("RadioButtonGroup")) {
        element.setAttribute(
          "alignment",
          commonFunctions.formDataOthers.Alignment
            ? commonFunctions.formDataOthers.Alignment
            : "horizontal"
        );
        if (element.getAttribute("alignment") == "vertical") {
          element.style.flexDirection = "column";
          element.style.alignItems = "flex-start";
          for (var c = 0; c < element.childNodes.length; c++) {
            var child = element.childNodes[c];
            child.style.marginLeft = "15%";
            child.style.alignSelf = "";
          }
        } else {
          element.style.flexDirection = "row";
          element.style.alignItems = "";
          for (var c = 0; c < element.childNodes.length; c++) {
            var child = element.childNodes[c];
            child.style.marginLeft = "";
            child.style.alignSelf = "center";
          }
        }
      }
      element.setAttribute("isRequired", commonFunctions.formData.isRequired);
      element.setAttribute("isVisible", commonFunctions.formData.isVisible);
      if (element.getAttribute("isvisible") == "false") {
        element.style.opacity = "0.4";
      } else {
        element.style.opacity = "1";
      }
      element.style.backgroundColor = commonFunctions.formData.Color;
      element.style.top = 70 + commonFunctions.formData.LocationY + "px";
      element.style.left = 464 + commonFunctions.formData.LocationX + "px";
      element.style.width = commonFunctions.formData.Width + "px";
      element.style.height = commonFunctions.formData.Height + "px";
      notify("Changes saved.", "success", 1000);
    }
  }

  function branchingSwitchValueChanged(e) {
    branchingButton.current.instance.option("disabled", !e.value);
    const element = document.getElementById(
      localStorage.getItem("currentSelectedComponentName")
    );
    element.setAttribute("branchingEnabled", e.value);
  }

  return (
    <div>
      <CompNavbar></CompNavbar>
      <div class="formEditorBg">
        <div class="solSideMenu">
          <div class="allComponentsBg">
            <h3 class="title">All Components</h3>
            <List
              dataSource={allComponents}
              height={300}
              itemHoldTimeout={10}
              onItemHold={onItemHold}
              itemRender={ListItem}
              id="allComponentsList"
            ></List>
          </div>
          <div class="addedComponentsBg">
            <h3 class="title">Added Components</h3>
            <List
              dataSource={addedComponents}
              height={200}
              itemRender={ListItem2}
              ref={addedComponentsList}
              allowItemDeleting={true}
              itemDeleteMode={"toggle"}
              onItemClick={handleItemClick}
              onItemDeleted={handleItemDeleted}
              id={"addedComponentsList"}
              selectionMode={"single"}
            ></List>
          </div>
        </div>
        <div
          class="formTemplate"
          id="formTemplate"
          ref={formTemplateElement}
        ></div>
        <div class="sagSideMenu">
          <div class="configurationBg">
            <h3 class="title">Configuration</h3>
            <h4>General</h4>
            <Form
              id="form"
              labelMode={"outside"}
              formData={commonFunctions.formData}
              readOnly={false}
              showColonAfterLabel={true}
              labelLocation={"left"}
              minColWidth={100}
              colCount={1}
              width={250}
              ref={configurationForm}
              customizeItem={customizeItem}
            />
            <hr></hr>
            <h4>Other</h4>
            <Form
              id="form2"
              labelMode={"outside"}
              formData={commonFunctions.formDataOthers}
              readOnly={false}
              showColonAfterLabel={true}
              labelLocation={"left"}
              minColWidth={100}
              colCount={1}
              width={250}
              ref={otherPropertiesForm}
              visible={otherPropertiesFormVisibility}
            >
              <Item
                editorOptions={{ elementAttr: { id: "Text" } }}
                dataField="Text"
              ></Item>
              <Item
                editorOptions={{ elementAttr: { id: "Hint" } }}
                dataField="Hint"
              ></Item>
              <Item
                editorOptions={{
                  elementAttr: { id: "Value" },
                  readOnly: true,
                  text: "Off",
                }}
                dataField="Value"
              ></Item>
              <Item
                editorOptions={{
                  elementAttr: { id: "selectOptions" },
                  text: "Options",
                  onClick: showSelectBoxOptionsPopup,
                }}
                editorType={"dxButton"}
                dataField="setOptions"
              ></Item>
              <Item
                editorOptions={{
                  elementAttr: { id: "allowedTypes" },
                  dataSource: [
                    ".pdf",
                    ".jpeg",
                    ".jpg",
                    ".png",
                    ".docx",
                    ".xlsx",
                  ],
                }}
                editorType={"dxTagBox"}
                dataField="allowedTypes"
              ></Item>
              <Item
                editorOptions={{
                  elementAttr: { id: "RadioButtonOptions" },
                  text: "Options",
                  onClick: showRadioButtonOptionsPopup,
                }}
                editorType={"dxButton"}
                dataField="ButtonOptions"
              ></Item>
              <Item
                editorOptions={{
                  elementAttr: { id: "RadioButtonAlignment" },
                  dataSource: ["horizontal", "vertical"],
                  value: "horizontal",
                }}
                editorType={"dxSelectBox"}
                dataField="Alignment"
              ></Item>
            </Form>
            <hr></hr>
            <h4>Branching</h4>
            <p style={{ display: "none" }} id="noBranchingText">
              No branching option for this component.
            </p>
            <div
              style={{ display: "none" }}
              id="branchingPart"
              class="buttonsDiv"
            >
              <Switch
                height={40}
                onValueChanged={branchingSwitchValueChanged}
                ref={branchingSwitch}
                id="branchingSwitch"
              ></Switch>
              <Button
                text="Branching"
                type="default"
                ref={branchingButton}
                onClick={showBranchingPopup}
              ></Button>
            </div>
            <hr></hr>
            <div class="buttonsDiv">
              <Button
                text="Reset"
                type="danger"
                onClick={handleResetButton}
              ></Button>
              <Button
                text="Change"
                type="success"
                onClick={handleChangeButton}
              ></Button>
            </div>
          </div>
        </div>
      </div>
      <BranchingPopup
        visibility={branchingPopupVisible}
        hidePopup={hideBranchingPopup}
      ></BranchingPopup>
      <SelectBoxOptionsPopup
        visibility={selectBoxOptionsPopupVisible}
        hidePopup={hideSelectBoxOptionsPopup}
      ></SelectBoxOptionsPopup>
      <RadioButtonOptionsPopup
        visibility={radioButtonOptionsPopupVisible}
        hidePopup={hideRadioButtonOptionsPopup}
      ></RadioButtonOptionsPopup>
    </div>
  );
}
// sidebars are made

export default FormEditorPage;
