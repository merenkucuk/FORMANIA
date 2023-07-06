export default function UiText({id, transform}) {
    return (
        <p className="draggableDiv uiCompText" id={id} style={{transform: `${transform}`}}>
            THIS IS A TEXT.
        </p>
    )
}
