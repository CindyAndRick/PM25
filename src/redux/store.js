import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import CityReducer from './reducers/CityReducer';
import TabbarReducer from './reducers/TabbarReducer';
import CinemaListReducer from './reducers/CinemaListReducer';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    whitelist: []
}

const reducer = combineReducers({
    CityReducer,
    TabbarReducer,
    CinemaListReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

// redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, /* preloadedState, */ composeEnhancers(
    // origin
    // const store = createStore(persistedReducer,
    applyMiddleware(reduxPromise)
));
let persistor = persistStore(store)

export { store, persistor };


// function createMyStore(reducer) {
//     var list = []
//     var state = reducer(undefined, {})
//     function subscribe(callback) {
//         list.push(callback)
//     }

//     function dispatch(action) {
//         reducer(state, action)
//         for (var i in list) {
//             list[i] && list[i]()
//         }
//     }

//     function getState() {
//         return state
//     }

//     return {
//         subscribe,
//         dispatch,
//         getState
//     }
// }