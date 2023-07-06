import "../App.css";
import { Popup } from "devextreme-react/popup";
import Form, { Item, GroupItem } from "devextreme-react/form";
import Button from "devextreme-react/button";
import React, { useState } from "react";

function LinkPopup(props) {
  const [shareLinkForm, setShareLinkForm] = useState(null);

  const handleShareButton = () => {
    var formName = shareLinkForm.getEditor("FormName").option("value");
    if (formName == "" || formName[0] == " ") {
      shareLinkForm
        .getEditor("FormName")
        .option("elementAttr", { class: "redBorder" });
      return;
    }
    shareLinkForm.getEditor("FormName").option("elementAttr", { class: "" });
    var endDate = shareLinkForm.getEditor("hasEndDate").option("value")
      ? shareLinkForm.getEditor("endDate").option("value").toLocaleString()
      : null;
    var password = shareLinkForm.getEditor("hasPassword").option("value")
      ? shareLinkForm.getEditor("password").option("value")
      : null;
    var formData = JSON.parse(localStorage.getItem("pages"));
    var data = {
      name: formName,
      formEndDate: endDate,
      formPassword: password,
      formData: formData,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/v1/form", requestOptions)
      .then((response) => response.json())
      .then((data) => getResponseResult(data))
      .catch((e) => console.log(e));
  };

  function getResponseResult(data) {
    document.getElementById("linkText").innerText = data.data.formLink;
    var ind = document
      .getElementById("viewSubmitsPassword")
      .innerHTML.indexOf(":");

    var oldString = document
      .getElementById("viewSubmitsPassword")
      .innerHTML.substring(ind + 2);
    document.getElementById("viewSubmitsPassword").innerHTML = document
      .getElementById("viewSubmitsPassword")
      .innerHTML.replace(oldString, data.data.viewSubmitsPassword);
    document.getElementById("viewSubmitsPassword").style.visibility = "visible";
  }

  return (
    <Popup
      visible={props.visibility}
      onHiding={props.hidePopup}
      dragEnabled={false}
      hideOnOutsideClick={true}
      showCloseButton={true}
      showTitle={true}
      title="Share with link"
      width={500}
      height={400}
    >
      <Form
        onContentReady={(e) => {
          setShareLinkForm(e.component);
        }}
      >
        <GroupItem colCount={1}>
          <Item dataField="FormName" editorType="dxTextBox"></Item>
          <Item
            dataField="hasEndDate"
            editorType="dxCheckBox"
            editorOptions={{
              onValueChanged: function (e) {
                shareLinkForm.getEditor("endDate").option("disabled", !e.value);
              },
            }}
          ></Item>
          <Item
            dataField="endDate"
            editorType="dxDateBox"
            editorOptions={{ type: "datetime", disabled: true }}
          ></Item>
          <Item
            dataField="hasPassword"
            editorType="dxCheckBox"
            editorOptions={{
              onValueChanged: function (e) {
                shareLinkForm
                  .getEditor("password")
                  .option("disabled", !e.value);
              },
            }}
          ></Item>
          <Item
            dataField="password"
            editorType="dxTextBox"
            editorOptions={{ disabled: true }}
          ></Item>
        </GroupItem>
      </Form>

      <div style={{ "text-align": "center", "margin-top": "5px" }}>
        <Button
          text="Share"
          type="success"
          onClick={handleShareButton}
          useSubmitBehavior={true}
        ></Button>
      </div>
      <div
        id="linkText"
        style={{
          "text-align": "center",
          "margin-top": "5px",
          color: "blue",
        }}
      >
        <p></p>
      </div>
      <div
        id="viewSubmitsPassword"
        style={{
          "text-align": "center",
          "margin-top": "5px",
          visibility: "hidden",
        }}
      >
        <p>Password for viewing submits: _</p>
      </div>
    </Popup>
  );
}
export default LinkPopup;
