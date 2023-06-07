import {API} from '../../utils/api.js';

async function getCityData(){
    var cityList = await API({
        url: "city/getAllCity",
        method: "GET"
    }).then(
        res=>{
            return {
                type: 'GET_CITY_LIST',
                payload: res.data.data
            }
        }
    )
    return cityList
}

export default getCityData;