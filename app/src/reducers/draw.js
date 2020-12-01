const draw = (state = [], action) => {
  switch (action.type) {
    case "DRAW_LINE": {
      const { line } = action.payload;

      return [...state, line];
    }

    case "ADD_NEW_RESPONSE_LINE": {
      const { line } = action.payload;

      return [...state, line.line];
    }

    case "ADD_DRAW_HISTORY": {
      const { drawHistory } = action.payload;

      return [...state, ...drawHistory];
    }

    default:
      return state;
  }
};

export default draw;
