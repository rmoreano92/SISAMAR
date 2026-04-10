let Mantenimiento = {
    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' })
        $(".chzn-select-deselect,#select2_sample").chosen()
    },

    ListarTipoFormatoSISV2: function (idFuenteFinanciamiento) {

        return HttpClient.Get('/Citas/ListarTipoFormatoSISV2')
            .then(res => {

                $('#cboTipoAfiliacion').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboTipoAfiliacion').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            if ((obj.tfrm_Descripcion == 'Afiliación AUS' || obj.tfrm_Descripcion == 'Afiliacion Temporal') && obj.com_Descripcion == 'Subsidiado') {
                                $('#cboTipoAfiliacion').append(`<option value="${obj.lot_IdTablaSiasis}">${obj.com_Descripcion} - ${obj.tfrm_Descripcion}</option>`)
                            }

                        })

                        $(`#cboTipoAfiliacion`).val(7)
                        $(`#txtDisa`).val(250)
                        $(`#txtTipo`).val(2)
                        $('.chzn-select').chosen().trigger("chosen:updated")

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    PacientesSeleccionarPorNroHistoriaClinica: () => {
        let formData = new FormData()

        formData.append('nroHistoria', $('#txtHistoriaActual').val())

        Cargando(1)

        HttpClient.Get(`/Paciente/PacientesSeleccionarPorNroHistoriaClinicaV2?area=Farmacia&nroHistoria=${$('#txtHistoriaActual').val()}`)
            .then((res) => {
                console.log('historia', res)
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        let datosPaciente = res.data.table[0]
                        $('#txtDatosPaciente').val(datosPaciente.primerNombre + ' ' + (datosPaciente.segundoNombre ? datosPaciente.segundoNombre : '') + ' ' + datosPaciente.apellidoPaterno + ' ' + datosPaciente.apellidoMaterno)
                        console.log('historia', res)
                    }
                } else {
                    console.log(res)
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                console.log(e)
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },

    ModificarNroHistoria: () => {
        let formData = new FormData()

        formData.append('nroHistoriaActual', $('#txtHistoriaActual').val())
        formData.append('idTipoNumeracion', $('#cboTipoHistoria').val())
        formData.append('nroHistoria', $('#txtHistoriaNuevo').val())

        Cargando(1)

        HttpClient.Post(`/Paciente/ModificarNroHistoria?area=Farmacia`, formData)
            .then((res) => {
                console.log('historia', res)
                if (res.estado) {
                    console.log('que paso', res)
                    alerta(1, 'La historia se modifico con exito')
                    $('#txtHistoriaActual').val('')
                    $('#cboTipoHistoria').val(0)
                    $('#txtHistoriaNuevo').val('')
                    $('#txtDatosPaciente').val('')

                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    console.log(res)
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                console.log(e)
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },

    ConsultarAfiliadoFuaE: async function (intOpcion, strTipoDocumento, strNroDocumento, strDisa, strTipoFormato, strNroContrato, strCorrelativo) {

        let formData = new FormData();

        formData.append("intOpcion", intOpcion)
        formData.append("strTipoDocumento", strTipoDocumento)
        formData.append("strNroDocumento", strNroDocumento)
        formData.append("strDisa", strDisa)
        formData.append("strTipoFormato", strTipoFormato)
        formData.append("strNroContrato", strNroContrato)
        formData.append("strCorrelativo", strCorrelativo)

        return HttpClient.Post('/MicroServicios/ConsultarAfiliadoFuaE', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    },

    ModificarAfiliacionPaciente: (nroCuenta, codigoSis, idSiaSis) => {
        let formData = new FormData()

        formData.append('nroCuenta', nroCuenta)
        formData.append('codigoSis', codigoSis)
        formData.append('idSiaSis', idSiaSis)

        Cargando(1)

        HttpClient.Post(`/Paciente/ModificarAfiliacionPaciente?area=Farmacia`, formData)
            .then((res) => {
                console.log('historia', res)
                if (res.estado) {
                    console.log('que paso', res)
                    alerta(1, 'La Afiliacion fue modificada')

                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    console.log(res)
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                console.log(e)
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SisFiliacionesAgregar: function (
        idSiasis, Codigo, AfiliacionDisa, AfiliacionTipoFormato, AfiliacionNroFormato, AfiliacionNroIntegrante, DocumentoTipo, CodigoEstablAdscripcion,
        AfiliacionFecha, Paterno, Materno, Pnombre, Onombres, Genero, Fnacimiento, IdDistritoDomicilio, Estado, Fbaja, DocumentoNumero, MotivoBaja, FbajaOK
    ) {
        let formData = new FormData();
        formData.append("idSiasis", idSiasis)
        formData.append("Codigo", Codigo)
        formData.append("AfiliacionDisa", AfiliacionDisa)
        formData.append("AfiliacionTipoFormato", AfiliacionTipoFormato)
        formData.append("AfiliacionNroFormato", AfiliacionNroFormato)
        formData.append("AfiliacionNroIntegrante", AfiliacionNroIntegrante)
        formData.append("DocumentoTipo", DocumentoTipo)
        formData.append("CodigoEstablAdscripcion", CodigoEstablAdscripcion)
        formData.append("AfiliacionFecha", AfiliacionFecha)
        formData.append("Paterno", Paterno)
        formData.append("Materno", Materno)
        formData.append("Pnombre", Pnombre)
        formData.append("Onombres", Onombres)
        formData.append("Genero", Genero)
        formData.append("Fnacimiento", Fnacimiento)
        formData.append("IdDistritoDomicilio", IdDistritoDomicilio)
        formData.append("Estado", Estado)
        formData.append("Fbaja", Fbaja)
        formData.append("DocumentoNumero", DocumentoNumero)
        formData.append("MotivoBaja", MotivoBaja)
        formData.append("FbajaOK", FbajaOK)

        return HttpClient.Post('/Sis/web_SisFiliacionesAgregar?area=Comun', formData)
            .then(res => {
                if (res.estado) {
                    return res
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
            })
    },

    InitDatablesBusquedaSis: function () {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '40vh',
            scrollCollapse: true,
            columns: [
                { title: 'ApPaterno' },
                { title: 'ApMaterno' },
                { title: 'PNombre' },
                { title: 'SNombre' },
                { title: 'Fnacimiento' },
                { title: 'cAfiliacion' },
                { title: 'estado' },
                { title: 'fBajaOK' },
                { title: 'DNI' },
                { title: 'sexo' },
                { title: 'distritoDomicilio' },
                { title: 'cDisa' },
                { title: 'cFormato' },
                { title: 'cNumero' },
                { title: 'AfiliacionNroIntegrante' },
                { title: 'codigo' },
                { title: 'idSiaSis' },
                { title: 'MotivoBaja' },
                { title: 'CodigoEstablAdscripcion' },
                { title: 'AfiliacionFecha' }
            ]
        }

        var tableWrapper = $('#tblBusquedaSis'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_busquedaSis = $("#tblBusquedaSis").dataTable(parms);
    },

    Events: () => {

        $('#btnBuscarHistoria').on('click', () => {

            //$('#txtHistoriaActual').val('')
            $('#cboTipoHistoria').val(0)
            $('#txtHistoriaNuevo').val('')
            $('#txtDatosPaciente').val('')

            $('.chzn-select').chosen().trigger("chosen:updated");
            Mantenimiento.PacientesSeleccionarPorNroHistoriaClinica()
        })
        $('#btnGuardar').on('click', () => {
            Mantenimiento.ModificarNroHistoria()
        })
        $('#btnBuscarPacientes').on('click', async function () {

            if ($('#cboTipoAfiliacion').val() == 0) {
                alerta(2, 'Seleccine el tipo de afiliacion')
                return false
            }

            if ($('#txtDisa').val() == '') {
                alerta(2, 'La "DISA DE AFILIACIÓN" es un dato obligatorio.')
                $('#txtDisa').focus()
                return false
            }

            if ($('#txtTipo').val() == '') {
                alerta(2, 'El "TIPO DE AFILIACIÓN" es un dato obligatorio.')
                $('#txtTipo').focus()
                return false
            }

            if ($('#txtNroAfiliacion').val() == '') {
                alerta(2, 'El "NÚMERO DE AFILIACIÓN" es un dato obligatorio.')
                $('#txtNroAfiliacion').focus()
                return false
            }

            Cargando(1)

            //TamizajeNeonatal.LimpiarCamposRegistro()

            let response = await Mantenimiento.ConsultarAfiliadoFuaE(
                intOpcion = $('#cboTipoAfiliacion').val() == '7' ? '1' : '2', strTipoDocumento = $('#txtTipo').val().trim() == '2' ? '1' : '3', strNroDocumento = $('#txtNroAfiliacion').val().trim(),
                strDisa = $('#txtDisa').val().trim(), strTipoFormato = $('#txtTipo').val().trim(), strNroContrato = $('#txtNroAfiliacion').val().trim(), strCorrelativo = '1')

            if (response.data.idError == '0') {
                console.log('response', response)

                let data = response.data

                let dataSet = [
                    data.apePaterno, data.apeMaterno, data.nombres, '', data.fecNacimiento.substr(6, 2) + '/' + data.fecNacimiento.substr(4, 2) + '/' + data.fecNacimiento.substr(0, 4),
                    data.disa + '-' + data.contrato, 0, '', data.nroDocumento, (data.genero == '0' ? '2' : '1'), data.idUbigeo, data.disa, data.tipoFormato, data.nroContrato, '',
                    data.tabla, data.idNumReg, '', data.eess, data.fecAfiliacion.substr(6, 2) + '/' + data.fecAfiliacion.substr(4, 2) + '/' + data.fecAfiliacion.substr(0, 4)
                ]

                oTable_busquedaSis.fnClearTable()
                oTable_busquedaSis.fnAddData(dataSet)

                $('#modalBusquedaSis').modal('show')
                Cargando(0)
            } else {
                swal({
                    title: 'Cuidado',
                    text: response.data.resultado,
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: true
                })
                Cargando(0)
            }

        })

        $('#btnGuardarAfiliacion').on('click', () => {

            let objRowSis = oTable_busquedaSis.api(true).row('.selected').data()

            let nroCuenta = $('#txtNroCuenta').val()
            let idSiasis = objRowSis[16]
            let Codigo = objRowSis[15]

            Mantenimiento.ModificarAfiliacionPaciente(nroCuenta, Codigo, idSiasis)
        })

        $('#btnLimpiarCampos').on('click', async function () {

            Cargando(1)
            $('#txtApellidoPaterno').val('')
            $('#txtApellidoMaterno').val('')
            $('#txtPrimerNombre').val('')
            $('#txtSegundoNombre').val('')
            $('#cboTipoSexo').val(0)

            $('#txtFechaNacimiento').val('')
           
            $('#cboTipoAfiliacion').val(7)
            $('#txtDisa').val('250')
            $('#txtTipo').val('2')
            $('#txtNroAfiliacion').val('')
            $('#txtNroCuenta').val('')

            $('.chzn-select').chosen().trigger("chosen:updated");
            Cargando(0)

        })

        $('#tblBusquedaSis tbody').on('click', 'tr', function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');
        })
        $('#tblBusquedaSis tbody').on('dblclick', 'tr', async function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')

            let objRowSis = oTable_busquedaSis.api(true).row('.selected').data()

            Cargando(1)



            let idSiaSis = await Mantenimiento.SisFiliacionesAgregar(
                idSiasis = objRowSis[16], Codigo = objRowSis[15], AfiliacionDisa = objRowSis[11], AfiliacionTipoFormato = objRowSis[12], AfiliacionNroFormato = objRowSis[13],
                AfiliacionNroIntegrante = objRowSis[14], DocumentoTipo = '', CodigoEstablAdscripcion = objRowSis[18], AfiliacionFecha = objRowSis[19], Paterno = objRowSis[0],
                Materno = objRowSis[1], Pnombre = objRowSis[2], Onombres = objRowSis[3], Genero = objRowSis[9], Fnacimiento = objRowSis[4], IdDistritoDomicilio = objRowSis[10],
                Estado = objRowSis[6], Fbaja = objRowSis[7], DocumentoNumero = objRowSis[8], MotivoBaja = objRowSis[17], FbajaOK = ''
            )

            $('#txtApellidoPaterno').val(objRowSis[0])
            $('#txtApellidoMaterno').val(objRowSis[1])
            $('#txtPrimerNombre').val(objRowSis[2])
            $('#txtSegundoNombre').val(objRowSis[3])
            $('#cboTipoSexo').val(objRowSis[9])
            $('#txtFechaNacimiento').datepicker("setDate", objRowSis[4])
            $("#txtHoraNacimiento").val('12:00')

            $('#modalBusquedaSis').modal('hide')

            Cargando(0)

        })
    }


}

$(document).ready(() => {


    Mantenimiento.Plugins()
    Mantenimiento.Events()

    Mantenimiento.InitDatablesBusquedaSis()

    Mantenimiento.ListarTipoFormatoSISV2()
})