export default function UiTextField({id, transform}) {
    return (
        <input type="text" className="draggableDiv uiCompTextField" id={id} style={{transform: `${transform}`}}/>
    )
}
