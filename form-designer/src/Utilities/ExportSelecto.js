import Selecto from "react-selecto";
import React from "react";

export default function ExportSelecto({moveableRef, selectoRef, targets, setTargets, editEnabled}) {
    return (
        <Selecto
            ref={selectoRef}
            boundContainer={true}
            dragContainer={".editorCanvas"}
            selectableTargets={[".draggableDiv"]}
            hitRate={0}
            selectByClick={editEnabled}
            selectFromInside={false}
            toggleContinueSelect={["shift"]}
            ratio={0}
            onDragStart={e => {
                const moveable = moveableRef.current;
                const target = e.inputEvent.target;
                if (moveable.isMoveableElement(target) || targets.some(t => t === target || t.contains(target))) {
                    e.stop();
                }
            }}
            onSelectEnd={e => {
                const moveable = moveableRef.current;
                if (e.isDragStart) {
                    e.inputEvent.preventDefault();
                    moveable.waitToChangeTarget().then(() => {
                        moveable.dragStart(e.inputEvent);
                    });
                }
                setTargets(e.selected);
            }}
        ></Selecto>
    )
}
