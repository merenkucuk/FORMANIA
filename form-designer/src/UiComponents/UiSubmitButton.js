export default function UiSubmitButton({id, transform}) {
    return (
        <input type="submit" value="SUBMIT." className="draggableDiv uiCompSubmit" id={id} style={{transform: `${transform}`}}/>
    )
}
