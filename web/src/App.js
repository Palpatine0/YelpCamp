// App.js
import React, {useState} from "react";
import {Layout} from "antd";
import {Routes, Route, BrowserRouter} from "react-router-dom";

import {Header, Content, Footer} from "antd/es/layout/layout";
import Head from "./Head";
import "./Head.css";
import Body from "./Body";
import Detail from "./Detail";
import Foot from "./Foot";

const App = () => {
    const [bodyHeight, setBodyHeight] = useState(window.innerHeight - 64 - 64);

    const [newEvent, setNewEvent] = useState(0)
    const [bodyKey, setBodyKey] = useState(0);

    const newEventHandle = () => {
        // Increment the key to force re-render of Body component
        setBodyKey((prevKey) => prevKey + 1);
    };

    // const newEventHandle = (ver) => {
    //     setNewEvent(ver);
    // };

    return (
        <BrowserRouter>
            <Layout>
                <Head newEventCallbak={newEventHandle}/>

                <Routes>
                    {/*<Route path='/' element={<Body windowHeight={bodyHeight} newEventNotice={newEvent}/>}/>*/}
                    <Route
                        path='/'
                        element={<Body key={bodyKey} windowHeight={bodyHeight} newEventNotice={newEvent}/>}
                    />
                    <Route path="/detail" element={<Detail windowHeight={bodyHeight}/>}/>
                </Routes>
                <Foot/>
            </Layout>
        </BrowserRouter>
    );
};

export default App;
