// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {NavLink} from 'react-router-dom';
import {apiUrls} from './_data';
import Tools from 'src/utils/helpers/Tools';
import './MainMenu.css';

type Props = {};
type State = {};

export default class MainMenu extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <nav>
                <input type="checkbox" id="menu-checkbox"/>
                <div id="main-menu" className="container-fluid">
                    <div className="row">
                        <NavLink exact className="menu-item col-xl-1" to="/">
                            Trang chủ
                        </NavLink>
                        <NavLink exact className="menu-item col-xl-1" to="/bai-viet/gioi-thieu">
                            Giới thiệu
                        </NavLink>
                        <NavLink exact className="menu-item col-xl-2" to="/bai-viet/ai-thien-van">
                            Đài thiên văn
                        </NavLink>
                        <NavLink exact className="menu-item col-xl-2" to="/bai-viet/nha-chieu-hinh">
                            Nhà chiếu hình
                        </NavLink>
                        <NavLink exact className="menu-item col-xl-3" to="/bai-viet/chuong-trinh-tham-quan">
                            Chương trình tham quan
                        </NavLink>
                        <NavLink exact className="menu-item col-xl-1" to="/tin-tuc">
                            Tin tức
                        </NavLink>
                        <NavLink exact className="menu-item col-xl-1" to="/kien-thuc">
                            Kiến thức
                        </NavLink>
                        <NavLink exact className="menu-item col-xl-1" to="/lien-he">
                            Liên hệ
                        </NavLink>
                    </div>
                </div>
                <label className="toggle" htmlFor="menu-checkbox">
                    <span>☰</span>
                </label>
            </nav>
        );
    }
}

const styles = {
};
