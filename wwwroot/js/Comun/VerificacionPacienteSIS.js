/*var listaDxRefCon = [{}];
var tratamientoRefCon = '';
var moduloActualRefCon = '';*/
//var idPacienteGlobal = 0;

var permisoFirma4Identity = "";

var FormatoFua = {

    async CargaInicial() {
        //Referencias.limpiar();
        /*
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencionBuscar').val(fechaP);
        */
        /*$("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");*/

        //$('.modalRefCon').modal({ backdrop: 'static', keyboard: false });
        //$('.modalRefCon').modal('hide');

        //EstablecimientosSaludTodos();
        //ListaDepartamentos();

        //this.ListarTiposGravedadAtencion();
        //this.ListarTiposServiciosMGP();
        //this.ListarOrigenAtencionEmergencia();
        permisoFirma4Identity = await PermisoGeneral.SeleccionarPermisoGeneral("FIRMA4IDENTITY");
        await FormatoFua.ListarTipoFormatoSISV2();
    },


    plugins() {

        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' })
        $(".chzn-select-deselect,#select2_sample").chosen()
        /*
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#txtFinEmb,#txtFechaAtencion,#txtFechaAtencionBuscar,#txtFUM,#txtFPP,#txtFEcog,#txtFechaControl,#txtFPPControl,#txtProximaConsulta').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");
        */
    },


    IniciarCombos() {

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

    Eventos() {
        /*$("html").click(function () {
            oTable_atenciones.$('tr.selected').removeClass('selected');
            //console.log("SELECCIONAR BODY: ");
        });*/

        $('#tblAtencion tbody').on('click', 'tr', function (e) {
            e.stopPropagation();
            //console.log("SELECCIONAR TABLA");
            if ($(this).hasClass('selected')) {
                //$(this).removeClass('selected');
            }
            else {
                oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            //var pos = oTable_atencionesEmer.api(true).row($(this)).index();
            //var row = oTable_atencionesEmer.fnGetData(pos);           
        });

        ///////////////////////////////////BUSQUEDA//////////////////////////////////////////////////
        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscarAtenciones").click();
            }
        });

        $('#btnBuscarAtenciones').on('click', async function () {
            //$('#lblMedicoProgramado').html('');
            var filtro = "";

            //if ($('#txtNroCuentaBuscar').val() == "" && $('#txtNroDniBuscar').val() == "" && $('#txtNroHistoriaBuscar').val() == "" && $('#txtApPaternoBuscar').val() == "" && $('#txtApMaternoBuscar').val() == "") {
            //    alerta('2', 'Ingrese almenos un campo para la busqueda.');
            //    return false;
            //}
            //else {
                //$('#lblMedicoProgramado').html("Medico: " + $('#cboConsultorio>option:selected').attr("med"))
                if ($('#txtNroCuentaBuscar').val() != "") { filtro = filtro + " AND ate.IdCuentaAtencion = " + $('#txtNroCuentaBuscar').val(); }
                if ($('#txtNroDniBuscar').val() != "") { filtro = filtro + " AND pac.NroDocumento = '" + $('#txtNroDniBuscar').val() + "'"; }
                if ($('#txtNroHistoriaBuscar').val() != "") { filtro = filtro + " AND pac.NroHistoriaClinica = '" + $('#txtNroHistoriaBuscar').val() + "'"; }
                if ($('#txtApPaternoBuscar').val() != "") { filtro = filtro + " AND pac.ApellidoPaterno LIKE '" + $('#txtApPaternoBuscar').val() + "%'"; }
                if ($('#txtApMaternoBuscar').val() != "") { filtro = filtro + " AND pac.ApellidoMaterno LIKE '" + $('#txtApMaternoBuscar').val() + "%'"; }

                const atenciones = await FormatoFua.ListarAtenciones(filtro);
            //}
            $('html, body').animate({
                scrollTop: $(".head").offset().top
            }, 1000);
        });

        $('#btnLimpiarBusqueda').on('click', async function () {
            $('.search').val('');
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////////
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

            let response = await FormatoFua.ConsultarAfiliadoFuaE(
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

            FormatoFua.ModificarAfiliacionPaciente(nroCuenta, Codigo, idSiasis)
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



            let idSiaSis = await FormatoFua.SisFiliacionesAgregar(
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
        /////////////////////////////////GENERAR FUA/////////////////////////////////////////////////        
        $('#btnModificarFua').on('click', async function () {
            var objrowTb = oTable_atenciones.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una atención por favor.');
                return false;
            } else {
                $('#txtNroCuenta').val(objrowTb.idCuentaAtencion)
                $('#txtApellidoPaterno').val(objrowTb.apellidoPaterno)
                $('#txtApellidoMaterno').val(objrowTb.apellidoMaterno)
                $('#txtPrimerNombre').val(objrowTb.primerNombre)
                $('#txtSegundoNombre').val(objrowTb.segundoNombre)
                $('#cboTipoSexo').val(objrowTb.idTipoSexo)
                $('#modalModificarAfiliacion').modal('show')

                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                //if (objrowTb.idFuenteFinanciamiento == 3) {
                //    swal({
                //        title: 'Mensaje',
                //        text: '¿Esta seguro que desea generar el formato FUA para la atención?',
                //        type: 'question',
                //        showCancelButton: true,
                //        confirmButtonColor: '#4fb7fe',
                //        cancelButtonColor: '#6c6c6c',
                //        confirmButtonText: 'Aceptar',
                //        cancelButtonText: 'Cancelar',
                //    }).then(function () {
                //        FormatoFua.GenerarFormatoFua(objrowTb.idCuentaAtencion);
                //        //EvaluacionEmergencia.GenerarHojaEvaluacion(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);

                //    }, function (dimiss) {

                //    });
                //} else {
                //    alerta(2, 'La atención no pertenece a un paciente SIS.');
                //    //    rutaInfoEme = objrowTb.rutaArchivoEmer;
                //    //    $("#visorDocumento").attr("src", PathServerFiles + rutaInfoEme);
                //    //    $('#modalVisorDocumento').modal('show');
                //}


            }
        });
        ////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////EVENTOS IMPRIMIR FUA/////////////////////////////
        //$('#tblAtencion tbody').on('click', '.ImprimeFuaSF', function () {
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);

        //    //console.log("RUTA: " + ruta);
        //    $("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivoFua);
        //    $('#modalVisorDocumento').modal('show');
        //});

        //$('#tblAtencion tbody').on('click', '.ImprimeFuaCF', function () {
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);
        //    imprimirDocumentoConFirma(row.idCuentaAtencion, row.codeFua, row.idDocFua, row.tipoFua);
        //});

        $('#tblAtencion tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarFuaPdf(row.idCuentaAtencion, row.idCuentaAtencion);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblAtencion tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
        });

        $('#tblAtencion tbody').on('click', '.FirmarFuaSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeFua)               //KHOYOSI            
            if (firma) {
                /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua); }*/
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.codeFua); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.codeFua); }
                //await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
            }
            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////



        /////////////////////EVENTOS FIRMAR FUA FUA/////////////////////////////
        $('#tblAtencion tbody').on('click', '.Firma4IdentityFUA', function (event) {
            event.preventDefault();

            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            $(".bit4id-sign").attr("action", '/Utilitario/FirmaComponent?area=ConsultaExterna');
            $('#bit4id-document').text(`${PathServerFiles}${row.rutaArchivoFua}`);
            $('#bit4id-documentName').text(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).substr(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).indexOf("/") + 1,));
            $('#bit4id-documentID').text(`${row.rutaArchivoFua},${row.idCuentaAtencion},FUA,Sis,FormatoFua`);
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";
            $(".bit4id-image").html("https://www.mgp.gob.pe/uploads/1565361369.png");
            $(".bit4id-paragraphFormat").html("https://www.mgp.gob.pe/uploads/1565361369.png");

            window.location.href = document.getElementsByClassName('bit4-link')[0].href;

            return false
        });

        $('#tblAtencion tbody').on('click', '.btnFirma4IdentityImprimeFUA', function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            AbrirVisorDocumento('/4IdentitySignedFiles' + row.rutaArchivoFua, 0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////
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
    ///////////////////////////////LISTAR ATENCIONES////////////////////////////////////////////////    
    async ListarAtenciones(filtro) {
        var formData = new FormData();
        let datos;

        formData.append('lcFiltro', filtro);
        oTable_atenciones.fnClearTable();
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Mantenimiento/ListarAtenciones?area=Sis",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsAtenciones.table.length > 0) {
                    dataAtenciones = datos.lsAtenciones.table;
                    oTable_atenciones.fnAddData(dataAtenciones);
                }
                else {
                    dataAtenciones = {};
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return datos;
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////GENERAR FUA////////////////////////////////////////////////    
    async GenerarFormatoFua(idCuenta) {
        const datosfua = await FormatoFua.ModificarFua(idCuenta);
        if (datosfua.respuesta == 1) {
            const hojafua = await FormatoFua.GenerarFua(idCuenta);
        }
        //        console.log(datosfua);
        //
    },

    async ModificarFua(idCuenta) {
        var formData = new FormData();
        let datos;

        formData.append('idCuentaAtencion', idCuenta);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/CrearModificarFua?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta == 1) {
                    alerta(1, "Los datos se guardaron correctamente.");
                    return datos
                }
                else {
                    alerta(3, "Hubo un error al guardar los datos del FUA.");
                    return 0
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina.")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return datos;
    },

    async GenerarFua(idCuenta) {
        var formData = new FormData();
        let datos;

        formData.append('idCuentaAtencion', idCuenta);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/GenerarFormatoFua?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta == "Ok") {
                    alerta(1, datos.mensaje);
                    $("#btnBuscarAtenciones").click();
                }
                else {
                    alerta(3, datos.mensaje);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return datos;
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////



    ///////////////KHOYOSI/////////////////////////////////////////////
    ObtenerIdUsuarioSesion() {
        var idUser = 0;
        $.ajax({
            method: "POST",
            url: "/Utilitario/ObtenerIdUsuarioLogeado?area=Comun",
            //data: midata,
            //dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                idUser = datos;
            },
            error: function (msg) {
                alerta("ERROR", "Error aal obtener Id del Medico!", "2");
            }
        });

        return idUser;
    },
    /////////////////////////////////////////////////////////////////////


    //////////////////////////////INICIALIZAR TABLAS///////////////////////////////////////////
    initDatables() {
        var parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            "ordering": true,
            columns: [
                {
                    width: '7%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //$(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
                    }
                },
                {
                    width: '7%',
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 5,
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //$(td).html(FormatearFecha(rowData.fecNacim));
                    }
                },
                /*{
                    width: '10%',
                    targets: 6,
                    data: "tipoPaciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },*/
                {
                    width: '7%',
                    targets: 7,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 8,
                    data: "horaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 9,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: "tipoPlan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (rowData.idFuenteFinanciamiento == 3) {
                            if (rowData.codeFua != "") {
                                var btnRuta = "";
                                var btnImprime = "";
                                var btnImprimeSinF = "";

                                btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                if (permisoFirma4Identity == '1') {
                                    if (rowData.statusFirmaFua == 0) {
                                        btnRuta = '<button class="Firma4IdentityFUA btn btn-sm btn-info glow_button" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-pencil"></i> </button>'; // cambiar luego
                                    } else {
                                        btnImprime = ' <button class="btnFirma4IdentityImprimeFUA btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>'; // cambiar luego
                                    }
                                } else {
                                    if (rowData.statusFirmaFua == 0) {
                                        btnRuta = '<a href="' + rowData.rutaFua + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                                    }
                                    if (rowData.statusFirmaFua == 1 || rowData.statusFirmaFua == 0) {
                                        btnImprime = ' <button class="ImprimeFuaCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';

                                        //btnRuta = "";
                                    }
                                }

                                $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

                                $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                            }
                            else {
                                $(td).html('');
                            }
                        } else {
                            $(td).html('');
                        }

                        /*if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }*/

                    }
                }


            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencion").dataTable(parms);


    },


}


//////////////////////KHOYOSI////////////////////////////////
var imprimirDocumentoConFirma = function (idCuentaAtencion, code, idDoc, tipo) {
    var objrow = oTable_atenciones.api(true).row('.selected').data();
    //var midata = new FormData();

    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
    //$('#ifrmReporte').attr('src', url);

    var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.open("GET", url);
    request.onload = function () {

        var url = window.URL.createObjectURL(this.response);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        //a.download = this.response.name || "CE-" + $.now()
        a.download = "CE-FUA" + idCuentaAtencion + "-" + $.now()
        a.click();

        ListaAtencionesCE();
    }
    request.send();
}
//////////////////////////////////////////////////////////////////



$(document).ready(function () {
    FormatoFua.CargaInicial();
    //AdmisionEmergencia.IniciarCombos();
    FormatoFua.plugins();
    FormatoFua.initDatables();
    FormatoFua.InitDatablesBusquedaSis();
    //AdmisionEmergencia.initDatablesConsumoAtencion();
    FormatoFua.Eventos();

});

