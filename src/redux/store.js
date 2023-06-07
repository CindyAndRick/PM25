import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import AQDataReducer from './reducers/AQDataReducer';
import CityDataReducer from './reducers/CityDataReducer';
import UserDataReducer from './reducers/UserDataReducer';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage
    // blacklist: ['UserDataReducer']
    // whitelist: [AQDataReducer, CityDataReducer, UserDataReducer]
}

const reducer = combineReducers({
    AQDataReducer,
    CityDataReducer,
    UserDataReducer
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
