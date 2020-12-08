export const addDrawingObject = object => ({
  type: "ADD_DRAWING_OBJECT",
  payload: { object }
});

export const addResponseDrawingObject = object => ({
  type: "ADD_NEW_RESPONSE_DRAWING_OBJECT",
  payload: { object }
});

export const addDrawingHistory = drawingHistory => ({
  type: "ADD_DRAWING_HISTORY",
  payload: { drawingHistory }
});

export const clearDrawingObjects = () => ({
  type: "CLEAR_DRAWING_OBJECTS"
});

export const changeDrawingObject = object => ({
  type: "CHANGE_DRAWING_OBJECT",
  payload: { object }
});
