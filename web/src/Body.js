/*Body.js*/

import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Layout, List, Card, Rate, message} from "antd";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import axios from 'axios';

const {Content} = Layout
const {Meta} = Card

const data = [];


const Body = ({windowHeight, newEventNotice}) => {


    return (
        <Content
            style={{
                textAlign: "center",
                minHeight: windowHeight
            }}
        >
            <Camps newNotice={newEventNotice}/>
        </Content>
    );
}

const Camps = ({newNotice}) => {

    // --backend data retrieve opt

    const [camps, setCamps] = useState([]);

    // auto enforce
    useEffect(() => {
        console.log("newNotice", newNotice);
        getCamps();
    }, [newNotice]); // Include newNotice as a dependency
    /*useEffect(() => {
        console.log("newNotice", newNotice);
        getCamps();
    }, []);*/

    const getCamps = () => {
        // get data in backend by accessing "/api/camp/retrieveAllCamps". when open
        // axios.get('/../..',{..}): put retrieved data on frontend
        // .then: operate the retrieved data
        axios.get(
            '/api/camp/retrieveAllCamps', {
                params: {}
            }
        ).then((res) => {
            if(res.data.code != 0) {
                message.error(res.data.message);
                return;
            }
            setCamps(res.data.data);
            console.log(res.data.data);
        }).catch((error) => {
            message.error(error.message);
        });
    }

    // --/backend data retrieve opt

    return (
        <div style={{marginLeft: "60px", marginTop: "40px"}}>
            <List grid={{column: 4}} dataSource={camps}
                renderItem={(item) => (
                    <List.Item>

                        <Link target={"_blank"} to={{pathname: '/detail', search: `campID=${item.campID}`}}>
                            {/*<Link target={"_blank"} to={{ pathname: '/detail', search: `id=${item.id}` }}>/!*target={"_blank"}: pop a new page when clicked*!/*/}
                            <Card style={{width: "300px"}}
                                cover={
                                    <img
                                        style={{width: "300px", height: "180px"}}
                                        src={`${axios.defaults.baseURL}/api/pic/retrievePics?id=${item.imgs[0]}`}
                                        // src={`http://127.0.0.1:8081/api/pic/retrievePics?id=${item.imgs[0]}`}
                                        // src={item.imgs[0]}
                                    />
                                }>
                                <div style={{textAlign: "left"}}>
                                    <Rate defaultValue={item.stars} disabled/>
                                    <Meta title={item.title} description={`${item.desc.substring(0, 16)}...`}/>
                                </div>
                            </Card>
                        </Link>

                        {console.log("item.campID:", item.campID, typeof item.campID)}

                    </List.Item>
                )}
            />
        </div>
    );
}


export default Body;


