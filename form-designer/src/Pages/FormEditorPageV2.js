import {useRef, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {NotificationContainer, NotificationManager} from 'react-notifications';

import ExportMoveable from "../Utilities/ExportMoveable";
import ExportSelecto from "../Utilities/ExportSelecto";
import UseUndoableState from "../Utilities/UseUndoableState";
import ExportUiComponent from "../Utilities/ExportUiComponent";

import CompNavbar from "../Components/CompNavbar";

import 'react-notifications/lib/notifications.css';
import {toolboxItems} from "../Data/ToolboxItems";

let tbItems = toolboxItems;
const initComponentTransform = "translate(0px, 0px)";

export default function FormEditorPageV2() {

    // ADDED COMPONENTS STATE & UNDO-REDO STATES
    const {
        state: addedComponents,
        setState: setAddedComponents,
        resetState: resetAddedComponents,
        index: addedComponentsStateIndex,
        lastIndex: addedComponentsStateLastIndex,
        goBack: undoAddedComponents,
        goForward: redoAddedComponents
    } = UseUndoableState([]);

    // UNDO-REDO CONDITIONS
    const undoRedo = {
        canUndo: addedComponentsStateIndex > 0,
        canRedo: addedComponentsStateIndex < addedComponentsStateLastIndex,
    }

    // EDIT & GRID STATES
    const [editEnabled, setEditEnabled] = useState(true);
    const [gridEnabled, setGridEnabled] = useState(true);

    // MOVEABLE & SELECTO STATE & REFS
    const [targets, setTargets] = useState([]);
    const moveableRef = useRef();
    const selectoRef = useRef();

    const copyToCanvas = (source, destination, droppableSource) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const item = sourceClone[droppableSource.index];
        const validItemId = findValidItemId(item.id);

        // Prevent adding a 2nd submit button if it's already on the form.
        if (validItemId === "Submit_1") {
            NotificationManager.error("You can add only one submit button to your form!", "ACTION FAILED!", 5000);
            return destClone;
        }

        const newItem = {
            id: item.id,
            compId: validItemId,
            formcomp: ExportUiComponent(validItemId, initComponentTransform),
        };

        destClone.push(newItem);
        return destClone;
    };

    const onDragEnd = (result) => {
        const {source, destination} = result;
        if (!destination) return;

        switch (source.droppableId) {
            case "tbItems":
                setAddedComponents(copyToCanvas(tbItems, addedComponents, source));
                break;
            default:
                break;
        }
    }

    function findValidItemId(toolboxId) {
        let searchArrLength = addedComponents.filter(x => x.id === toolboxId).length;
        if (searchArrLength === 0) return toolboxId;
        else return toolboxId + "_" + searchArrLength;
    }

    return(
        <div>
            <CompNavbar
                undo={undoAddedComponents}
                redo={redoAddedComponents}
                editEnabled={editEnabled}
                setEditEnabled={setEditEnabled}
                gridEnabled={gridEnabled}
                setGridEnabled={setGridEnabled}
                undoRedo={undoRedo}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div class="editorBackground">
                    <div className="editorSidebar editorSidebarLeft">
                        <Droppable droppableId="tbItems" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} className="editorSidebarToolboxContainer" isDraggingOver={snapshot.isDraggingOver}>
                                    {tbItems.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div>
                                                    <div
                                                         ref={provided.innerRef}
                                                         {...provided.draggableProps}
                                                         {...provided.dragHandleProps}
                                                         isDragging={snapshot.isDragging}
                                                         style={provided.draggableProps.style}
                                                    >
                                                        {item.content}
                                                    </div>
                                                    {snapshot.isDragging && (
                                                        <div>
                                                            {item.content}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    <Droppable key={addedComponents} droppableId={addedComponents}>
                        {(provided, snapshot) => (
                            <div className="editorCanvas" id="formTemplate" ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                                <ExportMoveable
                                    moveableRef={moveableRef}
                                    selectoRef={selectoRef}
                                    targets={targets}
                                    editEnabled={editEnabled}
                                    gridEnabled={gridEnabled}
                                    addedComponents={addedComponents}
                                    setAddedComponents={setAddedComponents}
                                />
                                <ExportSelecto
                                    moveableRef={moveableRef}
                                    selectoRef={selectoRef}
                                    targets={targets}
                                    setTargets={setTargets}
                                    editEnabled={editEnabled}
                                />
                                {addedComponents.map((item) => (item.formcomp))}
                            </div>
                        )}
                    </Droppable>

                </div>
            </DragDropContext>

            <NotificationContainer/>
        </div>
    );
}
