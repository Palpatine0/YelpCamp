/* Detail.js */
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Layout, Row, Col, Divider, Rate, Carousel, Image, List, Typography, Button, Modal, Input, message} from "antd";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import moment from 'moment';
import axios from 'axios';

import Maps from "./Maps";

const {Content} = Layout
const {Paragraph, Text} = Typography


const Detail = ({windowHeight}) => {
    const [searchParams] = useSearchParams();

    const [camp, setCamp] = useState({title:"", stars: 0, address:"", desc:"", comments: 0, lat:0, lng:0, imgs:[], time:""});

    useEffect(()=>{
        const paramID = searchParams.get("campID");
        getCampDetail(paramID);
    }, []);

    const getCampDetail = (campID) => {
        axios.get('/api/camp/retrieveCamp', {params:{campID:campID}}).then((res)=>{
            if(res.data.code != 0){
                message.error(res.data.message);
                return ;
            }

            setCamp(res.data.data);
        }).catch((error)=>{
            console.log(error.message);
        });
    };

    return (
        <Content style={{minHeight: windowHeight}}>
            <Row style={{marginTop: "20px"}}>
                <Col span={2}/><span/>
                <Col span={12}>
                    <Divider plain>Description</Divider>
                    <Description camp={camp}/>
                    <Divider plain>Comments</Divider>
                    <Comments campID={searchParams.get("campID")}/>
                </Col>

                <Col span={6} offset={2}>
                    <Divider plain>Images</Divider>
                    <Imgs imgs={camp.imgs}/>
                    <Divider plain>Location</Divider>
                    <Maps latlng={{lat:camp.lat,lng:camp.lng}} zoom={6}/>
                </Col>
                <Col span={2}/><span/>
            </Row>
        </Content>
    );
};

const Description = ({camp}) => {
    return (
        <div>
            <Row><h1>{camp.title}</h1></Row>
            <Row style={{lineHeight: "35px"}}>
                <Col span={6}><Rate disabled defaultValue={camp.stars} value={camp.stars} /></Col>
                <Col span={4}><span>Average Rate: {camp.stars}</span></Col>
                <Col span={4}>Comments {camp.comments}</Col>
                <Col>Publish Date: {moment(camp.time*1000).format('MM-DD-YYYY HH:mm')}</Col>
            </Row>
            <Row><h3>Location: {camp.address}</h3></Row>
            <Row><h3>Description:</h3></Row>
            <Row><span>{camp.desc}</span></Row>
        </div>
    );


}


/*const comments = [
    {user: "A", stars: 2, time: "XX", desc: "superb!"},
    {user: "B", stars: 4, time: "XX", desc: "superb!"}
]*/
const Comments = ({campID}) => {

    const [coms, setComs] = useState([])

    useEffect(()=>{
        getCommentList(campID);
    },[]);

    const getCommentList = (id) =>{
        axios.get("/api/comment/retrieveComments", {params:{campID:id}}).then((res)=>{
            // console.log(res)
            if(res.data.code != 0){
                message.error(res.data.message);
                return ;
            }
            setComs(res.data.data);
        }).catch((error)=>{
            message.error(error.message);
        });
    };

    const commentAddEventHandle = () => {
        // console.log(coms)
        const data = coms.map(item => item)
        setComs(data)
    }

    return (
        <div>
            <List
                header={<CommentButton addEventCallbackFunc={commentAddEventHandle} campID={campID}/>}
                dataSource={coms}
                renderItem={(item) => (
                    <List.Item>
                        <Typography>
                            <Paragraph>
                                <span style={{marginLeft: "2px"}}> {item.user} </span>
                                <span style={{marginLeft: "2px"}}> Rate: {item.stars} </span>
                                <span style={{marginLeft: "2px"}}> {moment(item.time*1000).format('MM-DD-YYYY HH:mm')}</span>
                            </Paragraph>
                            <Text>
                                <span style={{marginLeft: "2px"}}> {item.desc}</span>
                            </Text>
                        </Typography>
                    </List.Item>
                )}
            />
        </div>
    );
}


const CommentButton = ({addEventCallbackFunc,campID}) => {


    const [show, setShow] = useState(false)
    const [user, setUser] = useState("")
    const [stars, setStars] = useState(0)
    const [desc, setDesc] = useState("")

    const handelShowModalT = () => {
        setShow(true)
        setUser("")
        setStars(5)
        setDesc("")
    }
    const handelShowModalF = () => {
        setShow(false);
    }
    const submit = () => {
    const param = { campID: campID, user: user, stars: stars, desc: desc };

    axios
        .post("/api/comment/addComment", param, {
            headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
            if (res.data.code === 0) {
                // Comment was added successfully, update the state and close the modal
                addEventCallbackFunc();
                setShow(false);
            } else {
                message.error(res.data.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(error.message);
        });
};



    return (
        <div>
            <Button type={"primary"} size={"small"} onClick={handelShowModalT}>Comment</Button>
            <Modal title={"Write your thought"} open={show} onOk={submit} onCancel={handelShowModalF}>
                <Col>Username</Col>
                <Col><Input size={"small"} value={user} onChange={e => {
                    e.persist();
                    setUser(e.target.value);
                }}/></Col>

                <Col>Rate</Col>
                <Col><Rate value={stars} onChange={setStars}/></Col>

                <Col><Input size={"large"} value={desc} onChange={e => {
                    e.persist();
                    setDesc(e.target.value);
                }}/></Col>
            </Modal>
        </div>
    );
}



const Imgs = ({imgs}) => {
    return (
        <div>
            <Carousel autoplay style={{textAlign: "center", height: 200, width: 376}}>
                {/*{camp.imgs.map((img, idx) => <Image key={idx} height={200} width={376} src={img}/>)}*/}
                {imgs.map((img,idx)=><Image key={idx} height={200} width={376} src={`${axios.defaults.baseURL}/api/pic/retrievePics?id=${img}`} />)}
            </Carousel>
        </div>
    );
}


export default Detail;
