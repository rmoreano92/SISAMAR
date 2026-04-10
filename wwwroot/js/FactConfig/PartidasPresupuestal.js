var PartidaPresupuestal = {
    idPartidaPresupuestal: 0,

    async Iniciar() {
        PartidaPresupuestal.DataTableBusqueda();
        PartidaPresupuestal.DataTableProcedimientosPartidasPresupuestal();
        await PartidaPresupuestal.Plugins();
        PartidaPresupuestal.Eventos();
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
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcion",
                    width: "85%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_PartidaPresupuestal = $("#tblPartidasPresupuestal").dataTable(parms);
    },

    DataTableProcedimientosPartidasPresupuestal() {
        var parms = {
            "paging": true,
            "bFilter": true,
            "ordering": true,
            "order": [[3, 'desc']],
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "codigo",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                },
                {
                    data: "nombre",
                    width: "70%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                },
                {
                    data: null,
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        const checked = (PartidaPresupuestal.idPartidaPresupuestal == rowData.idPartida);
                        rowData.seleccionado = checked; // estado inicial

                        const input = $('<input>', {
                            class: 'toggle__input chkCptEsPartidaPresupuestal writing',
                            type: 'checkbox',
                            id: 'chkCptEsPartidaPresupuestal_' + rowData.idProducto,
                            checked: checked
                        }).on('change', function () {
                            rowData.seleccionado = this.checked;
                        });

                        $(td).html(
                            $('<div>', { class: 'check__toggle mt-04' }).append(
                                $('<label>', { class: 'toggle' }).append(
                                    input,
                                    $('<span>', { class: 'toggle__label' }).append(
                                        $('<span>', { class: 'toggle__text' })
                                    )
                                )
                            )
                        );
                    }
                    //createdCell: function (td, cellData, rowData, row, col) {
                    //    $(td).attr('align', 'left')
                    //    $(td).html('<div class="check__toggle mt-04">' +
                    //        '    <label class="toggle">' +
                    //        '        <input class="toggle__input writing"' +
                    //        '               type = "checkbox"' +
                    //        '' + (PartidaPresupuestal.idPartidaPresupuestal == rowData.idPartida ? 'checked' : '') +
                    //        '               id = "chkCptEsPartidaPresupuestal_' + rowData.idProducto + '" > ' +
                    //        '        <span class="toggle__label">' +
                    //        '            <span class="toggle__text"></span>' +
                    //        '        </span>' +
                    //        '    </label>' +
                    //        '</div>')
                    //},
                },
                {
                    data: null,
                    visible: false,
                    render: function (data, type, row) {
                        return (PartidaPresupuestal.idPartidaPresupuestal == row.idPartida) ? 1 : 0;
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ProcedimientosPartidaPresupuestal = $("#tblProcedimientosPartidasPresupuestal").dataTable(parms);
    },

    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#modalRegistroPartidaPresupuestal').on('shown.bs.modal', function () {
            oTable_ProcedimientosPartidaPresupuestal.resize();
        });

        $('#btnBuscar').on('click', async function () {
            await PartidaPresupuestal.PartidasPresupuestalListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            PartidaPresupuestal.LimpiarCamposBusqueda();
        });

        $('#tblPartidasPresupuestal tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_PartidaPresupuestal.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            await PartidaPresupuestal.LimpiarCamposRegistro();
            PartidaPresupuestal.DesbloquearRegistro();
            await PartidaPresupuestal.CatalogoServiciosListarTodos();
            //oTable_ProcedimientosPartidaPresupuestal.fnAddData(documentos.table);
            $("#modalRegistroPartidaPresupuestal").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_PartidaPresupuestal.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await PartidaPresupuestal.LimpiarCamposRegistro();
            PartidaPresupuestal.DesbloquearRegistro();
            const resp = await PartidaPresupuestal.CargarDatos(objrowTb.idPartidaPresupuestal);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroPartidaPresupuestal").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_PartidaPresupuestal.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await PartidaPresupuestal.LimpiarCamposRegistro();
            const resp = await PartidaPresupuestal.CargarDatos(objrowTb.idPartidaPresupuestal);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                PartidaPresupuestal.BloquearRegistro();
                $("#modalRegistroPartidaPresupuestal").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_PartidaPresupuestal.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            swal({
                title: 'ELIMINAR',
                html: "¿Esta seguro de eliminar la partida presupuestal?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Código</th><th>Partida Prespuestal</th></tr><tr><td align="left">' + objrowTb.codigo + '</td><td align="left">' + objrowTb.descripcion + '</td></tr></table>',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    PartidaPresupuestal.idPartidaPresupuestal = objrowTb.idPartidaPresupuestal;
                    const resp = await PartidaPresupuestal.PartidasPresupuestalEliminar();
                    if (resp) {
                        await PartidaPresupuestal.LimpiarCamposRegistro();
                        PartidaPresupuestal.PartidasPresupuestalListar();
                    }
                }

            }, function (dimiss) {

            });

        });

        $('#btnGuardarPartidaPresupuestal').on('click', async function () {

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
                    const resp = await PartidaPresupuestal.PartidasPresupuestalGuardar();
                    if (resp) {
                        await PartidaPresupuestal.LimpiarCamposRegistro();
                        PartidaPresupuestal.PartidasPresupuestalListar();
                        $("#modalRegistroPartidaPresupuestal").modal("hide");
                    }
                }
            }, function (dimiss) {

            });
        });

        $('#btnCancelarPartidaPresupuestal').on('click', async function () {
            await PartidaPresupuestal.LimpiarCamposRegistro();
            $("#modalRegistroPartidaPresupuestal").modal("hide");
        });

    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async PartidasPresupuestalListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('codigo', $("#txtCodigoPartidaPresupuestalBusq").val());
        data.append('nombre', $("#txtDescripcionPartidaPresupuestalBusq").val());

        try {
            Cargando(1);
            oTable_PartidaPresupuestal.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/PartidasPresupuestal/PartidasPresupuestalListar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_PartidaPresupuestal.fnAddData(datos.respuesta.table);
                oTable_PartidaPresupuestal.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async FactPartidasPresupuestalesSeleccionar(idPartida) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idPartida', idPartida);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/PartidasPresupuestal/FactPartidasPresupuestalesSeleccionar?area=Caja",
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

    async CatalogoServiciosListarTodos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        try {
            Cargando(1);
            oTable_ProcedimientosPartidaPresupuestal.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/PartidasPresupuestal/CatalogoServiciosListarTodos?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_ProcedimientosPartidaPresupuestal.fnAddData(datos.respuesta.table);
                oTable_ProcedimientosPartidaPresupuestal.resize();
                resp = true;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async PartidasPresupuestalGuardar() {
        if (PartidaPresupuestal.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idPartida', PartidaPresupuestal.idPartidaPresupuestal);
        formData.append('codigo', $("#txtCodigoPartidaPresupuestal").val());
        formData.append('nombre', $("#txtNombrePartidaPresupuestal").val());
        formData.append('detalle', JSON.stringify(PartidaPresupuestal.DevolverDetalleProductos()));
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/PartidasPresupuestal/PartidasPresupuestalGuardar?area=FactConfig",
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
                    if (datos.errorNumber > 0 && datos.warningNumber == 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                        return resp;
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

    async PartidasPresupuestalEliminar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idPartida', PartidaPresupuestal.idPartidaPresupuestal);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/PartidasPresupuestal/PartidasPresupuestalEliminar?area=FactConfig",
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
                    if (datos.errorNumber > 0 && datos.warningNumber == 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                        return resp;
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



    ////////////////////METODOS//////////////////////////////////////////////////////////////////////
    async CargarDatos(idPartidaPresupuestal) {
        let resp = false;
        let datos = await PartidaPresupuestal.FactPartidasPresupuestalesSeleccionar(idPartidaPresupuestal);
        if (!isEmpty(datos)) {
            let objPartidaPresupuestal = datos.table[0];
            PartidaPresupuestal.idPartidaPresupuestal = objPartidaPresupuestal.idPartidaPresupuestal;
            $("#txtCodigoPartidaPresupuestal").val(objPartidaPresupuestal.codigo);
            $("#txtNombrePartidaPresupuestal").val(objPartidaPresupuestal.descripcion);
            //$('#chkEsFarmaciaTipoTarifa').prop('checked', objPartidaPresupuestal.esFarmacia);
            //oTable_ProcedimientosPartidaPresupuestal.fnAddData(documentos.table);
            await PartidaPresupuestal.CatalogoServiciosListarTodos();

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            resp = true;
        }

        return resp;
    },

    DevolverDetalleProductos() {
        let detalle = [];
        let objItemDetalle = null;
        let lstDetalle = oTable_ProcedimientosPartidaPresupuestal.api(true).data().toArray();

        for (let [i, obj] of lstDetalle.entries()) {

            if (obj.seleccionado) {
                objItemDetalle = {
                    idPartidaPresupuestal: PartidaPresupuestal.idPartidaPresupuestal,
                    idProductoCpt: obj.idProducto
                }

                detalle.push(objItemDetalle);
            }
        }

        return detalle;
    },

    ValidarDatosObligatoriosRegistro() {
        //let detalleServ = PartidaPresupuestal.DevolverDetalleNroDocumentos();

        if (isEmpty($("#txtCodigoPartidaPresupuestal").val())) {
            alerta2("info", "", "Por favor ingrese el Código del Centro de Costo.");
            return false;
        }

        if (isEmpty($("#txtNombrePartidaPresupuestal").val())) {
            alerta2("info", "", "Por favor ingrese el Nombre del Centro de Costo.");
            return false;
        }

        return true;
    },

    async LimpiarCamposRegistro() {
        PartidaPresupuestal.idPartidaPresupuestal = 0;

        $('.writing').val('');
        $('.reading').val('');

        oTable_ProcedimientosPartidaPresupuestal.fnClearTable();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarCamposBusqueda() {
        $(".search").val("");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarPartidaPresupuestal").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarPartidaPresupuestal").show();
    },

}

$(document).ready(function () {
    PartidaPresupuestal.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});