import axios from 'axios';
import React, { createContext, useReducer, useState, useEffect, useContext, useCallback } from 'react';
import { SERVER_URL, REACT_APP_SOCKET } from './Constants';
import io from 'socket.io-client';

export const AppContext = createContext();
export const SocketContext = createContext();

export const withContext = Component => {
    class ComponentWithContext extends React.Component {
        render() {
            return (
                <AppContextProvider>
                    <SocketContextProvider>
                        <Component />
                    </SocketContextProvider>
                </AppContextProvider>
            );
        }
    }

    return ComponentWithContext;
};

export const ActionTypes = {
    FETCHED: 'FETCHED',
    PUSH: 'PUSH',
    ADDED: 'ADDED',
    REMOVED: 'REMOVE',
    UPDATED: 'UPDATED',
};

// TODO: Change your routes

export const fetch = async dispatch => {
    let results = [];
    if (!navigator.onLine) {
        console.log('ERROR OFFLINE MODE');
    } else {
        let response = await axios.get(`${SERVER_URL}/items`);
        let { data } = response;
        results = data;
    }
    dispatch({ type: ActionTypes.FETCHED, results });
};

export const add = async (entity, dispatch) => {
    let response;
    console.log({ ...entity });
    response = await axios.post(`${SERVER_URL}/items`, entity);
    let result = response.data;
    dispatch({ type: ActionTypes.ADDED, result });
};

export const remove = async (id, dispatch) => {
    await axios.delete(`${SERVER_URL}/item/${id}`);
    dispatch({ type: ActionTypes.REMOVED, id });
};

export const update = async (entity, dispatch) => {
    let response;
    console.log({ ...entity });
    response = await axios.put(`${SERVER_URL}/item/${entity.id}`, entity);
    let result = response.data;
    dispatch({ type: ActionTypes.UPDATED, result });
};

export const reducer = (state, action) => {
    let newState;
    switch (action.type) {
        case ActionTypes.FETCHED:
            newState = [...action.results];
            break;
        case ActionTypes.ADDED:
            newState = [...state.filter(i => i.id !== action.result.id), { ...action.result }];
            break;
        case ActionTypes.UPDATED:
            newState = [...state.filter(i => i.id !== action.result.id), { ...action.result }];
            break;
        case ActionTypes.REMOVED:
            newState = state.filter(i => i.id !== action.id);
            break;
        case ActionTypes.PUSH:
            newState = [...action.data];
            break;
        default:
            newState = state;
    }

    if (newState !== state) {
        console.log('action:', action.type, '->', newState);
    }

    return newState;
};

export const SocketContextProvider = props => {
    const { dispatch } = useContext(AppContext);
    const [socket, setSocket] = useState(false);

    const pushCallBack = useCallback(
        payload => {
            console.log('received PUSH', { ...payload });
            dispatch({ type: ActionTypes.PUSH, data: payload.data });
        },
        [dispatch],
    );

    useEffect(() => {
        if (!socket) {
            const _socket = io.connect(REACT_APP_SOCKET);
            console.log('connecting socket');
            _socket.on('push', function(payload) {
                pushCallBack(payload);
            });
            _socket.emit('ready');
            setSocket(_socket);
        }
    }, [socket, pushCallBack]);

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {props.children}
        </SocketContext.Provider>
    );
};

export const AppContextProvider = props => {
    const [items, dispatch] = useReducer(reducer, []);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            console.log('First Fetch...');
            fetch(dispatch).then(() => setLoaded(true));
        }
    }, [loaded]);

    return (
        <AppContext.Provider
            value={{
                items,
                dispatch,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
