var TipoTarifa = {
    idTipoTarifa: 0,

    async Iniciar() {
        TipoTarifa.DataTableBusqueda();
        TipoTarifa.DataTableProcedimientosTiposTarifa();
        await TipoTarifa.Plugins();
        TipoTarifa.Eventos();
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
                    data: "tipoTarifa",
                    width: "70%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.esFarmacia) {
                            $(td).html('<span class="chip teal d-block text-sm-center" style="width: 30px;padding: 0px 5px;">SI</span >');
                        } else {
                            $(td).html('<span class="chip secondary d-block text-sm-center" style="width: 30px;padding: 0px 5px;">NO</span >');
                        }
                    }
                },               
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TiposTarifa = $("#tblTiposTarifa").dataTable(parms);
    },

    DataTableProcedimientosTiposTarifa() {
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
                        const checked = (TipoTarifa.idTipoTarifa == rowData.idTipoTarifa);
                        rowData.seleccionado = checked; // estado inicial

                        const input = $('<input>', {
                            class: 'toggle__input chkCptEsTipoTarifa writing',
                            type: 'checkbox',
                            id: 'chkCptEsTipoTarifa_' + rowData.idProducto,
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
                    //               '    <label class="toggle">' +
                    //               '        <input class="toggle__input chkCptEsTipoTarifa writing"' +
                    //               '               type = "checkbox"' + 
                    //               '' + (TipoTarifa.idTipoTarifa == rowData.idTipoTarifa ? 'checked' : '') +
                    //               '               id = "chkCptEsTipoTarifa_' + rowData.idProducto + '" > ' +
                    //               '        <span class="toggle__label">' +
                    //               '            <span class="toggle__text"></span>' +
                    //               '        </span>' +
                    //               '    </label>' +
                    //               '</div>')
                    //},
                }, 
                {
                    data: null,
                    visible: false,
                    render: function (data, type, row) {
                        return (TipoTarifa.idTipoTarifa == row.idTipoTarifa) ? 1 : 0;
                    }
                },                
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ProcedimientosTipoTarifa = $("#tblProcedimientosTiposTarifa").dataTable(parms);
    },
   
    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#modalRegistroTipoTarifa').on('shown.bs.modal', function () {
            oTable_ProcedimientosTipoTarifa.resize();
        });

        $('#btnBuscar').on('click', async function () {
            await TipoTarifa.TiposTarifaListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            TipoTarifa.LimpiarCamposBusqueda();
        });

        $('#tblTiposTarifa tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_TiposTarifa.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
                
        $('#btnAgregar').on('click', async function () {
            await TipoTarifa.LimpiarCamposRegistro();
            TipoTarifa.DesbloquearRegistro();
            await TipoTarifa.TiposTarifaCptListarTodos();
            //oTable_ProcedimientosTipoTarifa.fnAddData(documentos.table);
            $("#modalRegistroTipoTarifa").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_TiposTarifa.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await TipoTarifa.LimpiarCamposRegistro();
            TipoTarifa.DesbloquearRegistro();
            const resp = await TipoTarifa.CargarDatos(objrowTb.idTipoTarifa);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroTipoTarifa").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_TiposTarifa.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await TipoTarifa.LimpiarCamposRegistro();
            const resp = await TipoTarifa.CargarDatos(objrowTb.idTipoTarifa);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                TipoTarifa.BloquearRegistro();
                $("#modalRegistroTipoTarifa").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_TiposTarifa.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            swal({
                title: 'ELIMINAR',
                html: "¿Esta seguro de eliminar el tipo de tarifa?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Código</th><th>Tipo Tarifa</th></tr><tr><td align="left">' + objrowTb.codigo + '</td><td align="left">' + objrowTb.tipoTarifa + '</td></tr></table>',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    TipoTarifa.idTipoTarifa = objrowTb.idTipoTarifa;
                    const resp = await TipoTarifa.TiposTarifaEliminar();
                    if (resp) {
                        await TipoTarifa.LimpiarCamposRegistro();
                        TipoTarifa.TiposTarifaListar();
                    }
                }

            }, function (dimiss) {

            });

        });

        $('#btnGuardarTipoTarifa').on('click', async function () {

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
                    const resp = await TipoTarifa.TiposTarifaGuardar();
                    if (resp) {
                        await TipoTarifa.LimpiarCamposRegistro();
                        TipoTarifa.TiposTarifaListar();
                        $("#modalRegistroTipoTarifa").modal("hide");
                    }
                }
            }, function (dimiss) {

            });
        });

        $('#btnCancelarTipoTarifa').on('click', async function () {
            await TipoTarifa.LimpiarCamposRegistro();
            $("#modalRegistroTipoTarifa").modal("hide");
        });

        $('#chkTodosNinguno').on('click', async function () {
            if ($('#chkTodosNinguno').is(":checked")) {
                $(".chkCptEsTipoTarifa").prop("checked", true);
            } else {
                $(".chkCptEsTipoTarifa").removeAttr("checked");
            }
            
        });
                
    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async TiposTarifaListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('codigo', $("#txtCodigoTipoTarifaBusq").val());
        data.append('nombre', $("#txtDescripcionTipoTarifaBusq").val());

        try {
            Cargando(1);
            oTable_TiposTarifa.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TiposTarifa/TiposTarifaListar?area=FactConfig",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_TiposTarifa.fnAddData(datos.respuesta.table);
                oTable_TiposTarifa.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },
        
    async TiposTarifaSeleccionar(idTipoTarifa) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTipoTarifa', idTipoTarifa);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TiposTarifa/TiposTarifaSeleccionar?area=FactConfig",
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

    async TiposTarifaCptListarTodos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        try {
            Cargando(1);
            oTable_ProcedimientosTipoTarifa.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TiposTarifa/TiposTarifaCptListarTodos?area=FactConfig",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_ProcedimientosTipoTarifa.fnAddData(datos.respuesta.table);
                oTable_ProcedimientosTipoTarifa.resize();
                resp = true;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },
        
    async TiposTarifaGuardar() {
        if (TipoTarifa.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idTipoTarifa', TipoTarifa.idTipoTarifa);
        formData.append('codigo', $("#txtCodigoTipoTarifa").val());
        formData.append('nombre', $("#txtNombreTipoTarifa").val());       
        formData.append('esFarmacia', $('#chkEsFarmaciaTipoTarifa').is(":checked") ? 1 : 0);
        formData.append('detalle', JSON.stringify(TipoTarifa.DevolverDetalleProductos()));
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TiposTarifa/TiposTarifaGuardar?area=FactConfig",
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

    async TiposTarifaEliminar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idTipoTarifa', TipoTarifa.idTipoTarifa);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TiposTarifa/TiposTarifaEliminar?area=FactConfig",
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
    async CargarDatos(idTipoTarifa) {
        let resp = false;
        let datos = await TipoTarifa.TiposTarifaSeleccionar(idTipoTarifa);        
        if (!isEmpty(datos)) {
            let objTipoTarifa = datos.table[0];
            TipoTarifa.idTipoTarifa = objTipoTarifa.idTipoTarifa;
            $("#txtCodigoTipoTarifa").val(objTipoTarifa.codigo);
            $("#txtNombreTipoTarifa").val(objTipoTarifa.tipoTarifa);
            $('#chkEsFarmaciaTipoTarifa').prop('checked', objTipoTarifa.esFarmacia);        
            //oTable_ProcedimientosTipoTarifa.fnAddData(documentos.table);
            await TipoTarifa.TiposTarifaCptListarTodos();

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            resp = true;
        }

        return resp;
    },

    DevolverDetalleProductos() {
        let detalle = [];
        let objItemDetalle = null;
        let lstDetalle = oTable_ProcedimientosTipoTarifa.api().rows().data().toArray();

        for (let [i, obj] of lstDetalle.entries()) {

            if (obj.seleccionado) {
                objItemDetalle = {
                    idTipoTarifa: TipoTarifa.idTipoTarifa,
                    idProductoCpt: obj.idProducto
                }

                detalle.push(objItemDetalle);
            }            
        }

        return detalle;
    },

    ValidarDatosObligatoriosRegistro() {
        //let detalleServ = TipoTarifa.DevolverDetalleNroDocumentos();

        if (isEmpty($("#txtCodigoTipoTarifa").val())) {
            alerta2("info", "", "Por favor ingrese el Código del Tipo de Tarifa.");
            return false;
        }

        if (isEmpty($("#txtNombreTipoTarifa").val())) {
            alerta2("info", "", "Por favor ingrese el Nombre del Tipo de Tarifa.");
            return false;
        }

        return true;
    },

    async LimpiarCamposRegistro() {
        TipoTarifa.idTipoTarifa = 0;

        $('.writing').val('');
        $('.reading').val('');
        $('.writing').removeAttr('checked')

        oTable_ProcedimientosTipoTarifa.fnClearTable();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarCamposBusqueda() {
        $(".search").val("");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarTipoTarifa").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarTipoTarifa").show();
    },

}

$(document).ready(function () {
    TipoTarifa.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});