export default function UiInputBox({id, transform}) {
    return (
        <input className="draggableDiv" id={id} type="text" style={{transform: `${transform}`}}/>
    )
}
