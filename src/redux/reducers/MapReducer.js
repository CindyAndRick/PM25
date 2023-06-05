const MapReducer = (prevState = {
    allAQData: []
}, action = {}) =>{
    switch (action.type) {
        case 'GET_ALL_DATA':
            return {
                ...prevState,
                allAQData: action.payload
            }
        default:
            return prevState
    }
}

export default MapReducer;