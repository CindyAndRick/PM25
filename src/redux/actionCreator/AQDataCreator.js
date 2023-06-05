import {API} from '../../utils/api.js';
import moment from 'moment';

async function getAllAQData(){
    var allAQData = await API({
        url: "data/getAQData",
        method: "POST",
        headers:{
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data:{
            "date": moment().subtract(2, 'hours').format('YYYY-MM-DD'),
            "hour": moment().subtract(2, 'hours').format('HH')
        }
    }).then(
        res=>{
            return {
                type: 'GET_ALL_DATA',
                payload: res.data.data
            }
        }
    )
    return allAQData;
}

export default getAllAQData;