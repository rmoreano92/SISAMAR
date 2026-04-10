var Archivero = {
    idArchivero: 0, 

    async Iniciar() {
        Archivero.DataTableBusqueda();
        Archivero.DataTableServiciosAutorizados();
        await Archivero.Plugins();
        Archivero.Eventos();
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
            //"bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "dni",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoPaterno",
                    width: "25%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "25%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombres",
                    width: "35%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }               
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Archiveros = $("#tblArchiveros").dataTable(parms);
    },

    DataTableServiciosAutorizados() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "servicio",
                    width: "100%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ServiciosAutorizados = $("#tblServiciosAutorizados").dataTable(parms);
    },


    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await Archivero.ArchiverosListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            Archivero.LimpiarCamposBusqueda();
        });

        $('#tblArchiveros tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Archiveros.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            await Archivero.LimpiarCamposRegistro();
            Archivero.DesbloquearRegistro();
            $("#modalRegistroArchivero").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_Archiveros.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await Archivero.LimpiarCamposRegistro();
            Archivero.DesbloquearRegistro();
            const resp = await Archivero.CargarDatos(objrowTb.idEmpleado);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroArchivero").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_Archiveros.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await Archivero.LimpiarCamposRegistro();
            const resp = await Archivero.CargarDatos(objrowTb.idEmpleado);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                Archivero.BloquearRegistro();
                $("#modalRegistroArchivero").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_Archiveros.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            swal({
                title: 'ELIMINAR',
                text: "¿Esta seguro de eliminar el archivero?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>DNI</th><th>Archivero</th></tr><tr><td>' + objrowTb.dni + '</td><td align="left">' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno + ' ' + objrowTb.nombres + '</td></tr></table>',
                type: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function () {
                Archivero.idEmpleado = objrowTb.idEmpleado;
                const resp = await Archivero.ArchiveroEliminar();
                if (resp) {
                    await Archivero.LimpiarCamposRegistro();
                    Archivero.ArchiverosListar();
                }
            }, function (dimiss) {

            });

        });

        $('#btnGuardarArchivero').on('click', async function () {

            swal({
                title: 'Guardar',
                text: "¿Esta seguro de guardar el registro?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                const resp = await Archivero.ArchiveroGuardar();
                if (resp) {
                    await Archivero.LimpiarCamposRegistro();
                    Archivero.ArchiverosListar();
                    $("#modalRegistroArchivero").modal("hide");
                }
            }, function (dimiss) {

            });
        });

        $('#btnCancelarArchivero').on('click', async function () {
            await Archivero.LimpiarCamposRegistro();
            $("#modalRegistroArchivero").modal("hide");
        });

        
        $('#cboEmpleadoArchivero_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await Archivero.EmpleadosListar(filtro, 1);
        });

        $('#tblServiciosAutorizados tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ServiciosAutorizados.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarServicioAutorizado').on('click', async function () {
            let idServicio = $("#cboServicioArchivero").val();

            if (isEmpty(idServicio) == false) {
                Archivero.AgregarServicio(idServicio);
            } else {
                alerta2("info", "", "Por favor seleccione un servicio para agregar.");
            }
        });

        $('#btnQuitarServicioAutorizado').on('click', async function () {
            let objrowTb = oTable_ServiciosAutorizados.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                Archivero.QuitarServicio(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un servicio para eliminar.");
            }
        });

    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async ArchiverosListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
                                
        data.append('dni', $("#txtDniArchiveroBusq").val());
        data.append('apPaterno', $("#txtApPaternoArchiveroBusq").val());
        data.append('apMaterno', $("#txtApMaternoArchiveroBusq").val());
        data.append('nombres', $("#txtNombreArchiveroBusq").val());

        try {
            Cargando(1);
            oTable_Archiveros.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Archiveros/ArchiverosListar?area=ArchivoClinico",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_Archiveros.fnAddData(datos.respuesta.table);
                oTable_Archiveros.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async ArchiveroSeleccionar(idEmpleado) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idEmpleado', idEmpleado);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Archiveros/ArchiveroSeleccionar?area=ArchivoClinico",
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

    async EmpleadosListar(filtro, activo) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $('#cboEmpleadoArchivero').empty();
        $('#cboEmpleadoArchivero').append('<option  value="0">Busque y seleccione un empleado</option>');
        $('#cboEmpleadoArchivero').val("0");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        if (filtro.length >= 3) {
            try {

                midata.append('filtro', filtro);
                midata.append('activo', activo);

                //Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Empleados/EmpleadosFiltrar?area=Seguridad",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                //Cargando(0)

                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboEmpleadoArchivero').append('<option value="' + obj.idEmpleado + '">' + obj.empleado + '</option>');
                });

                $('#cboEmpleadoArchivero').val("0");
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            } catch (error) {
                resp = false;
                //console.error(error)
                alerta(3, error);
            }
        }

        $('#cboEmpleadoArchivero_chosen .chosen-drop .chosen-search input').val(filtro);
    },

    async ArchiveroGuardar() {
        if (Archivero.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idEmpleado', $("#cboEmpleadoArchivero").val());
        formData.append('detalle', JSON.stringify(Archivero.DevolverDetalleServiciosAutorizados()));
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Archiveros/ArchiveroGuardar?area=ArchivoClinico",
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

    async ArchiveroEliminar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idEmpleado', Archivero.idEmpleado);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Archiveros/ArchiveroEliminar?area=ArchivoClinico",
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


    ////////////////////METODOS//////////////////////////////////////////////////////////////////////
    async CargarDatos(idEmpleado) {
        let resp = false;
        let datos = await Archivero.ArchiveroSeleccionar(idEmpleado);
        if (!isEmpty(datos)) {
            let archivero = datos.table[0];
            let servicios = datos.table1;
            Archivero.idEmpleado = archivero.idEmpleado;
            await Archivero.EmpleadosListar(archivero.dni, 0);
            $("#cboEmpleadoArchivero").val(archivero.idEmpleado);
            oTable_ServiciosAutorizados.fnAddData(servicios);

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            resp = true;
        }

        return resp;
    },

    AgregarServicio() {       
        let idServicio = $("#cboServicioArchivero").val();
        let servicio = $("#cboServicioArchivero option:selected").text();

        if (idServicio > 0) {
            if (Archivero.ItemYaExiste(idServicio) == false) {
                servicio = servicio.replace(/</g, '(').replace(/>/g, ')').replace(/(\r\n|\n|\r)/g, '');

                let objItemDetalle = {
                    index: 0,               //para controlar cada fila como unica
                    idEmpleado: 0,
                    idServicio: idServicio,
                    servicio: servicio
                }

                oTable_ServiciosAutorizados.fnAddData(objItemDetalle);
                oTable_ServiciosAutorizados.resize();

                $("#cboServicioArchivero").val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            }
        }        
    },

    QuitarServicio() {
        //let objDetalleServ = oTable_ServiciosAutorizados.api(true).row('.selected').data();
        oTable_ServiciosAutorizados.api(true).row('.selected').remove().draw(false);
        oTable_ServiciosAutorizados.resize();
    },

    ItemYaExiste(idServicio) {
        resp = false;
        let lstDetalleServicios = Archivero.DevolverDetalleServiciosAutorizados();
        lstDetalleServicios.forEach(function (detalle) {
            if (detalle.idServicio == idServicio) {
                resp = true;
                alerta2("info", "", "EL servicio ya se encuentra registrado.");
            }
        });

        return resp;
    },

    DevolverDetalleServiciosAutorizados() {
        let detalleServicios = [];
        let objItemDetalle = null;
        let lstDetalleServicios = oTable_ServiciosAutorizados.api(true).data().toArray();

        for (let [i, obj] of lstDetalleServicios.entries()) {

            objItemDetalle = {
                index: obj.index,               //para controlar cada fila como unica
                idEmpleado: 0,
                idServicio: obj.idServicio
            }

            detalleServicios.push(objItemDetalle);

        }

        return detalleServicios;
    },

    ValidarDatosObligatoriosRegistro() {
        let detalleServ = Archivero.DevolverDetalleServiciosAutorizados();
        
        if (isEmpty($("#cboEmpleadoArchivero").val())) {
            alerta2("info", "", "Por favor seleccione el archivero.");
            return false;
        }

        if (detalleServ.length == 0) {
            alerta2("info", "", "Por favor agregue almenos un servicio.");
            return false;
        }

        return true;
    },
        
    async LimpiarCamposRegistro() {
        Archivero.idEmpleado = 0;

        $('.writing').val('');
        $('.reading').val('');

        await Archivero.EmpleadosListar('', 0);
        oTable_ServiciosAutorizados.fnClearTable();
                        
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
    Archivero.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});