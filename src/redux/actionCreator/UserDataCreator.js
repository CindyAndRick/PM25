import { API } from '../../utils/api.js';

// async function userLogin(value){
//     const formData = new FormData();
//     formData.append('username', value.username);
//     formData.append('password', value.password);
//     var login = await API({
//         url: "user/login",
//         method: "POST",
//         data: formData
//     }).then(
//         res=>{
//             if (res.data.code === 200){
//                 return {
//                     type: 'LOGIN',
//                     payload: res.data
//                 }
//             }
//             else{
//                 return {
//                     type: 'LOGIN_FAIL'
//                 }
//             }
//         }
//     )
//     return login;
// }

// async function userRegister(value){
//     const formData = new FormData();
//     formData.append('username', value.username);
//     formData.append('password', value.password);
//     formData.append('nickname', value.nickname);
//     formData.append('phone', value.phone);
//     var register = await API({
//         url: "user/register",
//         method: "POST",
//         data: formData
//     }).then(
//         res=>{
//             if (res.data.code === 200){
//                 return {
//                     type: 'REGISTER',
//                     payload: res.data
//                 }
//             }
//             else{
//                 return {
//                     type: 'REGISTER_FAIL'
//                 }
//             }
//         }
//     )
//     return register;
// }

async function verifyToken(token) {
    var verifyToken = await API({
        url: "user/verifyToken",
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(
        res => {
            if (res.data.code === 200) {
                return {
                    type: 'VERIFY_TOKEN',
                    payload: true
                }
            }
            else {
                return {
                    type: 'VERIFY_TOKEN',
                    payload: false
                }
            }
        }
    )
    return verifyToken;
}

function setIsLogin(value) {
    return {
        type: 'SET_IS_LOGIN',
        payload: value
    }
}

function setToken(value) {
    return {
        type: 'SET_TOKEN',
        payload: value
    }
}

function setUserInfo(value) {
    return {
        type: 'SET_USER_INFO',
        payload: value
    }
}

export { verifyToken, setIsLogin, setToken, setUserInfo }