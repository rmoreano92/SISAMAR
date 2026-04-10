var CentroCosto = {
    idCentroCosto: 0,

    async Iniciar() {
        CentroCosto.DataTableBusqueda();
        CentroCosto.DataTableProcedimientosCentroCosto();
        await CentroCosto.Plugins();
        CentroCosto.Eventos();
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
        oTable_CentrosCosto = $("#tblCentrosCosto").dataTable(parms);
    },

    DataTableProcedimientosCentroCosto() {
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
                        const checked = (CentroCosto.idCentroCosto == rowData.idCentroCosto);
                        rowData.seleccionado = checked; // estado inicial

                        const input = $('<input>', {
                            class: 'toggle__input chkCptEsCentroCosto writing',
                            type: 'checkbox',
                            id: 'chkCptEsCentroCosto_' + rowData.idProducto,
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
                    //        '' + (CentroCosto.idCentroCosto == rowData.idCentroCosto ? 'checked' : '') +
                    //        '               id = "chkCptEsCentroCosto_' + rowData.idProducto + '" > ' +
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
                        return (CentroCosto.idCentroCosto == row.idCentroCosto) ? 1 : 0;
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ProcedimientosCentroCosto = $("#tblProcedimientosCentrosCosto").dataTable(parms);
    },

    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#modalRegistroCentroCosto').on('shown.bs.modal', function () {
            oTable_ProcedimientosCentroCosto.resize();
        });

        $('#btnBuscar').on('click', async function () {
            await CentroCosto.CentrosCostoListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            CentroCosto.LimpiarCamposBusqueda();
        });

        $('#tblCentrosCosto tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_CentrosCosto.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            await CentroCosto.LimpiarCamposRegistro();
            CentroCosto.DesbloquearRegistro();
            await CentroCosto.FactCatalogoServiciosConPrecioMayorListar();
            //oTable_ProcedimientosCentroCosto.fnAddData(documentos.table);
            $("#modalRegistroCentroCosto").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_CentrosCosto.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await CentroCosto.LimpiarCamposRegistro();
            CentroCosto.DesbloquearRegistro();
            const resp = await CentroCosto.CargarDatos(objrowTb.idCentroCosto);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroCentroCosto").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_CentrosCosto.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await CentroCosto.LimpiarCamposRegistro();
            const resp = await CentroCosto.CargarDatos(objrowTb.idCentroCosto);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                CentroCosto.BloquearRegistro();
                $("#modalRegistroCentroCosto").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_CentrosCosto.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            swal({
                title: 'ELIMINAR',
                html: "¿Esta seguro de eliminar el centro de costo?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Código</th><th>Centro Costo</th></tr><tr><td align="left">' + objrowTb.codigo + '</td><td align="left">' + objrowTb.descripcion + '</td></tr></table>',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    CentroCosto.idCentroCosto = objrowTb.idCentroCosto;
                    const resp = await CentroCosto.CentrosCostoEliminar();
                    if (resp) {
                        await CentroCosto.LimpiarCamposRegistro();
                        CentroCosto.CentrosCostoListar();
                    }
                }

            }, function (dimiss) {

            });

        });

        $('#btnGuardarCentroCosto').on('click', async function () {

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
                    const resp = await CentroCosto.CentrosCostoGuardar();
                    if (resp) {
                        await CentroCosto.LimpiarCamposRegistro();
                        CentroCosto.CentrosCostoListar();
                        $("#modalRegistroCentroCosto").modal("hide");
                    }
                }
            }, function (dimiss) {

            });
        });

        $('#btnCancelarCentroCosto').on('click', async function () {
            await CentroCosto.LimpiarCamposRegistro();
            $("#modalRegistroCentroCosto").modal("hide");
        });

    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async CentrosCostoListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('codigo', $("#txtCodigoCentroCostoBusq").val());
        data.append('nombre', $("#txtDescripcionCentroCostoBusq").val());

        try {
            Cargando(1);
            oTable_CentrosCosto.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CentrosCosto/CentrosCostoListar?area=FactConfig",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_CentrosCosto.fnAddData(datos.respuesta.table);
                oTable_CentrosCosto.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async CentrosCostoSeleccionar(idCentroCosto) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCentroCosto', idCentroCosto);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CentrosCosto/CentrosCostoSeleccionar?area=FactConfig",
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

    async FactCatalogoServiciosConPrecioMayorListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        try {
            Cargando(1);
            oTable_ProcedimientosCentroCosto.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CentrosCosto/FactCatalogoServiciosConPrecioMayorListar?area=FactConfig",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_ProcedimientosCentroCosto.fnAddData(datos.respuesta.table);
                oTable_ProcedimientosCentroCosto.resize();
                resp = true;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async CentrosCostoGuardar() {
        if (CentroCosto.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idCentroCosto', CentroCosto.idCentroCosto);
        formData.append('codigo', $("#txtCodigoCentroCosto").val());
        formData.append('nombre', $("#txtNombreCentroCosto").val());
        formData.append('detalle', JSON.stringify(CentroCosto.DevolverDetalleProductos()));
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CentrosCosto/CentrosCostoGuardar?area=FactConfig",
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

    async CentrosCostoEliminar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idCentroCosto', CentroCosto.idCentroCosto);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CentrosCosto/CentrosCostoEliminar?area=FactConfig",
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
    async CargarDatos(idCentroCosto) {
        let resp = false;
        let datos = await CentroCosto.CentrosCostoSeleccionar(idCentroCosto);
        if (!isEmpty(datos)) {
            let objCentroCosto = datos.table[0];
            CentroCosto.idCentroCosto = objCentroCosto.idCentroCosto;
            $("#txtCodigoCentroCosto").val(objCentroCosto.codigo);
            $("#txtNombreCentroCosto").val(objCentroCosto.descripcion);
            //$('#chkEsFarmaciaTipoTarifa').prop('checked', objCentroCosto.esFarmacia);
            //oTable_ProcedimientosCentroCosto.fnAddData(documentos.table);
            await CentroCosto.FactCatalogoServiciosConPrecioMayorListar();

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            resp = true;
        }

        return resp;
    },

    DevolverDetalleProductos() {
        let detalle = [];
        let objItemDetalle = null;
        let lstDetalle = oTable_ProcedimientosCentroCosto.api(true).data().toArray();

        for (let [i, obj] of lstDetalle.entries()) {

            if (obj.seleccionado) {
                objItemDetalle = {
                    idCentroCosto: CentroCosto.idCentroCosto,
                    idProductoCpt: obj.idProducto
                }

                detalle.push(objItemDetalle);
            }
        }

        return detalle;
    },

    ValidarDatosObligatoriosRegistro() {
        //let detalleServ = CentroCosto.DevolverDetalleNroDocumentos();

        if (isEmpty($("#txtCodigoCentroCosto").val())) {
            alerta2("info", "", "Por favor ingrese el Código del Centro de Costo.");
            return false;
        }

        if (isEmpty($("#txtNombreCentroCosto").val())) {
            alerta2("info", "", "Por favor ingrese el Nombre del Centro de Costo.");
            return false;
        }

        return true;
    },

    async LimpiarCamposRegistro() {
        CentroCosto.idCentroCosto = 0;

        $('.writing').val('');
        $('.reading').val('');

        oTable_ProcedimientosCentroCosto.fnClearTable();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarCamposBusqueda() {
        $(".search").val("");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarCentroCosto").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarCentroCosto").show();
    },

}

$(document).ready(function () {
    CentroCosto.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});