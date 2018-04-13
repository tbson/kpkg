export default () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            window.jQuery = require('jquery');
            require('bootstrap/dist/js/bootstrap.bundle.min.js');
            require('react-summernote/dist/react-summernote.css');
            resolve({
                ReactSummernote: require('react-summernote')
            });
        });
    });
};
