import React, { useEffect, useState, useMemo } from 'react'
import { Map, Heatmap, Scale, MapType, ToolBar } from '@pansy/react-amap';
import getAllAQData from '../../redux/actionCreator/AQDataCreator';
import getCityData from '../../redux/actionCreator/CityDataCreator';
import { connect } from 'react-redux';
import moment from 'moment';
import { Input } from 'antd';

function AMap(props) {
    const { Search } = Input;

    const [searchField, setSearchField] = useState("");

    let { allAQData, cityList, getAllAQData, getCityData } = props;

    useEffect(() => {
        if (allAQData.length === 0 || allAQData[0].hour.toString() !== moment().subtract(2, 'hours').format('HH')) {
            getAllAQData();
        }
        else{
            console.log("all AQ Data exist!", allAQData);
        }

        return ()=>{

        }
    }, [allAQData, getAllAQData])

    useEffect(() => {
        if (cityList.length === 0) {
            getCityData();
        }
        else{
            console.log("city list exist!", cityList);
        }
        return ()=>{

        }
    }, [cityList, getCityData])

    const heatmapData = useMemo(() => {
        return cityList.map(item=>{
            const AQData = allAQData.find(AQData => AQData.city_id === item.id);
            return {lng: item.lng, lat: item.lat, count: AQData ? AQData.aqi : 0};
        })
    }, [allAQData, cityList])

    const searchResult = useMemo(() => cityList.filter(item=>item.name.includes(searchField)), [cityList, searchField])

    const handleSearch = () => {
        console.log(searchResult);
    }

    return (
        <div style={{ height: '100%', width: '100%'}}>
            <Search style={{zIndex: '1', position: 'fixed', marginLeft:'20px', marginTop:'10px', width: '50vw'}} size="large" placeholder="请输入你想搜索的城市" 
                onSearch={()=>{handleSearch()}} onChange={(e)=>{setSearchField(e.target.value)}} value={searchField} enterButton />
            
            <Map> {/* center={{longtitude: 108.55, latitude: 34.32}} */}
                <MapType/>
                <Heatmap
                    dataSet={{
                        data: heatmapData,
                        max: 125
                    }}
                    gradient={{'.25':'green', '.5':'yellow', '.75':'orange', '1':'red'}}
                />
                <Scale/>
                <ToolBar/>
            </Map>
            {/* <button onClick={()=>{console.log(heatmapData)}}>click</button> */}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        allAQData: state.MapReducer.allAQData,
        cityList: state.CityReducer.cityList
    }
}

const mapDispatchToProps = {
    getAllAQData,
    getCityData
}

export default connect(mapStateToProps, mapDispatchToProps)(AMap);
