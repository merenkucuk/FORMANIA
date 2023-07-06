import "../App.css";
import "../Bg.css";
import React, { useEffect } from "react";
import Button from "devextreme-react/button";
import { useNavigate } from "react-router-dom";
function WelcomePage() {
  const navigate = useNavigate();
  const handleNewForm = () => {
    navigate("/formEditor", {
      replace: false,
      state: null,
    });
  };

  useEffect(() => {
    var branching = {};
    var SelectBoxOptions = {};
    var RadioButtonOptions = {};
    var pages = { Page1: {} };
    localStorage.branching = JSON.stringify(branching);
    localStorage.SelectBoxOptions = JSON.stringify(SelectBoxOptions);
    localStorage.RadioButtonOptions = JSON.stringify(RadioButtonOptions);
    localStorage.pages = JSON.stringify(pages);
    localStorage.setItem("currentPage", "Page1");
  }, []);

  function importForm() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (_) => {
      var file = input.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        navigate("/formEditor", {
          replace: false,
          state: data,
        });
      };
      reader.readAsText(file);
    };
    input.click();
  }

  return (
    <div className="mainBg">
      <div id="stars2"></div>
      <h1 className="formDesignerTitle">FORMANIA</h1>
      <div
        style={{
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        <b>New Generation Form Designer</b>
      </div>
      <div className="myDiv">
        <Button
          text="Create New Form"
          hint="Create an empty form."
          icon="newfolder"
          onClick={handleNewForm}
          height="50px"
          width="200px"
        />
        <Button
          elementAttr={{ class: "rightButton" }}
          text="Import Existing Form"
          hint="Import a form in JSON file format from your local storage."
          icon="import"
          onClick={importForm}
          height="50px"
          width="200px"
        />
      </div>
    </div>
  );
}

export default WelcomePage;
