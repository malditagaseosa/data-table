const Producto = (producto, cantidad, bodega, estado, observacion, key) => {
    return {
        producto,
        cantidad,
        bodega,
        estado,
        observacion,
        key
    }
};

var app = new Vue({
    el: '#app',
    data: {
        bodegas: [],
        estados: [],
        form: {},
        productos: [],
        busqueda: '',
        pagina: 1,
        porPagina: 5,
        paginas: [],
        listadoFiltrado: []

    },
    created: function() {
        this.loadListadoBodegas();
        this.loadListadoEstados();
        this.loadListadoProductos();
    },
    methods: {
        handleSave: function() {
            let vm = this;
            let producto = Producto(this.form.producto, this.form.cantidad, JSON.parse(this.form.bodega), JSON.parse(this.form.estado), this.form.observacion, this.form.key);
            if(producto.key){
                Swal.fire({
                    title: '¿Esta seguro de guardar los cambios?',
                    type: 'question',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Si :)',
                    cancelButtonText: 'No :('
                }).then((result) => {
                    if(result.value){
                        DatabaseService.setProducto(producto).then(()=>{
                            vm.form = {};
                            vm.loadListadoProductos();
                            Swal.fire(
                                'Guardado',
                                'Los cambios han sido guardados',
                                'success'
                            )
                        }, this.error);
                    }
                });
            }else{
                DatabaseService.setProducto(producto).then(()=>{
                    vm.form = {};
                    vm.loadListadoProductos();
                    Swal.fire(
                        'Guardado',
                        'Se ha guardado el producto',
                        'success'
                    )
                }, this.error);
            }
        },
        handleUpdate: function(registro) {
            $('#modal-producto').modal('show');
            this.form = {
                producto: registro.producto,
                cantidad: registro.cantidad,
                bodega: JSON.stringify(registro.bodega),
                estado: JSON.stringify(registro.estado),
                observacion: registro.observacion,
                key: registro.key
            };
        },
        handleCancel: function(){
            this.form = {};
        },
        loadListadoBodegas: function(){
            DatabaseService.getListadoBodegas().then(this.setListadoBodegas, this.error);
        },
        loadListadoEstados: function(){
            DatabaseService.getListadoEstados().then(this.setListadoEstados, this.error);
        },
        loadListadoProductos: function(){
            DatabaseService.getListadoProductos().then(this.setListadoProductos, this.error);
        },
        setListadoBodegas: function(snapshot){
            this.bodegas = Object.keys(snapshot.val()).map((el)=>{
                return snapshot.val()[el];
            });
        },
        setListadoEstados: function(snapshot) {
            this.estados = Object.keys(snapshot.val()).map((el)=>{
                return snapshot.val()[el];
            });
        },
        setListadoProductos: function(snapshot) {
            if(snapshot.val()){
                this.productos = Object.keys(snapshot.val()).map((el)=>{
                    return snapshot.val()[el];
                });
                this.listadoFiltrado = this.productos;
            }else{
                return
            }
        },
        setPaginas: function(listado) {
            this.paginas = [];
            let num_paginas = Math.ceil(listado.length/this.porPagina);
            for (let i = 1; i <= num_paginas; i++){
                this.paginas.push(i);
            };
        },
        paginacion: function(listado) {
            let pagina = this.pagina;
            let porPagina = this.porPagina;
            let inicio = (pagina * porPagina) - porPagina;
            let final = (pagina * porPagina);
            
            return listado.slice(inicio, final);
        },
        error: function(error){
            console.log(error);
        }
    },
    computed: {
        productosFiltrados: function(){
            return this.productos.filter(p => {
                return p.producto.toLowerCase().indexOf(this.busqueda.toLowerCase()) > -1;
            });
        }
    },
    watch: {
        productos: function(){
            this.setPaginas(this.productos);
        },
        productosFiltrados: function(){
            this.setPaginas(this.productosFiltrados);
        }
    }
  })