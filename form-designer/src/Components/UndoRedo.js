import { useMemo, useState } from "react";
// If you're only working with primitives, this is not required
import isEqual from "lodash/isEqual";
import React from "react";


function useUndoableState(init) {
    const [states, setStates] = useState([init]); // Used to store history of all states
    const [index, setIndex] = useState(0); // Index of current state within `states`
    const state = useMemo(() => states[index], [states, index]); // Current state
    const setState = (value) => {
        // Use lodash isEqual to check for deep equality
        // If state has not changed, return to avoid triggering a re-render
        if (isEqual(state, value)) {
            return;
        }
        const copy = states.slice(0, index + 1); // This removes all future (redo) states after current index
        copy.push(value);
        setStates(copy);
        setIndex(copy.length - 1);
    };
    // Clear all state history
    const resetState = (init) => {
        setIndex(0);
        setStates([init]);
    };
    // Allows you to go back (undo) N steps
    const goBack = (steps = 1) => {
        setIndex(Math.max(0, Number(index) - (Number(steps) || 1)));
    };
    // Allows you to go forward (redo) N steps
    const goForward = (steps = 1) => {
        setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
    };
    return {
        state,
        setState,
        resetState,
        index,
        lastIndex: states.length - 1,
        goBack,
        goForward,
    };
}


// import useUndoableState from "path/to/hook";
function Undo() {
    const init = { text: "The quick brown fox jumps over the lazy dog" };
    const {
        state: doc,
        setState: setDoc,
        resetState: resetDoc,
        index: docStateIndex,
        lastIndex: docStateLastIndex,
        goBack: undoDoc,
        goForward: redoDoc
    } = useUndoableState(init);
    const canUndo = docStateIndex > 0;
    const canRedo = docStateIndex < docStateLastIndex;

    return (
        <div style={{ display: "block" }}>
      <textarea
          style={{ margin: "16px" }}
          onChange={(event) => setDoc({ text: event.target.value })}
          rows="5"
          value={doc.text}
      />
            <div>
                <button
                    onClick={() => undoDoc()}
                    disabled={!canUndo}
                >
                    Undo
                </button>

            </div>
        </div>
    );
}

function Redo() {
    const init = { text: "The quick brown fox jumps over the lazy dog" };
    const {
        state: doc,
        setState: setDoc,
        resetState: resetDoc,
        index: docStateIndex,
        lastIndex: docStateLastIndex,
        goBack: undoDoc,
        goForward: redoDoc
    } = useUndoableState(init);
    const canUndo = docStateIndex > 0;
    const canRedo = docStateIndex < docStateLastIndex
    const undo = () => canUndo && undoDoc();
    const redo = () => canRedo && redoDoc();
    return (
        <div style={{ display: "block" }}>
      <textarea
          style={{ margin: "16px" }}
          onChange={(event) => setDoc({ text: event.target.value })}
          value={doc.text}
      />
        </div>
    );
}
