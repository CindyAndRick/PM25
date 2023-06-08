import React, { useEffect, useState, useMemo } from 'react'
import { Map, Heatmap, Scale, ToolBar, Marker } from '@pansy/react-amap';
import { getAllAQData } from '../../redux/actionCreator/AQDataCreator';
import { getCityData, getFavourCity } from '../../redux/actionCreator/CityDataCreator';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { Input, AutoComplete, message, Card, Button } from 'antd';
import { StarFilled } from '@ant-design/icons';
import './AMap.css';

function AMap(props) {
    const navigate = useNavigate();
    const { Search } = Input;
    const [messageApi, contextHolder] = message.useMessage();

    // 用于记录搜索框的值
    const [searchField, setSearchField] = useState("");
    // 用于记录自动补全的options
    const [options, setOptions] = useState();
    // 用于记录搜索结果是否显示
    const [showSearchResult, setShowSearchResult] = useState(false);
    // 用于生成搜索结果Card
    const [searchResultCard, setSearchResultCard] = useState();
    // 用于生成搜索结果的marker
    const [searchResultMarker, setSearchResultMarker] = useState();
    // 用于记录上次获取的收藏点数量
    const [prevFavourNum, setPrevFavourNum] = useState(0);
    // 用于记录收藏点的marker
    const [favourCityMarker, setFavourCityMarker] = useState();
    // 用于生成收藏点的Card
    const [favourCityCard, setFavourCityCard] = useState();
    // 用于记录收藏点数据是否展示
    const [showFavourCity, setShowFavourCity] = useState(true);

    let { isLogin, allAQData, cityList, favourCityList, getAllAQData, getCityData, getFavourCity } = props;

    // 获取空气质量与城市数据
    useEffect(() => {
        if (allAQData.length === 0 || allAQData[0].hour.toString() !== moment().subtract(2, 'hours').format('H')) {
            console.log('getting AQ Data')
            getAllAQData();
        }
        else {
            console.log("all AQ Data exist!", allAQData);
        }

        return () => {

        }
    }, [allAQData, getAllAQData])
    useEffect(() => {
        if (cityList.length === 0) {
            getCityData();
        }
        else {
            console.log("city list exist!", cityList);
        }
        return () => {

        }
    }, [cityList, getCityData])

    // 获取收藏城市，若是无token便不获取
    useEffect(() => {
        let token = Cookies.get('token');
        if (token && favourCityList !== false && prevFavourNum !== favourCityList.length) {
            getFavourCity(token);
            setPrevFavourNum(favourCityList.length);
            console.log('getting favour city', favourCityList);
            setFavourCityMarker(favourCityList.map(item => {
                const city = cityList.find(city => city.id === item.city_id);
                return <Marker key={city.id} position={{ longitude: city.lng, latitude: city.lat }}>
                    <StarFilled style={{ color: 'gold', fontSize: '30px' }} />
                </Marker>
            }))
            setFavourCityCard(favourCityList.map(item => {
                const AQData = allAQData.find(AQData => AQData.city_id === item.city_id);
                const city = cityList.find(city => city.id === item.city_id);
                return <Card key={city.id} type="inner" title={city.name} size='small' extra={<Button type="link" onClick={() => {
                    navigate(`/detail/${city.id}`)
                }}>详细</Button>}>
                    <p>AQI: </p>{AQData ? AQData.aqi < 100 ? <p style={{ color: 'green' }}>{AQData.aqi}</p> :
                        AQData.aqi < 150 ? <p style={{ color: 'yellow' }}>{AQData.aqi}</p> : AQData.aqi < 225 ? <p style={{ color: 'orange' }}>{AQData.aqi}</p> :
                            <p style={{ color: 'red' }}>{AQData.aqi}</p> : '暂无数据'}
                    <p> PM2.5: </p>{AQData ? AQData.pm25 < 35 ? <p style={{ color: 'green' }}>{AQData.pm25}</p> :
                        AQData.pm25 < 70 ? <p style={{ color: 'yellow' }}>{AQData.pm25}</p> : AQData.pm25 < 150 ? <p style={{ color: 'orange' }}>{AQData.pm25}</p> :
                            <p style={{ color: 'red' }}>{AQData.pm25}</p> : '暂无数据'}
                </Card>
            }));
        }
        return () => {
        }
    }, [allAQData, getFavourCity, favourCityList, prevFavourNum, cityList, navigate])

    // 生成热力图数据
    const heatmapData = useMemo(() => {
        return cityList.map(item => {
            const AQData = allAQData.find(AQData => AQData.city_id === item.id);
            return { lng: item.lng, lat: item.lat, count: AQData ? AQData.aqi : 0 };
        })
    }, [allAQData, cityList])

    // 搜索城市
    const searchCityResult = useMemo(() => searchField === "" ? [] : cityList.filter(item => item.name.includes(searchField)), [cityList, searchField])

    const handleSearch = () => {
        console.log('handle search', showSearchResult);
        if (searchCityResult.length === 0) {
            console.log('search failed');
            messageApi.open({
                type: 'error',
                content: '搜索城市不存在'
            })
            setShowSearchResult(false);
        }
        else {
            setSearchResultCard(searchCityResult.map(item => {
                const AQData = allAQData.find(AQData => AQData.city_id === item.id);
                return <Card key={item.id} type="inner" title={item.name} extra={<Button type="link" onClick={() => {
                    navigate(`/detail/${item.id}`)
                }}>详细</Button>}>
                    <p>AQI: </p>{AQData ? AQData.aqi < 100 ? <p style={{ color: 'green' }}>{AQData.aqi}</p> :
                        AQData.aqi < 150 ? <p style={{ color: 'yellow' }}>{AQData.aqi}</p> : AQData.aqi < 225 ? <p style={{ color: 'orange' }}>{AQData.aqi}</p> :
                            <p style={{ color: 'red' }}>{AQData.aqi}</p> : '暂无数据'}
                    <p> PM2.5: </p>{AQData ? AQData.pm25 < 35 ? <p style={{ color: 'green' }}>{AQData.pm25}</p> :
                        AQData.pm25 < 70 ? <p style={{ color: 'yellow' }}>{AQData.pm25}</p> : AQData.pm25 < 150 ? <p style={{ color: 'orange' }}>{AQData.pm25}</p> :
                            <p style={{ color: 'red' }}>{AQData.pm25}</p> : '暂无数据'}
                </Card>
            }));
            setSearchResultMarker(searchCityResult.map(item => {
                return <Marker key={item.id} position={{ longitude: item.lng, latitude: item.lat }} />
            }));
            setShowSearchResult(true);
        }
    }

    // 生成搜索建议
    useEffect(() => {
        const name_list = searchCityResult.map(item => ({ label: item.name, value: item.name }));
        setOptions(name_list);
    }, [searchField, searchCityResult]);

    // 搜索框改变
    const handleChange = (e) => {
        setSearchField(e.target.value);
        if (e.target.value === '') {
            setShowSearchResult(false);
        }
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            {contextHolder}
            <AutoComplete style={{ zIndex: '2', position: 'fixed', marginLeft: '20px', marginTop: '10px', width: '45vw' }}
                options={options} onSelect={(e) => { setSearchField(e) }}>
                <Search size="large" placeholder="请输入你想搜索的城市" enterButton
                    onChange={handleChange} value={searchField} onSearch={handleSearch} />
            </AutoComplete>
            <Map style={{ zIndex: '0' }}> {/* center={{longtitude: 108.55, latitude: 34.32}} */}
                <Heatmap
                    dataSet={{
                        data: heatmapData,
                        max: 300
                    }}
                    gradient={{ '.3': 'green', '.5': 'yellow', '.75': 'orange', '1': 'red' }}
                />
                <Scale />
                <ToolBar />
                <div>
                    {showFavourCity && favourCityMarker}
                </div>
                <div>
                    {searchResultMarker}
                </div>
            </Map>
            {showSearchResult &&
                <Card title="搜索结果"
                    style={{
                        width: '45vw',
                        zIndex: '1',
                        position: 'fixed',
                        marginLeft: '20px',
                        top: '50px'
                    }}
                    size='small'
                >
                    {searchResultCard}
                </Card>
            }
            {
                isLogin && favourCityList !== false && favourCityList.length !== 0 && showFavourCity &&
                <Card title="收藏城市"
                    style={{
                        width: '20vw',
                        zIndex: '1',
                        position: 'fixed',
                        right: '20px',
                        top: '10px'
                    }}
                    size="small"
                    extra={<Button type="link" onClick={() => { setShowFavourCity(false) }}>关闭</Button>}
                >
                    {favourCityCard}
                </Card>
            }
            {
                isLogin && favourCityList !== false && favourCityList.length !== 0 && !showFavourCity &&
                <Button type="primary"
                    ghost
                    size='large'
                    icon={<StarFilled />}
                    style={{
                        zIndex: '1',
                        position: 'fixed',
                        right: '20px',
                        top: '20px'
                    }} onClick={() => { setShowFavourCity(true) }}></Button>
            }
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        allAQData: state.AQDataReducer.allAQData,
        cityList: state.CityDataReducer.cityList,
        favourCityList: state.CityDataReducer.favourCityList,
        isLogin: state.UserDataReducer.isLogin
    }
}

const mapDispatchToProps = {
    getAllAQData,
    getCityData,
    getFavourCity
}

export default connect(mapStateToProps, mapDispatchToProps)(AMap);
