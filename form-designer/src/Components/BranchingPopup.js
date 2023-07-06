import "../App.css";
import { Popup } from "devextreme-react/popup";
import TextBox from "devextreme-react/text-box";
import TagBox from "devextreme-react/tag-box";
import Button from "devextreme-react/button";
import { useEffect, useRef, useState } from "react";
import notify from "devextreme/ui/notify";
import SelectBox from "devextreme-react/select-box";
import { Tooltip } from "devextreme-react/tooltip";

function BranchingPopup(props) {
  const [branchCount, setBranchCount] = useState(0);
  var popup = useRef();
  var popupContent = useRef();
  if (!("branching" in localStorage)) {
    localStorage.setItem("branching", JSON.stringify({}));
  }

  useEffect(() => {
    var count = getBranchCountForComponent(
      localStorage.getItem("currentSelectedComponentName")
    );
    setBranchCount(count);
  }, [
    localStorage.getItem("currentSelectedComponentName"),
    localStorage.getItem("currentPage"),
  ]);

  function getAllAddedComponentNamesExceptSelf() {
    var names = [];
    var self = localStorage.getItem("currentSelectedComponentName");
    var formTemplateElement = document.getElementById("formTemplate");
    if (!formTemplateElement) {
      return;
    }
    for (var i = 0; i < formTemplateElement.childNodes.length; i++) {
      var node = formTemplateElement.childNodes[i];
      if (node.id != self) {
        names.push(node.id);
      }
    }
    return names;
  }

  function CustomComponent({ textBoxValue, tagboxValue, selectBoxValue }) {
    function onTagBoxReady(e) {
      e.component.option("value", tagboxValue);
    }
    function onTextBoxReady(e) {
      e.component.option("value", textBoxValue);
    }
    function onSelectBoxReady(e) {
      e.component.option("value", selectBoxValue);
    }
    return (
      <div>
        <div style={{ display: "flex" }}>
          <h3>Condition: </h3>
          <SelectBox
            dataSource={["equal", "contains", "startsWith", "endsWith"]}
            style={{ marginLeft: "75px" }}
            onContentReady={onSelectBoxReady}
          ></SelectBox>
        </div>
        <div style={{ display: "flex", marginTop: "20px" }}>
          <h3>Input: </h3>
          <TextBox
            onContentReady={onTextBoxReady}
            style={{ marginLeft: "120px" }}
          ></TextBox>
        </div>
        <div style={{ display: "flex", marginTop: "20px" }}>
          <p>Change visibility of these components:</p>
          <TagBox
            placeholder="Select..."
            dataSource={getAllAddedComponentNamesExceptSelf()}
            style={{ marginRight: "60px" }}
            width={"300px"}
            onContentReady={onTagBoxReady}
          ></TagBox>
        </div>
        <hr></hr>
      </div>
    );
  }

  function DynamicComponent({ branchCount }) {
    var componentName = localStorage.getItem("currentSelectedComponentName");
    var id = componentName + "_Branching";
    var branchs = getBranches(componentName);
    return (
      <div>
        <div
          id={id}
          ref={popupContent}
          style={{ overflowY: "auto", height: "360px" }}
        >
          {Array.from({ length: branchCount }, (_, index) => (
            <CustomComponent
              key={index}
              textBoxValue={
                branchs && branchs[index] ? branchs[index]["input"] : ""
              }
              tagboxValue={
                branchs && branchs[index]
                  ? branchs[index]["selectedComponentNames"]
                  : []
              }
              selectBoxValue={
                branchs && branchs[index]
                  ? branchs[index]["condition"]
                  : "equal"
              }
            />
          ))}
          <div style={{ display: "flex" }}>
            <Button
              onClick={handleAddBranching}
              text="Add Branching"
              icon="add"
            ></Button>
            <Button
              style={{
                marginLeft: "auto",
                display: branchCount ? "block" : "none",
              }}
              onClick={handleRemoveBranching}
              text="Remove Branching"
              icon="minus"
            ></Button>
          </div>
        </div>
        <Button
          style={{
            width: "30%",
            marginLeft: "30%",
            top: "90%",
            position: "absolute",
          }}
          text="Save"
          type="success"
          onClick={handleSaveBranching}
        ></Button>
        <i
          style={{
            marginLeft: "89%",
            top: "92%",
            position: "absolute",
            fontSize: "24px",
          }}
          className="dx-icon-info"
        ></i>
        <Tooltip
          target=".dx-icon-info"
          showEvent="mouseenter"
          hideEvent="mouseleave"
          hideOnOutsideClick={false}
        >
          <div>To separate inputs, use "|"</div>
        </Tooltip>
      </div>
    );
  }

  function handleAddBranching() {
    setBranchCount(branchCount + 1);
  }

  function handleRemoveBranching() {
    setBranchCount(branchCount - 1);
  }

  function handleSaveBranching() {
    var element = popupContent.current;
    var branching = JSON.parse(localStorage.getItem("branching"));
    branching[localStorage.getItem("currentSelectedComponentName")] = [];
    for (var i = 0; i < element.childNodes.length - 1; i++) {
      var node = element.childNodes[i];
      var branch = {};
      var conditionValue = node.querySelectorAll(".dx-texteditor-input")[0]
        .value;
      var inputValue = node.querySelectorAll(".dx-texteditor-input")[1].value;
      var selectedComponentNames = [];
      for (var j = 0; j < node.querySelectorAll(".dx-tag").length; j++) {
        var componentName = node.querySelectorAll(".dx-tag")[j].innerText;
        selectedComponentNames.push(componentName);
      }
      branch.condition = conditionValue;
      branch.input = inputValue;
      branch.selectedComponentNames = selectedComponentNames;
      branching[localStorage.getItem("currentSelectedComponentName")].push(
        branch
      );
    }
    localStorage.setItem("branching", JSON.stringify(branching));
    notify("Branching saved.", "success", "3000");
    popup.current.instance.option("visible", false);
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

  function getBranchCountForComponent(componentName) {
    var branches = getBranches(componentName);
    if (branches) {
      return branches.length;
    }
    return 0;
  }

  function getPopupContent(branchCount) {
    var componentName = localStorage.getItem("currentSelectedComponentName");
    if (componentName.startsWith("InputBox")) {
      return <DynamicComponent branchCount={branchCount} />;
    } else {
      return <div></div>;
    }
  }

  function handleOnHiding(e) {
    var c = getBranchCountForComponent(
      localStorage.getItem("currentSelectedComponentName")
    );
    setBranchCount(c);
    props.hidePopup();
  }

  return (
    <Popup
      visible={props.visibility}
      onHiding={handleOnHiding}
      dragEnabled={false}
      hideOnOutsideClick={true}
      showCloseButton={true}
      showTitle={true}
      title="Branching"
      width={500}
      height={500}
      ref={popup}
    >
      {getPopupContent(branchCount)}
    </Popup>
  );
}

export default BranchingPopup;
