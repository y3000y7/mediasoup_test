const draw = (state = { objects: [], timeStamp: 0 }, action) => {
  switch (action.type) {
    case "ADD_DRAWING_OBJECT": {
      const { object } = action.payload;

      return { objects: [...state.objects, object] };
    }

    case "ADD_NEW_RESPONSE_DRAWING_OBJECT": {
      const { object } = action.payload;

      return { objects: [...state.objects, object] };
    }

    case "ADD_DRAWING_HISTORY": {
      const { drawingHistory } = action.payload;

      return { objects: [...state.objects, ...drawingHistory] };
    }

    case "CLEAR_DRAWING_OBJECTS": {
      return { objects: [] };
    }

    case "CHANGE_DRAWING_OBJECT": {
      const { object } = action.payload;

      const changedIndex = state.objects.findIndex(obj => obj.id === object.id);
      let newObjects = removeItem(state.objects, changedIndex);
      newObjects = insertItem(newObjects, changedIndex, {
        ...state.objects[changedIndex],
        ...object
      });

      return {
        ...state,
        timeStamp: new Date().getTime(),
        objects: [...newObjects]
      };
    }

    default:
      return state;
  }
};

function insertItem(array, index, item) {
  let newArray = array.slice();
  newArray.splice(index, 0, item);
  return newArray;
}

function removeItem(array, index) {
  let newArray = array.slice();
  newArray.splice(index, 1);
  return newArray;
}

export default draw;
