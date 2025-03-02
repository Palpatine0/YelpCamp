/*Head.js*/
import React, {useState} from "react";
import {Layout, Menu} from "antd";
import New from "./Head_Button_New";
import {useNavigate} from 'react-router-dom';
const {Header} = Layout

const Head = ({newEventCallbak}) => {
    const [menus, setMenus] = useState([
        {title: "Campgrounds", path: "/", key: "Campgrounds"}, // Add key property
        {title: "About", path: "/about", key: "About"}, // Add key property
    ]);
    const navigate = useNavigate();

    /*to menu*/
    const menuClick = (event) => {
        /*console.log(event);*/
        navigate(event.item.props.path);
    }



    return (
        <Header style={{
            backgroundColor: 'rgb(220,54,70)'
        }}>

            {/*div for logo*/}
            <div style={{
                color: "white",
                fontSize: "22px",
                float: "left",
                display: "block",
                width: "120px"
            }}>
                YelpCamp
            </div>

            {/*div for nav*/}
            <div style={{
                marginLeft: "50px",
                float: "left",
                display: "block",
                width: "400px"
            }}>
                {/*invoke ant component*/}
                <Menu
                    style={{
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        color: "rgba(255,255,255, .55)"
                    }}
                    mode="horizontal"

                    items={
                        menus.map(
                            (item) => {
                                const key = item.title;
                                return {
                                    key,
                                    label: `${item.title}`,
                                    path: item.path
                                }
                            }
                        )
                    }
                    onClick={menuClick}
                />
            </div>

            <New newEvent={newEventCallbak}/>
        </Header>
    );
}

export default Head;