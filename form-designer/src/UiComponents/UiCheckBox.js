export default function UiCheckBox({id, transform}) {
    return (
        <label className="draggableDiv" id={id} style={{transform: `${transform}`}}>
            <input type="checkbox" style={{width: `36px`, height: `36px`,}}/>
        </label>
    );
}
