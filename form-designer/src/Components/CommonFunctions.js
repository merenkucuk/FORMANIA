import Draggable from "../Draggable";
import formUI from "devextreme/ui/form";
import ListUI from "devextreme/ui/list";
import SwitchUI from "devextreme/ui/switch";

class CommonFunctions {
  constructor(formData, formDataOthers) {
    this.handleComponentClick = this.handleComponentClick.bind(this);
    this.getComponent = this.getComponent.bind(this);
    this.getRandomString = this.getRandomString.bind(this);
    this.checkCursor = this.checkCursor.bind(this);
    this.makeDashed = this.makeDashed.bind(this);
    this.setVisibilityOfOtherForm = this.setVisibilityOfOtherForm.bind(this);
    this.setFormDataOthers = this.setFormDataOthers.bind(this);
    this.setBranchingPartVisibility =
      this.setBranchingPartVisibility.bind(this);
    if (formData && formDataOthers) {
      this.formData = formData;
      this.formDataOthers = formDataOthers;
    }
  }

  async getComponent(component) {
    var node;
    const draggable = new Draggable();
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
    } else if (component.name.startsWith("TextArea")) {
      node = document.createElement("textarea");
      node.setAttribute("readonly", true);
      node.style.resize = "none";
      node.style.textAlign = "center";
      node.style.color = "black";
      node.innerHTML = component.other.text;
    } else if (component.name.startsWith("InputBox")) {
      node = document.createElement("textarea");
      node.style.textAlign = "center";
      node.setAttribute("readonly", true);
      node.setAttribute("type", "text");
      node.placeholder = component.other.hint;
      node.value = component.other.value ? component.other.value : "";
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
      var s = document.createElement("select");
      s.style.backgroundColor = component.color;
      s.style.width = "100%";
      s.style.height = "100%";
      var options = component.other.options;
      if (options) {
        for (var i = 0; i < options.length; i++) {
          var innerNode = document.createElement("option");
          innerNode.innerText = options[i];
          innerNode.setAttribute("value", options[i]);
          s.appendChild(innerNode);
        }
      }
      node.appendChild(s);
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
      var randomString = this.getRandomString(5);
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
      var node = document.createElement("div");
      node.style.textAlign = "center";
      node.innerText = "File Uploader";
      var allowedTypes = component.other.allowedTypes;
      node.setAttribute("allowedTypes", allowedTypes);
      node.setAttribute(
        "fileId",
        component.other.fileId ? component.other.fileId : ""
      );
    } else if (component.name.startsWith("Image")) {
      var key = component.other.key;
      const requestOpts = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/api/v1/link/" + key, requestOpts);
      var responseJson = await response.json();
      var value = responseJson.data.value;
      node = document.createElement("div");
      var img = document.createElement("img");
      img.setAttribute("src", value);
      img.setAttribute("width", "100%");
      img.setAttribute("height", "100%");
      node.setAttribute("key", key);
      node.appendChild(img);
    } else {
      node = document.createElement("li");
    }
    node.style.left = component.locationX + 464 + "px";
    node.style.top = component.locationY + 70 + "px";
    node.style.backgroundColor = component.color;
    node.style.width = component.width + "px";
    node.style.height = component.height + "px";
    node.setAttribute("id", component.name);
    node.setAttribute("isRequired", component.isRequired);
    node.setAttribute("isVisible", component.isVisible);
    if (node.getAttribute("isvisible") == "false") {
      node.style.opacity = "0.4";
    } else {
      node.style.opacity = "1";
    }
    if (component.branches) {
      node.setAttribute("branches", JSON.stringify(component.branches));
    }
    node.setAttribute("hasbranching", component.hasBranching);
    node.setAttribute("branchingEnabled", component.branchingEnabled);
    node.addEventListener("mousemove", this.checkCursor);
    node.addEventListener("click", this.handleComponentClick);
    node.style.position = "fixed";
    node.style.zIndex = "9";
    node.style.maxWidth = "500px";
    node.style.maxHeight = "500px";
    draggable.dragElement(node);
    return node;
  }

  getRandomString(length) {
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

  handleComponentClick(e) {
    var id;
    if (e.target.id.startsWith("Image")) {
      id = e.target.id;
    } else if (e.target.parentElement.id.startsWith("Image")) {
      id = e.target.parentElement.id;
    } else {
      id = e.target.closest("[id]").id;
    }
    this.makeDashed(document.getElementById(id));
    var addedComponentsList = ListUI.getInstance(
      document.getElementById("addedComponentsList")
    );
    for (var i = 0; i < addedComponentsList.option("items").length; i++) {
      if (addedComponentsList.option("items")[i] == id) {
        var addedComponentsListContents = document
          .getElementById("addedComponentsList")
          .getElementsByClassName("dx-list-item-content");
        for (var i = 0; i < addedComponentsListContents.length; i++) {
          if (addedComponentsListContents[i].innerText == id) {
            var selectedListItem = addedComponentsListContents[i].parentElement;
            addedComponentsList.selectItem(selectedListItem);
            break;
          }
        }
      }
    }
    this.formData.Name = id;
    const element = document.getElementById(id);
    if (element.hasAttribute("isRequired")) {
      this.formData.isRequired = element.getAttribute("isRequired") === "true";
    } else {
      this.formData.isRequired = false;
    }
    if (element.hasAttribute("isVisible")) {
      this.formData.isVisible = element.getAttribute("isVisible") === "true";
    } else {
      this.formData.isVisible = true;
    }
    this.formData.Width = element.offsetWidth;
    this.formData.Height = element.offsetHeight;
    this.formData.LocationX = element.getBoundingClientRect().left - 464;
    this.formData.LocationY = element.getBoundingClientRect().top - 70;
    this.formData.Color = window
      .getComputedStyle(element, null)
      .getPropertyValue("background-color");
    var configurationForm = formUI.getInstance(document.getElementById("form"));
    configurationForm.updateData(this.formData);
    this.setVisibilityOfOtherForm(id);
    this.setFormDataOthers(id, element, "component");
    this.setBranchingPartVisibility(element);
    localStorage.setItem("currentSelectedComponentName", this.formData.Name);
    var branchingSwitch = SwitchUI.getInstance(
      document.getElementById("branchingSwitch")
    );
    branchingSwitch.option(
      "value",
      element.getAttribute("branchingEnabled") == "true"
    );
  }

  checkCursor(e) {
    const draggable = new Draggable();
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top; //y position within the element.
    var widthWithPx = window
      .getComputedStyle(e.currentTarget, null)
      .getPropertyValue("width");
    var heightWithPx = window
      .getComputedStyle(e.currentTarget, null)
      .getPropertyValue("height");
    var width = parseInt(widthWithPx.substring(0, widthWithPx.length - 2));
    var height = parseInt(heightWithPx.substring(0, heightWithPx.length - 2));
    if (x >= width - 15 && x <= width && y >= height - 15 && y <= height) {
      e.currentTarget.onmousedown = null;
      e.currentTarget.style.cursor = "nwse-resize";
      e.currentTarget.style.resize = "both";
      e.currentTarget.style.overflow = "auto";
      if (e.currentTarget.id.startsWith("CheckBox")) {
        e.currentTarget.onmouseup = (ev) => {
          ev.currentTarget.firstChild.style.width =
            Math.min(width, height) - 8 + "px";
          ev.currentTarget.firstChild.style.height =
            Math.min(width, height) - 8 + "px";
        };
      }
    } else {
      e.currentTarget.style.cursor = "default";
      e.currentTarget.style.resize = "none";
      draggable.dragElement(e.currentTarget);
    }
  }

  makeDashed(element) {
    var formTemplate = document.getElementById("formTemplate");
    for (var i = 0; i < formTemplate.childNodes.length; i++) {
      var node = formTemplate.childNodes[i];
      if (node.id == element.id) {
        node.style.border = "2px dashed blue";
      } else {
        node.style.border = "1px solid gray";
      }
    }
  }

  setVisibilityOfOtherForm(elementId) {
    if (elementId == "") {
      document.getElementById("form2").classList.add("dx-state-invisible");
      return;
    }
    document.getElementById("form2").classList.remove("dx-state-invisible");
    if (elementId.startsWith("TextArea")) {
      document.getElementById("Text").closest(".dx-item").style.display =
        "block";
      document.getElementById("Hint").closest(".dx-item").style.display =
        "none";
      document.getElementById("Value").closest(".dx-item").style.display =
        "none";
      document
        .getElementById("selectOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("allowedTypes")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonAlignment")
        .closest(".dx-item").style.display = "none";
    } else if (elementId.startsWith("InputBox")) {
      document.getElementById("Hint").closest(".dx-item").style.display =
        "block";
      document.getElementById("Text").closest(".dx-item").style.display =
        "none";
      document.getElementById("Value").closest(".dx-item").style.display =
        "none";
      document
        .getElementById("selectOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("allowedTypes")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonAlignment")
        .closest(".dx-item").style.display = "none";
    } else if (
      elementId.startsWith("Switch") ||
      elementId.startsWith("CheckBox")
    ) {
      document.getElementById("Value").closest(".dx-item").style.display =
        "block";
      document.getElementById("Text").closest(".dx-item").style.display =
        "none";
      document.getElementById("Hint").closest(".dx-item").style.display =
        "none";
      document
        .getElementById("selectOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("allowedTypes")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonAlignment")
        .closest(".dx-item").style.display = "none";
    } else if (elementId.startsWith("SelectBox")) {
      document.getElementById("Value").closest(".dx-item").style.display =
        "none";
      document.getElementById("Text").closest(".dx-item").style.display =
        "none";
      document.getElementById("Hint").closest(".dx-item").style.display =
        "none";
      document
        .getElementById("selectOptions")
        .closest(".dx-item").style.display = "block";
      document
        .getElementById("allowedTypes")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonAlignment")
        .closest(".dx-item").style.display = "none";
    } else if (elementId.startsWith("FileUploader")) {
      document.getElementById("Value").closest(".dx-item").style.display =
        "none";
      document.getElementById("Text").closest(".dx-item").style.display =
        "none";
      document.getElementById("Hint").closest(".dx-item").style.display =
        "none";
      document
        .getElementById("selectOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("allowedTypes")
        .closest(".dx-item").style.display = "block";
      document
        .getElementById("RadioButtonOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonAlignment")
        .closest(".dx-item").style.display = "none";
    } else if (elementId.startsWith("RadioButtonGroup")) {
      document.getElementById("Value").closest(".dx-item").style.display =
        "none";
      document.getElementById("Text").closest(".dx-item").style.display =
        "none";
      document.getElementById("Hint").closest(".dx-item").style.display =
        "none";
      document
        .getElementById("selectOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("allowedTypes")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonOptions")
        .closest(".dx-item").style.display = "block";
      document
        .getElementById("RadioButtonAlignment")
        .closest(".dx-item").style.display = "block";
    } else if (elementId.startsWith("Image")) {
      document.getElementById("Value").closest(".dx-item").style.display =
        "none";
      document.getElementById("Text").closest(".dx-item").style.display =
        "none";
      document.getElementById("Hint").closest(".dx-item").style.display =
        "none";
      document
        .getElementById("selectOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("allowedTypes")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonOptions")
        .closest(".dx-item").style.display = "none";
      document
        .getElementById("RadioButtonAlignment")
        .closest(".dx-item").style.display = "none";
    }
  }

  setFormDataOthers(elementId, element, clickFrom) {
    if (elementId.startsWith("TextArea")) {
      this.formDataOthers.Text = element.innerHTML;
    } else if (elementId.startsWith("InputBox")) {
      this.formDataOthers.Hint = element.getAttribute("placeholder");
    } else if (
      elementId.startsWith("Switch") ||
      elementId.startsWith("CheckBox")
    ) {
      if (element.firstChild.checked) {
        this.formDataOthers.Value = "On";
      } else {
        this.formDataOthers.Value = "Off";
      }
    } else if (elementId.startsWith("FileUploader")) {
      this.formDataOthers.allowedTypes = element.hasAttribute("allowedtypes")
        ? element.getAttribute("allowedtypes").split(",")
        : [];
    } else if (elementId.startsWith("RadioButtonGroup")) {
      this.formDataOthers.Alignment = element.hasAttribute("alignment")
        ? element.getAttribute("alignment")
        : "";
    }
    var otherPropertiesForm = formUI.getInstance(
      document.getElementById("form2")
    );
    otherPropertiesForm.updateData(this.formDataOthers);
  }

  setBranchingPartVisibility(element) {
    if (element.getAttribute("hasBranching") == "true") {
      document.getElementById("noBranchingText").style.display = "none";
      document.getElementById("branchingPart").style.display = "flex";
    } else {
      document.getElementById("noBranchingText").style.display = "block";
      document.getElementById("branchingPart").style.display = "none";
    }
  }

  async getSelectedPage(pageString) {
    var formTemplate = document.getElementById("formTemplate");
    var addedComponentsList = ListUI.getInstance(
      document.getElementById("addedComponentsList")
    );
    var l = addedComponentsList.option("dataSource").length;
    for (var i = 0; i < l; i++) {
      addedComponentsList.deleteItem(0);
    }
    document.getElementById("formTemplate").innerHTML = "";
    var pages = JSON.parse(localStorage.getItem("pages"));
    var page = pages[pageString];
    var componentsInThatPage = page.components;
    if (!componentsInThatPage) {
      addedComponentsList.option("items", []);
      return;
    }
    var items = [];
    for (var i = 0; i < componentsInThatPage.length; i++) {
      var component = componentsInThatPage[i];
      const node = await this.getComponent(component);
      formTemplate.appendChild(node);
      items.push(node.id);
    }
    addedComponentsList.option("items", items);
  }

  async changePage(e, pageString) {
    localStorage.setItem("currentPage", pageString);
    document.getElementById("pageNumberText").innerText = pageString;
    localStorage.setItem("SelectBoxOptions", "{}");
    localStorage.setItem("RadioButtonOptions", "{}");
    localStorage.setItem("branching", "{}");
    await this.getSelectedPage(pageString);
  }
}
export default CommonFunctions;
