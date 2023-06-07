const CityDataReducer = (prevState = {
    cityList: []
}, action={})=>{
    switch (action.type) {
        case 'GET_CITY_LIST':
            return {
                ...prevState,
                cityList: action.payload
            }
        default:
            return prevState
    }
}

export default CityDataReducer;