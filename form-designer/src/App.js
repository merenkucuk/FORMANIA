import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import WelcomePage from "./Pages/WelcomePage";
import { Route, Routes } from "react-router-dom";
import FormEditorPage from "./Pages/FormEditorPage";
import FormSubmitPage from "./Pages/FormSubmitPage";
import UploadsPage from "./Pages/UploadsPage";
function App() {
  return (
    <Routes>
      <Route index element={<WelcomePage />} />
      <Route path="/formEditor" element={<FormEditorPage />} />
      <Route path="/formSubmit" element={<FormSubmitPage />} />
      <Route path="/uploads" element={<UploadsPage />} />
    </Routes>
  );
}

export default App;
