const UserDataReducer = (prevState = {
    token: "",
    userInfo: {},
    isLogin: false // 仅用作登陆成功与否的判断
}, action = {}) => {
    switch (action.type) {
        // case 'LOGIN':
        //     return {
        //         ...prevState,
        //         token: action.payload.token,
        //         userInfo: {
        //             username: action.payload.data.username,
        //             nickname: action.payload.data.nickname,
        //             phone: action.payload.data.phone
        //         },
        //         isLogin: true
        //     }
        // case 'LOGIN_FAIL':
        //     return {
        //         ...prevState,
        //         isLogin: false
        //     }
        // case 'REGISTER':
        //     return {
        //         ...prevState,
        //         token: action.payload.token,
        //         userInfo: {
        //             username: action.payload.data.username,
        //             nickname: action.payload.data.nickname,
        //             phone: action.payload.data.phone
        //         },
        //         isLogin: true
        //     }
        // case 'REGISTER_FAIL':
        //     return {
        //         ...prevState,
        //         isLogin: false
        //     }
        case 'VERIFY_TOKEN':
            return {
                ...prevState,
                isLogin: action.payload
            }
        case 'SET_IS_LOGIN':
            return {
                ...prevState,
                isLogin: action.payload
            }
        case 'SET_TOKEN':
            return {
                ...prevState,
                token: action.payload
            }
        case 'SET_USER_INFO':
            return {
                ...prevState,
                userInfo: action.payload
            }
        default:
            return prevState
    }
}

export default UserDataReducer;