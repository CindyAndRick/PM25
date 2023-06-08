import React, { useEffect, useState, useMemo, useRef } from 'react'
import { connect } from 'react-redux';
import { getAQDataByCity } from '../../redux/actionCreator/AQDataCreator';
import { getCityData } from '../../redux/actionCreator/CityDataCreator';
import { useParams } from 'react-router-dom';
import * as echarts from 'echarts';
import 'echarts-gl';

import { FlagOutlined } from '@ant-design/icons';
import { Layout, theme, Table, Button } from 'antd';
const { Header, Content, Footer } = Layout;

function Detail(props) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { city_id } = useParams();
    let { cityAQData, cityList, getAQDataByCity, getCityData } = props;

    // echart图
    // const chartRef = useRef(null);
    const chart3DRef = useRef(null);
    const radarRef = useRef(null);

    const [cityName, setCityName] = useState();
    // 用于echart的数据
    // const [chartAQIData, setChartAQIData] = useState([]);
    // const [chartPM25Data, setChartPM25Data] = useState([]);
    // 用于echart3D的数据
    const [chartDays, setChartDays] = useState([]);
    const [chartDaysReverse, setChartDaysReverse] = useState([]);
    const [chart3DAQIData, setChart3DAQIData] = useState([]);
    const [radarAQData, setRadarAQData] = useState([]);
    const [radarMaxData, setRadarMaxData] = useState([]);

    useEffect(() => {
        getAQDataByCity(city_id);
        if (cityList.length === 0) {
            getCityData();
        }
        console.log('cityAQData', cityAQData);
        return () => {

        }
    }, [getAQDataByCity, cityList, getCityData, city_id, cityAQData]);

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
                    predict: item.predict,
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
        {
            title: '预测', dataIndex: 'predict', key: 'predict', render: (text) =>
                <Button icon={<FlagOutlined style={{ color: text === 1 ? '#1890ff' : 'gray' }} />}></ Button>,
            filters: [{ text: '预测', value: 1 }, { text: '实际', value: 0 }],
            onFilter: (value, record) => record.predict === value
        },
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

    // 柱状图数据
    // useEffect(() => {
    //     const today = new Date().toLocaleDateString();
    //     setChartAQIData(cityAQData.filter((item) => {
    //         const itemDate = new Date(item.date).toLocaleDateString();
    //         return itemDate === today;
    //     }).map(item => { return item.aqi }))
    //     setChartPM25Data(cityAQData.filter((item) => {
    //         const itemDate = new Date(item.date).toLocaleDateString();
    //         return itemDate === today;
    //     }).map(item => { return item.pm25 }))
    // }, [cityAQData]);

    // 绘制柱状图
    // useEffect(() => {
    //     var myChart = echarts.init(chartRef.current);
    //     // 绘制图表
    //     myChart.setOption({
    //         title: {
    //             text: '今日空气质量数据与预测'
    //         },
    //         legend: {
    //             orient: 'horizontal',
    //             bottom: 10
    //         },
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: { type: 'cross' }
    //         },
    //         xAxis: {
    //             axisTick: {
    //                 alignWithLabel: true
    //             },
    //             type: 'category',
    //             data: ['0时', '1时', '2时', '3时', '4时', '5时', '6时',
    //                 '7时', '8时', '9时', '10时', '11时', '12时', '13时',
    //                 '14时', '15时', '16时', '17时', '18时', '19时', '20时',
    //                 '21时', '22时', '23时']
    //             // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    //             //     13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    //         },
    //         yAxis: [
    //             {
    //                 type: 'value',
    //                 name: 'PM2.5',
    //                 position: 'right',
    //                 // axisLabel: {
    //                 //     formatter: '{value} ml'
    //                 // }
    //             },
    //             {
    //                 type: 'value',
    //                 name: 'AQI',
    //                 position: 'left',
    //                 // axisLabel: {
    //                 //     formatter: '{value} °C'
    //                 // }
    //             }
    //         ],
    //         series: [{
    //             name: 'AQI',
    //             type: 'bar',
    //             yAxisIndex: 0,
    //             data: chartAQIData
    //         },
    //         {
    //             name: 'PM2.5',
    //             type: 'line',
    //             smooth: true,
    //             yAxisIndex: 1,
    //             data: chartPM25Data
    //         }]
    //     });
    // }, [chartAQIData, chartPM25Data]);

    // 计算3D图Y轴数据
    useEffect(() => {
        // 获取明天周几
        const tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        const start_day = tomorrow.getDay();
        let week = [];
        for (let i = 0; i < 7; i++) {
            let day = start_day + i;
            if (day > 6) {
                day = day - 7;
            }
            let dayName = day === 0 ? '周日' : day === 1 ? '周一' : day === 2 ? '周二' : day === 3 ? '周三' : day === 4 ? '周四' : day === 5 ? '周五' : '周六';
            if (i === 6) {
                dayName = dayName + '(今日)';
            }
            week.push(dayName);
        }
        setChartDays(week);
        console.log(week);
    }, []);

    useEffect(() => {
        setChartDaysReverse(chartDays.slice().reverse());
    }, [chartDays]);

    // 计算3D图Z轴数据
    useEffect(() => {
        const today = new Date();
        setChart3DAQIData(cityAQData.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate <= today;
        }).map((item, index) => {
            const itemDate = new Date(item.date);
            const diffDays = Math.ceil(Math.abs(itemDate - today) / (1000 * 60 * 60 * 24));
            return [index % 24, diffDays - 1, item.aqi];
        }
        ))
    }, []);

    // 绘制3D图
    useEffect(() => {
        var my3DChart = echarts.init(chart3DRef.current);
        my3DChart.setOption({
            title: {
                text: '一周AQI数据与预测'
            },
            tooltip: {},
            visualMap: {
                max: 200,
                inRange: {
                    color: [
                        '#313695',
                        '#4575b4',
                        '#74add1',
                        '#abd9e9',
                        '#e0f3f8',
                        '#ffffbf',
                        '#fee090',
                        '#fdae61',
                        '#f46d43',
                        '#d73027',
                        '#a50026'
                    ]
                }
            },
            xAxis3D: {
                type: 'category',
                name: '时间',
                data: ['0时', '1时', '2时', '3时', '4时', '5时', '6时',
                    '7时', '8时', '9时', '10时', '11时', '12时', '13时',
                    '14时', '15时', '16时', '17时', '18时', '19时', '20时',
                    '21时', '22时', '23时']
            },
            yAxis3D: {
                type: 'category',
                name: '日期',
                data: chartDaysReverse
            },
            zAxis3D: {
                type: 'value',
                name: 'AQI'
            },
            grid3D: {
                boxWidth: 200,
                boxDepth: 80,
                viewControl: {
                    // projection: 'orthographic'
                },
                light: {
                    main: {
                        intensity: 1.2,
                        shadow: true
                    },
                    ambient: {
                        intensity: 0.3
                    }
                }
            },
            series: [
                {
                    type: 'bar3D',
                    name: 'AQI',
                    data: chart3DAQIData.map(function (item) {
                        return {
                            value: [item[0], item[1], item[2]]
                        };
                    }),
                    shading: 'lambert',
                    label: {
                        fontSize: 16,
                        borderWidth: 1
                    },
                    emphasis: {
                        label: {
                            fontSize: 20,
                            color: '#900'
                        },
                        itemStyle: {
                            color: '#900'
                        }
                    }
                }
            ]
        })

        return () => {
            my3DChart.dispose();
        }
    }, [chart3DAQIData, chartDaysReverse]);

    // 计算雷达图数据
    useEffect(() => {
        const today = new Date();
        setRadarAQData(cityAQData.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate <= today;
        }).filter(item => {
            return item.hour === 8
        }).map(item => { return [item.aqi, item.pm25, item.pm10, item.so2, item.no2, item.co, item.o3] }));
        let max_aqi = Number.MIN_SAFE_INTEGER;
        let max_pm25 = Number.MIN_SAFE_INTEGER;
        let max_pm10 = Number.MIN_SAFE_INTEGER;
        let max_so2 = Number.MIN_SAFE_INTEGER;
        let max_no2 = Number.MIN_SAFE_INTEGER;
        let max_co = Number.MIN_SAFE_INTEGER;
        let max_o3 = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < radarAQData.length; i++) {
            if (radarAQData[i][0] > max_aqi) {
                max_aqi = radarAQData[i][0];
            }
            if (radarAQData[i][1] > max_pm25) {
                max_pm25 = radarAQData[i][1];
            }
            if (radarAQData[i][2] > max_pm10) {
                max_pm10 = radarAQData[i][2];
            }
            if (radarAQData[i][3] > max_so2) {
                max_so2 = radarAQData[i][3];
            }
            if (radarAQData[i][4] > max_no2) {
                max_no2 = radarAQData[i][4];
            }
            if (radarAQData[i][5] > max_co) {
                max_co = radarAQData[i][5];
            }
            if (radarAQData[i][6] > max_o3) {
                max_o3 = radarAQData[i][6];
            }
        }
        setRadarMaxData([max_aqi, max_pm25, max_pm10, max_so2, max_no2, max_co, max_o3])
    }, []);

    // 绘制雷达图
    useEffect(() => {
        if (radarAQData.length === 7 && radarMaxData.length === 7 && chartDays.length === 7) {
            var myRadarChart = echarts.init(radarRef.current);
            myRadarChart.setOption({
                title: {
                    text: '一周空气质量雷达图',
                    top: 10,
                    left: 10
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    type: 'scroll',
                    bottom: 10,
                    data: chartDays
                },
                visualMap: {
                    top: 'middle',
                    right: 10,
                    color: ['blue', 'gray'],
                    calculable: true
                },
                radar: {
                    indicator: [
                        // { text: 'AQI', max: radarMaxData[0] },
                        // { text: 'PM2.5', max: radarMaxData[1] },
                        // { text: 'PM10', max: radarMaxData[2] },
                        // { text: 'SO2', max: radarMaxData[3] },
                        // { text: 'NO2', max: radarMaxData[4] },
                        // { text: 'CO', max: radarMaxData[5] },
                        // { text: 'O3', max: radarMaxData[6] }
                        { text: 'AQI', max: 150 },
                        { text: 'PM2.5', max: 60 },
                        { text: 'PM10', max: 250 },
                        { text: 'SO2', max: 10 },
                        { text: 'NO2', max: 40 },
                        { text: 'CO', max: 3 },
                        { text: 'O3', max: 250 }
                    ]
                },
                series: (function () {
                    var series = [];
                    for (var i = 0; i <= 6; i++) {
                        series.push({
                            type: 'radar',
                            symbol: 'none',
                            lineStyle: {
                                width: 1
                            },
                            emphasis: {
                                areaStyle: {
                                    color: 'rgba(0,250,0,0.3)'
                                }
                            },
                            data: [
                                {
                                    value: radarAQData[i],
                                    name: chartDays[i]
                                }
                            ]
                        });
                        // console.log(radarAQData[i], chartDays[i])
                    }
                    // console.log(series)
                    return series;
                })()
            })
        }

        return ()=>{
            myRadarChart.dispose();
        }
    }, [radarAQData, radarMaxData]);

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
                    {/* <div ref={chartRef}
                        style={{
                            width: '30vw',
                            height: '40vh',
                            marginLeft: '10vw',
                            marginTop: '3vh',
                            marginBottom: '3vh',
                            display: 'inline-block'
                        }}
                    ></div> */}

                    <div ref={chart3DRef}
                        style={{
                            width: '45vw',
                            height: '50vh',
                            marginLeft: '2vw',
                            marginTop: '3vh',
                            marginBottom: '6vh',
                            display: 'inline-block'
                        }}
                    ></div>
                    <div ref={radarRef}
                        style={{
                            width: '30vw',
                            height: '50vh',
                            marginLeft: '2vw',
                            marginTop: '3vh',
                            marginBottom: '6vh',
                            display: 'inline-block'
                        }}
                    ></div>
                    {/* <button onClick={() => { console.log(radarAQData) }}>click</button> */}
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