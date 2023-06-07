import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux';
import { getAQDataByCity } from '../../redux/actionCreator/AQDataCreator';
import { getCityData } from '../../redux/actionCreator/CityDataCreator';
import { useParams } from 'react-router-dom';

import { Layout, theme, Table } from 'antd';
const { Header, Content, Footer } = Layout;

function Detail(props) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { city_id } = useParams();
    let { cityAQData, cityList, getAQDataByCity, getCityData } = props;

    const [cityName, setCityName] = useState();

    useEffect(() => {
        getAQDataByCity(city_id);
        if (cityList.length === 0) {
            getCityData();
        }
        return () => {

        }
    }, [getAQDataByCity, cityList, getCityData, city_id]);

    useEffect(() => {
        if (!cityList || !cityList.length) {
            setCityName("loading...");
        }
        const city = cityList.find(item => item.id.toString() === city_id);
        if (!city) {
            setCityName("loading...");
        }
        else {
            setCityName(city.name);
        }
        console.log(cityList);
    }, [cityList, city_id])

    const dataSource = useMemo(() => {
        if (Array.isArray(cityAQData)) {
            return cityAQData.map((item, index) => {
                return {
                    key: index + 1,
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
    }, [cityAQData])

    const columns = [
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
                {cityName}
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
                    <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 24 }} />
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
        cityAQData: state.AQDataReducer.cityAQData,
        cityList: state.CityDataReducer.cityList
    }
}

const mapDispatchToProps = {
    getAQDataByCity,
    getCityData
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail)