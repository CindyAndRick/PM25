import React from 'react'
import { useRoutes } from 'react-router-dom'
import LazyLoad from '../utils/LazyLoad'
import Redirect from '../utils/Redirect'

import { Layout } from 'antd'

export default function MRouter() {

    const element = useRoutes([
        {
            path: "",
            element: <Redirect to="/map" />
        },
        {
            path: "/map",
            element: LazyLoad("Map/AMap")
        },
        {
            path: "/data",
            element: LazyLoad("Data/Data")
        },
        {
            path: "/center",
            element: LazyLoad("Center/Center")
        }
    ])

    return (
        <div>
            <Layout className="site-layout">
                {element}
            </Layout>
        </div>
    )
}
