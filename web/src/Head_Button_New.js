/* Button_New.js */
import React, {useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {Button, Col, Input, message, Modal, Rate, Row, Upload} from "antd";
import Maps from "./Maps";
import axios from "axios";

const {TextArea} = Input

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});


const New = ({newEvent}) => {

    //// button: New
    const [show, setShow] = useState(false)
    const [ver, setVer] = useState()

    const [title, setTitle] = useState("")
    const [user, setUser] = useState("")
    const [stars, setStars] = useState(0)
    const [address, setAddress] = useState("")
    const [desc, setDesc] = useState("")
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")

    const handelShowModalT = () => {
        console.log("doneeeee")
        setUser("")
        setTitle("")
        setStars(0)
        setAddress("")
        setLat(0)
        setLng(0)
        setImgList([])
        setDesc("")

        setShow(true)
    }
    const handelShowModalF = () => {
        setShow(false)
    }

    const handelMapClick = (lat, lng) => {
        setLat(lat)
        setLng(lng)
    }

    const addCamp = (param) => {
        console.log(param)
        axios.post("/api/camp/addCamp", param, {header: {"Content-Type": "application/json"}}).then((res) => {
            if (res.data.code != 0) {
                message.error(res.data.message);
                return;
            }
            message.success("Camp add success");
            newEvent(ver + 1);
            setVer(ver + 1);
            setShow(false);
        }).catch((error) => {
            console.log(error)
            message.error(error.message);
        })
    }

    const submit = () => {

        const param = {
            user: user,
            title: title,
            stars: stars,
            address: address,
            lat: lat,
            lng: lng,
            imgs: imgList.map(item => item.response.data.id),
            desc: desc,
        };

        addCamp(param)
        setShow(false)
    }

    const UploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}></div>
        </div>
    )


    //// button: New -> img preview
    const [showI, setShowI] = useState(false)
    const [imgTitle, setImgTitle] = useState('')
    const [imgSrc, setImgSrc] = useState('')
    const [imgList, setImgList] = useState([])
    const [maxUpload] = useState(2)

    const handelShowIModalT = () => {

        setShowI(true)
    }
    const handelShowIModalF = () => {
        setShowI(false)
    }
    const uploadImgPreviewHandel = async (file) => {
        handelShowIModalT()
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImgSrc(file.url || file.preview);
        setImgTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    }
    const uploadImgHandel = ({file, fileList, event}) => {
        if (file.status == "uploading") {
            message.success("Image uploading");
            setImgList(fileList);
        }
        if (file.status == "done") {
            message.success("Image upload success", 3);
            setImgList(fileList);
        }
        if (file.status == "removed") {
            const list = fileList.filter(item => item.uid != file.uid);
            setImgList(list);
        }
        if (file.status == "error") {
            message.error("Image upload failed", 3);
            const list = fileList.filter(item => item.uid != file.uid);
            setImgList(list);
        }
        setImgList(fileList)
    }

    return (
        <div style={{float: "right", display: "block", width: "100px"}}>
            <Button
                style={{backgroundColor: "transparent", color: "rgb(255,255,255)"}}
                size="large"
                onClick={handelShowModalT}
            >
                New
            </Button>

            <Modal
                title={"Add a Camp"}
                width={"800px"}
                open={show}
                onOk={submit}
                onCancel={handelShowModalF}
            >
                <Row>Title</Row>
                <Row><Input size={"middle"} value={title} onChange={e => {
                    e.persist();
                    setTitle(e.target.value);
                }}/></Row>

                <Row>User</Row>
                <Row><Input size={"small"} value={user} onChange={e => {
                    e.persist();
                    setUser(e.target.value);
                }}/></Row>

                <Row>Rate</Row>
                <Row><Rate value={stars} onChange={setStars}/></Row>

                <Row>Address</Row>
                <Row><Input size={"small"} value={address} onChange={e => {
                    e.persist();
                    setAddress(e.target.value);
                }}/></Row>

                <Row>Images</Row>
                <Row>
                    <Upload
                        // action="http://127.0.0.1:8081/api/pic/uploadPic"
                        action = {`${axios.defaults.baseURL}/api/pic/uploadPic`}
                        listType={"picture-card"}
                        fileList={imgList}
                        onChange={uploadImgHandel}
                        onPreview={uploadImgPreviewHandel}
                    >
                        {imgList.length >= maxUpload ? null : UploadButton}

                    </Upload>
                </Row>


                <Row>Location</Row>
                <Row><Input size={"middle"}/></Row>
                <Row>
                    <Col span={24}>
                        <Maps latlng={{lat: lat, lng: lng}} zoom={6} moveable={true} onclick={handelMapClick}/>
                    </Col>
                </Row>

                <Row>Description</Row>
                <Row><TextArea row={10} value={desc} onChange={e => {
                    e.persist();
                    setDesc(e.target.value);
                }}></TextArea></Row>

            </Modal>

            <Modal
                title={"Preview"}
                open={showI}
                onOk={handelShowIModalF}
                onCancel={handelShowIModalF}
                footer={null}
            >
                <img alt="pic" style={{width: "100%"}} src={imgSrc}/>
            </Modal>
        </div>
    );
}


export default New;