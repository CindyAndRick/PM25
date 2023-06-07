const AQDataReducer = (prevState = {
    allAQData: []
}, action = {}) =>{
    switch (action.type) {
        case 'GET_ALL_DATA':
            return {
                ...prevState,
                allAQData: action.payload
            }
        case 'GET_CITY_DATA':
            return {
                ...prevState,
                cityAQData: action.payload
            }
        default:
            return prevState
    }
}

export default AQDataReducer;