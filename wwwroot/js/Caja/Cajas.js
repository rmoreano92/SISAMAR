var Caja = {
    idCaja: 0,

    async Iniciar() {
        Caja.DataTableBusqueda();
        Caja.DataTableGeneracionComprobantes();
        await Caja.Plugins();
        Caja.Eventos();
    },

    async Plugins() {
        //let FechaHora = await Utilitario.FechaHoraServidor();        
        //let FechaDia = FechaHora.substring(0, 10);

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        //$("#txtFechaIngresoIniBusq, #txtFechaIngresoFinBusq").datepicker("setDate", FechaDia);

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
    },

    ///////////////////////DATATABLE//////////////////////////////////////////////////////////////////////////////
    DataTableBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "codigo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcion",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "loginPC",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "impresoraDefault",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "impresora2",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "usuarioLogeado",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Cajas = $("#tblCajas").dataTable(parms);
    },

    DataTableGeneracionComprobantes() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "tipoComprobante",
                    width: "30%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                },
                {
                    data: null,
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('<input id="nroSerie_' + rowData.idTipoComprobante + '" type="text" class="form-control form-control-sm" style="width:75%;" value="' + rowData.nroSerie + '" />')
                    },
                },
                {
                    data: null,
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('<input id="nroDocumento_' + rowData.idTipoComprobante + '" type="text" class="form-control form-control-sm" style="width:75%;" value="' + rowData.nroDocumento + '" />')
                    },
                },
                {
                    data: null,
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('<input id="nroDocumentoInicial_' + rowData.idTipoComprobante + '" type="text" class="form-control form-control-sm" style="width:75%;" value="' + rowData.nroDocumentoInicial + '" />')
                    },
                },
                {
                    data: null,
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('<input id="nroDocumentoFinal_' + rowData.idTipoComprobante + '" type="text" class="form-control form-control-sm" style="width:75%;" value="' + rowData.nroDocumentoFinal + '" />')
                    },
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_GeneracionComprobantes = $("#tblGeneracionComprobantes").dataTable(parms);
    },


    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await Caja.CajasListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            Caja.LimpiarCamposBusqueda();
        });

        $('#tblCajas tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Cajas.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            await Caja.LimpiarCamposRegistro();
            Caja.DesbloquearRegistro();
            let documentos = await Caja.CajaNroDocumentosSeleccionar(0);
            oTable_GeneracionComprobantes.fnAddData(documentos.table);
            $("#modalRegistroCaja").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_Cajas.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await Caja.LimpiarCamposRegistro();
            Caja.DesbloquearRegistro();
            const resp = await Caja.CargarDatos(objrowTb.idCaja);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroCaja").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_Cajas.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await Caja.LimpiarCamposRegistro();
            const resp = await Caja.CargarDatos(objrowTb.idCaja);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                Caja.BloquearRegistro();
                $("#modalRegistroCaja").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_Cajas.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            swal({
                title: 'ELIMINAR',
                html: "¿Esta seguro de eliminar la caja?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Código</th><th>Caja</th></tr><tr><td align="left">' + objrowTb.codigo + '</td><td align="left">' + objrowTb.descripcion + '</td></tr></table>',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    Caja.idCaja = objrowTb.idCaja;
                    const resp = await Caja.CajaEliminar();
                    if (resp) {
                        await Caja.LimpiarCamposRegistro();
                        Caja.CajasListar();
                    }
                }
                
            }, function (dimiss) {

            });

        });

        $('#btnGuardarCaja').on('click', async function () {

            swal({
                title: 'Guardar',
                html: "¿Esta seguro de guardar el registro?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    const resp = await Caja.CajaGuardar();
                    if (resp) {
                        await Caja.LimpiarCamposRegistro();
                        Caja.CajasListar();
                        $("#modalRegistroCaja").modal("hide");
                    }
                }                
            }, function (dimiss) {

            });
        });

        $('#btnCancelarCaja').on('click', async function () {
            await Caja.LimpiarCamposRegistro();
            $("#modalRegistroCaja").modal("hide");
        });

        $('#btCierreCaja').on('click', async function () {
            let objrowTb = oTable_Cajas.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }
            //if (NotaCredito.ValidarDatosObligatoriosRegistro() == true) {
            swal({
                title: 'Cierre',
                html: "¿Esta seguro de realizar el CIERRE DE CAJA?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    const resp = await Caja.CierreCaja(objrowTb.idGestioncaja);
                    if (resp) {
                        Caja.CajasListar();
                    }
                }                
            }, function (dimiss) {

            });//}
        });      

    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async CajasListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('codigo', $("#txtCodigoCajaBusq").val());
        data.append('nombre', $("#txtDescripcionCajaBusq").val());

        try {
            Cargando(1);
            oTable_Cajas.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Cajas/CajasListar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_Cajas.fnAddData(datos.respuesta.table);
                oTable_Cajas.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async CajaSeleccionar(idCaja) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCaja', idCaja);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Cajas/CajaSeleccionar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta;
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async CajaNroDocumentosSeleccionar(idCaja) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCaja', idCaja);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Cajas/CajaNroDocumentosSeleccionar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta;
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    
    async CajaGuardar() {
        if (Caja.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('IdCaja', Caja.idCaja);
        formData.append('Codigo', $("#txtCodigoCaja").val());
        formData.append('Descripcion', $("#txtNombreCaja").val());
        formData.append('loginPC', $("#txtEquipoAutorizadoCaja").val());
        formData.append('ImpresoraDefault', $("#txtImpresoraServiciosCaja").val());
        formData.append('Impresora2', $("#txtImpresoraFarmaciaCaja").val());
        formData.append('detalle', JSON.stringify(Caja.DevolverDetalleNroDocumentos()));
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Cajas/CajaGuardar?area=Caja",
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

    async CajaEliminar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idCaja', Caja.idCaja);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Cajas/CajaEliminar?area=Caja",
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

    async CierreCaja(idGestionCaja) {
        let respuesta;
        let resp = false;
        let datos;
        let mensaje = '';
        let formData = new FormData();

        formData.append('idGestionCaja', idGestionCaja);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Cajas/CierreCaja?area=Caja",
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
                        resp = true;
                        alerta2("success", "", datos.successMessage);
                        //location.reload();
                    }
                } else {
                    alerta2("error", "", datos.mensaje);
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    ////////////////////METODOS//////////////////////////////////////////////////////////////////////
    async CargarDatos(idCaja) {
        let resp = false;
        let datos = await Caja.CajaSeleccionar(idCaja);
        let documentos = await Caja.CajaNroDocumentosSeleccionar(idCaja);
        if (!isEmpty(datos)) {
            let objCaja = datos.table[0];
            Caja.idCaja = objCaja.idCaja;            
            $("#txtCodigoCaja").val(objCaja.codigo);
            $("#txtNombreCaja").val(objCaja.descripcion);
            $("#txtEquipoAutorizadoCaja").val(objCaja.loginPC);
            $("#txtImpresoraServiciosCaja").val(objCaja.impresoraDefault);
            $("#txtImpresoraFarmaciaCaja").val(objCaja.impresora2);
            oTable_GeneracionComprobantes.fnAddData(documentos.table);

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            resp = true;
        }

        return resp;
    },
        
    DevolverDetalleNroDocumentos() {
        let detalleDocumentos = [];
        let objItemDetalle = null;
        let lstDetalleDocumentos = oTable_GeneracionComprobantes.api(true).data().toArray();

        for (let [i, obj] of lstDetalleDocumentos.entries()) {

            objItemDetalle = {
                index: obj.index,               //para controlar cada fila como unica
                IdCaja: 0,
                IdTipoComprobante: obj.idTipoComprobante,
                NroSerie: $("#nroSerie_" + obj.idTipoComprobante).val(),
                NroDocumento: $("#nroDocumento_" + obj.idTipoComprobante).val(),
                NroDocumentoInicial: $("#nroDocumentoInicial_" + obj.idTipoComprobante).val(),
                NroDocumentoFinal: $("#nroDocumentoFinal_" + obj.idTipoComprobante).val()
            }

            detalleDocumentos.push(objItemDetalle);
        }

        return detalleDocumentos;
    },

    ValidarDatosObligatoriosRegistro() {
        //let detalleServ = Caja.DevolverDetalleNroDocumentos();

        if (isEmpty($("#txtCodigoCaja").val())) {
            alerta2("info", "", "Por favor ingrese el Código de la caja.");
            return false;
        }

        if (isEmpty($("#txtNombreCaja").val())) {
            alerta2("info", "", "Por favor ingrese el Nombre de la caja.");
            return false;
        }

        if (isEmpty($("#txtEquipoAutorizadoCaja").val())) {
            alerta2("info", "", "Por favor ingrese el Nombre del equipo autorizado.");
            return false;
        }

        //if (isEmpty($("#txtImpresoraServiciosCaja").val())) {
        //    alerta2("info", "", "Por favor ingrese el Nombre de la impresora para Servicios.");
        //    return false;
        //}

        //if (isEmpty($("#txtImpresoraFarmaciaCaja").val())) {
        //    alerta2("info", "", "Por favor ingrese el Nombre de la impresora para Farmacia.");
        //    return false;
        //}

        //if (detalleServ.length == 0) {
        //    alerta2("info", "", "Por favor agregue almenos un servicio.");
        //    return false;
        //}

        return true;
    },

    async LimpiarCamposRegistro() {
        Caja.idEmpleado = 0;

        $('.writing').val('');
        $('.reading').val('');
                
        oTable_GeneracionComprobantes.fnClearTable();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarCamposBusqueda() {
        $(".search").val("");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnAgregarServicioAutorizado").hide();
        $("#btnQuitarServicioAutorizado").hide();
        $("#btnGuardarArchivero").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnAgregarServicioAutorizado").show();
        $("#btnQuitarServicioAutorizado").show();
        $("#btnGuardarArchivero").show();
    },

}

$(document).ready(function () {
    Caja.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});