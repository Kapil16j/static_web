const initialState = {
    someData: null,
  };
  
  const someReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SOME_ACTION':
        return {
          ...state,
          someData: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default someReducer;