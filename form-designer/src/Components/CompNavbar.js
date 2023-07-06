import "./CompNavbar.css";
import React, { useState } from "react";
import { Container, Navbar, Nav, Modal } from "react-bootstrap";
import { Switch } from "devextreme-react/switch";
import "bootstrap/dist/css/bootstrap.min.css";
import LinkPopup from "./LinkPopup";
import { useNavigate } from "react-router-dom";
import listUI from "devextreme/ui/list";
import formUI from "devextreme/ui/form";
import Draggable from "../Draggable";
import ContextMenu from "devextreme-react/context-menu";
import notify from "devextreme/ui/notify";
import CommonFunctions from "./CommonFunctions";

function CompNavbar() {
  const [linkPopupVisible, setLinkPopupVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const commonFunctions = new CommonFunctions({}, {});

  const navigate = useNavigate();
  const showLinkPopup = () => {
    setLinkPopupVisible(true);
  };
  const hideLinkPopup = () => {
    setLinkPopupVisible(false);
  };
  const returnToWelcomePage = () => {
    navigate("..", {
      replace: false,
      state: {},
    });
  };
  const switchDarkLight = () => {
    const element = document.getElementsByClassName("formEditorBg")[0];
    element.classList.toggle("dark");
  };

  async function getFormData() {
    var formData = { components: [] };
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
      component.locationX =
        parseInt(locationXWithPx.substring(0, locationXWithPx.length - 2)) -
        464;
      var locationYWithPx = window
        .getComputedStyle(formElement.childNodes[i], null)
        .getPropertyValue("top");
      component.locationY =
        parseInt(locationYWithPx.substring(0, locationYWithPx.length - 2)) - 70;
      component.isRequired = formElement.childNodes[i].getAttribute(
        "isrequired"
      )
        ? formElement.childNodes[i].getAttribute("isrequired")
        : false;
      component.isVisible = formElement.childNodes[i].getAttribute("isvisible")
        ? formElement.childNodes[i].getAttribute("isvisible")
        : true;
      component.other = {};
      if (component.name.startsWith("TextArea")) {
        component.other.text = formElement.childNodes[i].innerHTML;
      } else if (component.name.startsWith("InputBox")) {
        component.other.hint = formElement.childNodes[i].placeholder;
      } else if (component.name.startsWith("Switch")) {
        component.other.value = formElement.childNodes[i].childNodes[0].checked
          ? "On"
          : "Off";
      } else if (component.name.startsWith("FileUploader")) {
        component.other.allowedTypes = formElement.childNodes[i].getAttribute(
          "allowedtypes"
        )
          ? formElement.childNodes[i].getAttribute("allowedtypes")
          : [];
      }
      component.hasBranching =
        formElement.childNodes[i].getAttribute("hasbranching");
      component.branchingEnabled =
        formElement.childNodes[i].getAttribute("branchingenabled");
      component.branches = getBranches(component.name);
      if (component.name.startsWith("SelectBox")) {
        component.other.options = getSelectBoxOptions(component.name);
      }
      if (component.name.startsWith("RadioButtonGroup")) {
        component.other.options = getRadioButtonOptions(component.name);
        component.other.Alignment = formElement.childNodes[i].getAttribute(
          "alignment"
        )
          ? formElement.childNodes[i].getAttribute("alignment")
          : "horizontal";
      }
      if (component.name.startsWith("Image")) {
        var imgSrc = formElement.childNodes[i].firstChild.src;
        var data = {
          value: imgSrc,
        };
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
        const response = await fetch("/api/v1/link", requestOptions);
        var responseJson = await response.json();
        var key = responseJson.data.key;
        component.other.key = key;
      }
      formData.components.push(component);
    }
    return formData;
  }

  function getSelectBoxOptions(componentName) {
    var selectBoxOptions = JSON.parse(localStorage.getItem("SelectBoxOptions"));
    if (
      selectBoxOptions[componentName] &&
      selectBoxOptions[componentName].length > 0
    ) {
      return selectBoxOptions[componentName];
    }
    var pages = JSON.parse(localStorage.getItem("pages"));
    var currentPage = pages[localStorage.getItem("currentPage")];
    if (
      currentPage &&
      currentPage.components &&
      currentPage.components.length > 0
    ) {
      for (var i = 0; i < currentPage.components.length; i++) {
        var component = currentPage.components[i];
        if (component.name == componentName) {
          return component.other.options;
        }
      }
    }
    return [];
  }

  function getRadioButtonOptions(componentName) {
    var radioButtonOptions = JSON.parse(
      localStorage.getItem("RadioButtonOptions")
    );
    if (
      radioButtonOptions[componentName] &&
      radioButtonOptions[componentName].length > 0
    ) {
      return radioButtonOptions[componentName];
    }
    var pages = JSON.parse(localStorage.getItem("pages"));
    var currentPage = pages[localStorage.getItem("currentPage")];
    if (
      currentPage &&
      currentPage.components &&
      currentPage.components.length > 0
    ) {
      for (var i = 0; i < currentPage.components.length; i++) {
        var component = currentPage.components[i];
        if (component.name == componentName) {
          return component.other.options;
        }
      }
    }
    return [];
  }

  function getBranches(componentName) {
    var branching = JSON.parse(localStorage.getItem("branching"));
    if (branching[componentName] && branching[componentName].length > 0) {
      return branching[componentName];
    }
    var pages = JSON.parse(localStorage.getItem("pages"));
    var currentPage = pages[localStorage.getItem("currentPage")];
    if (
      currentPage &&
      currentPage.components &&
      currentPage.components.length > 0
    ) {
      for (var i = 0; i < currentPage.components.length; i++) {
        var component = currentPage.components[i];
        if (component.name == componentName) {
          return component.branches;
        }
      }
    }
    return [];
  }

  function handleImageClick(e) {
    var element;
    if (e.target.id.startsWith("Image")) {
      element = e.target;
    } else if (e.target.parentElement.id.startsWith("Image")) {
      element = e.target.parentElement;
    } else {
      return;
    }
    var id = element.id;
    var form = formUI.getInstance(document.getElementById("form"));
    var addedComponentsList = listUI.getInstance(
      document.getElementById("addedComponentsList")
    );
    var formData = form.option("formData");
    formData.Name = id;
    formData.Color = window
      .getComputedStyle(element, null)
      .getPropertyValue("background-color");
    formData.Width = element.offsetWidth;
    formData.Height = element.offsetHeight;
    formData.LocationX = element.getBoundingClientRect().left - 464;
    formData.LocationY = element.getBoundingClientRect().top - 70;
    if (element.hasAttribute("isRequired")) {
      formData.isRequired = element.getAttribute("isRequired") === "true";
    } else {
      formData.isRequired = false;
    }
    if (element.hasAttribute("isVisible")) {
      formData.isVisible = element.getAttribute("isVisible") === "true";
    } else {
      formData.isVisible = true;
    }
    form.updateData(formData);
    addedComponentsList.selectItem(id);
    document.getElementById("noBranchingText").style.display = "block";
    commonFunctions.makeDashed(element);
    document.getElementById("Value").closest(".dx-item").style.display = "none";
    document.getElementById("Text").closest(".dx-item").style.display = "none";
    document.getElementById("Hint").closest(".dx-item").style.display = "none";
    document.getElementById("selectOptions").closest(".dx-item").style.display =
      "none";
    document.getElementById("allowedTypes").closest(".dx-item").style.display =
      "none";
    document
      .getElementById("RadioButtonOptions")
      .closest(".dx-item").style.display = "none";
    document
      .getElementById("RadioButtonAlignment")
      .closest(".dx-item").style.display = "none";
    document.getElementById("noBranchingText").style.display = "block";
    document.getElementById("branchingPart").style.display = "none";
  }

  async function download(type) {
    if (type == "json") {
      var jsonString = localStorage.getItem("pages");
      const element = document.createElement("a");
      const blob = new Blob([jsonString], { type: "text/plain" });
      element.href = URL.createObjectURL(blob);
      element.download = "formTemplate.json";
      element.click();
    }
  }

  const afterImageUpload = () => {
    const draggable = new Draggable();
    var input = document.getElementById("imageUpload");
    var formTemplate = document.getElementById("formTemplate");
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var div = document.createElement("div");
        div.style.position = "fixed";
        div.style.zIndex = "9";
        div.style.width = "200px";
        div.style.height = "200px";
        div.style.maxWidth = "500px";
        div.style.maxHeight = "500px";
        var img = document.createElement("img");
        img.setAttribute("src", e.target.result);
        img.setAttribute("width", "100%");
        img.setAttribute("height", "100%");
        div.appendChild(img);
        div.addEventListener("mousemove", commonFunctions.checkCursor);
        div.addEventListener("click", handleImageClick);
        draggable.dragElement(div);
        formTemplate.appendChild(div);
        var instance = listUI.getInstance(
          document.getElementById("addedComponentsList")
        );
        var items = instance.option("items");
        if (items.includes("Image")) {
          var ind = 1;
          while (true) {
            if (items.includes("Image" + "_" + ind)) {
              ind += 1;
              continue;
            } else {
              items.push("Image" + "_" + ind);
              div.setAttribute("id", "Image" + "_" + ind);
              break;
            }
          }
        } else {
          items.push("Image");
          div.setAttribute("id", "Image");
        }
        instance.option("items", items);
      };
      reader.readAsDataURL(input.files[0]);
    }
    document.getElementById("imageUpload").value = "";
  };

  function getPageButton(pageNo) {
    var item;
    if (pageNo == "Page1") {
      item = {
        text: pageNo,
        items: [
          {
            text: "Select",
            onClick: (e) => {
              commonFunctions.changePage(e, pageNo);
            },
          },
        ],
      };
    } else {
      item = {
        text: pageNo,
        items: [
          {
            text: "Select",
            onClick: (e) => {
              commonFunctions.changePage(e, pageNo);
            },
          },
          {
            text: "Delete",
            onClick: (e) => {
              deletePage(e, pageNo);
            },
          },
        ],
      };
    }
    return item;
  }

  async function addNewPage(e) {
    var page =
      e.component.option("items")[e.component.option("items").length - 1];
    var number = parseInt(page.text.replace("Page", "")) + 1;
    var pages = JSON.parse(localStorage.getItem("pages"));
    pages["Page" + number] = {};
    localStorage.setItem("pages", JSON.stringify(pages));
    await commonFunctions.changePage(e, "Page" + number);
  }

  async function deletePage(e, pageString) {
    var pages = JSON.parse(localStorage.getItem("pages"));
    delete pages[pageString];
    localStorage.setItem("pages", JSON.stringify(pages));
    if (localStorage.getItem("currentPage") == pageString) {
      commonFunctions.changePage(e, "Page1");
    }
  }

  function getContextMenuItems(e) {
    var menuItems = [
      {
        text: "New Page",
        icon: "plus",
        onClick: (e) => {
          addNewPage(e);
        },
      },
    ];
    var pages = JSON.parse(localStorage.getItem("pages"));
    for (var pageNo in pages) {
      var item = getPageButton(pageNo);
      menuItems.push(item);
    }
    e.component.option("items", menuItems);
  }

  async function savePage(e) {
    var formData = await getFormData();
    var currentPage = localStorage.getItem("currentPage");
    var pages = JSON.parse(localStorage.getItem("pages"));
    pages[currentPage] = formData;
    localStorage.setItem("pages", JSON.stringify(pages));
    localStorage.setItem("SelectBoxOptions", "{}");
    localStorage.setItem("RadioButtonOptions", "{}");
    localStorage.setItem("branching", "{}");
    notify("Page saved.", "success", 1000);
  }

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href=" " onClick={returnToWelcomePage}>
          <b className="navbarHeader">FORMANIA.</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <i id="addPageButton" className="dx-icon-plus navbarIcons"></i>
              <ContextMenu
                width={100}
                target={"#addPageButton"}
                onShowing={(e) => getContextMenuItems(e)}
                showEvent={"click"}
              ></ContextMenu>
            </Nav.Link>
            <Nav.Link>
              <i className="dx-icon-save navbarIcons" onClick={savePage}></i>
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                download("json");
              }}
            >
              <i className="dx-icon-download navbarIcons"></i>
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                document.getElementById("imageUpload").click();
              }}
            >
              <i id="imageIcon" className="dx-icon-image navbarIcons"></i>
            </Nav.Link>
            <Nav.Link onClick={showLinkPopup}>
              <i className="dx-icon-link navbarIcons"></i>
            </Nav.Link>
            <Nav.Link onClick={handleShow}>
              <i className="dx-icon-help navbarIcons"></i>
            </Nav.Link>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={afterImageUpload}
            />
            <Modal show={showModal} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>FORMANIA Introduction</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h1>What is the Formania</h1>
                <h3>
                  Formania is a web application to create forms for users to
                  make your own forms without programming.
                </h3>
                <h1>What does Formania contain</h1>
                <h3>
                  The web application has a form editor and the users use this
                  editor to create forms with components like text-box,
                  check-box, buttons, etc without programming. The web
                  application also has drag and drop feature for users to make
                  your own forms easily.
                </h3>
                <h1>How to use Formania</h1>
                <h3>
                  You can drag the components suitable for your form from the
                  all components section on the left side to the middle page
                  with the drag drop feature. These components include
                  components such as textarea, inputbox, checkbox etc. With the
                  configuration section on the right side, you can determine the
                  location of these components, size, name, color, etc. You can
                  also use the buttons you see above to add images etc.
                  features.
                </h3>
              </Modal.Body>
            </Modal>
          </Nav>
          <h2
            id="pageNumberText"
            style={{ marginRight: "550px", marginTop: "10px" }}
          >
            Page1
          </h2>
        </Navbar.Collapse>
        <Switch
          elementAttr={{ class: "navbarSwitch" }}
          visible={true}
          hoverStateEnabled={false}
          activeStateEnabled={false}
          focusStateEnabled={false}
          onValueChanged={switchDarkLight}
        />
      </Container>
      <LinkPopup
        visibility={linkPopupVisible}
        hidePopup={hideLinkPopup}
      ></LinkPopup>
    </Navbar>
  );
}
export default CompNavbar;
