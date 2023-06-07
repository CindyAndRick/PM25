import React, { useEffect, useState, useMemo } from 'react'
import { Map, Heatmap, Scale, MapType, ToolBar, Marker } from '@pansy/react-amap';
import {getAllAQData} from '../../redux/actionCreator/AQDataCreator';
import getCityData from '../../redux/actionCreator/CityDataCreator';
import { connect } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { Input, AutoComplete, message, Card, Button } from 'antd';
import './AMap.css';

function AMap(props) {
    const navigate = useNavigate();
    const { Search } = Input;
    const [messageApi, contextHolder] = message.useMessage();

    const [searchField, setSearchField] = useState("");
    const [options, setOptions] = useState();
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [searchResult, setSearchResult] = useState();
    const [searchResultMarker, setSearchResultMarker] = useState();

    let { allAQData, cityList, getAllAQData, getCityData } = props;

    // 获取空气质量与城市数据
    useEffect(() => {
        if (allAQData.length === 0 || allAQData[0].hour.toString() !== moment().subtract(2, 'hours').format('H')) {
            console.log('getting AQ Data')
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

    // 生成热力图数据
    const heatmapData = useMemo(() => {
        return cityList.map(item=>{
            const AQData = allAQData.find(AQData => AQData.city_id === item.id);
            return {lng: item.lng, lat: item.lat, count: AQData ? AQData.aqi : 0};
        })
    }, [allAQData, cityList])

    // 搜索城市
    const searchCityResult = useMemo(() => searchField === "" ? [] : cityList.filter(item=>item.name.includes(searchField)), [cityList, searchField])

    const handleSearch = () => {
        console.log('handle search', showSearchResult);
        if (searchCityResult.length === 0){
            console.log('search failed');
            messageApi.open({
                type:'error',
                content:'搜索城市不存在'
            })
            setShowSearchResult(false);
        }
        else{
            setSearchResult(searchCityResult.map(item =>{
                const AQData = allAQData.find(AQData => AQData.city_id === item.id);
                return <Card key={item.id} type="inner" title={item.name} extra={<Button type="link" onClick={()=>{
                    navigate(`/detail/${item.id}`)
                }}>detail</Button>}>
                        <p>AQI: </p>{AQData ? AQData.aqi < 100? <p style={{color:'green'}}>{AQData.aqi}</p> : 
                        AQData.aqi < 150 ? <p style={{color:'yellow'}}>{AQData.aqi}</p> : AQData.aqi < 225 ? <p style={{color:'orange'}}>{AQData.aqi}</p> :
                        <p style={{color:'red'}}>{AQData.aqi}</p> : '暂无数据'}
                        <p> PM2.5: </p>{AQData ? AQData.pm25 < 35? <p style={{color:'green'}}>{AQData.pm25}</p> : 
                        AQData.pm25 < 70 ? <p style={{color:'yellow'}}>{AQData.pm25}</p> : AQData.pm25 < 150 ? <p style={{color:'orange'}}>{AQData.pm25}</p> :
                        <p style={{color:'red'}}>{AQData.pm25}</p> : '暂无数据'}
                        </Card>
            }));
            setSearchResultMarker(searchCityResult.map(item=>{
                return <Marker key={item.id} position={{longitude: item.lng, latitude: item.lat}}/>
            }));
            setShowSearchResult(true);
        }
    }

    // 生成搜索建议
    useEffect(() => {
        const name_list = searchCityResult.map(item => ({ label: item.name, value: item.name }));
        setOptions(name_list);
    }, [searchField, searchCityResult]);

    const handleChange = (e) => {
        setSearchField(e.target.value);
    }

    return (
        <div style={{ height: '100%', width: '100%'}}>
            {contextHolder}
            <AutoComplete style={{zIndex: '2', position: 'fixed', marginLeft:'20px', marginTop:'10px', width: '45vw'}} 
                 options={options} onSelect={(e)=>{setSearchField(e)}}>
                <Search size="large" placeholder="请输入你想搜索的城市" enterButton 
                  onChange={handleChange} value={searchField} onSearch={handleSearch}/>
            </AutoComplete>
            <Map style={{zIndex:'0'}}> {/* center={{longtitude: 108.55, latitude: 34.32}} */}
                <MapType/>
                <Heatmap
                    dataSet={{
                        data: heatmapData,
                        max: 300
                    }}
                    gradient={{'.3':'green', '.5':'yellow', '.75':'orange', '1':'red'}}
                />
                <Scale/>
                <ToolBar/>
                <div>
                    {searchResultMarker}
                </div>
            </Map>
            {showSearchResult &&
            <Card title="搜索结果"
                style={{
                    width: '30vw',
                    zIndex:'1',
                    position: 'fixed',
                    right: '20px',
                    top: '20px'
                }}
            >
                { searchResult }
            </Card>
            } 
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        allAQData: state.AQDataReducer.allAQData,
        cityList: state.CityDataReducer.cityList
    }
}

const mapDispatchToProps = {
    getAllAQData,
    getCityData
}

export default connect(mapStateToProps, mapDispatchToProps)(AMap);
