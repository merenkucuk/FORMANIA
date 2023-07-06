import UiSwitchButton from "../UiComponents/UiSwitchButton";
import UiCheckBox from "../UiComponents/UiCheckBox";
import UiInputBox from "../UiComponents/UiInputBox";
import UiTextArea from "../UiComponents/UiTextArea";
import UiHeader from "../UiComponents/UiHeader";
import UiText from "../UiComponents/UiText";
import UiTextField from "../UiComponents/UiTextField";
import UiSubmitButton from "../UiComponents/UiSubmitButton";

export default function ExportUiComponent(id, transform) {
    const toolboxId = id.split("_")[0];
    if (toolboxId === "Switch") return <UiSwitchButton id={id} transform={transform}/>
    if (toolboxId === "CheckBox") return <UiCheckBox id={id} transform={transform}/>
    if (toolboxId === "InputBox") return <UiInputBox id={id} transform={transform}/>
    if (toolboxId === "TextArea") return <UiTextArea id={id} transform={transform}/>
    if (toolboxId === "Header") return <UiHeader id={id} transform={transform}/>
    if (toolboxId === "Text") return <UiText id={id} transform={transform}/>
    if (toolboxId === "Submit") return <UiSubmitButton id={id} transform={transform}/>
    if (toolboxId === "TextField") return <UiTextField id={id} transform={transform}/>
    return <p>DEFAULT</p>
}
