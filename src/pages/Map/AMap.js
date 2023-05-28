import React from 'react'
import { Map, Heatmap } from '@pansy/react-amap';

import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';

export default function AMap() {
    const { Search } = Input;
    const onSearch = (value) => console.log(value);
    return (
        <div>
            <Search placeholder="input search text" onSearch={onSearch} enterButton />
            <div style={{ height: '100vh', width: '100vw', position: 'absolute' }}>
                <Map>
                    {/* <Heatmap
                        dataSet={{
                            data: heatmapData,
                            max: 100
                        }}
                    /> */}
                </Map>
            </div>
        </div>
    )
}
