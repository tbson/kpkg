// @flow
import * as React from 'react';
import Wrapper from '../common/Wrapper';

type Props = {
    children?: React.Node,
};
type State = {};

export default class Contact extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Wrapper>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="content-container">
                            <h1>LIÊN HỆ</h1>
                            <hr/>
                            <div style={{height: 456}}>
                                <div><strong>Trung tâm Vũ trụ Việt Nam</strong></div>
                                <div>Viện Hàn lâm Khoa học và Công nghệ Việt Nam</div>
                                <ul>
                                    <li>Tòa nhà VNSC (A6), số 18, Hoàng Quốc Việt, Hà Nội, Việt Nam.</li>
                                    <li>Điện thoại: (+84) 24-37917675</li>
                                    <li>Fax: (+84) 24-37627205</li>
                                    <li>Email: info@vnsc.org.vn</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="content-container">
                            <h1>BẢN ĐỒ</h1>
                            <hr/>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.6410604478247!2d105.79980041505125!3d21.047043385988516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab23669d3ca1%3A0x49407c3e6b14925b!2sVietnam+National+Space+Center!5e0!3m2!1sen!2s!4v1524300601192" width="100%" height="450" frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}
