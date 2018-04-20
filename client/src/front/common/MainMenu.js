// @flow
import * as React from 'react';
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
                        <div className="menu-item col-xl-1 active">Trang chủ</div>
                        <div className="menu-item col-xl-1">Giới thiệu</div>
                        <div className="menu-item col-xl-2">Đài thiên văn</div>
                        <div className="menu-item col-xl-2">Nhà chiếu hình</div>
                        <div className="menu-item col-xl-3">Chương trình tham quan</div>
                        <div className="menu-item col-xl-1">Tin tức</div>
                        <div className="menu-item col-xl-1">Kiến thức</div>
                        <div className="menu-item col-xl-1">Liên hệ</div>
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
