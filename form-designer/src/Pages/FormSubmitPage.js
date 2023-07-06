import { useEffect, useState, useRef } from "react";
import "../App.css";
import Button from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import TextBox from "devextreme-react/text-box";
import { Popup } from "devextreme-react/popup";
import SelectBox from "devextreme-react/select-box";
import SelectBoxUI from "devextreme/ui/select_box";

function FormSubmitPage() {
  if (!localStorage.getItem("accessedForms")) {
    localStorage.setItem("accessedForms", JSON.stringify([]));
  }
  if (!localStorage.getItem("accessedFormSubmits")) {
    localStorage.setItem("accessedFormSubmits", JSON.stringify([]));
  }
  const [viewSubmitsPopupVisible, setViewSubmitsPopupVisible] = useState(false);
  const [viewedPages, setViewedPages] = useState([]);
  const [currentPage, setCurrentPage] = useState("Page1");
  const [viewSubmitMode, setViewSubmitMode] = useState(false);

  const showViewSubmitsPopup = () => {
    setViewSubmitsPopupVisible(true);
  };
  const hideViewSubmitsPopup = () => {
    setViewSubmitsPopupVisible(false);
  };
  var paramsArray = window.location.search.substring(1).split("&");
  var params = {};
  const [temp, setTemp] = useState(0);
  const [formPassword, setFormPassword] = useState("");
  const [viewSubmitsPassword, setViewSubmitsPassword] = useState("");
  for (var i = 0; i < paramsArray.length; i++) {
    var key = paramsArray[i].split("=")[0];
    var value = paramsArray[i].split("=")[1];
    params[key] = value;
  }
  var formId;
  if ("formId" in params) {
    formId = params.formId;
  }
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  var pageSelectBox = useRef();

  useEffect(() => {
    if (temp == 0) {
      fetch("/api/v1/form/" + formId, requestOptions)
        .then((response) => response.json())
        .then(async (data) => {
          await processResponse(data);
          setFormPassword(
            data.formPassword && data.formPassword != ""
              ? data.formPassword
              : ""
          );
          setViewSubmitsPassword(
            data.viewSubmitsPassword && data.viewSubmitsPassword != ""
              ? data.viewSubmitsPassword
              : ""
          );
          setViewedPages(["Page1"]);
          setCurrentPage("Page1");
          setViewSubmitMode(false);
        })
        .catch((e) => console.log(e));
      fetch("/api/v1/submit/byFormId/" + formId, requestOptions)
        .then((response) => response.json())
        .then((data) => processResponseForSubmits(data))
        .catch((e) => console.log(e));
    }
  }, [temp]);

  function processResponseForSubmits(data) {
    document.getElementById("submits").innerHTML = "";
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var submit = data[i];
        var node = document.createElement("li");
        node.setAttribute("id", "submit_" + submit.id);
        node.style.marginTop = "5px";
        node.style.cursor = "pointer";
        node.addEventListener("click", handleViewSubmit);
        var node2 = document.createElement("div");
        node2.style.width = "75%";
        node2.innerHTML = submit.submitDate;
        node.appendChild(node2);
        document.getElementById("submits").appendChild(node);
      }
      document.getElementById("noSubmissionText").style.display = "none";
    } else if (
      document.getElementById("submits").childNodes &&
      document.getElementById("submits").childNodes.length > 0
    ) {
      document.getElementById("noSubmissionText").style.display = "none";
    } else {
      document.getElementById("noSubmissionText").style.display = "block";
    }
  }

  function compareDates(d1, d2) {
    if (d1.getTime() > d2.getTime()) {
      return false;
    } else {
      return true;
    }
  }

  async function processResponse(data) {
    if (temp > 0) {
      return;
    }
    if ("message" in data) {
      console.log(data.message);
      return;
    }
    document.getElementById("formName").innerHTML = data.name;
    if (data.formEndDate) {
      document.getElementById("formEndDate").innerHTML =
        data.formEndDate.replace("T", " ");
    }
    var formData = JSON.parse(data.formData);
    localStorage.setItem("pages", JSON.stringify(formData));
    var formTemplateElement = document.getElementById("formTemplate");
    formTemplateElement.innerHTML = "";
    formTemplateElement.classList.remove("disabled");
    var firstPage = formData["Page1"];
    for (var i = 0; i < firstPage.components.length; i++) {
      const node = await getComponent(firstPage.components[i]);
      formTemplateElement.appendChild(node);
    }
    var pageNumbers = [];
    for (var pageNo in formData) {
      var no = parseInt(pageNo.replace("Page", ""));
      pageNumbers.push(no);
    }
    pageNumbers.sort();
    for (var i = 0; i < pageNumbers.length; i++) {
      pageNumbers[i] = "Page" + pageNumbers[i];
    }
    var submitData = await getSubmitData();
    localStorage.setItem(
      "currentSubmitData",
      JSON.stringify({ Page1: submitData })
    );
    pageSelectBox.current.instance.option("dataSource", pageNumbers);
    var uploadsDiv = document.getElementById("uploadsDiv");
    uploadsDiv.style.display = "none";
    setTemp(temp + 1);
  }

  function getComponentsInThePage() {
    var components = [];
    var formTemplate = document.getElementById("formTemplate");
    for (var i = 0; i < formTemplate.childNodes.length; i++) {
      var nodeId = formTemplate.childNodes[i].id;
      if (nodeId == "fileNameDiv") {
        continue;
      }
      components.push(nodeId);
    }
    return components;
  }

  function checkInputBoxValue(id) {
    var elem = document.getElementById(id);
    if (!elem.hasAttribute("branches")) {
      return;
    }
    if (elem.getAttribute("branchingenabled") != "true") {
      return;
    }
    var value = elem.value;
    var branches = JSON.parse(elem.getAttribute("branches"));
    var components = getComponentsInThePage();
    for (var i = 0; i < components.length; i++) {
      var eliminate = 0;
      var includes = 0;
      var componentName = components[i];
      for (var j = 0; j < branches.length; j++) {
        var branch = branches[j];
        var inputs = branch.input.split("|");
        var condition = branch.condition;
        if (branch.selectedComponentNames.includes(componentName)) {
          includes = 1;
          if (condition == "equal") {
            if (!inputs.includes(value)) {
              eliminate = 1;
              break;
            }
          } else if (condition == "contains") {
            var contains = false;
            for (var z = 0; z < inputs.length; z++) {
              if (value.includes(inputs[z])) {
                contains = true;
                break;
              }
            }
            if (!contains) {
              eliminate = 1;
              break;
            }
          } else if (condition == "startsWith") {
            var startsWith = false;
            for (var z = 0; z < inputs.length; z++) {
              if (value.startsWith(inputs[z])) {
                startsWith = true;
                break;
              }
            }
            if (!startsWith) {
              eliminate = 1;
              break;
            }
          } else if (condition == "endsWith") {
            var endsWith = false;
            for (var z = 0; z < inputs.length; z++) {
              if (value.endsWith(inputs[z])) {
                endsWith = true;
                break;
              }
            }
            if (!endsWith) {
              eliminate = 1;
              break;
            }
          }
        } else {
          continue;
        }
      }
      if (eliminate == 0 && includes == 1) {
        var component = document.getElementById(componentName);
        if (component.getAttribute("isVisible") == "true") {
          component.style.visibility = "hidden";
        } else {
          component.style.visibility = "visible";
        }
        if (componentName.startsWith("InputBox") && id != componentName) {
          component.value = "";
          checkInputBoxValue(componentName);
        }
      } else if (eliminate == 1 && includes == 1) {
        var component = document.getElementById(componentName);
        if (component.getAttribute("isVisible") == "true") {
          component.style.visibility = "visible";
        } else {
          component.style.visibility = "hidden";
        }
        if (componentName.startsWith("InputBox") && id != componentName) {
          component.value = "";
          checkInputBoxValue(componentName);
        }
      } else {
        var component = document.getElementById(componentName);
        if (component.style.visibility == "visible") {
          component.style.visibility = "visible";
        } else {
          component.style.visibility = "hidden";
        }
      }
    }
  }

  async function getComponent(component) {
    var node;
    if (component.name.startsWith("Switch")) {
      node = document.createElement("label");
      node.classList.add("switch");
      const node2 = document.createElement("input");
      node2.setAttribute("type", "checkbox");
      const node3 = document.createElement("span");
      node3.classList.add("slider");
      node3.classList.add("round");
      node.appendChild(node2);
      node.appendChild(node3);
      node.childNodes[0].checked = component.other.value == "On" ? true : false;
    } else if (component.name.startsWith("TextArea")) {
      node = document.createElement("textarea");
      node.disabled = true;
      node.style.resize = "none";
      node.style.textAlign = "center";
      node.style.color = "black";
      node.innerHTML = component.other.text;
    } else if (component.name.startsWith("InputBox")) {
      node = document.createElement("input");
      node.setAttribute("type", "text");
      node.placeholder = component.other.hint;
      node.value = component.other.value ? component.other.value : "";
      node.addEventListener("keyup", (e) => {
        checkInputBoxValue(component.name);
      });
    } else if (component.name.startsWith("CheckBox")) {
      node = document.createElement("label");
      const node2 = document.createElement("input");
      node2.setAttribute("type", "checkbox");
      var size = Math.min(component.width, component.height);
      node2.style.width = size + "px";
      node2.style.height = size + "px";
      node2.checked = component.other.value == "On" ? true : false;
      node.appendChild(node2);
      node.style.textAlign = "center";
    } else if (component.name.startsWith("SelectBox")) {
      node = document.createElement("div");
      var options = component.other.options;
      var dxSelectBox = new SelectBoxUI(node);
      dxSelectBox.option(
        "value",
        component.other.value ? component.other.value : options[0]
      );
      dxSelectBox.option("items", options);
      var node = dxSelectBox.element();
    } else if (component.name.startsWith("RadioButtonGroup")) {
      node = document.createElement("div");
      node.style.justifyContent = "space-evenly";
      node.style.display = "flex";
      var options = component.other.options;
      var alignment = component.other.Alignment;
      node.setAttribute("alignment", alignment);
      if (alignment == "vertical") {
        node.style.flexDirection = "column";
        node.style.alignItems = "flex-start";
      } else {
        node.style.flexDirection = "row";
        node.style.alignItems = "";
      }
      var randomString = getRandomString(5);
      if (options) {
        for (var i = 0; i < options.length; i++) {
          var radioButton = document.createElement("input");
          radioButton.setAttribute("type", "radio");
          radioButton.setAttribute("name", randomString);
          var value = component.other.value ? component.other.value : "";
          if (value && value == options[i]) {
            radioButton.setAttribute("checked", true);
          }
          var label = document.createElement("label");
          label.style.alignSelf = "center";
          label.innerText = options[i];
          var div = document.createElement("div");
          div.appendChild(radioButton);
          div.appendChild(label);
          if (alignment == "vertical") {
            div.style.marginLeft = "15%";
            div.style.alignSelf = "";
          } else {
            div.style.marginLeft = "";
            div.style.alignSelf = "center";
          }
          node.appendChild(div);
        }
      }
    } else if (component.name.startsWith("FileUploader")) {
      node = document.createElement("input");
      node.setAttribute("type", "file");
      var allowedTypes = component.other.allowedTypes;
      node.setAttribute("accept", allowedTypes);
      node.setAttribute("allowedTypes", allowedTypes);
      node.setAttribute(
        "fileId",
        component.other.fileId ? component.other.fileId : ""
      );
      node.setAttribute(
        "hash",
        component.other.hash ? component.other.hash : null
      );
      var div = document.createElement("div");
      div.id = "fileNameDiv";
      if (component.other.fileName) {
        var fileName = component.other.fileName;
        var top = component.locationY;
        var height = parseInt(component.height);
        div.innerHTML = "";
        div.style.top = top + height + 5 + "px";
        div.style.left = component.locationX + "px";
        div.style.position = "absolute";
        div.style.fontSize = "12px";
        div.style.opacity = "0.5";
        div.innerText = fileName;
        document.getElementById("formTemplate").appendChild(div);
      }
      node.addEventListener("change", (e) => {
        if (e.target.files[0]) {
          if (e.target.files[0].size > 10000000) {
            e.target.value = "";
            notify("File size must be less than 10 MB.", "warning", 2000);
            return;
          }
        }
        var fileName = e.target.files[0] ? e.target.files[0].name : null;
        var top = parseInt(e.target.style.top.replace("px", ""));
        var height = parseInt(e.target.style.height.replace("px", ""));
        div.innerHTML = "";
        div.style.top = top + height + 5 + "px";
        div.style.left = e.target.style.left;
        div.style.position = "absolute";
        div.style.fontSize = "12px";
        div.style.opacity = "0.5";
        div.innerText = fileName;
        document.getElementById("formTemplate").appendChild(div);
      });
    } else if (component.name.startsWith("Image")) {
      var key = component.other.key;
      const requestOpts = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/api/v1/link/" + key, requestOpts);
      var responseJson = await response.json();
      var value = responseJson.data.value;
      node = document.createElement("img");
      node.setAttribute("src", value);
      node.setAttribute("key", key);
    } else {
      node = document.createElement("li");
    }
    node.style.position = "absolute";
    node.style.left = component.locationX + "px";
    node.style.top = component.locationY + "px";
    node.style.backgroundColor = component.color;
    node.style.width = component.width + "px";
    node.style.height = component.height + "px";
    node.setAttribute("id", component.name);
    node.setAttribute("isRequired", component.isRequired);
    node.setAttribute("isVisible", component.isVisible);
    if (node.getAttribute("isVisible") == "true") {
      node.style.visibility = "visible";
    } else {
      node.style.visibility = "hidden";
    }
    if (component.branches) {
      node.setAttribute("branches", JSON.stringify(component.branches));
    }
    node.setAttribute("hasbranching", component.hasBranching);
    node.setAttribute("branchingEnabled", component.branchingEnabled);
    return node;
  }

  function getRandomString(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async function getSubmitData() {
    var submitData = { components: [] };
    for (
      var i = 0;
      i < document.getElementById("formTemplate").childNodes.length;
      i++
    ) {
      var component = {};
      var formElement = document.getElementById("formTemplate");
      component.name = formElement.childNodes[i].id;
      component.color = window
        .getComputedStyle(formElement.childNodes[i], null)
        .getPropertyValue("background-color");
      var widthWithPx = window
        .getComputedStyle(formElement.childNodes[i], null)
        .getPropertyValue("width");
      component.width = widthWithPx.substring(0, widthWithPx.length - 2);
      var heightWithPx = window
        .getComputedStyle(formElement.childNodes[i], null)
        .getPropertyValue("height");
      component.height = heightWithPx.substring(0, heightWithPx.length - 2);
      var locationXWithPx = window
        .getComputedStyle(formElement.childNodes[i], null)
        .getPropertyValue("left");
      component.locationX = parseInt(
        locationXWithPx.substring(0, locationXWithPx.length - 2)
      );
      var locationYWithPx = window
        .getComputedStyle(formElement.childNodes[i], null)
        .getPropertyValue("top");
      component.locationY = parseInt(
        locationYWithPx.substring(0, locationYWithPx.length - 2)
      );
      component.isRequired = formElement.childNodes[i].getAttribute(
        "isrequired"
      )
        ? formElement.childNodes[i].getAttribute("isrequired")
        : false;
      component.isVisible =
        formElement.childNodes[i].style.visibility == "visible" ? true : false;
      component.other = {};
      if (component.name.startsWith("TextArea")) {
        component.other.text = formElement.childNodes[i].innerHTML;
      } else if (component.name.startsWith("InputBox")) {
        component.other.hint = formElement.childNodes[i].placeholder;
        component.other.value = formElement.childNodes[i].value;
      } else if (component.name.startsWith("Switch")) {
        component.other.value = formElement.childNodes[i].childNodes[0].checked
          ? "On"
          : "Off";
      } else if (component.name.startsWith("CheckBox")) {
        component.other.value = formElement.childNodes[i].firstChild.checked
          ? "On"
          : "Off";
      } else if (component.name.startsWith("SelectBox")) {
        var selectBox = SelectBoxUI.getInstance(formElement.childNodes[i]);
        var value = selectBox.option("value");
        var items = selectBox.option("items");
        component.other.options = items;
        component.other.value = value;
      } else if (component.name.startsWith("RadioButtonGroup")) {
        component.other.options = [];
        component.other.Alignment =
          formElement.childNodes[i].getAttribute("alignment");
        var checkedValue = "";
        for (
          var j = 0;
          j < formElement.childNodes[i].querySelectorAll("label").length;
          j++
        ) {
          var option =
            formElement.childNodes[i].querySelectorAll("label")[j].innerText;
          component.other.options.push(option);
          if (formElement.childNodes[i].querySelectorAll("input")[j].checked) {
            checkedValue = option;
          }
        }
        component.other.value = checkedValue;
      } else if (component.name.startsWith("FileUploader")) {
        var formData = new FormData();
        var file = formElement.childNodes[i].files
          ? formElement.childNodes[i].files[0]
          : null;
        formData.set("file", file);
        const requestOptions = {
          method: "POST",
          body: formData,
        };
        const response = await fetch("/api/v1/file", requestOptions);
        var responseJson = await response.json();
        component.other.hash = responseJson.data;
        component.other.allowedTypes =
          formElement.childNodes[i].getAttribute("allowedtypes");
        var fileName = document.getElementById("fileNameDiv")
          ? document.getElementById("fileNameDiv").innerText
          : null;
        if (!component.other.hash || component.other.hash == "null") {
          component.other.hash = formElement.childNodes[i].getAttribute("hash");
        }
        component.other.fileName = fileName;
      } else if (component.name.startsWith("Image")) {
        component.other.key = formElement.childNodes[i].getAttribute("key");
      } else {
        component = null;
      }
      if (formElement.childNodes[i].getAttribute("branches") && component) {
        component.branches = JSON.parse(
          formElement.childNodes[i].getAttribute("branches")
        );
      } else {
        if (component) {
          component.branches = {};
        }
      }
      if (component) {
        submitData.components.push(component);
      }
    }
    return submitData;
  }

  function handleViewSubmit(e) {
    if (
      !JSON.parse(localStorage.getItem("accessedFormSubmits")).includes(formId)
    ) {
      showViewSubmitsPopup();
      return;
    }
    for (
      var i = 0;
      i < document.getElementById("submits").childNodes.length;
      i++
    ) {
      document.getElementById("submits").childNodes[
        i
      ].children[0].style.backgroundColor = "transparent";
    }
    setViewedPages(["Page1"]);
    setCurrentPage("Page1");
    setViewSubmitMode(true);
    pageSelectBox.current.instance.option("value", "Page1");
    var submitId;
    if (e.target.children.length > 0) {
      if (e.target.children[0].style.backgroundColor == "brown") {
        e.target.children[0].style.backgroundColor = "transparent";
      } else {
        e.target.children[0].style.backgroundColor = "brown";
      }
      submitId = e.target.id.split("_")[1];
    } else {
      if (e.target.style.backgroundColor == "brown") {
        e.target.style.backgroundColor = "transparent";
      } else {
        e.target.style.backgroundColor = "brown";
      }
      submitId = e.target.parentElement.id.split("_")[1];
    }
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/v1/submit/" + submitId, requestOptions)
      .then((response) => response.json())
      .then(async (data) => await processResponseForViewingSubmit(data))
      .catch((e) => console.log(e));
  }

  async function processResponseForViewingSubmit(data) {
    var formTemplateElement = document.getElementById("formTemplate");
    formTemplateElement.innerHTML = "";
    var submitData = JSON.parse(data.submitData);
    localStorage.setItem("currentSubmitData", JSON.stringify(submitData));
    var hashes = [];
    for (var pageNo in submitData) {
      var submitDataForThatPage = submitData[pageNo];
      for (var i = 0; i < submitDataForThatPage.components.length; i++) {
        if (
          submitDataForThatPage.components[i].name.startsWith("FileUploader")
        ) {
          var hash = submitDataForThatPage.components[i].other.hash;
          hashes.push(hash);
        }
      }
    }
    await getPage("Page1");
    formTemplateElement.classList.add("disabled");
    var uploadsDiv = document.getElementById("uploadsDiv");
    if (hashes.length > 0) {
      uploadsDiv.style.display = "block";
      var uploadsList = document.getElementById("uploadsList");
      uploadsList.innerHTML = "";
      for (var i = 0; i < hashes.length; i++) {
        var li = document.createElement("li");
        li.innerText = "http://localhost:3000/uploads?hash=" + hashes[i];
        uploadsList.appendChild(li);
      }
    } else {
      uploadsDiv.style.display = "none";
    }
  }

  function checkRequiredFields(submitData) {
    for (var i = 0; i < submitData.components.length; i++) {
      var component = submitData.components[i];
      if (component.name.startsWith("InputBox")) {
        if (component.isRequired == "true" && component.other.value == "") {
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "red";
          }
          return false;
        } else {
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "black";
          }
        }
      } else if (component.name.startsWith("SelectBox")) {
        if (component.isRequired == "true" && component.other.value == "") {
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "red";
          }
          return false;
        } else {
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "black";
          }
        }
      } else if (component.name.startsWith("RadioButtonGroup")) {
        if (component.isRequired == "true" && component.other.value == "") {
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "red";
          }
          return false;
        } else {
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "black";
          }
        }
      } else if (component.name.startsWith("FileUploader")) {
        var extension =
          component.other.fileName &&
          component.other.fileName.split(".").length > 0
            ? component.other.fileName.split(".").pop()
            : "null";
        var doesContain = false;
        if (
          component.other.allowedTypes &&
          component.other.allowedTypes.includes(extension)
        ) {
          doesContain = true;
        }
        if (
          component.isRequired == "true" &&
          (component.other.hash == "" ||
            !component.other.hash ||
            component.other.hash == "null")
        ) {
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "red";
          }
          return false;
        } else {
          if (!doesContain) {
            return "Wrong file type!";
          }
          if (document.getElementById(component.name)) {
            document.getElementById(component.name).style.borderColor = "black";
          }
        }
      }
    }
    return true;
  }

  async function handleSubmit(e) {
    var reqOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    var res = await fetch("/api/v1/form/checkTime/" + formId, reqOptions);
    var resJSON = await res.json();
    if (resJSON && resJSON.data) {
      notify("This form has expired.", "warning", 2000);
      return;
    }
    var pageCount = 0;
    var pages = JSON.parse(localStorage.getItem("pages"));
    for (var pageNumber in pages) {
      pageCount += 1;
    }
    if (pageCount != viewedPages.length) {
      notify("There are still unseen pages in the form.", "warning", 2000);
      return;
    }
    var today = new Date();
    var date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var currentDateTime = date + " " + time;
    var allSubmitData = {};
    var currentSubmitData = JSON.parse(
      localStorage.getItem("currentSubmitData")
    );
    var submitData = await getSubmitData();
    var message = checkRequiredFields(submitData);
    if (typeof message == "string") {
      notify(message, "error", 2000);
      return;
    }
    if (!message) {
      notify("Please fill all required fields!", "error", 2000);
      return;
    }
    allSubmitData[currentPage] = submitData;
    for (var pageNumber in currentSubmitData) {
      if (pageNumber == currentPage) {
        continue;
      }
      var submitData = currentSubmitData[pageNumber];
      var message = checkRequiredFields(submitData);
      if (typeof message == "string") {
        notify(message, "error", 2000);
        return;
      }
      if (!message) {
        notify("Please fill all required fields!", "error", 2000);
        return;
      }
      allSubmitData[pageNumber] = submitData;
    }
    notify("Submit is successful.", "success", 2000);
    var data = {
      formId: formId,
      submitDate: currentDateTime,
      submitData: allSubmitData,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/v1/submit", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        var node = document.createElement("li");
        node.setAttribute("id", "submit_" + data.data.id);
        node.style.marginTop = "5px";
        node.style.cursor = "pointer";
        node.addEventListener("click", handleViewSubmit);
        var node2 = document.createElement("div");
        node2.style.width = "75%";
        node2.innerHTML = currentDateTime;
        node.appendChild(node2);
        document.getElementById("submits").appendChild(node);
        document.getElementById("noSubmissionText").style.display = "none";
        getPage("Page1");
        handleResetForm();
      })
      .catch((e) => console.log(e));
  }

  function handleEnterPasswordForViewingSubmits(e) {
    var enteredPassword = document
      .getElementById("enterPasswordTextBox2")
      .querySelector("input").value;
    if (viewSubmitsPassword != enteredPassword) {
      notify("Wrong password!", "error", 3000);
      return;
    } else {
      notify("You can view submits now.", "success", 2000);
      localStorage.setItem(
        "accessedFormSubmits",
        JSON.stringify(
          JSON.parse(localStorage.getItem("accessedFormSubmits")).concat(formId)
        )
      );
      hideViewSubmitsPopup();
    }
  }

  function handleEnterFormSubmit(e) {
    var enteredPassword = document
      .getElementById("enterPasswordTextBox")
      .querySelector("input").value;
    if (formPassword != enteredPassword) {
      notify("Wrong password!", "error", 3000);
      return;
    } else {
      notify("Correct password.", "success", 2000);
      localStorage.setItem(
        "accessedForms",
        JSON.stringify(
          JSON.parse(localStorage.getItem("accessedForms")).concat(formId)
        )
      );
      setTimeout(() => {
        window.location.reload(false);
      }, 2000);
    }
  }

  function handleResetForm() {
    setTemp(0);
  }

  async function getPage(pageNo) {
    var currentSubmitData = JSON.parse(
      localStorage.getItem("currentSubmitData")
    );
    var page = {};
    if (pageNo in currentSubmitData) {
      page = currentSubmitData[pageNo];
    } else {
      var pages = JSON.parse(localStorage.getItem("pages"));
      page = pages[pageNo];
    }
    var formTemplateElement = document.getElementById("formTemplate");
    formTemplateElement.innerHTML = "";
    if (viewSubmitMode) {
      formTemplateElement.classList.add("disabled");
    } else {
      formTemplateElement.classList.remove("disabled");
    }
    if (!page.components) {
      return;
    }
    for (var i = 0; i < page.components.length; i++) {
      const node = await getComponent(page.components[i]);
      formTemplateElement.appendChild(node);
    }
  }

  if (
    !JSON.parse(localStorage.getItem("accessedForms")).includes(formId) &&
    formPassword &&
    formPassword != ""
  ) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          backgroundColor: "wheat",
        }}
      >
        <h1 style={{ textAlign: "center", marginTop: "15%" }}>
          You have to enter password for viewing this form.
        </h1>
        <TextBox
          id="enterPasswordTextBox"
          style={{ left: "38%", position: "absolute", marginTop: "20px" }}
          placeholder="Enter password here..."
          width="25%"
        ></TextBox>
        <Button
          style={{ left: "48%", position: "absolute", marginTop: "80px" }}
          text="Enter"
          onClick={handleEnterFormSubmit}
        ></Button>
      </div>
    );
  }

  async function handleSelectBoxItemClick(e) {
    if (!viewedPages.includes(e.itemData)) {
      setViewedPages([...viewedPages, e.itemData]);
    }
    var submitData = await getSubmitData();
    var currentSubmitData = JSON.parse(
      localStorage.getItem("currentSubmitData")
    );
    currentSubmitData[currentPage] = submitData;
    localStorage.setItem(
      "currentSubmitData",
      JSON.stringify(currentSubmitData)
    );
    e.component.option("value", e.itemData);
    setCurrentPage(e.itemData);
    getPage(e.itemData);
  }

  return (
    <div class="formSubmitBg">
      <div class="submitsLayout">
        <h3 style={{ marginTop: "10px", textAlign: "center" }}>
          <b>Submissions</b>
        </h3>
        <div
          style={{
            width: "90%",
            backgroundColor: "chocolate",
            height: "92%",
            marginLeft: "15px",
            borderRadius: "10px",
          }}
        >
          <ol
            id="submits"
            style={{
              marginLeft: "50px",
              top: "10px",
              position: "relative",
              fontWeight: "bold",
              color: "white",
            }}
          ></ol>
          <h4
            style={{
              color: "white",
              textAlign: "center",
              position: "absolute",
              top: "50%",
              marginLeft: "2%",
            }}
            id="noSubmissionText"
          >
            No Submissions for Now.
          </h4>
        </div>
      </div>
      <div class="formLayout">
        <h3
          id="formName"
          style={{
            textAlign: "center",
            color: "darkblue",
            background:
              "linear-gradient(45deg, rgba(255,129,0,1) 0%, rgba(255,184,0,1) 50%, rgba(255,129,0,1) 100%)",
            height: "40px",
            paddingTop: "5px",
            margin: "0px",
          }}
        >
          formName
        </h3>
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div
            id="formTemplate"
            class="formTemplate"
            style={{ width: "67%", marginLeft: "20px", position: "relative" }}
          ></div>
          <div
            style={{
              width: "250px",
              marginLeft: "20px",
            }}
          >
            <h4
              style={{
                marginTop: "20px",
                marginLeft: "10px",
                textAlign: "center",
              }}
            >
              <u>End Date:</u>
            </h4>
            <h5 id="formEndDate" style={{ textAlign: "center" }}>
              No end date.
            </h5>
            <div
              id="uploadsDiv"
              style={{
                backgroundColor: "chocolate",
                display: "none",
                borderRadius: "20px",
                boxShadow: "2px 4px darkred",
              }}
            >
              <h4
                style={{
                  marginTop: "20px",
                  marginLeft: "10px",
                  textAlign: "center",
                  color: "wheat",
                }}
              >
                <u>Uploads</u>
              </h4>
              <ul
                id="uploadsList"
                style={{
                  marginTop: "20px",
                  marginLeft: "10px",
                  textAlign: "center",
                  color: "wheat",
                  wordWrap: "break-word",
                  fontSize: "15px",
                }}
              ></ul>
            </div>
            <div
              style={{
                bottom: "100px",
                position: "absolute",
                marginLeft: "15px",
                display: "flex",
                backgroundColor: "chocolate",
                padding: "10px",
                borderRadius: "10px",
                color: "whitesmoke",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              <p style={{ marginTop: "5px", marginRight: "5px" }}>
                <b>Pages:</b>
              </p>
              <SelectBox
                onItemClick={handleSelectBoxItemClick}
                onContentReady={(e) => {
                  e.component.option("value", "Page1");
                  if (!viewedPages.includes("Page1")) {
                    setViewedPages([...viewedPages, "Page1"]);
                  }
                }}
                width={"150px"}
                style={{ marginBottom: "5px" }}
                ref={pageSelectBox}
              ></SelectBox>
            </div>
            <Button
              style={{
                bottom: "25px",
                position: "absolute",
              }}
              width={"16%"}
              height={"30px"}
              type={"success"}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div class="submitsLayout">
        <h3 style={{ marginTop: "10px", textAlign: "center" }}>
          <b>Options</b>
        </h3>
        <div
          style={{
            width: "90%",
            backgroundColor: "chocolate",
            height: "92%",
            marginLeft: "15px",
            borderRadius: "10px",
          }}
        >
          <Button
            style={{ marginLeft: "30%", marginTop: "10px" }}
            text="Reset Form"
            onClick={handleResetForm}
          ></Button>
        </div>
      </div>
      <Popup
        visible={viewSubmitsPopupVisible}
        onHiding={hideViewSubmitsPopup}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showCloseButton={true}
        showTitle={true}
        title="You have to enter password for viewing submits of this form."
        width={800}
        height={200}
      >
        <TextBox
          id="enterPasswordTextBox2"
          style={{ position: "absolute", left: "25%", width: "50%" }}
          placeholder="enter Password..."
        ></TextBox>
        <Button
          style={{ marginTop: "60px", position: "absolute", left: "45%" }}
          onClick={handleEnterPasswordForViewingSubmits}
          text="Enter"
        ></Button>
      </Popup>
    </div>
  );
}

export default FormSubmitPage;
