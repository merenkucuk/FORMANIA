import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function FormEditorToolboxItem({icon, itemText}) {
    return (
        <div className="editorSidebarToolboxItem">
            <div className="editorSidebarToolboxItemLogoContainer">
                <FontAwesomeIcon icon={icon}/>
            </div>
            <div className="editorSidebarToolboxItemTextContainer">
                <p className="editorSidebarToolboxItemText">{itemText}</p>
            </div>
        </div>
    )
}
