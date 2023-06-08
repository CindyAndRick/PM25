import { API } from '../../utils/api.js';
import moment from 'moment';

async function getAllAQData() {
    var allAQData = await API({
        url: "data/getAQData",
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            "date": moment().subtract(2, 'hours').format('YYYY-MM-DD'),
            "hour": moment().subtract(2, 'hours').format('HH')
        }
    }).then(
        res => {
            return {
                type: 'GET_ALL_DATA',
                payload: res.data.data
            }
        }
    )
    return allAQData;
}

async function getAQDataByCity(city_id) {
    var cityAQData = await API({
        url: "data/getAQDataByCity",
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            "start_date": moment().subtract(2, 'hours').subtract(6, 'days').format('YYYY-MM-DD'),
            "end_date": moment().subtract(2, 'hours').add(1, 'days').format('YYYY-MM-DD'),
            "city_id": city_id
        }
    }).then(
        res => {
            return {
                type: 'GET_CITY_DATA',
                payload: res.data.data
            }
        }
    )
    return cityAQData;
}

export { getAllAQData, getAQDataByCity };