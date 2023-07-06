export default function UiSwitchButton({id, transform}) {
    return (
        <label className="draggableDiv uiCompSwitch" id={id} style={{transform: `${transform}`}}>
            <input type="checkbox"></input>
            <span className="slider round"></span>
        </label>
    );
}
