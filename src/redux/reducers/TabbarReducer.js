const TabbarReducer = (prevState = {
    tabbar: true
}, action = {}) => {
    // console.log(action)
    switch (action.type) {
        case "hide-tabbar":
            return {
                ...prevState,
                tabbar: false
            }
        case "show-tabbar":
            return {
                ...prevState,
                tabbar: true
            }
        default:
            return prevState;
    }
};

export default TabbarReducer;