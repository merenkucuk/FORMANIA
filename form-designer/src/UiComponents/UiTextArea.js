export default function UiTextArea({id, transform}) {
    return (
        <textarea className="draggableDiv" id={id} style={{transform: `${transform}`}}></textarea>
    );
}
