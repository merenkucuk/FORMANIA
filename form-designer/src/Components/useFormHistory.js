import React from "react";
import isEqual from "lodash.isequal";
import useHistory from "./useHistory";

const useFormHistory = form => {
    const { values, active } = form.getState();

    const {
        present,
        past,
        future,
        set,
        undo,
        redo,
        clear,
        canUndo,
        canRedo
    } = useHistory(values);

    const willInitialize = React.useRef(false);

    React.useEffect(() => {
        if (!isEqual(present, values) && !active && !willInitialize.current) {
            set(values);
        }
    }, [active, set, values, present]);

    React.useEffect(() => {
        if (willInitialize.current) {
            form.initialize(present);
            willInitialize.current = false;
        }
    }, [form, present]);

    const addWillInitialize = fn => () => {
        willInitialize.current = true;
        fn();
    };

    return {
        present,
        past,
        future,
        undo: addWillInitialize(undo),
        redo: addWillInitialize(redo),
        clear: addWillInitialize(clear),
        canUndo,
        canRedo
    };
};

export default useFormHistory;
