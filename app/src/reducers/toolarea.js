const initialState = {
  toolAreaOpen: true,
  currentToolTab: "chat", // chat, settings, users
  unreadMessages: 0
};

const toolarea = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_TOOL_AREA": {
      const toolAreaOpen = !state.toolAreaOpen;
      const unreadMessages =
        toolAreaOpen && state.currentToolTab === "chat"
          ? 0
          : state.unreadMessages;

      return { ...state, toolAreaOpen, unreadMessages };
    }

    case "OPEN_TOOL_AREA": {
      const toolAreaOpen = true;
      const unreadMessages =
        state.currentToolTab === "chat" ? 0 : state.unreadMessages;

      return { ...state, toolAreaOpen, unreadMessages };
    }

    case "CLOSE_TOOL_AREA": {
      const toolAreaOpen = false;

      return { ...state, toolAreaOpen };
    }

    case "SET_TOOL_TAB": {
      const { toolTab } = action.payload;
      const unreadMessages = toolTab === "chat" ? 0 : state.unreadMessages;

      return { ...state, currentToolTab: toolTab, unreadMessages };
    }

    case "ADD_NEW_RESPONSE_MESSAGE": {
      if (state.toolAreaOpen && state.currentToolTab === "chat") {
        return state;
      }

      return { ...state, unreadMessages: state.unreadMessages + 1 };
    }

    default:
      return state;
  }
};

export default toolarea;
