let EstablecimientosNoMinsa = {

    IdEstablecimiento: 0,

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

    DatablesEstablecimientosSalud() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '25%',
                    targets: 0,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "distrito",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "provincia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 3,
                    data: "departamento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapper = $('#tblEstSalud'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_EstSalud = $("#tblEstSalud").dataTable(parms);

    },


    ListaDepartamentos() {

        $.ajax({
            url: "/Utilitario/ListaDepartamentos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbdepEstbuscar').empty();
                $('#cmbdepEstUcibuscar').empty();
                if (datos.session) {
                    $(datos.lsDeparta.table).each(function (i, obj) {
                        $('#cmbdepEstbuscar').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                        $('#cmbdepEstUcibuscar').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                    });

                    $('#cmbdepEstbuscar').val(0);
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    EstablecimientosNoMinsa.ListaProvincias();
                }

                
            },
            error: function (msg) {
                alerta(3, "Error al listar departamentos! " + JSON.stringify(msg));
            }
        });
    },

    ListaProvincias() {
        var midata = new FormData();
        midata.append('idDepartamento', $('#cmbdepEstbuscar').val());
        $.ajax({
            url: "/Utilitario/ListaProvinciasByDepartamentos?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbprovEstBuscar').empty();
                if (datos.session) {
                    $(datos.lsProvincias.table).each(function (i, obj) {
                        $('#cmbprovEstBuscar').append('<option  value="' + obj.idProvincia + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbprovEstBuscar').val("");
                    $('#cmbdistEstBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    //$('#cmbprovEstBuscar').val("");
                    //$('#cmbdistEstBuscar').val("");                
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar provincias!", "2");
                }, 900)
            }
        });

        
    },

    ListaDistrito() {
        var midata = new FormData();
        midata.append('idDProvincia', $('#cmbprovEstBuscar').val());
        $.ajax({
            url: "/Utilitario/ListaDistritosByProvincia?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbdistEstBuscar').empty();
                if (datos.session) {
                    $(datos.lsDistrito.table).each(function (i, obj) {
                        $('#cmbdistEstBuscar').append('<option  value="' + obj.idDistrito + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbdistEstBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar distritos!", "2");
                }, 900)
            }
        });
    },


    ListaDepartamentosRegistro() {

        $.ajax({
            url: "/Utilitario/ListaDepartamentos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboDepartamento').empty();
                if (datos.session) {
                    $(datos.lsDeparta.table).each(function (i, obj) {
                        $('#cboDepartamento').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                    });

                    $('#cboDepartamento').val(0);
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    EstablecimientosNoMinsa.ListaProvincias();
                }

            },
            error: function (msg) {
                alerta(3, "Error al listar departamentos! " + JSON.stringify(msg));
            }
        });
    },

    ListaProvinciasRegistro() {
        var midata = new FormData();
        midata.append('idDepartamento', $('#cboDepartamento').val());
        $.ajax({
            url: "/Utilitario/ListaProvinciasByDepartamentos?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboProvincia').empty();
                if (datos.session) {
                    $(datos.lsProvincias.table).each(function (i, obj) {
                        $('#cboProvincia').append('<option  value="' + obj.idProvincia + '">' + obj.nombre + '</option>');
                    });
                    $('#cboProvincia').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");              
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar provincias!", "2");
                }, 900)
            }
        });


    },

    ListaDistritoRegistro() {
        var midata = new FormData();
        midata.append('idDProvincia', $('#cboProvincia').val());
        $.ajax({
            url: "/Utilitario/ListaDistritosByProvincia?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboDistrito').empty();
                if (datos.session) {
                    $(datos.lsDistrito.table).each(function (i, obj) {
                        $('#cboDistrito').append('<option  value="' + obj.idDistrito + '">' + obj.nombre + '</option>');
                    });
                    $('#cboDistrito').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar distritos!", "2");
                }, 900)
            }
        });
    },

    TiposSubsector: async function () {
        Cargando(1);

        let formData = new FormData();

        const res = await HttpClient.Post('/Establecimientos/TiposSubsector?area=Comun', formData);

        $('#cboSubSectorEstablecimiento').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar las fuentes de financiamiento')
            return
        }
        $(res.data.table).each(function (i, obj) {

            $('#cboSubSectorEstablecimiento').append(`<option value="${obj.idTipoSubsector}">${obj.descripcion}</option>`)
        })
        $('#cboSubSectorEstablecimiento').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")

        Cargando(0)
    },

    BuscarEstablecimiento() {
        var codigo = $('#codigoEstBuscar').val();
        var nombre = $('#nombreEstBuscar').val();
        var departamento = $('#cmbdepEstbuscar').val();
        var provincia = $('#cmbprovEstBuscar').val();
        var distrito = $('#cmbdistEstBuscar').val();

        var filtro = "WHERE 1 = 1 ";

        if (departamento != null)
            filtro = filtro + " AND Departamentos.IdDepartamento = " + departamento
        if (provincia != null)
            filtro = filtro + " AND Provincias.IdProvincia = " + provincia
        if (distrito != null)
            filtro = filtro + " AND EstablecimientosNoMinsa.IdDistrito = " + distrito
        if (codigo != "")
            filtro = filtro + " AND EstablecimientosNoMinsa.Codigo = '" + codigo + "'"
        if (nombre != "")
            filtro = filtro + " AND EstablecimientosNoMinsa.Nombre LIKE '%" + nombre + "%'"

        Cargando(1)
        oTable_EstSalud.fnClearTable();
        //alert($('#cboConsultorio>option:selected').attr("prog"));
        var midata = new FormData();
        midata.append('filtro', filtro);
        //midata.append('prog', $('#cboConsultorio>option:selected').attr("prog"));
        $.ajax({
            method: "POST",
            url: "/Utilitario/EstablecimientosNoMinsaFiltrar?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {

                    if (datos.lsEstablecimientos.table.length > 0) {
                        oTable_EstSalud.fnAddData(datos.lsEstablecimientos.table);
                    }
                    else {
                        Cargando(0)
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    CrearModificarEstablecimientosNoMinsa: async function () {

        let formData = new FormData()

        formData.append('IdEstablecimiento', EstablecimientosNoMinsa.IdEstablecimiento);
        formData.append('Codigo', $('#txtCodigoEstablecimiento').val());
        formData.append('Nombre', $('#txtNombreEstablecimiento').val());
        formData.append('IdDistrito', $('#cboDistrito').val());
        formData.append('IdTipo', $('#cboSubSectorEstablecimiento').val());
        formData.append('Activo', $('#chkActivo').is(':checked') ? 1 : 0);
        formData.append('IdListBarItem', ObtenerItemListBar())

        let res = await HttpClient.Post('/Establecimientos/CrearModificarEstablecimientosNoMinsa?area=Farmacia', formData)

        if (!res.success) {
            alerta2('error', '', res.statusText)
            return
        }

        let data = res.data.table[0]


        if (data.successNumber == 1) {
            alerta2('success', '', data.successMessage)

        } else {
            alerta2('error', '', data.errorMessage)
        }

    },
    SeleccionarEstablecimientosNoMinsaByIdEstablecimiento: async function () {

        let formData = new FormData()

        formData.append('IdEstablecimiento', EstablecimientosNoMinsa.IdEstablecimiento);

        let res = await HttpClient.Post('/Establecimientos/SeleccionarEstablecimientosNoMinsaByIdEstablecimiento?area=Farmacia', formData)

        if (!res.success) {
            alerta2('error', '', res.statusText)
            return
        }

        let data

        if (res.data.table.length > 0) {
            data = res.data.table[0]
            return data
        }
        
        return null

    },

    CargarFormulario: async function () {

        let data = await this.SeleccionarEstablecimientosNoMinsaByIdEstablecimiento()

        if (isEmpty(data)) {
            return
        }

        $('#txtCodigoEstablecimiento').val(data.codigo)
        $('#txtNombreEstablecimiento').val(data.nombre)
        $('#cboDepartamento').val(data.idDepartamento)

        await EstablecimientosNoMinsa.ListaProvinciasRegistro();

        $('#cboProvincia').val(data.idProvincia)

        await EstablecimientosNoMinsa.ListaDistritoRegistro();

        $('#cboDistrito').val(data.idDistrito)
        $('#cboSubSectorEstablecimiento').val(data.idTipo)
        $('#chkActivo').prop('checked', data.activo == 1)

        
       
        $('#modalRegistroEstablecimiento').modal('show');

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    LimpiarCampos: function () {

        EstablecimientosNoMinsa.IdEstablecimiento = 0

        $('#txtCodigoEstablecimiento').val('')
        $('#txtNombreEstablecimiento').val('')
        $('#cboDepartamento').val(0)
        $('#cboProvincia').val(0)
        $('#cboDistrito').val(0)
        $('#cboSubSectorEstablecimiento').val(0)
        $('#chkActivo').prop('checked', false)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    Events: function () {
        ////////////////////////////////// EVENTS BUTTON //////////////////////////////////
        $('#btnBuscarEstablecimiento').on('click', function () {
            EstablecimientosNoMinsa.BuscarEstablecimiento();
        });
        $('#btnLimpiarBusquedaEstablecimiento').on('click', function () {
            $('#codigoEstBuscar').val('')
            $('#nombreEstBuscar').val('')
            $('#cmbdepEstbuscar').val(0)
            $('#cmbprovEstBuscar').val(0)
            $('#cmbdistEstBuscar').val(0)

            $('#cmbprovEstBuscar').empty()
            $('#cmbdistEstBuscar').empty()

            $('.chzn-select').chosen().trigger("chosen:updated")
        });
        $('#btnAgregar').on('click', function () {

            EstablecimientosNoMinsa.LimpiarCampos()

            $('#modalRegistroEstablecimiento').modal('show');
        });
        
        $('#btnCerrarModalEstablecimientos').on('click', function () {

            EstablecimientosNoMinsa.LimpiarCampos()
            $('#modalRegistroEstablecimiento').modal('hide');
        });
        
        $('#btnGuardar').on('click', async function () {

            if ($('#txtCodigoEstablecimiento').val() == '') {
                alerta(2, 'El Codigo del Establecimiento es obligatorio.')
                return
            }

            if ($('#txtNombreEstablecimiento').val() == '') {
                alerta(2, 'El Nombre del Establecimiento es obligatorio.')
                return
            }

            if (isEmpty($('#cboDistrito').val())) {
                alerta(2, 'El Distrito del Establecimiento es obligatorio.')
                return
            }

            if (isEmpty($('#cboSubSectorEstablecimiento').val())) {
                alerta(2, 'El Tipo Subsector del Establecimiento es obligatorio.')
                return
            }

            Cargando(1)
            await EstablecimientosNoMinsa.CrearModificarEstablecimientosNoMinsa()

            $('#codigoEstBuscar').val($('#txtCodigoEstablecimiento').val())
            EstablecimientosNoMinsa.BuscarEstablecimiento()
            $('#modalRegistroEstablecimiento').modal('hide');
            EstablecimientosNoMinsa.LimpiarCampos()
            Cargando(0)
            //
        });
        
        $('#btnModificar').on('click', async function () {

            let objRow = oTable_EstSalud.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Por favor selecciona un registro.')
                return
            }

            Cargando(1)
            //await EstablecimientosNoMinsa.CrearModificarEstablecimientos()

            EstablecimientosNoMinsa.IdEstablecimiento = objRow.idEstablecimientoNoMinsa

            await EstablecimientosNoMinsa.CargarFormulario()
            Cargando(0)
           
        });
        

        ////////////////////////////////// EVENTS BUTTON //////////////////////////////////


        ////////////////////////////////// EVENTS SELECT //////////////////////////////////
        $('#cmbdepEstbuscar').on('change', function () {
            $('#cmbprovEstBuscar').empty();
            $('#cmbdistEstBuscar').empty();
            EstablecimientosNoMinsa.ListaProvincias();
        });
        $('#cmbprovEstBuscar').on('change', function () {
            $('#cmbdistEstBuscar').empty();
            EstablecimientosNoMinsa.ListaDistrito();
        });

        $('#cboDepartamento').on('change', function () {
            $('#cboProvincia').empty();
            $('#cboDistrito').empty();
            EstablecimientosNoMinsa.ListaProvinciasRegistro();
        });
        $('#cboProvincia').on('change', function () {
            $('#cboDistrito').empty();
            EstablecimientosNoMinsa.ListaDistritoRegistro();
        });

        

        ////////////////////////////////// EVENTS SELECT //////////////////////////////////


        ////////////////////////////////// TABLE SELECT //////////////////////////////////
        $('#tblEstSalud').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_EstSalud.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        });

        ////////////////////////////////// TABLE SELECT //////////////////////////////////
    },

    Init: async function () {

        this.Plugins()

        this.ListaDepartamentos();
        this.ListaDepartamentosRegistro();
        this.TiposSubsector();

        this.DatablesEstablecimientosSalud()
        //this.DataTableFarmacia()
        //this.DataTableConsolidado()
        //this.DataTableReembolso()
        //this.DataTableFarmaciaDonaciones()
        //this.DataTableListaPacientes()
        //this.DataTableListaPacientesPreventas()
        //this.DataTableListaPacientesExoFarmacia()
        //this.DataTableListaPacientesExternos()

        //this.FuentesFinanciamientoSegunFiltro('UtilizadoEn=1 or UtilizadoEn=3  or UtilizadoEn=2')

        //EstadoCuenta.idPagosACuenta = (await Utilitario.SeleccionarParametro(245)).valorTexto
        //EstadoCuenta.idDevoluciones = (await Utilitario.SeleccionarParametro(265)).valorTexto

        this.Events()
    }
}

$(document).ready(function () {

    EstablecimientosNoMinsa.Init()
})