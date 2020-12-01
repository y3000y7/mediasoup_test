export const drawLine = line => ({
  type: "DRAW_LINE",
  payload: { line }
});

export const addResponseLine = line => ({
  type: "ADD_NEW_RESPONSE_LINE",
  payload: { line }
});

export const addDrawHistory = drawHistory => ({
  type: "ADD_DRAW_HISTORY",
  payload: { drawHistory }
});
