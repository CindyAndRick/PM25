const CityReducer = (prevState = {
    cityList: []
}, action={})=>{
    switch (action.type) {
        case 'GET_CITY_DATA':
            return {
                ...prevState,
                cityList: action.payload
            }
        default:
            return prevState
    }
}

export default CityReducer;