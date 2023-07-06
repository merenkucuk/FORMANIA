import { Popup } from "devextreme-react/popup";
import { useState, useRef, useEffect } from "react";
import Button from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import notify from "devextreme/ui/notify";

function RadioButtonOptionsPopup(props) {
  const [tempCount2, setTempCount2] = useState(2);
  var popup = useRef();
  var popupContent = useRef();
  if (!("RadioButtonOptions" in localStorage)) {
    localStorage.setItem("RadioButtonOptions", JSON.stringify({}));
  }

  useEffect(() => {
    if (props.visibility == false) {
      return;
    }
    var count = getOptionCountForComponent(
      localStorage.getItem("currentSelectedComponentName")
    );
    setTempCount2(count);
  }, [
    localStorage.getItem("currentSelectedComponentName"),
    localStorage.getItem("currentPage"),
  ]);

  useEffect(() => {
    if (popup.current) {
      popup.current.instance.repaint();
    }
  }, [tempCount2]);

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

  function DynamicComponent({ optionCount }) {
    var componentName = localStorage.getItem("currentSelectedComponentName");
    var id = componentName + "_Options";
    var optionsForThatComponent = getRadioButtonOptions(componentName);
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

  function handleAddOption() {
    setTempCount2(tempCount2 + 1);
  }

  function handleRemoveOption() {
    if (tempCount2 - 1 < 2) {
      notify(
        "There must be at least 2 radio buttons in one group.",
        "error",
        2000
      );
      return;
    }
    setTempCount2(tempCount2 - 1);
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

  function redrawRadioButtonGroup(options) {
    var element = document.getElementById(
      localStorage.getItem("currentSelectedComponentName")
    );
    element.innerHTML = "";
    var alignment = element.getAttribute("alignment")
      ? element.getAttribute("alignment")
      : "horizontal";
    if (alignment == "vertical") {
      element.style.flexDirection = "column";
      element.style.alignItems = "flex-start";
    } else {
      element.style.flexDirection = "row";
      element.style.alignItems = "";
    }
    var randomString = getRandomString(5);
    for (var i = 0; i < options.length; i++) {
      var radioButton = document.createElement("input");
      radioButton.setAttribute("type", "radio");
      radioButton.setAttribute("name", randomString);
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
      element.appendChild(div);
    }
  }

  function handleSaveOptions() {
    if (tempCount2 < 2) {
      notify(
        "There must be at least 2 radio buttons in one group.",
        "error",
        2000
      );
      return;
    }
    var element = popupContent.current;
    var radioButtonOptions = JSON.parse(
      localStorage.getItem("RadioButtonOptions")
    );
    radioButtonOptions[localStorage.getItem("currentSelectedComponentName")] =
      [];
    for (var i = 0; i < element.childNodes.length - 1; i++) {
      var node = element.childNodes[i];
      var option = node.querySelectorAll(".dx-texteditor-input")[0].value;
      radioButtonOptions[
        localStorage.getItem("currentSelectedComponentName")
      ].push(option);
    }
    localStorage.setItem(
      "RadioButtonOptions",
      JSON.stringify(radioButtonOptions)
    );
    redrawRadioButtonGroup(
      radioButtonOptions[localStorage.getItem("currentSelectedComponentName")]
    );
    notify("Options saved.", "success", "3000");
    popup.current.instance.option("visible", false);
  }

  function getPopupContent(optionCount) {
    return <DynamicComponent optionCount={optionCount} />;
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

  function getOptionCountForComponent(componentName) {
    var options = getRadioButtonOptions(componentName);
    if (options) {
      return options.length;
    }
    return 0;
  }

  function handleOnHiding(e) {
    var c = getOptionCountForComponent(
      localStorage.getItem("currentSelectedComponentName")
    );
    setTempCount2(c);
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
      title="Radio Button Options"
      width={500}
      height={500}
      ref={popup}
    >
      {getPopupContent(tempCount2)}
    </Popup>
  );
}
export default RadioButtonOptionsPopup;
