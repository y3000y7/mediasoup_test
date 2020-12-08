const draw = (state = [], action) => {
  switch (action.type) {
    case "ADD_DRAWING_OBJECT": {
      const { object } = action.payload;

      return [...state, object];
    }

    case "ADD_NEW_RESPONSE_DRAWING_OBJECT": {
      const { object } = action.payload;

      return [...state, object];
    }

    case "ADD_DRAWING_HISTORY": {
      const { drawingHistory } = action.payload;

      return [...state, ...drawingHistory];
    }

    case "CLEAR_DRAWING_OBJECTS": {
      return [];
    }

    case "CHANGE_DRAWING_OBJECT": {
      const { object } = action.payload;

      const changedIndex = state.findIndex(obj => obj.id === object.id);
      const changedObj = { ...state[changedIndex], ...object };
      const newState = state.map(s => {
        if (s.id === object.id) {
          return changedObj;
        } else {
          return s;
        }
      });
      return [...newState];
    }

    default:
      return state;
  }
};

export default draw;
