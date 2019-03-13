const DatabaseService = (()=>{

    const _config = {
        apiKey: "AIzaSyCejkYh_oczAlbjEDmrypxYss23p2bHpH4",
        authDomain: "prueba-223821.firebaseapp.com",
        databaseURL: "https://prueba-223821.firebaseio.com",
        projectId: "prueba-223821",
        storageBucket: "prueba-223821.appspot.com",
        messagingSenderId: "421356323828"
    };

    const _init = () => {
        firebase.initializeApp(_config);
    };
    
    const getListadoBodegas = () => {
        return firebase.database().ref('/bodegas/').once('value');
    };
    const getListadoProductos = () => {
        return firebase.database().ref('/productos/').once('value');
    };
    const getListadoEstados = () => {
        return firebase.database().ref('/estados/').once('value');
    };
    const setProducto = (producto) => {
        console.log('producto key: ', producto.key);
        if(!producto.key){
            producto.key = firebase.database().ref().child('productos').push().key;
            console.log('registrar nuevo producto:', producto);
        };
        let update = {};
        update['/productos/' + producto.key] = producto;
        return firebase.database().ref().update(update);
    };

    _init();


    return {
        getListadoBodegas,
        getListadoEstados,
        setProducto,
        getListadoProductos,
    }


})();