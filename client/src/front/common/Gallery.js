// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import LazyLoad from 'react-lazyload';
import {apiUrls} from './_data';
import CustomModal from 'src/utils/components/CustomModal';
import Carousel from 'src/utils/components/Carousel';
import Tools from 'src/utils/helpers/Tools';

type galleryItem = {
    id: number,
    title: string,
    imate: string,
    items: Array<Object>
};
type Props = {};
type State = {
    preview: boolean,
    previewItems: Array<Object>,
    gallery: {[number]: galleryItem},
    dataLoaded: boolean
};

export default class Gallery extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        preview: true,
        previewItems: [],
        gallery: {},
        dataLoaded: false
    };
    constructor(props: Props) {
        super(props);
    }

    async componentDidMount() {
        const gallery = Tools.getGlobalState('gallery');
        if (gallery) {
            return this.setState({
                gallery: gallery,
                dataLoaded: true
            });
        }

        const params = {
            category__type: 'gallery'
        };
        const result = await Tools.apiCall(apiUrls.banner, 'GET', params, false, false);
        if (result.success) {
            const listItem = result.data.items;
            const galleryDict = {};
            for (let item of listItem) {
                if (typeof galleryDict[item.category] == 'undefined') {
                    galleryDict[item.category] = {
                        id: item.category,
                        title: item.category_title,
                        image: item.image,
                        items: [item]
                    };
                } else {
                    galleryDict[item.category].items.push(item);
                }
            }

            this.setState({
                gallery: galleryDict,
                dataLoaded: true
            });
            Tools.setGlobalState('gallery', galleryDict);
        }
    }

    togglePreview = (preview: boolean, previewItems: Array<Object> = []) => {
        this.setState({
            preview: true,
            previewItems
        });
    };

    renderPreview = () => {
        const {previewItems} = this.state;
        if (!this.state.preview || !previewItems.length) return null;
        return (
            <CustomModal
                open={true}
                close={() => this.togglePreview(false)}
                title="Preview"
                size="md"
                backgroundColor="rgb(200, 200, 200)">
                <Carousel listItem={previewItems} />
            </CustomModal>
        );
    };

    render() {
        const gallery = [];
        for (let i in this.state.gallery) {
            const galleryItem = this.state.gallery[parseInt(i)];
            gallery.push(galleryItem);
        }
        if (!gallery.length) return null;
        return (
            <div>
                <div className="content-container">
                    <h2>Thư Viện Ảnh</h2>
                </div>
                {this.renderPreview()}
                <div className="row">
                    {gallery.map(item => (
                        <LazyLoad height={200} key={item.id}>
                            <GalleryItem item={item} togglePreview={this.togglePreview} />
                        </LazyLoad>
                    ))}
                </div>
            </div>
        );
    }
}

type ItemProps = {
    item: Object,
    togglePreview: Function
};
type ItemState = {};
class GalleryItem extends React.Component<ItemProps, ItemState> {
    static defaultProps = {
        item: {}
    };
    state: ItemState = {};
    constructor(props: ItemProps) {
        super(props);
    }

    render() {
        const {item} = this.props;
        return (
            <div className="col-md-4">
                <div className="thumbnail gallery-thumbnail" onClick={() => this.props.togglePreview(true, item.items)}>
                    <img src={item.image} width="100%" title={item.title} alt={item.title} />
                    <div className="caption">{item.title}</div>
                </div>
            </div>
        );
    }
}

const styles = {};
