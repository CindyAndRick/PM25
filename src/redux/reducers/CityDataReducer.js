const CityDataReducer = (prevState = {
    cityList: [],
    favourCityList: false
}, action = {}) => {
    switch (action.type) {
        case 'GET_CITY_LIST':
            return {
                ...prevState,
                cityList: action.payload
            }
        case 'GET_FAVOUR_CITY':
            return {
                ...prevState,
                favourCityList: action.payload
            }
        default:
            return prevState
    }
}

export default CityDataReducer;