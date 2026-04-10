var Camas = {
    idCama: 0,
    idPaciente: 0,
    movimientos: [],

    Iniciar() {
        Camas.plugins();
        Camas.DataTableCamas();
        Camas.DataTableMovimientoCamas();
        Camas.Eventos();
        Camas.TiposServicioSeleccionarTodos();
        Camas.ListarServiciosPorTipo();
        Camas.TiposCamaSeleccionarTodos();
        Camas.EstadosCamaSeleccionarTodos();
        Camas.TiposCondicionOcupacionSeleccionarTodos();

    },

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#txtFechaIngreso,#txtFechaSalida').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
    },

    //////////////////////////////////INICIALIZA DATATABLE///////////////////////////////////
    DataTableCamas() {
        var parms = {
            "paging": false,
            //"ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh', // JDELGADOPM
            order: [[0, 'asc']],
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "estado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 3,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 4,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 5,
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.estado == 'Disponible') {
                            $(td).parent().css('color', '#00ad15');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.estado == 'Ocupada') {
                            $(td).parent().css('color', '#607d8b');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
            ]

        }

        var tableWrapper = $('#tblCamas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_camas = $("#tblCamas").dataTable(parms);
    },

    DataTableMovimientoCamas() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '30vh', // JDELGADOPM
            //order: [[1, 'desc']],
            columns: [
                {
                    width: '50%',
                    targets: 0,
                    data: "dServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '25%',
                    targets: 1,
                    data: "fecIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //if (!isEmpty(rowData.fechaIngreso)) {
                        //    $(td).html(FormatearFecha(rowData.fechaIngreso));
                        //} else {
                        //    $(td).html('');
                        //}               
                    }
                },
                {
                    width: '25%',
                    targets: 1,
                    data: "fecSalida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //if (!isEmpty(rowData.fechaSalida)) {
                        //    $(td).html(FormatearFecha(rowData.fechaSalida));
                        //} else {
                        //    $(td).html('');
                        //}                        
                    }
                },                
            ]

        }

        var tableWrapper = $('#tblMovCamas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_movCamas = $("#tblMovCamas").dataTable(parms);
    },


    ///////////////////////////EVENTOS DE INTERACCION INTERFAZ - USUARIO//////////////////////////
    Eventos() {
        $('#btnBuscarCamas').on('click', function () {
            if ($("#cboServicio").val() > 0) {
                Camas.ListarCamasPorServicio();
            }            
        });

        $('#cboServicio').on('change', function () {
            $('#btnBuscarCamas').click();
        });
                
        $('#tblCamas tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_camas.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarCama').on('click', function () {            
            
            if (isEmpty($("#cboServicio").val())) {
                alerta2("info", "", "Seleccione un Servicio.");
                return false;
            }
            Camas.idCama = 0;
            Camas.idPaciente = 0;
            Camas.movimientos = [];
            Camas.DesbloquearCampos();
            $("#cboTipoCama").val(1);
            $("#cboEstadoCama").val(1);
            $("#cboCondicionOcupacion").val(4);
            $("#cboServicioPropietario").val($("#cboServicio").val());
            $("#cboUbicacionMov").val($("#cboServicio").val());

            $("#cboEstadoCama").attr('disabled', 'disabled');
            $("#cboCondicionOcupacion").attr('disabled', 'disabled');
            $("#cboServicioPropietario").attr('disabled', 'disabled');
            $("#cboUbicacionActual").attr('disabled', 'disabled');
            $('.chzn-select').chosen().trigger("chosen:updated");
            oTable_movCamas.fnClearTable();
            $("#modalRegistroCama").modal("show");
        });

        $('#btnModificarCama').on('click', async function () {
            var objrowTb = oTable_camas.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            await Camas.CargarDatosCama(objrowTb);
            
            Camas.DesbloquearCampos();
            
            $("#cboServicioPropietario").attr('disabled', 'disabled');
            $("#cboUbicacionActual").attr('disabled', 'disabled');
            if (objrowTb.estado == 'Ocupada') {                
                $("#cboEstadoCama").attr('disabled', 'disabled');
                $("#txtFechaIngreso").attr('disabled', 'disabled');
                $("#txtFechaSalida").attr('disabled', 'disabled');
                $("#cboUbicacionMov").attr('disabled', 'disabled');
                $("#btnAgregarMovimientoCama").hide();
                $("#btnEliminarMovimientoCama").hide();                
            }

            $('.chzn-select').chosen().trigger("chosen:updated");

            $("#modalRegistroCama").modal("show");
        });

        $('#btnConsultarCama').on('click', async function () {
            var objrowTb = oTable_camas.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }
            await Camas.CargarDatosCama(objrowTb);
            Camas.BloquearCampos();
            
            $("#modalRegistroCama").modal("show");
        });

        $('#btnEliminarCama').on('click', function () {
            var objrowTb = oTable_camas.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            if (objrowTb.estado == 'Ocupada') {
                alerta2("info", "", "No se puede eliminar una cama que esta siendo ocupada.");
                return false;
            }

            Camas.BloquearCampos();
            swal({
                title: 'Eliminar',
                text: 'Esta seguro que desea eliminar la cama ' + objrowTb.codigo,
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#EF6F6C',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                var res = await Camas.BusquedaCantidadEstanciaPorCama(objrowTb.idCama);
                if (res.estancias > 0) {
                    alerta2("info", "", "No se pueden eliminar camas que han tenido estancias hospitalarias anteriormente.");
                    return false;
                }

                Camas.CamasEliminar(objrowTb.idCama);

                //console.log(res.estancias);
            }).catch(swal.noop);
            //$("#modalRegistroCama").modal("show");
        });

        $('#tblMovCamas tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_movCamas.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarMovimientoCama').on('click', function () {

            if (isEmpty($("#txtFechaIngreso").val())) {
                alerta2('info', '', 'Debe ingresar la FECHA INGRESO que llegó la cama.');
                return false;
            } else if (esFormatoFecha($("#txtFechaIngreso").val()) == false){
                alerta2('info', '', 'Debe ingresar una FECHA INGRESO válida.');
                return false;
            }

            if (esFormatoFecha($("#txtFechaSalida").val()) == true) {
                if ($("#txtFechaIngreso").val() > $("#txtFechaSalida").val()) {
                    alerta2('info', '', 'La FECHA FINAL debe ser mayor o igual a la FECHA INGRESO');
                    return false;
                }                
            }
                        
            if (isEmpty($("#cboServicioPropietario").val())) {
                alerta2('info', '', 'Seleccione el servicio propietario de la cama.');
                return false;
            }

            if (isEmpty($("#cboUbicacionMov").val())) {
                alerta2('info', '', 'Debe elegir la Ubicación de la cama en ese rango de fechas.');
                return false;
            }

            if ($("#cboEstadoCama").val() == 3) {
                alerta2('info', '', 'La cama esta OCUPADA, no puede cambiar la ubicación de la cama.');
                return false;
            }
                        
            lstMovCamas = oTable_movCamas.api(true).rows().data();
            for (var i = 0; i < lstMovCamas.length; i++) {
                console.log(lstMovCamas[i].fechaIngreso);
                if (lstMovCamas[i].fecIngreso == $("#txtFechaIngreso").val()) {
                    //alerta2('info', '', 'El diagnóstico ya existe.');
                    return false;
                }
            }

            var objRow = {
                idServicio: $("#cboUbicacionMov").val(),
                dServicio: $("#cboUbicacionMov option:selected").text(),
                //FechaIngreso: isNull($("#txtFechaIngreso").val(), ''),
                //FechaSalida: isNull($("#txtFechaSalida").val(), ''),
                fecIngreso: isNull($("#txtFechaIngreso").val(), ''),
                fecSalida: isNull($("#txtFechaSalida").val(), '')
            }

            Camas.movimientos.unshift(objRow)
            oTable_movCamas.fnClearTable();
            oTable_movCamas.fnAddData(Camas.movimientos);
            oTable_movCamas.resize();
            //oTable_movCamas.api(true).row.add(objRow).draw(false);
            /*$('#tblMovCamas').dataTable({
                "order": [[1, 'desc']]
            });*/
            

            $("#txtFechaIngreso").val('');
            $("#txtFechaSalida").val('');
            $("#cboUbicacionMov").val('');

            $("#cboUbicacionActual").val(objRow.idServicio);

            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#btnEliminarMovimientoCama').on('click', function () {
            let objrowTb = oTable_movCamas.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }
            oTable_movCamas.api(true).row('.selected').remove().draw(false);
        });

        $('#btnGuardarCama').on('click', function () {
            if (Camas.ValidarDatosObligatorios()) {
                Camas.CamasModificar();
            }
        });

        $('#btnCerrarCama').on('click', function () {
            Camas.LimpiarRegistroCama();
            $("#modalRegistroCama").modal("hide");
        });

        $('#btnLiberarCama').on('click', async function () {
            let objrowTb = oTable_camas.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            if (objrowTb.idPaciente > 0) {
                swal({
                    title: 'Cama',
                    text: "¿Esta seguro de liberar la cama seleccionada?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function () {
                    let resp = await Camas.LiberarCamaPorPaciente(objrowTb.idPaciente);
                    if (resp) {
                        Camas.ListarCamasPorServicio();
                    }

                }, function (dimiss) {

                });
            } else {
                alerta2("info", "", "La cama se encuentra disponible.");
                return false;
            }
            
        });

    },


    ///////////////////////////METODOS Y FUNCIONES////////////////////////////////////////
    async CargarDatosCama(obj) {
        const cama = await Camas.CamasSeleccionarPorId(obj.idCama);

        Camas.idCama = obj.idCama;
        Camas.idPaciente = 0;
        $("#txtCodigo").val(cama.codigo);
        $("#cboTipoCama").val(cama.idTiposCama);
        $("#cboEstadoCama").val(cama.idEstadoCama);
        $("#cboCondicionOcupacion").val(cama.idCondicionOcupacion);
        $("#cboServicioPropietario").val(cama.idServicioPropietario);
        $("#cboUbicacionActual").val(cama.idServicioUbicacionActual);
        $("#txtFechaIngreso").val(cama.Codigo);

        await Camas.CamasMovimientosSeleccionarPorCama(obj.idCama);
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    ValidarDatosObligatorios() {
        if (isEmpty($("#cboTipoServicio").val())) {
            alerta2('info', '', 'Seleccione el tipo de servicio de la cama.');
            return false;
        }

        if (isEmpty($("#txtCodigo").val())) {
            alerta2('info', '', 'Seleccione el código de la cama.');
            return false;
        }

        if (isEmpty($("#cboTipoCama").val())) {
            alerta2('info', '', 'Seleccione el tipo de cama.');
            return false;
        }

        if (isEmpty($("#cboEstadoCama").val())) {
            alerta2('info', '', 'Seleccione el estado de la cama.');
            return false;
        }

        //if (isEmpty($("#cboCondicionOcupacion").val())) {
        //    alerta2('info', '', 'Seleccione la condición ocupación de la cama.');
        //    return false;
        //}

        if (isEmpty($("#cboServicioPropietario").val())) {
            alerta2('info', '', 'Seleccione el servicio propietario de la cama.');
            return false;
        }

        if (isEmpty($("#cboUbicacionActual").val())) {
            alerta2('info', '', 'Seleccione el servicio donde esta ubicado la cama actualmente.');
            return false;
        }

        movimientosCamas = oTable_movCamas.api(true).rows().data();
        if (movimientosCamas.length == 0) {
            alerta2('info', '', 'Tiene que Registrar al menos un Movimiento de la Cama (Fecha de Ingreso y Servicio).');
            return false;
        }

        return true;
    },

    LimpiarRegistroCama() {
        $(".campo").val('');        
        oTable_movCamas.fnClearTable();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    BloquearCampos() {
        $(".campo").attr('disabled', 'disabled');
        $("#btnAgregarMovimientoCama").hide();
        $("#btnEliminarMovimientoCama").hide();
        $("#btnGuardarCama").hide();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    DesbloquearCampos() {
        $(".campo").removeAttr("disabled");
        $("#btnAgregarMovimientoCama").show();
        $("#btnEliminarMovimientoCama").show();
        $("#btnGuardarCama").show();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },


    ///////////////////////////METODOS QUE CONSULTA BD///////////////////////////////////
    async ListarServiciosPorTipo() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        var filtro = ''
        if ($("#dataCboServicio").attr("data-tipo") == 2) {
            filtro = ' idEstado= 1 and EsObservacionEmergencia=1';
        }

        if ($("#dataCboServicio").attr("data-tipo") == 3) {
            filtro = ' idEstado= 1';
        }

        data.append('idTipoServicio', $("#dataCboServicio").attr("data-tipo"));
        data.append('filtro', filtro);

        Cargando(1)        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ListarServicioPorTipo?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $('#cboServicio').empty();
                    $('#cboServicioPropietario').empty();
                    $('#cboUbicacionActual').empty();
                    $('#cboUbicacionMov').empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboServicio').append('<option value="' + obj.idServicio + '">' + obj.descripcionLarga + '</option>');                                        
                        $('#cboServicioPropietario').append('<option value="' + obj.idServicio + '">' + obj.descripcionLarga + '</option>');    
                        $('#cboUbicacionActual').append('<option value="' + obj.idServicio + '">' + obj.descripcionLarga + '</option>');    
                        $('#cboUbicacionMov').append('<option value="' + obj.idServicio + '">' + obj.descripcionLarga + '</option>');    
                    });
                    $('#cboServicio').val('');
                    $('#cboServicioPropietario').val('');
                    $('#cboUbicacionActual').val('');
                    $('#cboUbicacionMov').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },

    async ListarCamasPorServicio() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idServicio', $("#cboServicio").val());

        Cargando(1)
        oTable_camas.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ListarDisponibilidadCamasPorServicioActual?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    oTable_camas.fnAddData(datos.lsResultado.table);                    
                }
            }
            else {
                location.reload();
            }
            oTable_camas.resize();
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },


    async TiposServicioSeleccionarTodos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        Cargando(1)
        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/TiposServicioSeleccionarTodos?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $('#cboTipoServicio').empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboTipoServicio').append('<option value="' + obj.idTipoServicio + '">' + obj.descripcionLarga + '</option>');
                    });
                    $('#cboTipoServicio').val($("#dataCboServicio").attr("data-tipo"));
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
            
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },

    async EstadosCamaSeleccionarTodos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        Cargando(1)
        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/EstadosCamaSeleccionarTodos?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $('#cboEstadoCama').empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboEstadoCama').append('<option value="' + obj.idEstadoCama + '">' + obj.descripcionLarga + '</option>');
                    });
                    $('#cboEstadoCama').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
            
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    
    async TiposCamaSeleccionarTodos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        Cargando(1)
        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/TiposCamaSeleccionarTodos?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $('#cboTipoCama').empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboTipoCama').append('<option value="' + obj.idTipoCama + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboTipoCama').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
            
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },

    async CamasSeleccionarPorId(idCama) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCama', idCama);

        Cargando(1)
        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/CamasSeleccionarPorId?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    respuesta = datos.lsResultado.table[0];
                }
            }
            else {
                location.reload();
            }
            
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },

    async TiposCondicionOcupacionSeleccionarTodos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
                
        Cargando(1)
        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/TiposCondicionOcupacionSeleccionarTodos?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $('#cboCondicionOcupacion').empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboCondicionOcupacion').append('<option value="' + obj.idCondicionOcupacion + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboCondicionOcupacion').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
            
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },

    async CamasBuscarCodigoDeCama(codigoCama, idServicioPropietario) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('codigoCama', codigoCama);
        data.append('idServicioPropietario', idServicioPropietario);

        Cargando(1)

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/CamasBuscarCodigoDeCama?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    respuesta = datos.lsResultado.table[0];
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },

    async BusquedaCantidadEstanciaPorCama(idCama) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCama', idCama);

        Cargando(1)

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/BusquedaCantidadEstanciaPorCama?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    respuesta = datos.lsResultado.table[0];
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },

    async CamasMovimientosSeleccionarPorCama(idCama) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCama', idCama);

        Cargando(1);
        Camas.movimientos = [];
        oTable_movCamas.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/CamasMovimientosSeleccionarPorCama?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {                    
                    datoMovCamas = datos.lsResultado.table;
                    for (var i = 0; i < datos.lsResultado.table.length; i++) {
                        //console.log(datoMovCamas[i].fechaIngreso);
                        var objRow = {
                            idServicio: datoMovCamas[i].idServicio,
                            dServicio: datoMovCamas[i].dServicio,
                            fecIngreso: datoMovCamas[i].fecIngreso,
                            fecSalida: datoMovCamas[i].fecSalida
                        }
                        Camas.movimientos.push(objRow)
                    }
                    oTable_movCamas.fnAddData(Camas.movimientos);
                    //oTable_movCamas.fnAddData(datos.lsResultado.table);   
                }
            }
            else {
                location.reload();
            }
            oTable_movCamas.resize();
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },

    async CamasModificar() {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        var lstMovimientosCama = oTable_movCamas.api(true).rows().data();

        if (Camas.idCama == 0) {
            const res = await Camas.CamasBuscarCodigoDeCama($("#txtCodigo").val(), $("#cboServicioPropietario").val());
            if (isEmpty(res) == false) {
                alerta2("info", "", "Ya existe una cama con el mismo \n Código / Servicio Propietario \n" + "Servicio: " + res.servicioActual);
                return false;
            }
        }
        
        data.append('idCama', Camas.idCama);
        data.append('x', 0);
        data.append('y', 0);
        data.append('idPaciente', Camas.idPaciente);
        data.append('idTipoServicio', $("#cboTipoServicio").val());
        data.append('codigo', $("#txtCodigo").val());
        data.append('idTipoCama', $("#cboTipoCama").val());
        data.append('idEstadoCama', $("#cboEstadoCama").val());
        data.append('idCondicionOcupacion', $("#cboCondicionOcupacion").val());
        data.append('idServicioPropietario', $("#cboServicioPropietario").val());
        data.append('idServicioUbicacionActual', $("#cboUbicacionActual").val());
        data.append('lstMovimientosCama', JSON.stringify(lstMovimientosCama.toArray()));

        Cargando(1)

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ModificarCama?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta) {
                    alerta2("success", "", "La cama se guardado correctamente.");
                    Camas.LimpiarRegistroCama();
                    Camas.ListarCamasPorServicio();
                    $("#modalRegistroCama").modal("hide");
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },

    async CamasEliminar(idCama) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();
        
        data.append('idCama', idCama);
        
        Cargando(1)

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/EliminarCama?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta) {
                    alerta2("success", "", "La cama se eliminado correctamente.");
                    Camas.LimpiarRegistroCama();
                    Camas.ListarCamasPorServicio();
                    $("#modalRegistroCama").modal("hide");
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },

    async LiberarCamaPorPaciente(idPaciente) {        
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idPaciente', idPaciente);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/LiberarCamaPorPaciente?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

}


$(document).ready(function () {
    Camas.Iniciar();
});