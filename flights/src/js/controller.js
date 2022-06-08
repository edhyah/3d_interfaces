AFRAME.registerComponent('controller', {
    schema: {
        message: {type: 'string', default: 'Hello, World!'}
    },
    init: function () {
        console.log('-------------');
        console.log(this.data.message);
    }
});
