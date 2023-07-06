import React from "react";

const initialState = {
    past: [],
    present: null,
    future: []
};

const reducer = (state, action) => {
    const { past, present, future } = state;

    switch (action.type) {
        case "UNDO":
            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [present, ...future]
            };
        case "REDO":
            const next = future[0];
            const newFuture = future.slice(1);

            return {
                past: [...past, present],
                present: next,
                future: newFuture
            };
        default:
            return state;
    }
};

const useHistory = initialPresent => {
    const [state, dispatch] = React.useReducer(reducer, {
        ...initialState,
        present: initialPresent
    });

    const canUndo = state.past.length !== 0;
    const canRedo = state.future.length !== 0;

    const undo = React.useCallback(() => {
        if (canUndo) {
            dispatch({ type: "UNDO" });
        }
    }, [canUndo, dispatch]);

    const redo = React.useCallback(() => {
        if (canRedo) {
            dispatch({ type: "REDO" });
        }
    }, [canRedo, dispatch]);

    return {
        ...state,
        set,
        undo,
        redo,
        canUndo,
        canRedo
    };
};

export default useHistory;