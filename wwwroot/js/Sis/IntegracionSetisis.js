let Sis = {
    meses: [
        { idMes: 1, descripcion: 'Enero' }, { idMes: 2, descripcion: 'Febrero' }, { idMes: 3, descripcion: 'Marzo' }, { idMes: 4, descripcion: 'Abril' }, { idMes: 5, descripcion: 'Mayo' },
        { idMes: 6, descripcion: 'Junio' }, { idMes: 7, descripcion: 'Julio' }, { idMes: 8, descripcion: 'Agosto' }, { idMes: 9, descripcion: 'Setiembre' }, { idMes: 10, descripcion: 'Octubre' },
        { idMes: 11, descripcion: 'Noviembre' }, { idMes: 12, descripcion: 'Diciembre' }
    ],
    anios: [],

    nombrePaquete: '',
    nroEnvio: '',

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#tblAnexos').DataTable({
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

        $('#txtFechaFuaInicio, #txtFechaFuaFin').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");



    },

    CargaInicial: async () => {
        let dt = new Date();
        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        var dia = dt.getDate()
        var mes = parseInt(dt.getMonth()) + 1
        var yyy = dt.getFullYear()

        await GenerarAnios()

        $('#cboMesProduccion').val(mes)
        $('#cboAnioProduccion').val(yyy)

        //PARA PRUEBA//
        $("#txtFechaFuaInicio").datepicker("setDate", '15/05/2024');
        $("#txtFechaFuaFin").datepicker("setDate", '27/01/2025');
        ///////////////


        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    ListarAtencionesFuaParaMigracion: function (FechaInicio, FechaFin, FuaUPS) {
        let formData = new FormData();
        formData.append("FechaInicio", FechaInicio)
        formData.append("FechaFin", FechaFin)
        formData.append("FuaUPS", FuaUPS)

        return HttpClient.Post('/IntegracionSoaSis/ListarAtencionesFuaParaMigracion', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table
                    } else {
                        alerta(2, 'No se encontraron datos del paciente, intente nuevamente')
                        Cargando(0)
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
    ActualizarFuasAEstadoMigrado: function (FechaInicio, FechaFin, FuaUPS) {
        let formData = new FormData();
        formData.append("FechaInicio", FechaInicio)
        formData.append("FechaFin", FechaFin)
        formData.append("FuaUPS", FuaUPS)

        return HttpClient.Post('/IntegracionSoaSis/ActualizarFuasAEstadoMigrado', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table
                    } else {
                        alerta(2, 'No se encontraron datos del paciente, intente nuevamente')
                        Cargando(0)
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

    ListarServiciosParaFUA: function () {
        return HttpClient.Get('/IntegracionSoaSis/ListarServiciosParaFUA')
            .then(res => {

                $('#cboFuaUPS').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboFuaUPS').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboFuaUPS').append(`<option value="${obj.codigoServicioFUA}">${obj.nombre}</option>`)
                        })

                        $('.chzn-select').chosen().trigger("chosen:updated");

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

    GenerarIntegracionSoaSis() { // Metodo Antiguo
        var formData = new FormData();
        formData.append('mesEnvio', $('#cboMesAtencion').val())
        formData.append('anioEnvio', $('#cboAnioAtencion').val())
        formData.append('mesProduccion', $('#cboMesProduccion').val())
        formData.append('anioProduccion', $('#cboAnioProduccion').val())

        Cargando(1)
        return HttpClient.Post('/IntegracionSoaSis/GenerarIntegracionSoaSis?area=Sis', formData).then(res => {
            if (res.estado) {
                let resultado = res.data.value.resultado
                $('#txtPaquete').val(resultado.paqueteNombre)
                $('#txtRespuesta').val(resultado.respuesta)
                Cargando(0)
            } else {
                alerta(2, res.msg)
                Cargando(0)
            }


        })
    },
    GenerarIntegracionSoaSisPorFechas() {
        var formData = new FormData();
        formData.append('fechaInicio', $('#txtFechaFuaInicio').val())
        formData.append('fechaFin', $('#txtFechaFuaFin').val())
        formData.append('mesProduccion', $('#cboMesProduccion').val())
        formData.append('anioProduccion', $('#cboAnioProduccion').val())
        formData.append('fuaUPS', $('#cboFuaUPS').val())
        console.log('asdasdasdasdas')
        Cargando(1)
        return HttpClient.Post('/IntegracionSoaSis/GenerarIntegracionSoaSisv2?area=Sis', formData).then(res => {
            if (res.estado) {
                let resultado = res.data.value.resultado
                $('#txtPaquete').val(resultado.paqueteNombre)
                $('#txtRespuesta').val(resultado.respuesta)
                Cargando(0)
            } else {
                alerta(2, res.msg)
                Cargando(0)
            }


        })
    }, // Metodo Antiguo

    MigracionSOASIS(FechaInicio, FechaFin, FuaUPS, numeroEnvio, nombrePaquete, mesProduccion, anioProduccion) {

        let fileName = ''
        var formData = new FormData();
        formData.append("FECHAINICIO", FechaInicio)
        formData.append("FECHAFIN", FechaFin)
        formData.append("fuaUPS", FuaUPS)
        formData.append('numeroEnvio', numeroEnvio)
        formData.append('nombrePaquete', nombrePaquete)
        formData.append('mesProduccion', mesProduccion)
        formData.append('anioProduccion', anioProduccion)

        return fetch('/IntegracionSoaSis/MigracionSOASIS', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener el archivo.');
                }

                const contentDisposition = response.headers.get('Content-Disposition');

                const matches = contentDisposition.split(';')

                fileName = matches[1].substring(10, 50)

                $('#txtPaquete').val(fileName)

                return response.blob();
            })
            .then(blob => {


                // Crear URL para el blob
                var url = window.URL.createObjectURL(blob);
                // Crear un enlace <a> para descargar el archivo
                var a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                // Simular clic en el enlace para iniciar la descarga
                document.body.appendChild(a);
                a.click();
                // Limpiar la URL del objeto blob para liberar memoria
                window.URL.revokeObjectURL(url);

                return true
            })
            .catch(error => {
                console.error(error);
                alert(error.message);
            });

        //return HttpClient.Post('/IntegracionSoaSis/MigracionSOASIS?area=Sis', formData).then(res => {
        //    if (res.estado) {
        //        return res.data.value
        //    } else {
        //        alerta(2, res.msg)
        //        return null
        //    }


        //})
    },


    CompletarComboFechaEnvio: function () {
        $('#cboMesAtencion').empty()
        $('#cboAnioAtencion').empty()

        $(Sis.anios).each((i, obj) => {
            $('#cboAnioAtencion').append(`<option value="${obj}">${obj}</option>`)
        })
        $(Sis.meses).each((i, obj) => {
            $('#cboMesAtencion').append(`<option value="${obj.idMes}">${obj.descripcion}</option>`)
        })

        $('.chzn-select').chosen().trigger("chosen:updated")

    },
    CompletarComboFechaProduccion: function () {
        console.log('no llega')
        $('#cboMesProduccion').empty()
        $('#cboAnioProduccion').empty()

        $(Sis.anios).each((i, obj) => {
            $('#cboAnioProduccion').append(`<option value="${obj}">${obj}</option>`)
        })
        $(Sis.meses).each((i, obj) => {
            $('#cboMesProduccion').append(`<option value="${obj.idMes}">${obj.descripcion}</option>`)
        })

        $('.chzn-select').chosen().trigger("chosen:updated")
    },


    GenerarNumeroEnvioNombrePaquete: function (mesProduccion, anioProduccion) {
        let formData = new FormData();
        formData.append("mesProduccion", mesProduccion)
        formData.append("anioProduccion", anioProduccion)

        return HttpClient.Post('/IntegracionSoaSis/GenerarNumeroEnvioNombrePaquete', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (!isEmpty(res.data)) {
                        return res.data.value
                    } else {
                        Cargando(0)
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

    InsertarATESOASISBK: function (IdCuentaAtencion, FuaDisa, FuaLote, FuaNumero, Anio, Mes, NroEnvio, Estado, Paquete) {
        let formData = new FormData();
        formData.append("IdCuentaAtencion", IdCuentaAtencion)
        formData.append("FuaDisa", FuaDisa)
        formData.append("FuaLote", FuaLote)
        formData.append("FuaNumero", FuaNumero)
        formData.append("Anio", Anio)
        formData.append("Mes", Mes)
        formData.append("NroEnvio", NroEnvio)
        formData.append("Estado", Estado)
        formData.append("Paquete", Paquete)

        return HttpClient.Post('/IntegracionSoaSis/InsertarATESOASISBK', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (!isEmpty(res.data)) {
                        return res.data
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    ActualizarEstadoATESOASISBK: function (IdCuentaAtencion, Estado) {
        let formData = new FormData();
        formData.append("IdCuentaAtencion", IdCuentaAtencion)
        formData.append("Estado", Estado)

        return HttpClient.Post('/IntegracionSoaSis/ActualizarEstadoATESOASISBK', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (!isEmpty(res.data)) {
                        return res.data
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    //////////////////////////////SETITIS//////////////////////////////////
    async EnviarFua(IdCuentaAtencion) {
        let respuesta = {
            login: null,
            envio: null,
            consulta: null
        }
        let formData = new FormData();
        formData.append("IdCuentaAtencion", IdCuentaAtencion)
        formData.append("jsonP", jsonPrueba)
        //formData.append("Estado", Estado)
        Cargando(1);
        return HttpClient.Post('/IntegracionSetisis/EnviarFua', formData)
            .then(res => {
                Cargando(0);
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (!isEmpty(res.data)) {
                        console.log(res.data);
                        console.log(res.data2);
                        respuesta.login = res.data;
                        respuesta.envio = res.data2;
                        respuesta.consulta = res.data3;
                        
                        return respuesta
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    return null
                }
            })
            .catch(e => {
                Cargando(0);
                alerta(3, 'Error: ' + e)
            })
    },
    ///////////////////////////////////////////////////////////////////////

    InitDatablesAtencionesFUA: () => {

        var parms = {
            "paging": true,
            "ordering": false,
            "info": true,
            "scrollX": true,
            "scrolly": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "fua",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "afiliacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "contratoAsegurado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "documentoIdentidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 5,
                    data: "apellidosNombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 6,
                    data: "fechaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 7,
                    data: "fuaCodigoPrestacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 8,
                    data: "cabDniUsuarioRegistra",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '5%',
                    targets: 9,
                    data: "descripcionEstadoEnvio",
                    createdCell: async function (td, cellData, rowData, row, col) {
                        //$(td).attr('align', 'left')
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.estadoEnvio == 0) {
                            btnImprimeSinF = `<span class="chip info">Pendiente</span>`
                        }

                        if (rowData.estadoEnvio == 2) {
                            btnImprimeSinF = `<span class="chip danger">Observado</span>`
                        }

                        if (rowData.estadoEnvio == 1) {
                            btnImprimeSinF = `<span class="chip success">Migrado</span>`
                        }

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '5%',
                    targets: 9,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        //if (rowData.estadoEnvio == 0) {
                        //    btnImprimeSinF = `<button class="MarcarFuaObservado btn btn-sm btn-danger" title="Marcar FUA como observado" style="margin: 2px;"><i class="fas fa-exclamation-circle"></i> </button>`
                        //}

                        //if (rowData.estadoEnvio == 2) {
                        //    btnImprimeSinF = `<button class="AnularObservacion btn btn-sm btn-success" title="Anular observación" style="margin: 2px;"><i class="fas fa-check"></i></button>`
                        //}

                        //if (rowData.estadoEnvio == 1) {
                        //    btnImprimeSinF = `<button class="CorregirFuaMigrado btn btn-sm btn-primary" title="Cambiar estado "Migrado" para corregir FUA" style="margin: 2px;"><i class="fa-solid fa-pen"></i></button>`
                        //}

                        //if (rowData.estadoEnvio == 1) {
                            btnImprimeSinF = `<button class="MigrarFua btn btn-sm btn-indigo" title="Enviar FUA" style="margin: 2px;"><i class="fa-solid fa-send"></i></button>`
                        //}
                       

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },

            ]

        }

        var tableWrapper = $('#tblAtencionFUA'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesFUA = $("#tblAtencionFUA").dataTable(parms);

    },

    Events() {
        $('#btnMigrar').on('click', function () {
            Sis.GenerarIntegracionSoaSis()
        })
        $('#btnMigrarPorFechas').on('click', async function () {
            /*Sis.GenerarIntegracionSoaSisPorFechas()*/

            Cargando(1)

            let cabeceraEnvio = await Sis.GenerarNumeroEnvioNombrePaquete($('#cboMesProduccion').val(), $('#cboAnioProduccion').val())

            Sis.nombrePaquete = cabeceraEnvio.nombrePaquete
            Sis.nroEnvio = cabeceraEnvio.nroEnvio

            console.log('cabeceraEnvio', Sis.nombrePaquete, Sis.nroEnvio)

            //await $('#tblAtencionFUA tbody tr').each(async function (index, obj) {
            //    let checkBox = $(obj).find('td .check__toggle .toggle .fuasMigrar')
            //    let row = oTable_atencionesFUA.fnGetData(index);

            //    if (checkBox.prop('checked')) {

            //        console.log('row', row)

            //        let cuentaAgregada = await Sis.InsertarATESOASISBK(row.idCuentaAtencion, row.fuaDisa, row.fuaLote, row.fuaNumero, $('#cboAnioProduccion').val(), $('#cboMesProduccion').val(), Sis.nroEnvio, 0, Sis.nombrePaquete)
            //        console.log('cuentaAgregada', cuentaAgregada.table[0].idCuentaAtencion)

            //    } else {
            //        let cuentaAgregada = await Sis.InsertarATESOASISBK(row.idCuentaAtencion, row.fuaDisa, row.fuaLote, row.fuaNumero, $('#cboAnioProduccion').val(), $('#cboMesProduccion').val(), Sis.nroEnvio, 2, Sis.nombrePaquete)
            //        console.log('cuentaAgregada', cuentaAgregada.table[0].idCuentaAtencion)
            //    }
            //});

            let migracionSis = await Sis.MigracionSOASIS($('#txtFechaFuaInicio').val(), $('#txtFechaFuaFin').val(), $('#cboFuaUPS').val(), Sis.nroEnvio, Sis.nombrePaquete, $('#cboMesProduccion').val(), $('#cboAnioProduccion').val())

            if (!isEmpty(migracionSis)) {

                alerta(1, 'Paquete migrado con exito')

                //if (migracionSis.resultado.codigo == 0) {
                //    alerta(1, 'Paquete migrado con exito')
                //} else {
                //    alerta(2, 'Paquete con errores de datos')
                //}

                //$('#txtPaquete').val(migracionSis.resultado.paqueteNombre)
                //$('#txtRespuesta').val(migracionSis.resultado.codigo + ' - ' + (isEmpty(migracionSis.resultado.respuesta) ? 'Registro exitoso' : migracionSis.resultado.respuesta))

                $('#txtRespuesta').val('El paquete se generó correctamente')
                console.log('migracionSis', migracionSis)

                Cargando(0)
            } else {
                alerta(2, 'Problemas al generar el paquete, vuleve a intentarlo')
                Cargando(0)
            }
        })
        $('#btnMarcarEnviado').on('click', async function () {
            Cargando(1)

            let atenciones = await Sis.ActualizarFuasAEstadoMigrado($('#txtFechaFuaInicio').val(), $('#txtFechaFuaFin').val(), $('#cboFuaUPS').val())
            $('#btnBuscarAtencionesFUA').click()

            Cargando(0)
            /*Sis.GenerarIntegracionSoaSisPorFechas()*/

            //Cargando(1)

            //$('#tblAtencionFUA tbody tr').each(async function (index, obj) {

            //    let checkBox = $(obj).find('td .check__toggle .toggle .fuasMigrar')

            //    if (checkBox.prop('checked')) {
            //        let row = oTable_atencionesFUA.fnGetData(index);
            //        let cuentaAgregada = await Sis.ActualizarEstadoATESOASISBK(row.idCuentaAtencion, 1)
            //        //console.log('cuentaAgregada', cuentaAgregada.table[0].idCuentaAtencion)
            //        console.log('cuentaAgregada', cuentaAgregada)
            //    }

            //});

            //setTimeout(async function () {

            //    $('#btnBuscarAtencionesFUA').click()
            //    Cargando(0)

            //}, 1000)

        })

        $('#btnBuscarAtencionesFUA').on('click', async function () {
            Cargando(1)

            let atenciones = await Sis.ListarAtencionesFuaParaMigracion($('#txtFechaFuaInicio').val(), $('#txtFechaFuaFin').val(), $('#cboFuaUPS').val())

            oTable_atencionesFUA.fnClearTable()
            if (atenciones.length > 0) {
                oTable_atencionesFUA.fnAddData(atenciones)
            }

            Cargando(0)
        })

        $('#tblAtencionFUA tbody').on('click', '.MarcarFuaObservado', async function () {
            var objrow = oTable_atencionesFUA.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesFUA.fnGetData(objrow);

            Cargando(1)
            let cuentaAgregada = await Sis.ActualizarEstadoATESOASISBK(row.idCuentaAtencion, 2)
            $('#btnBuscarAtencionesFUA').click()
            Cargando(0)
        });

        $('#tblAtencionFUA tbody').on('click', '.AnularObservacion', async function () {
            var objrow = oTable_atencionesFUA.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesFUA.fnGetData(objrow);

            Cargando(1)
            let cuentaAgregada = await Sis.ActualizarEstadoATESOASISBK(row.idCuentaAtencion, 0)
            $('#btnBuscarAtencionesFUA').click()
            Cargando(0)
        });

        $('#tblAtencionFUA tbody').on('click', '.CorregirFuaMigrado', async function () {
            var objrow = oTable_atencionesFUA.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesFUA.fnGetData(objrow);

            swal({
                title: 'Cuidado',
                text: "¿Estas seguro de cambiar el estado del FUA 'Migrado'?",
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            }).then(async (res) => {

                if (res) {
                    Cargando(1)
                    let cuentaAgregada = await Sis.ActualizarEstadoATESOASISBK(row.idCuentaAtencion, 0)
                    $('#btnBuscarAtencionesFUA').click()
                    Cargando(0)
                }
            })

        });

        $('#tblAtencionFUA tbody').on('click', '.MigrarFua', async function () {
            var objrow = oTable_atencionesFUA.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesFUA.fnGetData(objrow);

            swal({
                title: '',
                text: "¿Esta seguro de enviar el FUA?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true
            }).then(async (res) => {

                if (res) {
                    Cargando(1)
                    let fua = await Sis.EnviarFua(row.idCuentaAtencion);
                    $("#txtRespuesta").val(JSON.stringify(fua.login));
                    $("#txtRespuestaToken").val(fua.login.data.token);
                    $("#txtRespuestaEnvio").val(JSON.stringify(fua.envio));
                    $("#txtRespuestaConsulta").val(JSON.stringify(fua.consulta));
                    //$('#btnBuscarAtencionesFUA').click()
                    Cargando(0)
                }
            })

        });


        
    }
}

function GenerarAnios() {
    for (let i = 2020; i < 2150; i++) {
        Sis.anios.push(i)
    }
}

$(document).ready(function () {

    Sis.Plugins()
    Sis.CargaInicial()

    Sis.ListarServiciosParaFUA()


    Sis.CompletarComboFechaEnvio()
    Sis.CompletarComboFechaProduccion()

    Sis.InitDatablesAtencionesFUA()

    Sis.Events()
});




var jsonPrueba = '{"atencion":[{"idAtencion":"865229","loteFua":"24","nroFua":"00191691","renipress":"00006208","idCategoria":"05","nivel":"2","idPuntoDigitacion":"0","idComponente":null,"idDisaAsegurado":"350","idLoteAsegurado":"24","idCorrelativoAsegurado":"00191691","idSecuenciaAsegurado":"02","idTablaAsegurado":"2","idContratoAsegurado":"46514389","idPlan":null,"idGrupoPoblacional":null,"idTipoDocAsegurado":"1","numDocAsegurado":"007414017","apePaterno":"RAMIREZ","apeMaterno":"NAVAS","nombres":"LISSETTE","fecNac":"1954-11-17T00:00:00.000Z","idSexo":"0","idUbigeo":"150117","historiaClinica":"80648145","idTipoAtencion":"2","idCondicionMaterna":"0","idModalidadAtencion":"1","nroAutorizacion":null,"montoAutorizado":"1","fecHoraAtencion":"2024-12-22T14:37:35.1234567Z","renipressReferencia":"00006133","nroHojaReferencia":"6133-02453","idServicio":"056","idOrigenPersonal":"1","idLugarAtencion":"1","idDestinoAsegurado":"2","fecIngresoHospitalizacion":null,"fecAltaHospitalizacion":null,"renipressContraReferencia":null,"nroHojaContraReferencia":null,"fecParto":null,"idGrupoRiesgo":null,"fecFallecimiento":null,"renipressOfertaFlexible":null,"idEtnia":"80","idIafas":null,"idCodigoIafas":null,"idUps":null,"fecCorteAdministrativo":null,"idUdrAutorizaVinculado":null,"loteAutorizaVinculado":null,"nroAutorizaVinculado":null,"disaFuaVinculado":null,"loteFuaVinculado":null,"nroFuaVinculado":null,"idTipoDocRespAte":"1","numDocRespAte":"43569704","idTipoPersonalSalud":"01","idEspecialidadRespAte":null,"esEgresadoRespAte":"0","colegiaturaRespAte":"061478","rneRespAte":null,"idTipoDocDigitador":"1","numDocDigitador":"43569704","fecHoraRegistro":"2024-12-22T00:00:00.000Z","observacion":null,"versionAplicativo":"000000000","codigoAcreditacion":null,"fecHoraIniFuaAdm":null,"fecHoraFinFuaAdm":null,"idMotivoIngresoCasaMaterna":null,"idCasaMaterna":null,"idEstado":null,"esObservado":null,"control":{"idControl":"C1","idProceso":1,"fecHoraCrea":"2024-12-22T00:00:00.000Z","idUsuarioCrea":1,"observacion":"-"},"atDiagnosticos":[{"codigo":"R13X","nroDiagnostico":"1","tipoMovimiento":"I","tipoDiagnostico":"1"}],"atInsumos":[{"codigo":"I01","nroDiagnostico":"100","cantPrescrita":1,"cantEntregada":1,"lote":"24","nroSerie":"S001","registroSanitario":"R001","fecVencimiento":"2024-12-22","contieneOtrosDatos":"N"}],"atMedicamentos":[{"codigo":"01248","nroDiagnostico":"1","cantPrescrita":"2","cantEntregada":"2","fecPetitorio":"2024-12-22T14:48:35.1234567Z","nroDocPetitorio":"-","lote":"-","nroSerie":"-","registroSanitario":"-","fecVencimiento":"-","contieneOtrosDatos":"N"}],"atProcedimientos":[{"codigo":"99203","nroDiagnostico":"1","cantPrescrita":"1","cantEntregada":"1","resultado":"-"}],"atRecienNacidos":[{"nroRN":"00001","tipoDocumento":"1","nroDocumento":"72146918","disaAfiliacion":"001","formatoContratoAfil":"02","nroContratoAfil":"001","secuenciaContAfil":"03","apePaterno":"PEREZ","apeMaterno":"QUISPE","primerNombre":"JUAN","segundoNombre":null,"identificadorRegAfil":100,"identificadorTabla":"2"}],"atServAdicionales":[{"codigo":"1"}],"atServMatInfantiles":[{"codigo":"1","resultado":"-"}],"atTransportes":[{"codigo":1000,"nroPasajeros":1,"cantidad":1,"precio":10,"total":10}],"atViaticos":[{"codigo":1000,"nroDias":1,"nroComisionados":1,"total":10}],"atOtrosGastos":[{"codigo":1000,"cantidad":1,"nroDias":1,"precio":10,"total":10}]}]}'