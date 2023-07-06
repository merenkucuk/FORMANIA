import Moveable from "react-moveable";
import React from "react";
import ExportUiComponent from "./ExportUiComponent";

export default function ExportMoveable({moveableRef, selectoRef, targets, editEnabled, gridEnabled, addedComponents, setAddedComponents}) {
    const gridSize = 10;

    const changeState = (e) => {
        let newAddedComponents = [...addedComponents];
        const index = addedComponents.map(function(item) {return item.compId;}).indexOf(e.target.id);
        const newItem = {
            id: addedComponents[index].id,
            compId: addedComponents[index].compId,
            formcomp: ExportUiComponent(addedComponents[index].compId, e.target.style.transform),
        };
        newAddedComponents.splice(index, 1, newItem);
        setAddedComponents(newAddedComponents);
    }

    return(
        <Moveable
            ref={moveableRef}
            snappable={true}
            draggable={editEnabled}
            rotatable={editEnabled}
            scalable={editEnabled}
            snapGridWidth={gridEnabled * gridSize}
            snapGridHeight={gridEnabled * gridSize}
            target={targets}
            elementGuidelines={[".selectable"]}
            snapContainer={".editorCanvas"}
            snapThreshold={5}
            snapDirections={{"center": gridEnabled, "bottom": gridEnabled}}
            horizontalGuidelines={[100, 300, 500]}
            verticalGuidelines={[100, 300, 500]}
            onClickGroup={e => {selectoRef.current.clickTarget(e.inputEvent, e.inputTarget);}}
            onDrag={e => {e.target.style.transform = e.transform;}}
            onDragGroup={e => {e.events.forEach(ev => {ev.target.style.transform = ev.transform;});}}
            onDragEnd={changeState}
            onDragGroupEnd={t => t.events.forEach(changeState)}
            onRotate={e =>{e.target.style.transform = e.drag.transform;}}
            onRotateGroup={e => {e.events.forEach(ev => {ev.target.style.transform = ev.drag.transform;});}}
            onRotateEnd={changeState}
            onScale={e => {e.target.style.transform = e.drag.transform;}}
            onScaleGroup={e => {e.events.forEach(ev => {ev.target.style.transform = ev.drag.transform;});}}
            onScaleEnd={changeState}
            bounds={{"left":0,"top":0,"right":0,"bottom":0,"position":"css"}}
        />
    )
}
