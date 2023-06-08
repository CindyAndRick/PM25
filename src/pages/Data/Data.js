import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { getAllAQData } from '../../redux/actionCreator/AQDataCreator';
import { getCityData, getFavourCity, favourCity } from '../../redux/actionCreator/CityDataCreator';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Cookies from 'js-cookie';

import { StarFilled } from '@ant-design/icons';
import { Layout, theme, Table, Button } from 'antd';
const { Header, Content, Footer } = Layout;

function Data(props) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();

    let { allAQData, cityList, favourCityList, getAllAQData, getCityData, getFavourCity, favourCity } = props;

    // 用于记录上次获取的收藏点数量
    const [prevFavourNum, setPrevFavourNum] = useState(0);
    const [dataSource, setDataSource] = useState([]);
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
        }
        return () => {
        }
    }, [getFavourCity, favourCityList, prevFavourNum, cityList])

    // 用于生成数据表格
    useEffect(() => {
        if (Array.isArray(allAQData)) {
            setDataSource(allAQData.map((item, index) => {
                const city = cityList.find(city => city.id === item.city_id)
                var favour = false;
                if (favourCityList !== false) {
                    favour = favourCityList.find(favour => favour.city_id === item.city_id)
                }
                return {
                    key: index + 1,
                    favour: favour ? 't' + city.id.toString() : 'f' + city.id.toString(),
                    name: city.name,
                    date: item.date,
                    hour: item.hour,
                    aqi: item.aqi,
                    co: item.co,
                    no2: item.no2,
                    o3: item.o3,
                    pm10: item.pm10,
                    pm25: item.pm25,
                    so2: item.so2
                }
            }));
        }
    }, [allAQData, cityList, favourCityList]);

    const handleClick = (e) => {
        const city = cityList.find(city => city.name === e.target.innerText);
        navigate(`/detail/${city.id}`);
    }

    const columns = [
        {
            title: '收藏', dataIndex: 'favour', key: 'favour', render: (text) => <Button
                icon={<StarFilled style={{ color: text[0] === 't' ? 'gold' : 'grey' }}
                    onClick={() => {
                        favourCity({
                            token: Cookies.get('token'),
                            city_id: parseInt(text.slice(1))
                        })
                        setDataSource(dataSource.map(item => {
                            if (item.favour === text) {
                                item.favour = text[0] === 't' ? 'f' + text.slice(1) : 't' + text.slice(1);
                            }
                            return item;
                        }))
                    }}
                />}></Button>,
            filters: [{ text: '已收藏', value: 't' }, { text: '未收藏', value: 'f' }],
            onFilter: (value, record) => record.favour[0] === value
        },
        { title: '城市', dataIndex: 'name', key: 'name', render: (text) => <Button onClick={handleClick} type="link">{text}</Button> },
        // filters: cityFilters, filterSearch: true, onFilter: (value, record) => record.name.includes(value)
        { title: '日期', dataIndex: 'date', key: 'date' },
        { title: '时间', dataIndex: 'hour', key: 'hour' },
        {
            title: 'AQI', dataIndex: 'aqi', key: 'aqi', render: (text) => {
                var obj; text < 100 ? obj = { color: 'green' } :
                    text < 200 ? obj = { color: 'orange' } : obj = { color: 'red' };
                return (<p style={obj}>{text}</p>)
            }, sorter: (a, b) => a.aqi - b.aqi
        },
        {
            title: 'PM2.5', dataIndex: 'pm25', key: 'pm25', render: (text) => {
                var obj; text < 75 ? obj = { color: 'green' } :
                    text < 150 ? obj = { color: 'orange' } : obj = { color: 'red' };
                return (<p style={obj}>{text}</p>)
            }, sorter: (a, b) => a.pm25 - b.pm25
        },
        {
            title: 'PM10', dataIndex: 'pm10', key: 'pm10', render: (text) => {
                var obj; text < 40 ? obj = { color: 'green' } :
                    text < 70 ? obj = { color: 'orange' } : obj = { color: 'red' };
                return (<p style={obj}>{text}</p>)
            }, sorter: (a, b) => a.pm10 - b.pm10
        },
        {
            title: 'CO', dataIndex: 'co', key: 'co', render: (text) => {
                var obj; text < 4 ? obj = { color: 'green' } :
                    text < 10 ? obj = { color: 'orange' } : obj = { color: 'red' };
                return (<p style={obj}>{text}</p>)
            }, sorter: (a, b) => a.co - b.co
        },
        {
            title: 'NO2', dataIndex: 'no2', key: 'no2', render: (text) => {
                var obj; text < 40 ? obj = { color: 'green' } :
                    text < 80 ? obj = { color: 'orange' } : obj = { color: 'red' };
                return (<p style={obj}>{text}</p>)
            }, sorter: (a, b) => a.no2 - b.no2
        },
        {
            title: 'O3', dataIndex: 'o3', key: 'o3', render: (text) => {
                var obj; text < 160 ? obj = { color: 'green' } :
                    text < 200 ? obj = { color: 'orange' } : obj = { color: 'red' };
                return (<p style={obj}>{text}</p>)
            }, sorter: (a, b) => a.o3 - b.o3
        },
        {
            title: 'SO2', dataIndex: 'so2', key: 'so2', render: (text) => {
                var obj; text < 20 ? obj = { color: 'green' } :
                    text < 60 ? obj = { color: 'orange' } : obj = { color: 'red' };
                return (<p style={obj}>{text}</p>)
            }, sorter: (a, b) => a.so2 - b.so2
        }
    ]

    return (
        <Layout>
            <Header
                style={{
                    paddingLeft: 20,
                    background: colorBgContainer,
                }}
            >
                全国空气质量数据
            </Header>
            <Content
                style={{
                    margin: '24px 16px 0',
                }}
            >
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                    }}
                >
                    <Table dataSource={dataSource} columns={columns} />
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Air Quality System ©2023 Created by Rick
            </Footer>
        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {
        allAQData: state.AQDataReducer.allAQData,
        cityList: state.CityDataReducer.cityList,
        favourCityList: state.CityDataReducer.favourCityList
    }
}

const mapDispatchToProps = {
    getAllAQData,
    getCityData,
    getFavourCity,
    favourCity
}

export default connect(mapStateToProps, mapDispatchToProps)(Data)