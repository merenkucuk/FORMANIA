import React, { Component } from "react";

class Draggable extends Component {
  dragElement(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      var rect = elmnt.parentElement.getBoundingClientRect();
      var parentWidth = rect.width;
      var parentHeight = rect.height;
      var parentX = rect.x;
      var parentY = rect.y;
      elmnt.style.top =
        Math.min(
          Math.max(elmnt.offsetTop - pos2, parentY),
          parentY + parentHeight - elmnt.offsetHeight
        ) + "px";
      elmnt.style.left =
        Math.min(
          Math.max(elmnt.offsetLeft - pos1, parentX),
          parentX + parentWidth - elmnt.offsetWidth + 1
        ) + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

export default Draggable;
