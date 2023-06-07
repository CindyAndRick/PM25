import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux';
import { getAllAQData } from '../../redux/actionCreator/AQDataCreator';
import getCityData from '../../redux/actionCreator/CityDataCreator';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { Layout, theme, Table, Button } from 'antd';
const { Header, Content, Footer } = Layout;

function Data(props) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();

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

    const dataSource = useMemo(()=>{
        if (Array.isArray(allAQData)) {
            return allAQData.map((item, index) => {
                const city = cityList.find(city => city.id === item.city_id)
                return {
                    key: index + 1,
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
            });
        } else {
            return [];
        }
    },[allAQData, cityList])

    const handleClick = (e) => {
        const city = cityList.find(city => city.name === e.target.innerText);
        navigate(`/detail/${city.id}`);
    }

    // const cityFilters = useMemo(()=>{
    //     return cityList.map(city => {return {text: city.name, value: city.name}})
    // }, [cityList])

    const columns = [
        {title: '城市', dataIndex: 'name', key: 'name', render: (text) => <Button onClick={handleClick} type="link">{text}</Button>},
                    // filters: cityFilters, filterSearch: true, onFilter: (value, record) => record.name.includes(value)
        {title: '日期', dataIndex: 'date', key: 'date'},
        {title: '时间', dataIndex: 'hour', key: 'hour'},
        {title: 'AQI', dataIndex: 'aqi', key: 'aqi', render: (text) => {var obj; text < 100 ? obj = {color: 'green'} : 
                                                                        text < 200 ? obj = {color: 'orange'} : obj = {color: 'red'};
                                                                        return (<p style={obj}>{text}</p>)}, sorter: (a, b) => a.aqi - b.aqi},
        {title: 'PM2.5', dataIndex: 'pm25', key: 'pm25', render: (text) => {var obj; text < 75 ? obj = {color: 'green'} : 
                                                                            text < 150 ? obj = {color: 'orange'} : obj = {color: 'red'};
                                                                            return (<p style={obj}>{text}</p>)}, sorter: (a, b) => a.pm25 - b.pm25},
        {title: 'PM10', dataIndex: 'pm10', key: 'pm10' , render: (text) => {var obj; text < 40 ? obj = {color: 'green'} : 
                                                                            text < 70 ? obj = {color: 'orange'} : obj = {color: 'red'};
                                                                            return (<p style={obj}>{text}</p>)}, sorter: (a, b) => a.pm10 - b.pm10},
        {title: 'CO', dataIndex: 'co', key: 'co', render: (text) => {var obj; text < 4 ? obj = {color: 'green'} : 
                                                                    text < 10 ? obj = {color: 'orange'} : obj = {color: 'red'};
                                                                    return (<p style={obj}>{text}</p>)}, sorter: (a, b) => a.co - b.co},
        {title: 'NO2', dataIndex: 'no2', key: 'no2', render: (text) => {var obj; text < 40 ? obj = {color: 'green'} : 
                                                                        text < 80 ? obj = {color: 'orange'} : obj = {color: 'red'};
                                                                        return (<p style={obj}>{text}</p>)}, sorter: (a, b) => a.no2 - b.no2}, 
        {title: 'O3', dataIndex: 'o3', key: 'o3', render: (text) => {var obj; text < 160 ? obj = {color: 'green'} : 
                                                                    text < 200 ? obj = {color: 'orange'} : obj = {color: 'red'};
                                                                    return (<p style={obj}>{text}</p>)}, sorter: (a, b) => a.o3 - b.o3},
        {title: 'SO2', dataIndex: 'so2', key: 'so2', render: (text) => {var obj; text < 20 ? obj = {color: 'green'} : 
                                                                    text < 60 ? obj = {color: 'orange'} : obj = {color: 'red'};
                                                                    return (<p style={obj}>{text}</p>)}, sorter: (a, b) => a.so2 - b.so2}
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
                    <Table dataSource={dataSource} columns={columns}/>
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

const mapStateToProps = (state) =>{
    return {
        allAQData: state.AQDataReducer.allAQData,
        cityList: state.CityDataReducer.cityList
    }
}

const mapDispatchToProps = {
    getAllAQData,
    getCityData
}

export default connect(mapStateToProps, mapDispatchToProps)(Data)