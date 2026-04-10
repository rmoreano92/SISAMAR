let Sis = {
    meses: [
        { idMes: 1, descripcion: 'Enero' }, { idMes: 2, descripcion: 'Febrero' }, { idMes: 3, descripcion: 'Marzo' }, { idMes: 4, descripcion: 'Abril' }, { idMes: 5, descripcion: 'Mayo' },
        { idMes: 6, descripcion: 'Junio' }, { idMes: 7, descripcion: 'Julio' }, { idMes: 8, descripcion: 'Agosto' }, { idMes: 9, descripcion: 'Setiembre' }, { idMes: 10, descripcion: 'Octubre' },
        { idMes: 11, descripcion: 'Noviembre' }, { idMes: 12, descripcion: 'Diciembre' }
    ],
    anios: [],

    nombrePaquete: '',
    nroEnvio: '',
    InitDatablesAtencionesFUA: () => {

        var parms = {
            "paging": true,
            "ordering": false,
            "info": true,
            "scrollX": true,
            "scrollY": "300px",
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

                        if (rowData.estadoEnvio == 0) {
                            btnImprimeSinF = `<button class="MarcarFuaObservado btn btn-sm btn-danger" title="Marcar FUA como observado" style="margin: 2px;"><i class="fas fa-exclamation-circle"></i> </button>`
                        }

                        if (rowData.estadoEnvio == 2) {
                            btnImprimeSinF = `<button class="AnularObservacion btn btn-sm btn-success" title="Anular observación" style="margin: 2px;"><i class="fas fa-check"></i></button>`
                        }

                        if (rowData.estadoEnvio == 1) {
                            btnImprimeSinF = `<button class="CorregirFuaMigrado btn btn-sm btn-primary" title="Cambiar estado "Migrado" para corregir FUA" style="margin: 2px;"><i class="fa-solid fa-pen"></i></button>`
                        }
                        //if (rowData.estadoEnvio == 1) {
                        //    btnImprimeSinF = `<span class="chip success">Migrado</span>`
                        //} else if (rowData.estadoEnvio == 2) {
                        //    btnImprimeSinF = `
                        //        <div class="check__toggle">
                        //            <label class="toggle">
                        //                <input class="toggle__input toggle__input fuasMigrar" type="checkbox">
                        //                <span class="toggle__label mr-1">
                        //                    <span class="toggle__text"></span>
                        //                </span>
                        //            </label>
                        //        </div>
                        //    `
                        //} else { 
                        //    btnImprimeSinF = `
                        //        <div class="check__toggle">
                        //            <label class="toggle">
                        //                <input class="toggle__input toggle__input fuasMigrar" type="checkbox" checked>
                        //                <span class="toggle__label mr-1">
                        //                    <span class="toggle__text"></span>
                        //                </span>
                        //            </label>
                        //        </div>
                        //    `
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
    InitDatablesListaPaquetesSis: () => {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            "scrollY": "300px",
            columns: [
                {
                    width: '45%',
                    targets: 0,
                    data: "nomPaquete",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "anio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "mes",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "cantFilATE",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "cantFilSMI",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "cantFilDIA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "cantFilMED",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "cantFilINS",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "cantFilPRO",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: "cantFilSER",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "cantFilRN",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btn = "";

                        btn = '<button class="btnValidarPaquete btn btn-sm btn-success glow_button" title="" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-check"></i> </button>';


                        $(td).html(btn);
                    }
                }

            ]

        }

        var tableWrapper = $('#tblListaPaquetesSis'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Paquetes = $("#tblListaPaquetesSis").dataTable(parms);

    },

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#tblAnexos').DataTable({
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

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

    CargaInicial: async () => {
        let dt = new Date();
        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        var dia = dt.getDate()
        var mes = parseInt(dt.getMonth()) + 1
        var yyy = dt.getFullYear()

        await GenerarAnios()

        $('#cboMesProduccion').val(mes)
        $('#cboAnioProduccion').val(yyy)

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

    MigracionSOASIS_3010: async function(FechaInicio, FechaFin, FuaUPS, numeroEnvio, nombrePaquete, mesProduccion, anioProduccion) {

        let fileName = ''
        var formData = new FormData();
        formData.append("FECHAINICIO", FechaInicio)
        formData.append("FECHAFIN", FechaFin)
        formData.append("fuaUPS", FuaUPS)
        formData.append('numeroEnvio', numeroEnvio)
        formData.append('nombrePaquete', nombrePaquete)
        formData.append('mesProduccion', mesProduccion)
        formData.append('anioProduccion', anioProduccion)

        let resp = await HttpClient.Post('/IntegracionSoaSis/MigracionSOASIS_3010', formData)

        if (isEmpty(resp.data) || resp.data == "") {
            alerta2(2, 'Hubo un error al generar el paquete')
            return false
        }

        formData = new FormData();
        formData.append("fileName", resp.data.value.nombrePaquete)
        resp = await HttpClient.Post('/IntegracionSetisis/MigraPaqueteSetiSIS', formData)
        console.log('resp', resp)


        return resp

        //return fetch('', {
        //    method: 'POST',
        //    body: formData
        //})
        //    .then(response => {
        //        if (!response.ok) {
        //            throw new Error('Error al obtener el archivo.');
        //        }

        //        const contentDisposition = response.headers.get('Content-Disposition');

        //        const matches = contentDisposition.split(';')

        //        fileName = matches[1].substring(10, 50)

        //        $('#txtPaquete').val(fileName)

        //        return response.blob();
        //    })
        //    .then(blob => {

                
        //        // Crear URL para el blob
        //        var url = window.URL.createObjectURL(blob);
        //        // Crear un enlace <a> para descargar el archivo
        //        var a = document.createElement('a');
        //        a.href = url;
        //        a.download = fileName;
        //        // Simular clic en el enlace para iniciar la descarga
        //        document.body.appendChild(a);
        //        a.click();
        //        // Limpiar la URL del objeto blob para liberar memoria
        //        window.URL.revokeObjectURL(url);

        //        return true
        //    })
        //    .catch(error => {
        //        console.error(error);
        //        alert(error.message);
        //    });

        //return HttpClient.Post('/IntegracionSoaSis/MigracionSOASIS?area=Sis', formData).then(res => {
        //    if (res.estado) {
        //        return res.data.value
        //    } else {op
        //        alerta(2, res.msg)
        //        return null
        //    }


        //})
    },
    ConsultarPaqueteSetiSIS: async function (fileName) {

        var formData = new FormData();
        formData.append("fileName", fileName)

        let resp = await HttpClient.Post('/IntegracionSetisis/ConsultarPaqueteSetiSIS', formData)

        //if (isEmpty(resp.data) || resp.data == "") {
        //    alerta2(2, 'Hubo un error al generar el paquete')
        //    return false
        //}

        return resp

        //return fetch('', {
        //    method: 'POST',
        //    body: formData
        //})
        //    .then(response => {
        //        if (!response.ok) {
        //            throw new Error('Error al obtener el archivo.');
        //        }

        //        const contentDisposition = response.headers.get('Content-Disposition');

        //        const matches = contentDisposition.split(';')

        //        fileName = matches[1].substring(10, 50)

        //        $('#txtPaquete').val(fileName)

        //        return response.blob();
        //    })
        //    .then(blob => {

                
        //        // Crear URL para el blob
        //        var url = window.URL.createObjectURL(blob);
        //        // Crear un enlace <a> para descargar el archivo
        //        var a = document.createElement('a');
        //        a.href = url;
        //        a.download = fileName;
        //        // Simular clic en el enlace para iniciar la descarga
        //        document.body.appendChild(a);
        //        a.click();
        //        // Limpiar la URL del objeto blob para liberar memoria
        //        window.URL.revokeObjectURL(url);

        //        return true
        //    })
        //    .catch(error => {
        //        console.error(error);
        //        alert(error.message);
        //    });

        //return HttpClient.Post('/IntegracionSoaSis/MigracionSOASIS?area=Sis', formData).then(res => {
        //    if (res.estado) {
        //        return res.data.value
        //    } else {
        //        alerta(2, res.msg)
        //        return null
        //    }


        //})
    },
    ListarPaquetesMigradosSis: async function () {
        


        let response = await HttpClient.Get(`/IntegracionSoaSis/ListarPaquetesMigradosSis`)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        
        
        $('.chzn-select').chosen().trigger("chosen:updated");

        return data
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

    GenerarNumeroEnvioNombrePaquetev2: function (mesProduccion, anioProduccion) {
        let formData = new FormData();
        formData.append("mesProduccion", mesProduccion)
        formData.append("anioProduccion", anioProduccion)

        return HttpClient.Post('/IntegracionSoaSis/GenerarNumeroEnvioNombrePaquetev2', formData)
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

    GenerarReporteErrores: async function (NombrePaquete, Tipo, jsonData) {

        let formData = new FormData();

        formData.append('NombrePaquete', NombrePaquete);
        formData.append('Tipo', Tipo);
        formData.append('jsonData', JSON.stringify(jsonData));

        
        const res = await HttpClient.Post('/IntegracionSoaSis/GenerarReporteErrores?area=Comun', formData);

        if (!res.success) {
            alerta2('error', '', res.statusText)
            return
        }

        let data = res.data.table1[0]

        console.log('data', data)

        if (data.successNumber == 1) {
            alerta2('success', '', data.successMessage)

            return res.data.table

        } else {
            alerta2('error', '', data.errorMessage)

            return null
        }
    },
    ActualizarEstadoSisFuaResumen: async function (NombrePaquete) {

        let formData = new FormData();

        formData.append('NombrePaquete', NombrePaquete);

        
        const res = await HttpClient.Post('/IntegracionSoaSis/ActualizarEstadoSisFuaResumen?area=Comun', formData);

        //if (!res.success) {
        //    alerta2('error', '', res.statusText)
        //    return
        //}

        //let data = res.data.table1[0]

        //console.log('data', data)

        //if (data.successNumber == 1) {
        //    alerta2('success', '', data.successMessage)

        //    return res.data.table

        //} else {
        //    alerta2('error', '', data.errorMessage)

        //    return null
        //}
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


            let migracionSis = await Sis.MigracionSOASIS($('#txtFechaFuaInicio').val(), $('#txtFechaFuaFin').val(), $('#cboFuaUPS').val(), Sis.nroEnvio, Sis.nombrePaquete, $('#cboMesProduccion').val(), $('#cboAnioProduccion').val())

            if (!isEmpty(migracionSis)) {

                alerta(1, 'Paquete migrado con exito')

                $('#txtRespuesta').val('El paquete se generó correctamente')
                console.log('migracionSis', migracionSis)

                Cargando(0)
            } else {
                alerta(2, 'Problemas al generar el paquete, vuleve a intentarlo')
                Cargando(0)
            }
        })
        $('#btnMigrarPorFechasV2').on('click', async function () {
            /*Sis.GenerarIntegracionSoaSisPorFechas()*/

            Cargando(1)

            let cabeceraEnvio = await Sis.GenerarNumeroEnvioNombrePaquetev2($('#cboMesProduccion').val(), $('#cboAnioProduccion').val())

            Sis.nombrePaquete = cabeceraEnvio.nombrePaquete
            Sis.nroEnvio = cabeceraEnvio.nroEnvio

            console.log('cabeceraEnvio', Sis.nombrePaquete, Sis.nroEnvio)

            try {
                let migracionSis = await Sis.MigracionSOASIS_3010($('#txtFechaFuaInicio').val(), $('#txtFechaFuaFin').val(), $('#cboFuaUPS').val(), Sis.nroEnvio, Sis.nombrePaquete, $('#cboMesProduccion').val(), $('#cboAnioProduccion').val())

                if (!isEmpty(migracionSis)) {

                    alerta(1, 'Paquete migrado con exito')

                    //$('#txtPaquete').val(migracionSis.paquete)



                    if (migracionSis.jsonPaquete.estado != 'ok') {
                        const correctedText = migracionSis.jsonPaquete.mensaje.replace(/'/g, '"');
                        let datos = JSON.parse(correctedText)

                        const erroresPlano = datos.errores.map(e => {
                            return {
                                id: e.id,
                                error: e.errores.join("; ")
                            };
                        });


                        let erroresSetiSis = await Sis.GenerarReporteErrores(cabeceraEnvio.nombrePaquete, 1, erroresPlano)

                        if (!isEmpty(erroresSetiSis)) {
                            const hoja = XLSX.utils.json_to_sheet(erroresSetiSis);
                            const libro = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(libro, hoja, "Errores");
                            XLSX.writeFile(libro, "errores.xlsx");

                            console.log('migracionSis', JSON.parse(correctedText))

                            alerta2('warning', `Paquete: ${migracionSis.paquete}`, 'El paquete tiene observaciones, por favor verifica el archivo excel')
                            //$('#txtRespuesta').val('El paquete tiene observaciones, por favor verifica el archivo excel ')
                        }

                        
                    } else {
                        //$('#txtRespuesta').val('El paquete se generó correctamente ')
                        alerta2('success', `Paquete: ${migracionSis.paquete}`, 'El paquete se generó correctamente')

                        await Sis.ActualizarEstadoSisFuaResumen(cabeceraEnvio.nombrePaquete) 
                    }


                    Cargando(0)
                } else {
                    //alerta(2, 'Problemas al generar el paquete, vuleve a intentarlo')
                    alerta2('error', `Paquete: ${migracionSis.paquete}`, 'Problemas al generar el paquete, vuleve a intentarlo')
                    Cargando(0)
                }
            } catch (e) {
                alerta2('error', ``, 'Problemas al generar el paquete, vuleve a intentarlo')
                console.log('Error: ' + e)
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
        $('#btnActualizarListaFuas').on('click', async function () {
            Cargando(1)

            let atenciones = await Sis.ListarPaquetesMigradosSis()

            oTable_Paquetes.fnClearTable()
            if (atenciones.length > 0) {
                oTable_Paquetes.fnAddData(atenciones)
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

        $('#tblListaPaquetesSis tbody').on('click', '.btnValidarPaquete', async function () {
            var objrow = oTable_Paquetes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_Paquetes.fnGetData(objrow);

            Cargando(1)
            let paquete = await Sis.ConsultarPaqueteSetiSIS(row.nombrePaquete)

            if (paquete?.jsonPaquete?.procesado == 'false') {
                alerta2('warning', '', 'Este paquete no fue migrado')
                Cargando(0)
                return
            }

            let proceso = paquete?.jsonPaquete?.data?.proceso
            let carga = paquete?.jsonPaquete?.data?.carga
            let msg = `
                        Paquete: ${paquete.paquete} <br> 
                        Estado: ${proceso.descripcion} (${proceso.estado})
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
                            <tbody>
                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">consolidada</th>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">observada</th>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">produccion</th>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">recepcionada</th>
                            </tr>
                            <tr>
                                <td style=""> ${carga?.consolidada}</td>
                                <td style=""> ${carga?.observada}</td>
                                <td style=""> ${carga?.produccion}</td>
                                <td style=""> ${carga?.recepcionada}</td>
                            </tr>
                            </tbody>
                        </table>`
            //for (obj of paquete.)
            if (proceso.codigo == 5 && proceso.estado == 'Completado') {
                Cargando(0)
                let descargar = await alertaAsync('question', '¿Descargar observaciones?', msg)

                if (descargar) {
                    Cargando(1)
                    let datos = paquete.jsonPaquete.data

                    const erroresPlano = datos.observaciones.map(e => {
                        return {
                            fua: e.fua,
                            error: e.errores.join("; ")
                        };
                    });

                    let erroresSetiSis = await Sis.GenerarReporteErrores(row.nombrePaquete, 2, erroresPlano)

                    if (!isEmpty(erroresSetiSis)) {
                        const hoja = XLSX.utils.json_to_sheet(erroresSetiSis);
                        const libro = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(libro, hoja, "Errores");
                        XLSX.writeFile(libro, "errores.xlsx");

                        console.log('migracionSis', JSON.parse(correctedText))

                        alerta2('warning', `Paquete: ${migracionSis.paquete}`, 'El paquete tiene observaciones, por favor verifica el archivo excel')
                        //$('#txtRespuesta').val('El paquete tiene observaciones, por favor verifica el archivo excel ')
                    }
                    Cargando(0)
                }
            } else {
                alerta2('success', 'Correcto', msg)
            }
            
            console.log('paquete', paquete)

            Cargando(0)

        });

        $('#btnAbrirModalPaquete').on('click', function () {
            $('#modalRegistroPaquetes').modal('show')
        })
        $('#btnCerrarModalPaquete').on('click', function () {
            $('#modalRegistroPaquetes').modal('hide')
        })
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
    Sis.InitDatablesListaPaquetesSis()

    Sis.Events()
});
