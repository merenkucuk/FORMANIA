export default function UiHeader({id, transform}) {
    return (
        <h1 className="draggableDiv uiCompHeader" id={id} style={{transform: `${transform}`}}>
            THIS IS A HEADER.
        </h1>
    )
}
