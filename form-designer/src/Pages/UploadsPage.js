import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";

function UploadsPage() {
  const [temp, setTemp] = useState(0);
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "//cdn.jsdelivr.net/npm/pdfjs-dist@3.7.107/build/pdf.worker.js";
  var paramsArray = window.location.search.substring(1).split("&");
  var hash = "";
  if (paramsArray[0].includes("hash=")) {
    hash = paramsArray[0].replace("hash=", "");
  }

  const requestOptions = {
    method: "GET",
  };

  async function decryptHash(hashString) {
    hashString = hashString.replaceAll("/", ".");
    const response = await fetch(
      "/api/v1/file/decrypt/" + hashString,
      requestOptions
    );
    var responseJson = await response.json();
    return responseJson;
  }

  function getPDF(file) {
    const container = document.getElementById("container");
    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const dataUrl = `data:application/pdf;base64,${btoa(
        String.fromCharCode.apply(null, uint8Array)
      )}`;
      var loadingTask = pdfjsLib.getDocument(arrayBuffer);
      // Load and render the PDF
      loadingTask.promise
        .then(function (pdf) {
          // Get the first page of the PDF
          pdf.getPage(1).then(function (page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            const iframe = document.createElement("iframe");
            iframe.src = dataUrl;
            iframe.width = "100%";
            iframe.height = viewport.height;
            iframe.style.overflow = "auto";
            iframe.style.border = "none";
            container.innerHTML = "";
            container.appendChild(iframe);
          });
        })
        .catch(function (error) {
          console.error("Error occurred while loading the PDF:", error);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  function getXlsx(file) {
    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(uint8Array, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const html = XLSX.utils.sheet_to_html(worksheet);
      var doc = new DOMParser().parseFromString(html, "text/xml");
      document.documentElement.innerHTML = doc.firstChild.innerHTML;
      var body = document.getElementsByTagName("BODY")[0];
      const fileUrl = URL.createObjectURL(file);
      var a = document.createElement("a");
      a.href = fileUrl;
      a.download = file.name;
      var button = document.createElement("button");
      button.innerText = "Download";
      button.style.width = "200px";
      button.style.height = "50px";
      var i = document.createElement("i");
      i.classList.add("dx-icon-download");
      button.appendChild(i);
      a.appendChild(button);
      body.insertBefore(a, body.firstChild);
    };
    reader.readAsArrayBuffer(file);
  }

  function getDocx(file) {
    const container = document.getElementById("container");
    const fileUrl = URL.createObjectURL(file);
    var a = document.createElement("a");
    a.href = fileUrl;
    a.download = file.name;
    a.style.position = "absolute";
    a.style.top = "40%";
    a.style.left = "43%";
    var button = document.createElement("button");
    button.innerText = "Download";
    button.style.width = "200px";
    button.style.height = "50px";
    var i = document.createElement("i");
    i.classList.add("dx-icon-download");
    button.appendChild(i);
    a.appendChild(button);
    container.appendChild(a);
  }

  function getImage(file) {
    const container = document.getElementById("container");
    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const dataUrl = `data:image/jpeg;base64,${btoa(
        String.fromCharCode.apply(null, uint8Array)
      )}`;
      const iframe = document.createElement("iframe");
      iframe.src = dataUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.overflow = "auto";
      iframe.style.border = "none";
      container.innerHTML = "";
      container.appendChild(iframe);
    };
    reader.readAsArrayBuffer(file);
  }

  function checkFile(file) {
    if (file.name.endsWith(".pdf")) {
      getPDF(file);
    } else if (
      file.name.endsWith(".jpg") ||
      file.name.endsWith(".png") ||
      file.name.endsWith(".jpeg")
    ) {
      getImage(file);
    } else if (file.name.endsWith(".xlsx")) {
      getXlsx(file);
    } else if (file.name.endsWith(".docx")) {
      getDocx(file);
    }
  }

  useEffect(() => {
    if (temp == 0) {
      decryptHash(hash)
        .then((data) => {
          var fileId = data.id;
          return fileId;
        })
        .then((fileId) => {
          fetch("/api/v1/file/" + fileId, requestOptions)
            .then(async (response) => {
              var x = [...response.headers];
              var filename = "file";
              for (var i in x) {
                if (x[i][0] == "content-disposition") {
                  filename = x[i][1]
                    .split(";")[2]
                    .replace(" filename=", "")
                    .replaceAll('"', "");
                  break;
                }
              }
              var file = new File([await response.blob()], filename);
              checkFile(file);
            })

            .catch((e) => console.log(e));
        });
      setTemp(temp + 1);
    }
  }, [temp]);

  return (
    <div
      style={{ width: "100%", height: "100%", position: "fixed" }}
      id="container"
    ></div>
  );
}

export default UploadsPage;
