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

    default:
      return state;
  }
};

export default draw;
