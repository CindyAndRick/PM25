import React from 'react'

const LazyLoad = (path) => {
    const Comp = React.lazy(() => import(`../pages/${path}`))
    return (
        <React.Suspense fallback={<div>loading...</div>}>
            <Comp />
        </React.Suspense>
    )
}

export default LazyLoad