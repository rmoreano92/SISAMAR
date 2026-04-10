let Servicios = {
    IdServicio: 0,
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

    InitDatablesServicios: () => {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            "scrollY": "300px",
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
                    targets: 1,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 3,
                    data: "departamento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "soloTipoSexo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "maximaEdad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "codigoServicioSEM",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "ubicacionSEM",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "codigoServicioHIS",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }

            ]

        }

        var tableWrapper = $('#tblServicios'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Servicios = $("#tblServicios").dataTable(parms);

    },
    ServiciosSeleccionarPorTipo: async function () {

        let formData = new FormData()

        formData.append('Nombre', $('#txtNombreBusqueda').val())
        formData.append('IdTipoServicio', $('#cboTipoServicioBusqueda').val())

        let response = await HttpClient.Post(`/Servicios/ServiciosSeleccionarPorTipo`, formData)

        oTable_Servicios.fnClearTable()

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        oTable_Servicios.fnAddData(data)

        return data
    },
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

        $('#cboDepartamento').empty();
        $(data).each(function (i, obj) {
            $('#cboDepartamento').append('<option value="' + obj.idDepartamento + '">' + obj.descripcionLarga + '</option>');
        });
        $('#cboDepartamento').val('');
        $('.chzn-select').chosen().trigger("chosen:updated");

        return data
    },
    ListarTipoServicio: async function () {

        const res = await HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun');

        $('#cboTipoServicioBusqueda').empty();
        $('#cboTipoServicio').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            if (obj.valor != 0) {
                $('#cboTipoServicioBusqueda').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
                $('#cboTipoServicio').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
            }
        })

        $('#cboTipoServicioBusqueda').val('')
        $('#cboTipoServicio').val('')
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    SuSaludUpsSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/SuSaludUpsSeleccionarTodos?area=Comun');

        $('#cboUpsSusalud').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboUpsSusalud').append(`<option value="${obj.codigo}">${obj.codigo} - ${obj.descripcion}</option>`)
        })

        $('#cboUpsSusalud').val('')
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    SisFuaUPServiciosSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/SisFuaUPServiciosSeleccionarTodos?area=Comun');

        $('#cboUpsFua').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboUpsFua').append(`<option value="${obj.ups}">${obj.ups} - ${obj.descripcion}</option>`)
        })

        $('#cboUpsFua').val('')
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    UPServiciosSeleccionarTodosV2: async function () {

        const res = await HttpClient.Get('/Utilitario/UPServiciosSeleccionarTodosV2?area=Comun');

        $('#cboUpsHis').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboUpsHis').append(`<option value="${obj.upShis}">${obj.upShis} - ${obj.descripcion}</option>`)
        })

        $('#cboUpsHis').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    RenaesUPServiciosSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/RenaesUPServiciosSeleccionarTodos?area=Comun');

        $('#cboUpsRenaes').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboUpsRenaes').append(`<option value="${obj.ups}">${obj.ups} - ${obj.descripcion}</option>`)
        })

        $('#cboUpsRenaes').val('')
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposEdadSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/TiposEdadSeleccionarTodos?area=Comun');

        $('#cboRangoEdad').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboRangoEdad').append(`<option value="${obj.idTipoEdad}">${obj.descripcionLarga}</option>`)
        })

        $('#cboRangoEdad').val('')
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    ListarTiposModuloAtencion: async function () {

        const res = await HttpClient.Get('/Utilitario/ListarTiposModuloAtencion?area=Comun');

        $('#cboTipoModuloServicio').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoModuloServicio').append(`<option value="${obj.descripcion}">${obj.descripcion}</option>`)
        })

        $('#cboTipoModuloServicio').val('')
        $('.chzn-select').chosen().trigger("chosen:updated")
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
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lstData.table.length > 0) {
                    $(idHtml).empty();
                    $(datos.lstData.table).each(function (i, obj) {
                        $(idHtml).append('<option value="' + obj.idEspecialidad + '">' + obj.descripcionLarga + '</option>');
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
    ServiciosAgregar: async function () {

        let formData = new FormData()

        formData.append('IdServicio', Servicios.IdServicio);
        formData.append('IdProducto', $('#hdIdProductoEstanciaPorDia').val());
        //formData.append('SVG', '');
        formData.append('Codigo', $('#txtCodigoServicio').val());
        formData.append('Nombre', $('#txtNombreServicio').val());
        formData.append('IdEspecialidad', $('#cboEspecialidades').val());
        formData.append('IdTipoServicio', $('#cboTipoServicio').val());
        formData.append('SoloTipoSexo', $('#cboTipoSexoServicio').val());
        formData.append('MaximaEdad', devuelveEdadEnDiasXtipo(parseInt($('#txtRangoEdadHasta').val())));
        formData.append('CodigoServicioSEM', $('#txtCodigoServicioSem').val());
        formData.append('UbicacionSEM', $('#txtUbicacionServicioSem').val());
        formData.append('CodigoServicioHIS', $('#cboUpsHis').val());
        formData.append('CostoCeroCE', $('#chkConsultorioNoCobra').val());
        formData.append('MinimaEdad', devuelveEdadEnDiasXtipo(parseInt($('#txtRangoEdadDesde').val())));
        formData.append('Triaje', $('#chkConsultorioNecesitaTriaje').is(':checked'));
        formData.append('EsObservacionEmergencia', $('#chkElServicioEsObservacionEmergencia').is(':checked'));
        //formData.append('UsaModuloNinoSano', 0);
        //formData.append('UsaModuloMaterno', 0);
        //formData.append('UsaGalenHos', 0);
        formData.append('TipoEdad', $('#cboRangoEdad').val());
        formData.append('UsaFUA', $('#chkSeUsaFormatoFua').is(':checked'));
        formData.append('CodigoServicioSuSalud', $('#cboUpsSusalud').val());
        formData.append('CodigoServicioFUA', $('#cboUpsFua').val());
        //formData.append('FuaTipoAnexo2015', 0);
        formData.append('CodigoServicioRenaes', $('#cboUpsRenaes').val());
        formData.append('ActivaProcedimiento', $('input[name="rdbActivaProcedimiento"]:checked').val());

        // Nuevos campos agregados (de la tabla completa)
        formData.append('EsTeleconsulta', $('#chkEsTeleconsulta').is(':checked'));
        formData.append('EsPuntoCarga', $('#chkEsPuntoCarga').is(':checked'));
        formData.append('UsaGalenHos', $('#chkEmiteFormatoFua').is(':checked'));
        formData.append('TipoModulo', $('#cboTipoModuloServicio').val());

        let response = await HttpClient.Post(`/Servicios/ServiciosAgregar`, formData)

        //oTable_CatalogoServicios.fnClearTable()

        if (isEmpty(response)) {
            return false
        }

        let data = response.data

        if (data == 0) {
            //alerta(2, 'No existen datos para mostrar.')
            return false
        }

        //oTable_CatalogoServicios.fnAddData(data)

        return data
    },

    CargarFormularioRegistro: async function (data) {

        await Servicios.ListarEspecialidadPorDepartamento(data.idDepartamento, '#cboEspecialidades')

        $('#cboTipoServicio').val(data.idTipoServicio);
        $('#cboDepartamento').val(data.idDepartamento);
        $('#cboEspecialidades').val(data.idEspecialidad);
        $('#txtCodigoServicio').val(data.codigo);
        $('#txtNombreServicio').val(data.servicio);
        $('#cboUpsHis').val(isEmpty(data.codigoServicioHIS) ? 0 : data.codigoServicioHIS);
        $('#cboUpsSusalud').val(data.codigoServicioSuSalud);
        $('#cboUpsFua').val(data.codigoServicioFUA);
        $('#cboUpsRenaes').val(data.codigoServicioRenaes);

        $('#hdIdProductoEstanciaPorDia').val(data.idProducto);
        $('#txtCodigoEstanciaPorDia').val(data.codigoProducto);
        $('#txtProductoEstanciaPorDia').val(data.nombreProducto);
        $('#txtCodigoServicioSem').val(data.codigoServicioSEM);
        $('#txtUbicacionServicioSem').val(data.ubicacionSEM);
        $('#cboTipoSexoServicio').val(data.soloTipoSexo);
        $('#cboRangoEdad').val(data.tipoEdad);
        $('#txtRangoEdadDesde').val(devuelveEdadXtipo(parseInt(data.minimaEdad)));
        $('#txtRangoEdadHasta').val(devuelveEdadXtipo(parseInt(data.maximaEdad)));
        $('#cboTipoModuloServicio').val(data.tipoModulo);

        $('#chkEsTeleconsulta').prop('checked', data.esTeleconsulta);
        $('#chkEsPuntoCarga').prop('checked', data.esPuntoCarga == 0 ? false : true);
        $('#chkServicioHabilitado').prop('checked', data.idEstado);
        $('#chkSeUsaFormatoFua').prop('checked', data.usaFUA);
        $('#chkElServicioEsObservacionEmergencia').prop('checked', data.esObservacionEmergencia);
        $('#chkConsultorioNoCobra').prop('checked', data.costoCeroCE);
        $('#chkConsultorioNecesitaTriaje').prop('checked', data.triaje);
        $('#chkEmiteFormatoFua').prop('checked', data.usaGalenHos);
        $(`input[name="rdbActivaProcedimiento"][value="${data.activaProcedimiento}"]`).prop('checked', true);

        Servicios.IdServicio = data.idServicio;

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    /////
    AbrirModalCatalogoServicios: function (tipo) {

        $('#hdTipoCatalogoServicios').val(tipo)
        $('#modalCatalogoServicios').modal('show')

    },
    LimpiarFormularioRegistro: function () {
        $('#cboTipoServicio').val(0);
        $('#cboDepartamento').val(0);
        $('#cboEspecialidades').val(0);
        $('#txtCodigoServicio').val('');
        $('#txtNombreServicio').val('');
        $('#cboUpsSusalud').val(0);
        $('#cboUpsHis').val(0);
        $('#cboUpsFua').val(0);
        $('#cboUpsRenaes').val(0);
        $('#chkEsTeleconsulta').prop('checked', false);
        $('#chkEsPuntoCarga').prop('checked', false);
        $('#chkServicioHabilitado').prop('checked', false);
        $('#chkSeUsaFormatoFua').prop('checked', false);
        $('#txtCodigoEstanciaPorDia').val('');
        $('#hdIdProductoEstanciaPorDia').val('');
        $('#txtProductoEstanciaPorDia').val('');
        $('#txtCodigoServicioSem').val('');
        $('#txtUbicacionServicioSem').val('');
        $('#chkElServicioEsObservacionEmergencia').prop('checked', false);
        $('#cboTipoSexoServicio').val(0);
        $('#cboRangoEdad').val(0);
        $('#txtRangoEdadDesde').val('');
        $('#txtRangoEdadHasta').val('');
        $('#chkConsultorioNoCobra').prop('checked', false);
        $('#chkConsultorioNecesitaTriaje').prop('checked', false);
        $('#chkEmiteFormatoFua').prop('checked', false);
        $('#cboTipoModuloServicio').val(0);
        $(`input[name="rdbActivaProcedimiento"][value="${0}"]`).prop('checked', true);
        // Si EspecialidadHosp es un objeto en JavaScript, también lo reseteamos
        Servicios.IdServicio = 0;

        $('#modalServicios input').attr('disabled', false)
        $('#modalServicios select').attr('disabled', false)
        $('#modalServicios button').attr('disabled', false)
        $('#btnCerrarModalServicios').attr('disabled', false)

        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    /////
    Events: function () {
        $('#btnBuscarServicio').on('click', async function () {
            Cargando(1)
            await Servicios.ServiciosSeleccionarPorTipo()
            Cargando(0)
        })
        $('#btnAgregar').on('click', async function () {
            $('#modalServicios').modal('show')
        })
        $('#btnModificar').on('click', async function () {

            let row = oTable_Servicios.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro')
                return
            }

            await Servicios.CargarFormularioRegistro(row)

            $('#modalServicios').modal('show')
        })
        $('#btnConsultar').on('click', async function () {

            let row = oTable_Servicios.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro')
                return
            }

            $('#modalServicios input').attr('disabled', true)
            $('#modalServicios select').attr('disabled', true)
            $('#modalServicios button').attr('disabled', true)
            $('#btnCerrarModalServicios').attr('disabled', false)
            $('btnGuardarServicio').hide()

            await Servicios.CargarFormularioRegistro(row)

            $('#modalServicios').modal('show')
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
            await Servicios.FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo()
            Cargando(0)
        })
        $('#btnGuardarServicio').on('click', async function () {

            let msgError = ''

            if (isEmpty($('#cboTipoServicio').val())) {
                msgError = msgError + '<li>Seleccione el Tipo de Servicio</li>'
            }
            if (isEmpty($('#cboDepartamento').val())) {
                msgError = msgError + '<li>Seleccione el Departamento</li>'
            }
            if (isEmpty($('#cboEspecialidades').val())) {
                msgError = msgError + '<li>Seleccione una Especialidad</li>'
            }
            if (isEmpty($('#cboTipoSexoServicio').val())) {
                msgError = msgError + '<li>Seleccione el TIPO SEXO</li>'
            }
            if ($('#txtCodigoServicio').val() == '') {
                msgError = msgError + '<li>Ingrese el Codigo del Servicio</li>'
            }
            if ($('#txtNombreServicio').val() == '') {
                msgError = msgError + '<li>Ingrese el Nombre del Servicio</li>'
            }
            if (isEmpty($('#cboRangoEdad').val())) {
                msgError = msgError + '<li>Seleccione la Rango de Edad</li>'
            }
            if ($('#txtRangoEdadDesde').val() == '') {
                msgError = msgError + '<li>Ingrese la Edad Mínima</li>'
            }
            if ($('#txtRangoEdadHasta').val() == '') {
                msgError = msgError + '<li>Ingrese la Edad Máxima</li>'
            }
            if (isEmpty($('#cboUpsHis').val())) {
                msgError = msgError + '<li>Seleccione el Codigo UPS HIS</li>'
            }


            if (msgError != '') {
                msgError = '<ul style="text-align: left; margin-left: 90px;">' + msgError + '</ul>'
                alerta2('warning', 'Atención', msgError)

                return
            }

            Cargando(1)

            let resp = await Servicios.ServiciosAgregar()

            Cargando(0)
            if (!isEmpty(resp) && resp.data != 0) {
                alerta2('success', 'Servicios', 'Se registro el servicio')

                Servicios.LimpiarFormularioRegistro()

                //$('#modalServicios').modal('hide')
                //$('#btnBuscarServicio').click()
            }
        })
        $('#btnCerrarModalServicios').on('click', async function () {
            $('#btnBuscarServicio').click()
            Servicios.LimpiarFormularioRegistro()
            $('#modalServicios').modal('hide')
        })
        $('#btnSeleccionarProcedimiento').on('click', async function () {

            let row = oTable_CatalogoServicios.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro')
                return
            }

            if ($('#hdTipoCatalogoServicios').val() == 1) {
                $('#txtCodigoEstanciaPorDia').val(row.codigo)
                $('#hdIdProductoEstanciaPorDia').val(row.idProducto)
                $('#txtProductoEstanciaPorDia').val(row.nombre)
            } else if ($('#hdTipoCatalogoServicios').val() == 2) {
               
            }

            $('#modalCatalogoServicios').modal('hide')

        })
        $('#btnCerrarModalCatalogoServicios').on('click', async function () {
            $('#modalCatalogoServicios').modal('hide')
        })


        $('#cboDepartamento').on('change', async function () {
            await Servicios.ListarEspecialidadPorDepartamento($('#cboDepartamento').val(), '#cboEspecialidades')
        })

        $('#tblCatalogoServicios tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_CatalogoServicios.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })

        $('#tblServicios tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_Servicios.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
    },
    Init: async function () {
        await this.InitDatablesServicios()
        await this.InitDatablesCatalogoServicios()

        await this.ListarDepartamentosHospital()
        await this.ListarTipoServicio()
        await this.SuSaludUpsSeleccionarTodos()
        await this.SisFuaUPServiciosSeleccionarTodos()
        await this.UPServiciosSeleccionarTodosV2()
        await this.RenaesUPServiciosSeleccionarTodos()
        await this.TiposEdadSeleccionarTodos()
        await this.ListarTiposModuloAtencion()

        await this.Events()
    }

}

function devuelveEdadEnDiasXtipo(edad) {
    switch (parseInt($('#cboRangoEdad').val())) {
        case 1:
            return edad * 365;
        case 2:
            return edad * 30;
        case 3:
            return edad;
        default:
            return 0;
    }
}
function devuelveEdadXtipo(edad) {
    switch (parseInt($('#cboRangoEdad').val())) {
        case 1:
            return edad / 365;
        case 2:
            return edad / 30;
        case 3:
            return edad;
        default:
            return 0;
    }
}