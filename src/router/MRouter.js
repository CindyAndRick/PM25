import React from 'react'
import { useRoutes } from 'react-router-dom'
import LazyLoad from '../utils/LazyLoad'
import Redirect from '../utils/Redirect'

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
            path: "/detail/:city_id",
            element: LazyLoad("Detail/Detail")
        },
        {
            path: "/center",
            element: LazyLoad("Center/Center"),
        },
        {
            path: "/login",
            element: LazyLoad("Login/Login")
        },
        {
            path: "/register",
            element: LazyLoad("Register/Register")
        }
    ])

    return (
        <div style={{ height: '100%', width: '100%' }}>
            {element}
        </div>
    )
}
