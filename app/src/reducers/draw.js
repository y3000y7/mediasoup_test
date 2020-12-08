const initialState = { objects: [] };

const draw = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DRAWING_OBJECT": {
      const { object } = action.payload;

      return { ...state, objects: [...state.objects, object] };
    }

    case "ADD_NEW_RESPONSE_DRAWING_OBJECT": {
      const { object } = action.payload;

      return { ...state, objects: [...state.objects, object] };
    }

    case "ADD_DRAWING_HISTORY": {
      const { drawingHistory } = action.payload;

      return { ...state, objects: [...state.objects, ...drawingHistory] };
    }

    case "CLEAR_DRAWING_OBJECTS": {
      return { ...state, objects: [] };
    }

    case "CHANGE_DRAWING_OBJECT": {
      const { object } = action.payload;

      const changedIndex = state.objects.findIndex(obj => obj.id === object.id);
      let newObjects = [...state.objects];
      newObjects[changedIndex] = { ...newObjects[changedIndex], ...object };

      return {
        ...state,
        objects: newObjects
      };
    }

    default:
      return state;
  }
};

export default draw;
