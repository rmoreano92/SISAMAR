var EspecialidadHosp = {
    IdEspecialidad: 0,
    IdEspecialidadCE: 0,
    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: false })
        $(".chzn-select-deselect,#select2_sample").chosen()
        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    /////////////////////////////////////// DATATABLES ///////////////////////////////////////
    InitDatablesEspecialidades: () => {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            "scrollY": "300px",
            columns: [
                {
                    width: '20%',
                    targets: 0,
                    data: "descripcionLarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "tiempoPromedioAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '35%',
                    targets: 2,
                    data: "productoConsulta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '35%',
                    targets: 3,
                    data: "productoInterconsulta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper = $('#tblEspecialidades'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Especialidades = $("#tblEspecialidades").dataTable(parms);

    },
    InitDatablesCatalogoServicios: () => {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            "scrollY": "300px",
            columns: [
                {
                    width: '15%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '85%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogoServicios'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_CatalogoServicios = $("#tblCatalogoServicios").dataTable(parms);

    },

    ///////////////////////////METODOS QUE CONSULTA BD////////////////////////////////////////////////////////////////////////

    ListarDepartamentosHospital: async function () {

        let formData = new FormData()


        let response = await HttpClient.Get(`/Utilitario/ListarDepartamentosHospital`)

        if (isEmpty(response)) {
            return false
        }

        let data = response.dataSet.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        $('#cboDepartamentoBusqueda').empty();
        $('#cboDepartamentoEspecialidad').empty();
        $(data).each(function (i, obj) {
            $('#cboDepartamentoBusqueda').append('<option value="' + obj.idDepartamento + '">' + obj.descripcionLarga + '</option>');
            $('#cboDepartamentoEspecialidad').append('<option value="' + obj.idDepartamento + '">' + obj.descripcionLarga + '</option>');
        });
        $('#cboDepartamentoBusqueda').val('');
        $('#cboDepartamentoEspecialidad').val('');
        $('.chzn-select').chosen().trigger("chosen:updated");

        return data
    },

    EspecialidadesFiltrar: async function () {

        let formData = new FormData()

        let lcFiltro = ''

        if ($('#txtNombreBusqueda').val() != '') {
            lcFiltro = lcFiltro + ` where Especialidades.Nombre like '${$('#txtNombreBusqueda').val()}%' `
        }

        if (!isEmpty($('#cboDepartamentoBusqueda').val())) {
            if (lcFiltro == '') {
                lcFiltro = lcFiltro + ` where Especialidades.IdDepartamento = ${$('#cboDepartamentoBusqueda').val()} `
            } else {
                lcFiltro = lcFiltro + ` AND Especialidades.IdDepartamento = ${$('#cboDepartamentoBusqueda').val()} `
            }
            
        }


        lcFiltro = lcFiltro + ' order by Especialidades.IdDepartamento, Especialidades.Nombre '

        formData.append('lcFiltro', lcFiltro)

        let response = await HttpClient.Post(`/Especialidades/EspecialidadesFiltrar`, formData)

        oTable_Especialidades.fnClearTable()

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        oTable_Especialidades.fnAddData(data)

        return data
    },

    FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo: async function () {

        let formData = new FormData()

        formData.append('codigo', $('#txtCodigoProcedimientoBusqueda').val())
        formData.append('nombre', $('#txtNombreProcedimientoBusqueda').val())
        formData.append('EsCpt', 2)

        let response = await HttpClient.Post(`/Utilitario/FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo`, formData)

        oTable_CatalogoServicios.fnClearTable()

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        oTable_CatalogoServicios.fnAddData(data)

        return data
    },
    ListarEspecialidadPorDepartamento: async function (idDepartamento, idHtml) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idDepartamento', idDepartamento);

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Especialidades/EspecialidadesSeleccionarPorDepartamento?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lstData.table.length > 0) {
                    $(idHtml).empty();
                    $(datos.lstData.table).each(function (i, obj) {
                        $(idHtml).append('<option value="' + obj.idDepartamento + '">' + obj.descripcionLarga + '</option>');
                    });
                    $(idHtml).val('');
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

    CrearModificarEspecialidad: async function (IdEspecialidad, Nombre, IdDepartamento, TiempoPromedioAtencion, IdEspecialidadCE, IdProductoConsulta, IdProductoInterconsulta) {

        let formData = new FormData()

        formData.append('IdEspecialidad', IdEspecialidad)
        formData.append('Nombre', Nombre)
        formData.append('IdDepartamento', IdDepartamento)
        formData.append('TiempoPromedioAtencion', TiempoPromedioAtencion)
        formData.append('IdEspecialidadCE', IdEspecialidadCE)
        formData.append('IdProductoConsulta', IdProductoConsulta)
        formData.append('IdProductoInterconsulta', IdProductoInterconsulta)

        let response = await HttpClient.Post(`/Especialidades/CrearModificarEspecialidad`, formData)


        if (isEmpty(response)) {
            return false
        }

        return response
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////
    AbrirModalCatalogoServicios: function (tipo) {

        $('#hdTipoCatalogoServicios').val(tipo)
        $('#modalCatalogoServicios').modal('show')

    },
    /////

    /////////////////////////////////////// EVENTS ///////////////////////////////////////

    Events: function () {
        $('#btnBuscarEspecialidades').on('click', async function () {
            Cargando(1)
            await EspecialidadHosp.EspecialidadesFiltrar()
            Cargando(0)
        })
        $('#btnLimpiarBuscquedaEspecialidades').on('click', async function () {
            $('#txtNombreBusqueda').val('')
            $('#cboDepartamentoBusqueda').val('')

            $('.chzn-select').chosen().trigger("chosen:updated");
        })
        $('#btnAgregar').on('click', async function () {
            $('#modalEspecialidades').modal('show')
        })
        $('#btnModificar').on('click', async function () {

            let row = oTable_Especialidades.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro')
                return
            }

            $('#cboDepartamentoEspecialidad').prop('disabled', false)
            $('#txtNombreEspecialidad').prop('disabled', false)
            $('#txtTiempoPromedioAtencionEspecialidad').prop('disabled', false)
            $('#btnProductoConsulta').prop('disabled', false)
            $('#btnProductoInterConsulta').prop('disabled', false)
            $('#btnGuardarEspecialidad').show()

            EspecialidadHosp.CargarFormularioRegistro(row)

            $('#modalEspecialidades').modal('show')
        })
        $('#btnConsultar').on('click', async function () {

            let row = oTable_Especialidades.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro')
                return
            }

            $('#cboDepartamentoEspecialidad').prop('disabled', true)
            $('#txtNombreEspecialidad').prop('disabled', true)
            $('#txtTiempoPromedioAtencionEspecialidad').prop('disabled', true)
            $('#btnProductoConsulta').prop('disabled', true)
            $('#btnProductoInterConsulta').prop('disabled', true)
            $('#btnGuardarEspecialidad').hide()

            EspecialidadHosp.CargarFormularioRegistro(row)


            $('#modalEspecialidades').modal('show')
        })
        $('#btnCerrarModalEspecialidades').on('click', async function () {
            EspecialidadHosp.LimpiarFormularioRegistro()
            $('#modalEspecialidades').modal('hide')
        })
        $('#btnGuardarEspecialidad').on('click', async function () {

            let msgError = ''

            if ($('#txtNombreEspecialidad').val() == '') {
                msgError = msgError + 'Ingrese el nombre de la especialidad<br>'
            }
            if (isEmpty($('#cboDepartamentoEspecialidad').val())) {
                msgError = msgError + 'Ingrese el Departamento de la especialidad<br>'
            }
            if ($('#txtTiempoPromedioAtencionEspecialidad').val() == '') {
                msgError = msgError + 'Ingrese el Tiempo Promedio de Atención<br>'
            }

            if (msgError != '') {
                alerta2('warning', 'Atención', msgError)

                return
            }

            let tiempo = parseFloat($('#txtTiempoPromedioAtencionEspecialidad').val());

            if (!isNaN(tiempo) && tiempo > 0) {
                let redondeoEntero = Math.round(60 / tiempo);
                let redondeoDosDecimales = Math.round((60 / tiempo) * 100) / 100;

                if (redondeoEntero !== redondeoDosDecimales) {
                    alerta2('warning', 'Atención', 'El TIEMPO PROMEDIO DE ATENCIÓN deberá ser múltiplo de 60')
                    $('#txtTiempoPromedioAtencionEspecialidad').val(""); // Limpiar el campo si es inválido (opcional)
                    return
                }
            }

            Cargando(1)

            let resp = await EspecialidadHosp.CrearModificarEspecialidad(
                IdEspecialidad = EspecialidadHosp.IdEspecialidad, Nombre = $('#txtNombreEspecialidad').val(), IdDepartamento = $('#cboDepartamentoEspecialidad').val(),
                TiempoPromedioAtencion = $('#txtTiempoPromedioAtencionEspecialidad').val(), IdEspecialidadCE = EspecialidadHosp.IdEspecialidadCE,
                IdProductoConsulta = $('#hdIdProductoConsultaEspecialidad').val(), IdProductoInterconsulta = $('#hdIdProductoInterconsultaEspecialidad').val())

            Cargando(0)
            if (!isEmpty(resp) && resp.data != 0) {
                alerta2('success', 'Especialidades', 'Se registro la especialidad')

                EspecialidadHosp.LimpiarFormularioRegistro()

                $('#modalEspecialidades').modal('hide')
                $('#btnBuscarEspecialidades').click()
            }
        })

        
        $('#btnBuscarCatalogoServicios').on('click', async function () {

            let msgError = ''

            if ($('#txtCodigoProcedimientoBusqueda').val() == '' && $('#txtNombreProcedimientoBusqueda').val() == '') {
                msgError = msgError + 'Ingresa el codigo o parte del nombre del procedimiento.'
            }

            if (msgError != '') {
                alerta2('warning', 'Atención', msgError)

                return
            }
            Cargando(1)
            await EspecialidadHosp.FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo()
            Cargando(0)
        })
        $('#btnLimpiarFiltroCatalogoServicios').on('click', async function () {
            $('#txtCodigoProcedimientoBusqueda').val('')
            $('#txtNombreProcedimientoBusqueda').val('')
        })
        $('#btnCerrarModalCatalogoServicios').on('click', async function () {
            $('#modalCatalogoServicios').modal('hide')
        })

        $('#btnSeleccionarProcedimiento').on('click', async function () {

            let row = oTable_CatalogoServicios.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro')
                return
            }

            if ($('#hdTipoCatalogoServicios').val() == 1) {
                $('#txtCodigoProductoConsultaEspecialidad').val(row.codigo)
                $('#hdIdProductoConsultaEspecialidad').val(row.idProducto)
                $('#txtProductoConsultaEspecialidad').val(row.nombre)
            } else if ($('#hdTipoCatalogoServicios').val() == 2) {
                $('#txtCodigoProductoInterconsultaEspecialidad').val(row.codigo)
                $('#hdIdProductoInterconsultaEspecialidad').val(row.idProducto)
                $('#txtProductoInterconsultaEspecialidad').val(row.nombre)
            }

            $('#modalCatalogoServicios').modal('hide')
            
        })

        ///////////////////////////////// TABLES /////////////////////////////////

        $('#tblCatalogoServicios tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_CatalogoServicios.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })

        $('#tblEspecialidades tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_Especialidades.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })

    },

    CargarFormularioRegistro: function (data) {
        $('#txtNombreEspecialidad').val(data.nombre);
        $('#cboDepartamentoEspecialidad').val(data.idDepartamento);
        $('#txtTiempoPromedioAtencionEspecialidad').val(data.tiempoPromedioAtencion);
        $('#hdIdProductoConsultaEspecialidad').val(data.idproductoConsulta);
        $('#hdIdProductoInterconsultaEspecialidad').val(data.idproductoInterConsulta);

        $('#txtCodigoProductoConsultaEspecialidad').val(data.codigoProductoConsulta);
        $('#txtProductoConsultaEspecialidad').val(data.productoConsulta);
        $('#txtCodigoProductoInterconsultaEspecialidad').val(data.codigoProductoInterconsulta);
        $('#txtProductoInterconsultaEspecialidad').val(data.productoInterconsulta);

        // Si EspecialidadHosp es un objeto en JavaScript, también lo reseteamos
        EspecialidadHosp.IdEspecialidad = data.idEspecialidad;
        EspecialidadHosp.IdEspecialidadCE = data.idEspecialidadCE;

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    LimpiarFormularioRegistro: function () {
        $('#txtNombreEspecialidad').val('');
        $('#cboDepartamentoEspecialidad').val('');
        $('#txtTiempoPromedioAtencionEspecialidad').val('');
        $('#hdIdProductoConsultaEspecialidad').val('');
        $('#hdIdProductoInterconsultaEspecialidad').val('');

        $('#txtCodigoProductoConsultaEspecialidad').val('');
        $('#txtProductoConsultaEspecialidad').val('');
        $('#txtCodigoProductoInterconsultaEspecialidad').val('');
        $('#txtProductoInterconsultaEspecialidad').val('');

        // Si EspecialidadHosp es un objeto en JavaScript, también lo reseteamos
        EspecialidadHosp.IdEspecialidad = 0;
        EspecialidadHosp.IdEspecialidadCE = 0;

        $('.chzn-select').chosen().trigger("chosen:updated");
    },


    Init: function () {
        EspecialidadHosp.Plugins()
        EspecialidadHosp.InitDatablesEspecialidades()
        EspecialidadHosp.InitDatablesCatalogoServicios()

        EspecialidadHosp.Events()

        

        EspecialidadHosp.ListarDepartamentosHospital()
    }
}

