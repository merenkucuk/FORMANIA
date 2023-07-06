import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

import FormEditorToolboxItem from "./FormEditorToolboxItem";

const toolboxItems = [
    {
        id: "Switch",
        content: <FormEditorToolboxItem icon={solid("toggle-on")} itemText={"SWITCH BUTTON."}/>
    },
    {
        id: "CheckBox",
        content: <FormEditorToolboxItem icon={solid("check-square")} itemText={"CHECKBOX."}/>,
    },
    {
        id: "TextArea",
        content: <FormEditorToolboxItem icon={solid("keyboard")} itemText={"TEXT AREA."}/>,
    },
    {
        id: "InputBox",
        content: <FormEditorToolboxItem icon={solid("keyboard")} itemText={"INPUT BOX."}/>,
    },
    {
        id: "Header",
        content: <FormEditorToolboxItem icon={solid("header")} itemText={"HEADER."}/>,
    },
    {
        id: "Text",
        content: <FormEditorToolboxItem icon={solid("font")} itemText={"TEXT."}/>,
    },
    {
        id: "Submit",
        content: <FormEditorToolboxItem icon={solid("paper-plane")} itemText={"SUBMIT BUTTON."}/>,
    },
    {
        id: "TextField",
        content: <FormEditorToolboxItem icon={solid("keyboard")} itemText={"TEXT FIELD."}/>,
    },
]

export {toolboxItems};
