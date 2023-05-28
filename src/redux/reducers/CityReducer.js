const CityReducer = (prevState = {
    cityName: "北京"
}, action = {}) => {
    // console.log(action)
    switch (action.type) {
        case "change-city":
            return {
                ...prevState,
                cityName: action.payload
            }
        default:
            return prevState;
    }
};

export default CityReducer;