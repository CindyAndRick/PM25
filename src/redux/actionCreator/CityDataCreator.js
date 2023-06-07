import { API } from '../../utils/api.js';

async function getCityData() {
    var cityList = await API({
        url: "city/getAllCity",
        method: "GET"
    }).then(
        res => {
            return {
                type: 'GET_CITY_LIST',
                payload: res.data.data
            }
        }
    )
    return cityList
}

async function getFavourCity(token) {
    var favourCityList = await API({
        url: "city/getFavourCity",
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(
        res => {
            return {
                type: 'GET_FAVOUR_CITY',
                payload: res.data.data
            }
        }
    )
    return favourCityList
}

async function favourCity(value) {
    var favourCity = await API({
        url: "city/favourCity",
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + value.token,
            'Content-Type': 'application/json'
        },
        data: {
            city_id: value.city_id
        }
    }).then(
        res => {
            return {
                type: 'GET_FAVOUR_CITY',
                payload: res.data.data
            }
        }
    )
    return favourCity
}

function initializeFavourCity() {
    return {
        type: 'GET_FAVOUR_CITY',
        payload: false
    }
}

export { getCityData, getFavourCity, favourCity, initializeFavourCity };