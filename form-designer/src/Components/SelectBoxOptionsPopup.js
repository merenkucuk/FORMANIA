import { Popup } from "devextreme-react/popup";
import { useState, useRef, useEffect } from "react";
import Button from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import notify from "devextreme/ui/notify";

function SelectBoxOptionsPopup(props) {
  const [tempCount, setTempCount] = useState(0);
  var popup = useRef();
  var popupContent = useRef();
  if (!("SelectBoxOptions" in localStorage)) {
    localStorage.setItem("SelectBoxOptions", JSON.stringify({}));
  }

  useEffect(() => {
    if (props.visibility == false) {
      return;
    }
    var count = getOptionCountForComponent(
      localStorage.getItem("currentSelectedComponentName")
    );
    setTempCount(count);
  }, [
    localStorage.getItem("currentSelectedComponentName"),
    localStorage.getItem("currentPage"),
  ]);

  function CustomComponent({ textBoxValue }) {
    function onTextBoxReady(e) {
      e.component.option("value", textBoxValue);
    }
    return (
      <div>
        <div style={{ display: "flex", marginTop: "20px" }}>
          <h3>Option: </h3>
          <TextBox
            onContentReady={onTextBoxReady}
            style={{ marginLeft: "120px" }}
          ></TextBox>
        </div>
        <hr></hr>
      </div>
    );
  }

  function handleAddOption() {
    setTempCount(tempCount + 1);
  }

  function handleRemoveOption() {
    setTempCount(tempCount - 1);
  }

  function handleSaveOptions() {
    var element = popupContent.current;
    var selectBoxOptions = JSON.parse(localStorage.getItem("SelectBoxOptions"));
    selectBoxOptions[localStorage.getItem("currentSelectedComponentName")] = [];
    for (var i = 0; i < element.childNodes.length - 1; i++) {
      var node = element.childNodes[i];
      var option = node.querySelectorAll(".dx-texteditor-input")[0].value;
      selectBoxOptions[
        localStorage.getItem("currentSelectedComponentName")
      ].push(option);
    }
    localStorage.setItem("SelectBoxOptions", JSON.stringify(selectBoxOptions));
    notify("Options saved.", "success", "3000");
    popup.current.instance.option("visible", false);
  }

  function DynamicComponent({ optionCount }) {
    var componentName = localStorage.getItem("currentSelectedComponentName");
    var id = componentName + "_Options";
    var optionsForThatComponent = getSelectBoxOptions(componentName);
    return (
      <div>
        <div
          id={id}
          ref={popupContent}
          style={{ overflowY: "auto", height: "360px" }}
        >
          {Array.from({ length: optionCount }, (_, index) => (
            <CustomComponent
              key={index}
              textBoxValue={
                optionsForThatComponent && optionsForThatComponent[index]
                  ? optionsForThatComponent[index]
                  : ""
              }
            />
          ))}
          <div style={{ display: "flex" }}>
            <Button
              onClick={handleAddOption}
              text="Add Option"
              icon="add"
            ></Button>
            <Button
              style={{
                marginLeft: "auto",
                display: optionCount ? "block" : "none",
              }}
              onClick={handleRemoveOption}
              text="Remove Option"
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
          onClick={handleSaveOptions}
        ></Button>
      </div>
    );
  }

  function getPopupContent(optionCount) {
    return <DynamicComponent optionCount={optionCount} />;
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

  function getOptionCountForComponent(componentName) {
    var options = getSelectBoxOptions(componentName);
    if (options) {
      return options.length;
    }
    return 0;
  }

  function handleOnHiding(e) {
    var c = getOptionCountForComponent(
      localStorage.getItem("currentSelectedComponentName")
    );
    setTempCount(c);
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
      title="Select Box Options"
      width={500}
      height={500}
      ref={popup}
    >
      {getPopupContent(tempCount)}
    </Popup>
  );
}

export default SelectBoxOptionsPopup;
