var ObjtableHospitalizadosRn;
var FechaDia;
var FechaTemp;
var idAccion;
var gemelar = [];
var medobsenf = [];
var proferesp = 0;
var accion = '';
var LibroNacimiento = {
    IdRegistroRn: 0,
    IdCuentaAtencion: 0,
    IdPaciente: 0,
    NacidoEn: 0,
    Tabla: '',
    //accion: '',

    InicializarComponentesEvaluacionRn() {
        //$('#modalRegistroRN').modal({ backdrop: 'static', keyboard: false });
        //$('#modalRegistroRN').modal('hide');

        //$('#rdbTardioNO').prop('checked', true);
        //$('#rdbLacthoraNO').prop('checked', true);

        //$(".chzn-select").chosen({ placeholder_text_single: 'Seleccione una opción', allow_single_deselect: true });
        //$(".chzn-select-deselect").chosen({ placeholder_text_single: 'Seleccione una opción', allow_single_deselect: true });

        //Cargando(0);
    },

    InitPlugin() {
        $('#txtFechaNacimientoRn, #txtFechaFiltro').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraNacimientoRn").mask("Hn:Nn");

        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        $('#txtFechaFiltro').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

       

        $(".chzn-select").chosen({ allow_single_deselect: true });
    },

    InitDataTableRecienNacidos() {
        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            bFilter: false,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "nroLibro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "nroFolio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "nroAnio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "nroMes",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '5%',
                //    targets: 1,
                //    data: "nroDocumento",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    width: '6%',
                    targets: 1,
                    data: "fecNac",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 1,
                    data: "sexo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 1,
                    data: "docMadre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "madre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "padre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

            ]

        }

        var tableWrapper = $('#lstRnHospitalizados'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        ObjtableHospitalizadosRn = $("#lstRnHospitalizados").dataTable(parms);
    },

    InitDataTablePacientes() {
        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            bFilter: false,
            responsive: true,
            columns: [
                {
                    targets: 1,
                    width: '5%',
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

                {
                    targets: 3,
                    width: '10%',
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 6,
                    width: '5%',
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    targets: 7,
                //    width: '20%',
                //    data: "tipoServicio",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    targets: 8,
                //    width: '20%',
                //    data: "servicioIngreso",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    argets: 9,
                //    width: '5%',
                //    data: "fechaIngreso",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    argets: 10,
                //    width: '5%',
                //    data: "fechaEgreso",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //}
            ]
        }

        var tableWrapper = $('#tblPacientes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Pacientes = $("#tblPacientes").dataTable(parms);
    },

    LlenarCombos() {
        //var idServicio = $("#idServicio").val();
        //var midata = new FormData();
        //midata.append('idTipoServicio', idServicio);
        var midata = new FormData();
        midata.append('IdTipoServicio', 0);

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaPaises?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboNacionalidadMadre').empty();
                $('#cboNacionalidadPadre').empty();
                $(datos.data.table).each(function (i, obj) {
                    $('#cboNacionalidadMadre').append('<option  value="' + obj.idPais + '">' + obj.nombre + '</option>');
                    $('#cboNacionalidadPadre').append('<option  value="' + obj.idPais + '">' + obj.nombre + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar nacionalidades!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposGestacion?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoGestacion').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoGestacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos gestacion!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarNumeroGemelar?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboNumeroGemelar').empty();
                gemelar = datos.table;
                /*
                $(datos.table).each(function (i, obj) {
                    $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });*/
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar numeros gemelar!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposProcedenciaRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboProcedenciaRn').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProcedenciaRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar numeros gemelar!", "2");
                }, 900)
            }
        });


        $.ajax({
            //async: false,
            cache: false,
            //url: "/RecienNacido/ListarServiciosNacimiento?area=Hospitalizacion",
            url: "/Utilitario/ListarServicioPorTipoServicio?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboServicioNacimiento').empty();
                $('#cboServicioNacimiento').append('<option value=""></option>');
                $(datos.respuesta.table).each(function (i, obj) {
                    $('#cboServicioNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar numeros gemelar!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarRiesgosObstetricos?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboRiesgo').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboRiesgo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar riesgo obstetrico!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarCondicionRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboCondicion').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCondicion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar condición!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarContactoPielaPiel?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboContactoPiel').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboContactoPiel').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar Contacto piel a piel!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarMedicosObstetrasEnfermeras?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboProfResponsable').empty();
                medobsenf = datos.table;
                /*$(datos.table).each(function (i, obj) {
                    $('#cboProfResponsable').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });*/
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar profesionales responsables!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarTipoPartoRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoParto').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoParto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos parto!", "2");
                }, 900)
            }

        });
        //CARGA COMBOS UBIGEO/////////////////////////////////////////////////////////
        //cboDepartamentoDomicilio
        //cboProvinciaDomicilio
        //cboDistritoDomicilio



        cargarCombo('/Utilitario/ListaDepartamentosSeleccionarPorIdPais?area=Comun',
            'cboDepartamentoDomicilio',
            'Seleccione una opción',
            'idDepartamento',
            'nombre',
            {'idPais': 166},
            '');
        $('#cboProvinciaDomicilio').empty();
        $('#cboDistritoDomicilio').empty();

        //cargarCombo('/Utilitario/ListaProvinciasByDepartamentos?area=Comun',
        //    'cboProvinciaDomicilio',
        //    'Seleccione una opción',
        //    'id',
        //    'nombre',
        //    {},
        //    '');

        //cargarCombo('/Utilitario/ListaDistritosByProvincia?area=Comun',
        //    'cboDistritoDomicilio',
        //    'Seleccione una opción',
        //    'id',
        //    'nombre',
        //    {},
        //    '');

        //////////////////KHOYOSI////////////////////////////////////
        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposDocumentos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoDocumento').empty();
                $('#cboTipoDocMadre').empty();
                $(datos.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocumento').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                    $('#cboTipoDocMadre').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos documentos!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboSexo').empty();
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos sexo!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposEstadoCivilTodos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboEstadoCivilMadre').empty();
                $(datos.lsEstadoCivil.table).each(function (i, obj) {
                    $('#cboEstadoCivilMadre').append('<option  value="' + obj.idEstadoCivil + '">' + obj.dCorto + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos estado civil!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/TiposGradoInstruccionTodos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboGradoInstruccionMadre').empty();
                $(datos.lsGradosIns.table).each(function (i, obj) {
                    $('#cboGradoInstruccionMadre').append('<option  value="' + obj.idGradoInstruccion + '">' + obj.dCorto + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos grados instruccion!", "2");
                }, 900)
            }
        });
        //////////////////KHOYOSI////////////////////////////////////

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },

    ListarPacientesRegistroRN() {
        //var Recurso
        //Recurso = $("#lstRnHospitalizados").data('source');
        Cargando(1);
        var midata = new FormData();

        midata.append('NroLibro', $("#txtLibroFiltro").val());
        midata.append('NroFolio', $("#txtFolioFiltro").val());
        midata.append('NroAnio', $("#txtAnioFiltro").val());
        midata.append('NroMes', $("#txtMesFiltro").val());
        midata.append('NroHistoriaMadre', $("#txtNroHistoriaMadreFiltro").val());
        midata.append('ApPaternoMadre', $("#txtApPaternoMadreFiltro").val());
        midata.append('FechaNacimiento', $("#txtFechaFiltro").val());
                
        $.ajax({
            method: "POST",
            url: "/LibroNacimiento/ListarPacientesRegistroLibroNacimiento?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                Cargando(0)
                ObjtableHospitalizadosRn.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtableHospitalizadosRn.fnAddData(datos.table);
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    Eventos() {


        //$('#cboDepartamentoDomicilio').on('change', function () {
        //    $('#cboProvinciaDomicilio').empty();
        //    $('#cboDistritoDomicilio').empty();

        //});


        $('#cboDepartamentoDomicilio').on('change', function () {
            const valor = $(this).val();
            const texto = $(this).find('option:selected').text();

            console.log('Se seleccionó el valor:', valor);
            console.log('Texto visible:', texto);

                $('#cboProvinciaDomicilio').empty();
                $('#cboDistritoDomicilio').empty();

                $('#cboProvinciaDomicilio').trigger("chosen:updated");
                $('#cboDistritoDomicilio').trigger("chosen:updated");


            cargarCombo('/Utilitario/ListaProvinciasByDepartamentos?area=Comun',
                'cboProvinciaDomicilio',
                'Seleccione una opción',
                'idProvincia',
                'nombre',
                { 'idDepartamento': valor },
                '');

        });


        $('#cboProvinciaDomicilio').on('change', function () {
            const valor = $(this).val();
            const texto = $(this).find('option:selected').text();

            console.log('Se seleccionó el valor:', valor);
            console.log('Texto visible:', texto);

            $('#cboDistritoDomicilio').empty();
            $('#cboDistritoDomicilio').trigger("chosen:updated");

            cargarCombo('/Utilitario/ListaDistritosByProvincia?area=Comun',
                'cboDistritoDomicilio',
                'Seleccione una opción',
                'idDistrito',
                'nombre',
                { 'idDProvincia': valor },
                '');

        });





        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnFiltroBuscar").click();
            }
        });

        //$('.search2').keypress(function (e) {
        //    if (e.which == 13) {
        //        e.preventDefault();
        //        $("#btnBuscarPacientes").click();
        //    }
        //});

        $('#lstRnHospitalizados tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtableHospitalizadosRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('input[name=rdbAtendidoPor]').on('change', function () {
            LibroNacimiento.FiltrarProfesionalAtendio();
        });

        $('input[name=rdbPatNeo]').on('change', function () {
            LibroNacimiento.PatNeo_Change();
        });

        $('#cboTipoGestacion').on('change', function () {
            LibroNacimiento.TipoGestacion_Change();
        });

        $('#cboCondicion').on('change', function () {
            LibroNacimiento.Condicion_Change();
        });

        $('#txtNroFetos').on('keyup', function () {
            if ($('#txtNroFetos').val() < 0 || $('#txtNroFetos').val() > 10) {
                alerta(2, "El Nro Fetos no puede ser menor a 0 ni mayor a 10.");
                $('#txtNroFetos').val("");
            }
            LibroNacimiento.Fetos_Change();
        });

        $('#cboTipoReporte').on('change', function () {
            LibroNacimiento.TipoReporte_Change();
        });


        //////////////////BUSQUEDA PACIENTES//////////////////////
        //$('#tblPacientes tbody').on('click', 'tr', function () {
        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        oTable_Pacientes.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //});

        //$('#btnBuscarPacientes').on('click', async function () {
        //    await LibroNacimiento.ListarPacientes();
        //});

        //$('#btnLimpiarPacientes').on('click', function () {
        //    LibroNacimiento.LimpiarBusquedaPacientes();
        //});

        //$('#btnAceptarPaciente').on('click', function () {
        //    LibroNacimiento.AgregarRegistroRn();
        //});

        //$('#btnCancelarPaciente').on('click', function () {
        //    LibroNacimiento.LimpiarBusquedaPacientes();
        //    $("#modalPacienteBusqueda").modal("hide");
        //});

        //////////////////LIBRO NACIMIENTOS//////////////////////
        $('#btnFiltroBuscar').on('click', function () {
            LibroNacimiento.ListarPacientesRegistroRN();
        });

        $('#btnFiltroLimpiar').on('click', function () {
            LibroNacimiento.LimpiarFiltros();
        });

        //////////////////LIBRO NACIMIENTOS//////////////////////
        $('#btnAgregarLibroNacimiento').on('click', function () {
            LibroNacimiento.EjecutarAccion("A");
            LibroNacimiento.AgregarLibroNacimiento();
        });

        $('#btnModificarLibroNacimiento').on('click', function () {
            LibroNacimiento.EjecutarAccion("M");
            LibroNacimiento.CargarDatosLibroNacimiento();
      
            //LibroNacimiento.FetosLista();
        });

        $('#btnEliminarLibroNacimiento').on('click', function () {
            LibroNacimiento.EjecutarAccion("E");
            LibroNacimiento.EliminarLibroNacimiento();
        });

        $('#btnConsultarLibroNacimiento').on('click', function () {
            LibroNacimiento.EjecutarAccion("C");
            LibroNacimiento.CargarDatosLibroNacimiento();
        });

        //////////////////LIBRO NACIMIENTOS//////////////////////
        $('#btnCancelarLibroNacimiento').on('click', function () {
            LibroNacimiento.CancelarLibroNacimiento();
        });

        $('#btnGuardarLibroNacimiento').on('click', function () {
            LibroNacimiento.GuardarLibroNacimiento();
        });


        /////////////EVENTOS CONSUMO EN EL SERVICIO//////////////////////
        //$('#tblCSAtencion tbody').on('click', 'tr', function () {

        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //});

        //$("#modalConsumoServicio").on('hidden.bs.modal', function () {
        //    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
        //    AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //});

        //$('#btnEliminarCSAtencion').on('click', function () {
        //    var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
        //    //ConsumoServicio.eliminar(objrow.idCuentaAtencion)
        //    var objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();

        //    if (isEmpty(objrowConsumoServ)) {
        //        alerta(2, 'Seleccione el procedimiento que desea eliminar.');
        //        return false;
        //    }

        //    if (objrow.idEstadoAtencion == 2) {
        //        alerta('2', 'Verifique el estado de la atencion');
        //        return false;
        //    }
        //    else {
        //        if (objrowConsumoServ.idEstadoFacturacion == 1) {
        //            swal({
        //                title: 'Eliminar',
        //                text: 'Estas seguro de eliminar orden?',
        //                type: 'warning',
        //                showCancelButton: true,
        //                confirmButtonColor: '#4fb7fe',
        //                cancelButtonColor: '#EF6F6C',
        //                confirmButtonText: 'Aceptar'
        //            }).then(function () {

        //                ConsumoServicio.eliminar(objrowConsumoServ.idOrden)
        //                AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //            }).catch(swal.noop);;
        //        }
        //        else {
        //            alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
        //            return false;
        //        }
        //    }

        //});

        //$('#btnActualizaCSAtencion').on('click', function () {
        //    var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
        //    AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //});

        //$('#btnAgregarCSAtencion').on('click', function () {
        //    ConsumoServicio.bloqueoProcedencia();
        //    ConsumoServicio.limpiar();
        //    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
        //    $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
        //    ConsumoServicio.listaPorCuenta(objrow.idCuentaAtencion, 1); // bloquear aqui
        //    $('#modalConsumoServicio').modal('show');
        //});
    },

    ////////////////////////////BUSCAQUEDA PACIENTE////////////////////////////////
    async ListarPacientes() {
        Cargando(1);
        var formData = new FormData
        var respuesta;
        let datos

        if ($("#txtApPaternoBusq").val() != '' || $("#txtApMaternoBusq").val() != '' || $("#txtNroDniBusq").val() != '' || $("#txtNroHistoriaBusq").val() != '') {

            oTable_Pacientes.fnClearTable();

            formData.append("ApellidoPaterno", $("#txtApPaternoBusq").val());
            formData.append("ApellidoMaterno", $("#txtApMaternoBusq").val());
            formData.append("NroDocumento", $("#txtNroDniBusq").val());
            formData.append("NroHistoriaClinica", $("#txtNroHistoriaBusq").val());

            try {
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Paciente/ListaPacientes?area=Comun",
                        //contentType: "application/json; charset=utf-8",
                        data: formData,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                if (datos.session) {
                    if (datos.lsPacientes.table.length > 0) {
                        oTable_Pacientes.fnAddData(datos.lsPacientes.table);
                    }
                }
            } catch (error) {
                //console.error(error)
                alerta(3, error);
            }
        } else {
            alerta(2, "Ingrese alguno de los campos para realizar la busqueda de pacientes.")
            return false;
        }

        return true;
    },

    LimpiarBusquedaPacientes() {
        $(".search2").val("");
        oTable_Pacientes.fnClearTable();
    },

    //////////FUNCION CONSUMO SERVICIO BUSQUEDA CPT/////////////////////////////////
    //BuscaAtencionesCptCEparaFormatoHIS(idCuentaAtencion) { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
    //    var midata = new FormData();
    //    midata.append('idCuentaAtencion', idCuentaAtencion);
    //    Cargando(1)
    //    oTable_consumoServAtencion.fnClearTable();
    //    $.ajax({
    //        method: "POST",
    //        url: "/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHIS?area=Facturacion",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        success: function (datos) {
    //            Cargando(0)
    //            if (datos.session) {
    //                if (datos.listaCpt.table.length !== 0) {

    //                    oTable_consumoServAtencion.fnAddData(datos.listaCpt.table);
    //                }
    //            }
    //            else {
    //                location.reload();
    //            }
    //        },
    //        error: function (msg) {
    //            alerta(3, "Error al listar Cpt");
    //            Cargando(0)
    //        }
    //    });

    //    oTable_consumoServAtencion.resize();

    //},

    ////////////////////////////SELECCIONAR//////////////////////////////////
    SeleccionarRegistroRN(idCuentaAtencion, idRegistroRn, tabla) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idRegistroRn', idRegistroRn);
        midata.append('tabla', tabla);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/SeleccionarRegistroRN?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        //console.log(datos.table[0]);
                        //$("#hdnIdRegistroRN").val(idRegistroRn);
                        //$("#hdnIdCuentaAtencion").val(idCuentaAtencion);
                        //$("#hdnTablaRN").val(tabla);
                        LibroNacimiento.IdRegistroRn = idRegistroRn;
                        LibroNacimiento.IdCuentaAtencion = idCuentaAtencion;
                        LibroNacimiento.Tabla = tabla;
                        //$("#txtFecClamp").datepicker("setDate", datos.table[0].fechaClampaje);
                        $("#cboTipoGestacion").val(datos.table[0].idTipoGestacion);
                        $("#cboTipoGestacion").trigger("chosen:updated");
                        LibroNacimiento.TipoGestacion_Change();
                        $("#txtNroFetos").val(datos.table[0].fetos);
                        LibroNacimiento.Fetos_Change();
                        $("#cboNumeroGemelar").val(datos.table[0].nroGemelar);
                        $("#cboNumeroGemelar").trigger("chosen:updated");
                        $("#cboCondicion").val(datos.table[0].idCondicion);
                        $("#cboCondicion").trigger("chosen:updated");
                        if (datos.table[0].obito == "No") {
                            $('#rdbObitoNo').prop('checked', true);
                        } else if (datos.table[0].obito == "Menor") {
                            $('#rdbObitoSiMenor').prop('checked', true);
                        } else if (datos.table[0].obito == "Mayor") {
                            $('#rdbObitoSiMayor').prop('checked', true);
                        }
                        LibroNacimiento.Condicion_Change();
                        $("#txtEdadGestacional").val(datos.table[0].edadGes);
                        $("#txtPeso").val(datos.table[0].peso);
                        $("#txtTalla").val(datos.table[0].talla);
                        $("#txtPerCefalico").val(datos.table[0].perimetroCefalico);
                        $("#txtPerToracico").val(datos.table[0].perimetroToracico);
                        if (datos.table[0].idServicioNacimiento > 0) {
                            $("#cboServicioNacimiento").val(datos.table[0].idServicioNacimiento);
                        } else {
                            $("#cboServicioNacimiento").val("");
                        }
                        $("#cboServicioNacimiento").trigger("chosen:updated");
                        if (datos.table[0].idOtraProcedencia == null || datos.table[0].idOtraProcedencia == '') {
                            $("#cboProcedenciaRn").val(1);
                        } else {
                            $("#cboProcedenciaRn").val(datos.table[0].idOtraProcedencia);
                        }
                        $("#cboProcedenciaRn").trigger("chosen:updated");
                        if (datos.table[0].inmediato == true) {
                            $('#rdbInmediatoSi').prop('checked', true);
                        } else if (datos.table[0].inmediato == false) {
                            $('#rdbInmediatoNO').prop('checked', true);
                        }
                        $("#txtMinuto").val(datos.table[0].alMinuto);
                        $("#txt5Minuto").val(datos.table[0].alos5Minutos);
                        if (datos.table[0].reanimacion == true) {
                            $('#rdbReanimacionSi').prop('checked', true);
                        } else if (datos.table[0].reanimacion == false) {
                            $('#rdbReanimacionNO').prop('checked', true);
                        }
                        if (datos.table[0].patologiaNeonatal == true) {
                            $('#rdbPatNeoSi').prop('checked', true);
                        } else if (datos.table[0].patologiaNeonatal == false) {
                            $('#rdbPatNeoNo').prop('checked', true);
                        }
                        LibroNacimiento.PatNeo_Change();
                        $("#txtEspecificar").val(datos.table[0].especificar);
                        //$("#txtTiempoHosp").val(datos.table[0].tiempoHosp);
                        if (datos.table[0].embarazo == "N") {
                            $('#rdbEmbarazoN').prop('checked', true);
                        } else if (datos.table[0].embarazo == "C") {
                            $('#rdbEmbarazoC').prop('checked', true);
                        }
                        $("#txtPatGest").val(datos.table[0].patologiaGest);
                        $("#txtNroEmbarazo").val(datos.table[0].nroEmbarazo);
                        if (datos.table[0].attPrenatal == true) {
                            $('#rdbAtPreNatalSi').prop('checked', true);
                        } else if (datos.table[0].attPrenatal == false) {
                            $('#rdbAtPreNatalNo').prop('checked', true);
                        }
                        $("#txtNroAPN").val(datos.table[0].nroApn);
                        $("#txtLugarAPN").val(datos.table[0].lugarApn);
                        $("#txtGestas").val(datos.table[0].gesta);
                        //$("#txtParidad").val(datos.table[0].paridad);
                        $("#txtParidad1").val(datos.table[0].paridad1);
                        $("#txtParidad2").val(datos.table[0].paridad2);
                        $("#txtParidad3").val(datos.table[0].paridad3);
                        $("#txtParidad4").val(datos.table[0].paridad4);
                        if (datos.table[0].atendidoPor == "M") {
                            $('#rdbAtendidoPorMed').prop('checked', true);
                        } else if (datos.table[0].atendidoPor == "O") {
                            $('#rdbAtendidoPorObs').prop('checked', true);
                        } else if (datos.table[0].atendidoPor == "X") {
                            $('#rdbAtendidoPorOtro').prop('checked', true);
                        }
                        proferesp = datos.table[0].idMedico;
                        LibroNacimiento.FiltrarProfesionalAtendio();
                        $("#cboProfResponsable").val(datos.table[0].idMedico);
                        $("#cboProfResponsable").trigger("chosen:updated");
                        $("#txtProfResponsable").val(datos.table[0].responsableAtencion);
                        $("#cboTipoParto").val(datos.table[0].idTipoParto);
                        $("#cboTipoParto").trigger("chosen:updated");
                        $("#cboRiesgo").val(datos.table[0].idRiesgo);
                        $("#cboRiesgo").trigger("chosen:updated");
                        $("#cboContactoPiel").val(datos.table[0].pielaPiel);
                        $("#cboContactoPiel").trigger("chosen:updated");
                        if (datos.table[0].parto == true) {
                            $('#rdbEutocito').prop('checked', true);
                        } else if (datos.table[0].parto == false) {
                            $('#rdbComplicado').prop('checked', true);
                        }
                        $("#txtComplicaciones").val(datos.table[0].complicacionParto);
                        if (datos.table[0].posicionParto == "H") {
                            $('#rdbTipoPartoH').prop('checked', true);
                        } else if (datos.table[0].posicionParto == "V") {
                            $('#rdbTipoPartoV').prop('checked', true);
                        }
                        if (datos.table[0].clampadoTardio == true) {
                            $('#rdbTardioSi').prop('checked', true);
                        } else if (datos.table[0].clampadoTardio == false) {
                            $('#rdbTardioNO').prop('checked', true);
                        }
                        if (datos.table[0].clampadoTardio == true) {
                            $('#rdbLacthoraSi').prop('checked', true);
                        } else if (datos.table[0].clampadoTardio == false) {
                            $('#rdbLacthoraNO').prop('checked', true);
                        }
                        $("#chkConAcompaniante").prop('checked', datos.table[0].conAcompaniante);
                        $("#chkConAnalgesia").prop('checked', datos.table[0].conAnaglgesia);

                        //$("#txtObservacion").val(datos.table[0].observaciones);
                        //$("#txtNroGemelar").val(datos.table[0].nroGemelar);
                        //console.log("HOla1");
                        //midata.append("", posicion);                        
                    }
                    LibroNacimiento.EjecutarAccion();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    async SeleccionarRegistroRNporHistoria(nroHistoria) {
        resp = false;
        var midata = new FormData();
        midata.append('nroHistoria', nroHistoria);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/SeleccionarRegistroRNporHistoria?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos.table)) {
                if (datos.table.length > 0) {
                    alerta2('warning', '', 'El paciente que intenta agregar ya cuenta con un registro de nacimiento.');
                    resp = true;
                }
            } else {
                resp = false;
            }
        } catch (error) {
            alerta2('danger', '', error);
        }

        return resp;
    },

    async VerificarNacimientoRegistroRN(idPaciente) {
        resp = null;
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/VerificarNacimientoRegistroRN?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos.table)) {
                if (datos.table.length > 0) {
                    resp = datos.table[0];
                }
            } else {
                resp = null;
            }
        } catch (error) {
            alerta2('danger', '', error);
        }

        return resp;
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////VALIDAR CAMPOS/////////////////////////////////////////////
    ValidarCampos() {
        //if ($("#cboTipoGestacion").val() == null) { alerta(2, "Debe seleccionar el Tipo Gestación."); $('#nacimiento-tab-link').trigger('click'); $("#cboTipoGestacion").focus(); $("#cboTipoGestacion_chosen").addClass("chosen-container-active"); return false; }
        if ($("#txtNumeroLibro").val() == '') { alerta2("info", "", "Debe ingresar el Nro de Libro."); $("#txtNumeroLibro").focus(); return false; }
        if ($("#txtFolioLibro").val() == '') { alerta2("info", "", "Debe ingresar el Nro de Folio."); $("#txtFolioLibro").focus(); return false; }
        if ($("#txtAnioLibro").val() == '') { alerta2("info", "", "Debe ingresar el Nro de Año."); $("#txtAnioLibro").focus(); return false; }

        //if ($("#txtNombresMadre").val() == '') { alerta2("info", "", "Debe ingresar el nombre de la madre."); $("#txtNombresMadre").focus(); return false; }
        //if ($("#txtApPaternoMadre").val() == '') { alerta2("info", "", "Debe ingresar el apellido paterno de la madre."); $("#txtApPaternoMadre").focus(); return false; }
        //if ($("#txtApMaternoMadre").val() == '') { alerta2("info", "", "Debe ingresar el apellido materno de la madre."); $("#txtApMaternoMadre").focus(); return false; }
        //if ($("#txtEdadMadre").val() == '') { alerta2("info", "", "Debe ingresar la edad de la madre."); $("#txtEdadMadre").focus(); return false; }
        //if ($("#txtNacionalidadMadre").val() == '') { alerta2("info", "", "Debe ingresar la nacionalidad de la madre."); $("#txtNacionalidadMadre").focus(); return false; }
        //if (isEmpty($("#cboNacionalidadMadre").val())) { alerta2("info", "", "Debe seleccionar la nacionalidad de la madre."); $("#cboNacionalidadMadre").focus(); $("#cboNacionalidadMadre_chosen").addClass("chosen-container-active"); return false; }

        if ($("#txtFechaNacimientoRn").val() == '') { alerta2("info", "", "Debe ingresar la fecha de nacimiento del RN."); $("#txtFechaNacimientoRn").focus(); return false; }
        if ($("#txtHoraNacimientoRn").val() == '') { alerta2("info", "", "Debe ingresar la hora de nacimiento del RN."); $("#txtHoraNacimientoRn").focus(); return false; }
        if (isEmpty($("#cboSexo").val())) { alerta2("info", "", "Debe ingresar el sexo del RN."); $("#cboSexo").focus(); $("#cboSexo_chosen").addClass("chosen-container-active"); return false; }
        if (isEmpty($("#cboCondicion").val())) { alerta2("info", "", "Debe ingresar la condición del RN."); $("#cboCondicion").focus(); $("#cboCondicion_chosen").addClass("chosen-container-active"); return false; }
        //if ($("#txtPesoRn").val() == '') { alerta2("info", "", "Debe ingresar el peso del RN."); $("#txtPesoRn").focus(); return false; }
        //if ($("#txtTallaRn").val() == '') { alerta2("info", "", "Debe ingresar la talla del RN."); $("#txtTallaRn").focus(); return false; }
        


        return true;
    },
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////GENERAR PARTE DIARIO/////////////////////////////////////////////////
    async GenerarParteDiario(idCuenta, fecha) {
        Cargando(1);
        var formData = new FormData
        var respuesta;
        let datos
        try {
            formData.append('idCuenta', idCuenta);
            formData.append('fechaInicio', fecha);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/GenerarParteDiario?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                alerta(1, 'La Hparte diario se creo correctamente.');
            } else {
                alerta(3, 'Hubo un error durante la creación del parte diario.');
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////

    EjecutarAccion(accion) {
        $("#btnGuardarLibroNacimiento").hide();
        if (accion == "A" || accion == "M") {
            $(".campo").prop("disabled", false);
            $("#btnGuardarLibroNacimiento").show();
        }

        if (accion == "C" || accion == "E") {
            $(".campo").prop("disabled", true);      
        }

        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#txtNroFetos").val('0');
        $("#txtNroFetos").attr('disabled', 'disabled');
        $("#cboNumeroGemelar").attr('disabled', 'disabled');



        //if (accion == 'M') {
        //    HabilitarCampos();
        //    if ($('#cboTipoGestacion').val() == 1) {
        //        $("#txtNroFetos").attr('disabled', true);
        //        $("#cboNumeroGemelar").attr('disabled', true);
        //    }
        //    if ($("#rdbPatNeoNo").is(":checked")) {
        //        $("#txtEspecificar").attr('disabled', true);
        //    }
        //    LibroNacimiento.PatNeo_Change();
        //    LibroNacimiento.Condicion_Change();
        //} else if (accion == 'C') {
        //    DeshabilitarCampos();
        //}
        //$('.chzn-select').chosen().trigger("chosen:updated");

        ////$('#modalRegistroRN').modal('show');
        //MostrarAreaRegistro();
    },

    FiltrarProfesionalAtendio() {
        var tipo = '';
        var resp = 0;
        if ($("#rdbAtendidoPorMed").is(":checked")) { tipo = '1' } else if ($("#rdbAtendidoPorObs").is(":checked")) { tipo = '5' } else if ($("#rdbAtendidoPorOtro").is(":checked")) { tipo = '6' }
        $('#cboProfResponsable').empty();
        //console.log(medobsenf);
        if (tipo == '6') {
            $('#profesionalResponsableCombo').hide();
            $('#profesionalResponsableTexto').show();
        } else {
            $('#profesionalResponsableCombo').show();
            $('#profesionalResponsableTexto').hide();
            $(medobsenf).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.tipo == tipo && obj.esActivo == 1) {
                    if (obj.valor == proferesp) {
                        resp = obj.valor;
                    }
                    $('#cboProfResponsable').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
        }

        $("#cboProfResponsable").val(resp);
        $("#cboProfResponsable").trigger("chosen:updated");
        //$('.chzn-select').chosen().trigger("chosen:updated");
    },

    PatNeo_Change() {
        if ($("#rdbPatNeoSi").is(":checked")) {
            $("#txtEspecificar").val("");
            $("#txtEspecificar").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbPatNeoNo").is(":checked")) {
            $("#txtEspecificar").val("");
            $("#txtEspecificar").attr('disabled', true);
        } else {
            $("#txtEspecificar").val("");
            $("#txtEspecificar").attr('disabled', true);
        }
    },

    Condicion_Change() {
        $(".rdbObito").prop('checked', false);
        if ($("#cboCondicion").val() == 1) {
            $('#rdbObitoNo').prop('checked', true);
            $(".rdbObito").attr('disabled', true);
        }
        else if ($("#cboCondicion").val() == 3) {
            //$("#txtEspecificar").val("");
            $(".rdbObito").removeAttr('disabled', 'disabled');
        }
    },

    TipoGestacion_Change() {
        $('#cboNumeroGemelar').empty();
        if ($('#cboTipoGestacion').val() == 1) {
            //console.log(medobsenf);
            $(gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.nroGemelos == 0) {
                    $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
            $('#txtNroFetos').val(0);
            $('#cboNumeroGemelar').val(0);
            $("#txtNroFetos").attr('disabled', true);
            $("#cboNumeroGemelar").attr('disabled', true);
        } else if ($('#cboTipoGestacion').val() == 2) {
            $('#txtNroFetos').val('');
            $('#cboNumeroGemelar').val('');
            $("#txtNroFetos").removeAttr('disabled', 'disabled');
            $("#cboNumeroGemelar").removeAttr('disabled', 'disabled');
        } else {
            $("#txtNroFetos").attr('disabled', true);
            $("#cboNumeroGemelar").attr('disabled', true);
        }
        $("#cboNumeroGemelar").trigger("chosen:updated");
    },

    Fetos_Change() {
        var fetos = 0;
        $('#cboNumeroGemelar').empty();
        fetos = $('#txtNroFetos').val();

        if (fetos > 0 && fetos <= 10) {
            $(gemelar).each(function (i, obj) {
                console.log(obj.descripcion);
                /*
                if (fetos > 5) {
                    fetos = 5;
                }*/
                if (obj.nroGemelos == fetos) {
                    $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }

            });
        } else {
            if (fetos < 0 || fetos > 10 || (fetos == 0 && $('#cboTipoGestacion').val() == 2)) {
                $('#txtNroFetos').val('');
            } else {
                $(gemelar).each(function (i, obj) {
                    console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
            }
        }
        $('#cboNumeroGemelar').val('');
        $("#cboNumeroGemelar").trigger("chosen:updated");
    },

    FetosLista() {
        var fetos = 0;
        //$('#cboNumeroGemelar').empty();
        fetos = $('#txtNroFetos').val();
        

        if (fetos > 0 && fetos <= 10) {
            $(gemelar).each(function (i, obj) {
                console.log(obj.descripcion);
                /*
                if (fetos > 5) {
                    fetos = 5;
                }*/
                if (obj.nroGemelos == fetos) {
                    $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }

            });
        } else {
            if (fetos < 0 || fetos > 10 || (fetos == 0 && $('#cboTipoGestacion').val() == 2)) {
                $('#txtNroFetos').val('');
            } else {
                $(gemelar).each(function (i, obj) {
                    console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
            }
        }

        
        $('#cboNumeroGemelar').val($('#txtNroFetos').val());
        
        console.log($('#txtNroFetos').val());
        $("#cboNumeroGemelar").trigger("chosen:updated");
        console.log($('#cboNumeroGemelar').val());
    },


    CargaMetodoxCargaUsuaria(idEstadoUsuaria) {
        var midata = new FormData();
        midata.append('idEstadoUsuaria', idEstadoUsuaria);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/ListarMetodoxIdEstadoUsuaria?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboMetodo').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMetodo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $("#cboMetodo").trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar procedimientos!", "2");
                }, 900)
            }
        });

    },

    LlenarCondicionPaciente() {
        var midata = new FormData();
        midata.append('idNroCuenta', $("#txtNroCuenta").val());
        midata.append('idGrupo', $("#idGrupo").val());
        $.ajax({
            method: "POST",
            url: "/RecienNacido/DevuelveCondicionPaciente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $(datos.table).each(function (i, obj) {
                    if (obj.categoria == "MGP") {
                        $("#txtCondServicio").val(obj.descripcion);
                        $("#hdnCondServicio").val(obj.idTipoCondicionPaciente);
                    } else {
                        $("#txtCondEstablecimiento").val(obj.descripcion);
                        $("#hdnCondEstablecimiento").val(obj.idTipoCondicionPaciente);
                    }
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta(3, "Error al obtener las condiciones del paciente");
                }, 900)
            }
        });
    },

    LlenarEfecto(idMetodoEfecto) {
        var midata = new FormData();
        midata.append('idMetodoEfecto', idMetodoEfecto);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/ListarEfectoSecxMetodo?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboEfectoSec').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboEfectoSec').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $("#cboEfectoSec").trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar efectos secundarios!", "2");
                }, 900)
            }
        });
    },



    LimpiarFiltros() {
        /*
        $("#txtCama").val("");
        $("#txtNroCuentaFiltro").val("");
        $("#txtDniFiltro").val("");
        $("#txtNroHistoriaFiltro").val("");
        $("#txtApPaternoFiltro").val("");
        $('#txtFechaFiltro').val(FechaDia);
        LibroNacimiento.ListarHospitalizados(); */
        //$("#txtNroCuentaFiltro").val("");
        $(".search").val("");
        $("#txtFechaFiltro").datepicker("setDate", FechaDia);

    },

    LimpiarForm() {
        LibroNacimiento.IdRegistroRn = 0;
        $(".campo").val("");
        $("#cboNacionalidadMadre").val(166);
        $("#cboNacionalidadPadre").val(166);
        $('.chzn-select').chosen().trigger("chosen:updated");

        ////$("#hdnIdCuentaAtencion").val("");
        ////$("#hdnIdRegistroRN").val("");
        ////$("#hdnTablaRN").val("");
        //LibroNacimiento.IdRegistroRn = 0;
        //LibroNacimiento.IdCuentaAtencion = 0;
        //LibroNacimiento.IdPaciente = 0;
        //LibroNacimiento.Tabla = '';
        //$("#txtNroHistoria").val("");
        //$("#txtFecNac").val("");
        //$("#txtHoraNac").val("");
        //$("#cboTipoDocumento").val("");
        //$("#cboTipoDocumento").trigger("chosen:updated");
        //$("#txtNroDocumento").val("");
        //$("#cboSexo").val("");
        //$("#cboSexo").trigger("chosen:updated");
        //$("#txtNroHijo").val("");
        //$("#txtFecClamp").val("");
        //$("#cboTipoGestacion").val("");
        //$("#cboTipoGestacion").trigger("chosen:updated");
        //$("#txtNroFetos").val("");
        //$("#cboNumeroGemelar").val("");
        //$("#cboNumeroGemelar").trigger("chosen:updated");
        //$("#cboCondicion").val("");
        //$("#cboCondicion").trigger("chosen:updated");
        //$(".rdbObito").prop('checked', false);
        //$(".rdbObito").attr('disabled', true);
        //$("#txtEdadGestacional").val("");
        //$("#txtPeso").val("");
        //$("#txtTalla").val("");
        //$("#txtPerCefalico").val("");
        //$("#txtPerToracico").val("");
        //$("#cboServicioNacimiento").val("");
        //$("#cboServicioNacimiento").trigger("chosen:updated");
        //$("#cboProcedenciaRn").val(1);
        //$("#cboProcedenciaRn").trigger("chosen:updated");
        //$("#txtNroHistoriaMadre").val("");
        //$("#txtNombreMadre").val("");
        //$("#txtNroHistoriaMadre").val("");
        //$("#cboTipoDocMadre").val("");
        //$("#cboTipoDocMadre").trigger("chosen:updated");
        //$("#txtNroDocMadre").val("");
        //$("#txtEdadMadre").val("");
        //$("#cboEstadoCivilMadre").val("");
        //$("#cboEstadoCivilMadre").trigger("chosen:updated");
        //$("#cboGradoInstruccionMadre").val("");
        //$("#cboGradoInstruccionMadre").trigger("chosen:updated");
        //$(".rdbInmediato").prop('checked', false);
        //$("#txtMinuto").val("");
        //$("#txt5Minuto").val("");
        //$(".rdbReanimacion").prop('checked', false);
        //$(".rdbPatNeo").prop('checked', false);
        //$("#txtEspecificar").val("");
        //$("#txtEspecificar").attr('disabled', true);
        //$("#txtTiempoHosp").val("");
        //$(".rdbEmbarazo").prop('checked', false);
        //$("#txtPatGest").val("");
        //$("#txtNroEmbarazo").val("");
        //$(".rdbAtPreNatal").prop('checked', false);
        //$("#txtNroAPN").val("");
        //$("#txtLugarAPN").val("");
        //$("#txtGestas").val("");
        //$("#txtParidad").val("");
        //$("#txtParidad1").val("");
        //$("#txtParidad2").val("");
        //$("#txtParidad3").val("");
        //$("#txtParidad4").val("");
        //$(".rdbAtendidoPor").prop('checked', false);
        //$("#cboProfResponsable").val("");
        //$("#cboProfResponsable").trigger("chosen:updated");
        //$("#txtProfResponsable").val("");
        //$("#cboTipoParto").val("");
        //$("#cboTipoParto").trigger("chosen:updated");
        //$("#cboRiesgo").val("");
        //$("#cboRiesgo").trigger("chosen:updated");
        //$("#cboContactoPiel").val("");
        //$("#cboContactoPiel").trigger("chosen:updated");
        //$(".rdbParto").prop('checked', false);
        //$(".rdbPartoComplicado").prop('checked', false);
        //$("#txtComplicaciones").val("");
        //$(".rdbTipoParto").prop('checked', false);
        //$(".rdbTardio").prop('checked', false);
        //$(".rdbLacthora").prop('checked', false);
        //$("#chkConAcompaniante").prop('checked', false);
        //$("#chkConAnalgesia").prop('checked', false);

        ////$('.rdbInmediato').prop('checked', '');
        ////$('.rdbReanimacion').prop('checked', '');
        ////$('.rdbPatNeo').prop('checked', '');
        ////$('.rdbEmbarazo').prop('checked', '');
        ////$('.rdbAtPreNatal').prop('checked', '');
        ////$('.rdbAtendidoPor').prop('checked', '');
        ////$('.rdbTipoParto').prop('checked', '');
        ////$('.rdbTardio').prop('checked', '');
        ////$('.rdbLacthora').prop('checked', '');
        ////$('#chkConAcompaniante').prop('checked', '');
        ////$('#chkConAnalgesia').prop('checked', '');

        ///*
        //$('.nav-link').removeClass('active');
        //$('.nav-link').prop('aria-expanded', false);
        //$('#home-tab').addClass('active');
        //$('#home-tab').prop('aria-expanded', false);
        //*/
        //$('#atencion-tab-link').trigger('click');

        //$("#txtObservacion").val(null);
        ////$("#txtNroGemelar").val(null);


        ////$('#rdbTipoPartoH').prop('checked', false);
        ////$('#rdbTipoPartoV').prop('checked', false);

        ////$("#rdbLacthoraNO").prop('checked', true);
        ////$("#rdbTardioNO").prop('checked', true);    

        ////$('#rdbTipoPartoH').prop('checked', false);

        ////$("#PacienteHeaderModal").html("");
        ////$("#HistoriaHeaderModal").html("");
        ////$("#CuentaHeaderModal").html("");

        ////idAccion = 0;
        ////medobsenf = [];
        //proferesp = 0;

        //    BloquearControles(false);
    },
    /*
    function limpiarNoAceptaMetodo() {
    
        $("#cboConsulta").val(-1);
        $("#cboProcedimientoEntrada").val(-1);
        $("#txtNroInsumos").val("");
        $("#cboProcedimiento").val(-1);
        $("#cboEfectoSecundario").val(-1);
        $("#cboMetodoDefinitivo").val(-1);
        $("#cboMetodoTemporal").val(-1);
        $("#cboMedico").val(-1);
        idAccion = 0;
        $("#cboConsulta").trigger("chosen:updated");
        $("#cboProcedimientoEntrada").trigger("chosen:updated");
    
        $("#cboProcedimiento").trigger("chosen:updated");
        $("#cboEfectoSecundario").trigger("chosen:updated");
        $("#cboMetodoDefinitivo").trigger("chosen:updated");
        $("#cboMetodoTemporal").trigger("chosen:updated");
        $("#cboMedico").trigger("chosen:updated");
    
    }
    */
    //////////////////////////GUARDAR-AGREGAR///////////////////////////////////////
    //AgregarPacienteRegistroRn() {
    //    $("#modalBuscarPaciente").modal("show")
    //},

    //CerrarModalBusquedaPaciente() {
    //    $("#modalBuscarPaciente").modal("hide")
    //},

    //AgregarRegistroRn() {
    //    accion = 'A';
    //    LibroNacimiento.limpiarmodal();
    //    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();


    //},




    //////////////////////////AGREGAR - MODIFICAR - GUARDAR///////////////////////////////////////
    //BuscarPacienteRegistroRn() {
    //    ObjtableHospitalizadosRn.$('tr.selected').removeClass('selected');
    //    LibroNacimiento.LimpiarBusquedaPacientes();
    //    $("#modalPacienteBusqueda").modal("show");
    //},

    CargarDatosLibroNacimiento() {
        //accion = 'M';
        LibroNacimiento.LimpiarForm();
        var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();

        if (isEmpty(objrow)) {
            alerta2("info", "", "Debe seleccionar un Registro de Nacimiento.");
            return false;
        }
        
        //asignar valores    
        $('#txtNumeroLibro').val(objrow.nroLibro);
        $('#txtFolioLibro').val(objrow.nroFolio);
        $('#txtAnioLibro').val(objrow.nroAnio);
        $('#txtMesLibro').val(objrow.nroMes);

        $('#txtHistoriaMadre').val(objrow.historiaMadre);
        $('#txtDniMadre').val(objrow.docMadre);
        $('#txtNombresMadre').val(objrow.nombresMadre);
        $('#txtApPaternoMadre').val(objrow.apPaternoMadre);
        $('#txtApMaternoMadre').val(objrow.apMaternoMadre);
        $('#txtEdadMadre').val(objrow.edadMadre);
        $('#cboEstadoCivilMadre').val(objrow.idEstadoCivilMadre);
        $('#txtLugarNacimientoMadre').val(objrow.lugarNacimientoMadre);
        //JAA



        cargarCombo('/Utilitario/ListaProvinciasByDepartamentos?area=Comun',
            'cboProvinciaDomicilio',
            'Seleccione una opción',
            'idProvincia',
            'nombre',
            { 'idDepartamento': objrow.idDepartamento },
            objrow.idProvincia);


        cargarCombo('/Utilitario/ListaDistritosByProvincia?area=Comun',
            'cboDistritoDomicilio',
            'Seleccione una opción',
            'idDistrito',
            'nombre',
            { 'idDProvincia': objrow.idProvincia },
            objrow.idDistrito);
        $('#cboDepartamentoDomicilio').val(objrow.idDepartamento);
        $('#cboProvinciaDomicilio').val(objrow.idProvincia);
        $('#cboDistritoDomicilio').val(objrow.idDistrito);

        //


        $('#cboNacionalidadMadre').val(objrow.idNacionalidadMadre);
        $('#txtNumeroEmbarazoMadre').val(objrow.nroEmbarazoMadre);
        $('#txtHijosVivosMadre').val(objrow.hijosVivosMadre);
        $('#txtHijosMuertosMadre').val(objrow.hijosMuertosMadre);
        $('#txtVidaConyugalMadre').val(objrow.vidaConyugalMadre);
        $('#txtDomicilioMadre').val(objrow.direccionMadre);

        $('#txtNombresPadre').val(objrow.nombresPadre);
        $('#txtApPaternoPadre').val(objrow.apPaternoPadre);
        $('#txtApMaternoPadre').val(objrow.apMaternoPadre);
        $('#txtEdadPadre').val(objrow.edadPadre);
        $('#txtLugarNacimientoPadre').val(objrow.lugarNacimientoPadre);
        //$('#txtNacionalidadPadre').val(objrow.nacionalidadPadre);
        $('#cboNacionalidadPadre').val(objrow.nacionalidadPadre);
                
        $('#txtFechaNacimientoRn').datepicker("setDate", objrow.fecNac);
        $('#txtHoraNacimientoRn').val(objrow.horaNac);
        $('#txtNombresRn').val(objrow.paciente);
        $('#cboSexo').val(objrow.idTipoSexo);
        $('#cboTipoGestacion').val(objrow.idTipoGestacion);
        $('#cboCondicion').val(objrow.idCondicion);

        $('#txtNroFetos').val(objrow.fetos);
        LibroNacimiento.FetosLista();
        $('#cboNumeroGemelar').val(objrow.nroGemelar);

        console.log($('#cboNumeroGemelar').val());

        $('#txtVidaIntrauterinaRn').val(objrow.vidaIntrauterina);
        $('#txtPesoRn').val(objrow.peso);
        $('#txtTallaRn').val(objrow.talla);
        $('#txtApgarRn').val(objrow.apgar);
        $('#txtNroCertificadoRn').val('');
        $('#txtHCRn').val(objrow.nroHistoriaClinica);

        $('#txtCausaMuerte').val(objrow.causaMuerte);
        $('#txtAnotacionEspecial').val(objrow.anotacionEspecial);
        $('#txtObservacion').val(objrow.observaciones);


        LibroNacimiento.IdRegistroRn = objrow.idRegistroRN;

        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#btnGuardar").show();
        //console.log(objrow);
        /*
        if (objrow.cantEvaluacion > 0) {
            EvaluacionRn.SeleccionarEvaluacionRN(objrow.nroCuenta, objrow.idRegistroRN, objrow.tabla);
        }
        */

        //////////////////////////COMENTADO POR KHOYOSI - PORQUE YA NO SE USARA EN ESTE MODULO /////////////////////////
        //Diagnosticos.SeleccionarDiagnosticos(objrow.idAtencion, 2);

        //ConsumoServicio.idCuentaAtencion = objrow.nroCuenta;
        //ConsumoServicio.idEstadoAtencion = objrow.idEstadoAtencion;
        //ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(objrow.nroCuenta);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        //LibroNacimiento.SeleccionarRegistroRN(objrow.nroCuenta, objrow.idRegistroRN, objrow.tabla);

        //LlenarCondicionPaciente();
        // ValidarAtencionEvaluacionRn();

        MostrarAreaRegistro();
    },

    AgregarLibroNacimiento() {
        //accion = 'A';
        LibroNacimiento.LimpiarForm();        
        MostrarAreaRegistro();
    },

    GuardarLibroNacimiento() {
        if (LibroNacimiento.ValidarCampos() == false) {
            return false;
        }

        var midata = new FormData();

        midata.append("IdRecienNacido", LibroNacimiento.IdRegistroRn);

        midata.append("NumeroLibro", $("#txtNumeroLibro").val());
        midata.append("FolioLibro", $("#txtFolioLibro").val());
        midata.append("AnioLibro", $("#txtAnioLibro").val());
        midata.append("MesLibro", $("#txtMesLibro").val());

        midata.append("HistoriaMadre", $("#txtHistoriaMadre").val());
        midata.append("DniMadre", $("#txtDniMadre").val());
        midata.append("NombresMadre", $("#txtNombresMadre").val());
        midata.append("ApPaternoMadre", $("#txtApPaternoMadre").val());
        midata.append("ApMaternoMadre", $("#txtApMaternoMadre").val());
        midata.append("EdadMadre", $("#txtEdadMadre").val());
        midata.append("EstadoCivilMadre", $("#cboEstadoCivilMadre").val());
        //JAA

        //var ResidenciaActual='';

        //var dep = ($('#cboDepartamentoDomicilio').val() || '0').padStart(2, '0');
        //var pro = ($('#cboProvinciaDomicilio').val() || '0').padStart(2, '0');
        //var dis = ($('#cboDistritoDomicilio').val() || '0').padStart(2, '0');

        ResidenciaActual = $('#cboDistritoDomicilio').val()  //dep + pro + dis;
        midata.append("ResidenciaActual", ResidenciaActual);

        //

        midata.append("LugarNacimientoMadre", $("#txtLugarNacimientoMadre").val());
        //midata.append("NacionalidadMadre", $("#txtNacionalidadMadre").val());
        midata.append("NacionalidadMadre", $("#cboNacionalidadMadre").val());
        midata.append("NumeroEmbarazoMadre", $("#txtNumeroEmbarazoMadre").val());
        midata.append("HijosVivosMadre", $("#txtHijosVivosMadre").val());
        midata.append("HijosMuertosMadre", $("#txtHijosMuertosMadre").val());
        midata.append("VidaConyugalMadre", $("#txtVidaConyugalMadre").val());
        midata.append("DomicilioMadre", $("#txtDomicilioMadre").val());

        midata.append("FechaNacimientoRn", $("#txtFechaNacimientoRn").val());
        midata.append("HoraNacimientoRn", $("#txtHoraNacimientoRn").val());
        midata.append("NombresRn", $("#txtNombresRn").val());
        midata.append("Sexo", $("#cboSexo").val());
        midata.append("TipoGestacion", $("#cboTipoGestacion").val());
        //JAA
        midata.append("Fetos", $("#txtNroFetos").val());
        midata.append("NroGemelar", $("#cboNumeroGemelar").val());
        //
        midata.append("Condicion", $("#cboCondicion").val());
        midata.append("VidaIntrauterinaRn", $("#txtVidaIntrauterinaRn").val());
        midata.append("PesoRn", $("#txtPesoRn").val());
        midata.append("TallaRn", $("#txtTallaRn").val());
        midata.append("ApgarRn", $("#txtApgarRn").val());
        midata.append("NroCertificadoRn", $("#txtNroCertificadoRn").val());
        midata.append("HCRn", $("#txtHCRn").val());

        midata.append("NombresPadre", $("#txtNombresPadre").val());
        midata.append("ApPaternoPadre", $("#txtApPaternoPadre").val());
        midata.append("ApMaternoPadre", $("#txtApMaternoPadre").val());
        midata.append("EdadPadre", $("#txtEdadPadre").val());
        midata.append("LugarNacimientoPadre", $("#txtLugarNacimientoPadre").val());
        //midata.append("NacionalidadPadre", $("#txtNacionalidadPadre").val());
        midata.append("NacionalidadPadre", $("#cboNacionalidadPadre").val());

        midata.append("CausaMuerte", $("#txtCausaMuerte").val());
        midata.append("AnotacionEspecial", $("#txtAnotacionEspecial").val());
        midata.append("Observacion", $("#txtObservacion").val());

        Cargando(1)
        $.ajax({
            method: "POST",
            url: "/LibroNacimiento/GuardarRegistroLibroNacimiento?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (datos.respuesta) {
                    alerta2("success", "", datos.mensaje);
                    LibroNacimiento.CerrarForm();
                    LibroNacimiento.ListarPacientesRegistroRN();
                } else {
                    alerta2("danger", "", datos.mensaje);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    EliminarLibroNacimiento() {
        LibroNacimiento.LimpiarForm();
        var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();

        if (isEmpty(objrow)) {
            alerta2("info", "", "Debe seleccionar un Registro de Nacimiento.");
            return false;
        }

        LibroNacimiento.IdRegistroRn = objrow.idRegistroRN;

        swal({
            title: 'ELIMINAR',
            text: '¿Estas seguro de eliminar el Registro de Nacimiento?',
            type: 'error',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#EF6F6C',
            cancelButtonColor: '#706f6f',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(function () { 
            var midata = new FormData();
            midata.append("IdRecienNacido", LibroNacimiento.IdRegistroRn);

            Cargando(1)
            $.ajax({
                method: "POST",
                url: "/LibroNacimiento/EliminarRegistroLibroNacimiento?area=Comun",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (datos) {
                    Cargando(0)
                    if (datos.respuesta) {
                        alerta2("success", "", datos.mensaje);
                        LibroNacimiento.CerrarForm();
                        LibroNacimiento.ListarPacientesRegistroRN();
                    } else {
                        alerta2("danger", "", datos.mensaje);
                    }
                },
                error: function (msg) {
                    Cargando(0)
                }
            });
            //LibroNacimiento.CerrarForm();
            //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
        }).catch(swal.noop);
    },
    

    //////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////CONSULTAR///////////////////////////////////////
    ConsultarRegistroRn() {
        accion = 'C';
        LibroNacimiento.limpiarmodal();
        var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();

        if (isEmpty(objrow)) {
            alerta(2, "Debe seleccionar un Registro de Nacimiento a consultar.");
            return false;
        }

        if (objrow.idEstadoAtencion == 0) {
            alerta(2, "La cuenta se encuentra Anulada.");
            //return false;
        }

        if (objrow.idEstadoAtencion == 2) {
            alerta(2, "La cuenta se encuentra cerrada.");
            //return false;
        }

        if (objrow.idRegistroRN == 0 || objrow.bActivo == 0) {
            alerta(2, "No hay nada que consultar. No cuenta con un Registro de Nacimiento.");
            return false;
        }

        //$('#txtDatos').html(' | N°.Cuenta: ' + objrow.nroCuenta + ' | N°.Historia: ' + objrow.nroHistoriaClinica + ' | Paciente: ' + objrow.paciente.toUpperCase())
        $("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrow.paciente == null ? '' : objrow.paciente));
        $("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrow.nroHistoriaClinica);
        $("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrow.nroCuenta);

        //asignar valores
        $('#txtNroHistoria').val(objrow.nroHistoriaClinica);
        $('#txtFecNac').val(objrow.fecNac);
        $('#txtHoraNac').val(objrow.horaNac);
        //$('#txtPaciente').val(objrow.paciente);
        //$('#txtSexoPac').val(objrow.sexo);
        $('#cboTipoDocumento').val(objrow.idDocIdentidad);
        $('#txtNroDocumento').val(objrow.nroDocumento);
        $('#cboSexo').val(objrow.idTipoSexo);
        $('#txtNroHijo').val(objrow.nroOrdenHijo);
        $('#cboTipoDocMadre').val(objrow.idDocIdentidadMadre);
        $('#txtNombreMadre').val(objrow.madre);
        $('#txtNroDocMadre').val(objrow.docMadre);
        $('#txtNroHistoriaMadre').val(objrow.historiaMadre);
        $('#txtEdadMadre').val(objrow.edadMadre);
        $('#cboEstadoCivilMadre').val(objrow.estadoCivilMadre);
        $('#cboGradoInstruccionMadre').val(objrow.gradoInstruccionMadre);

        //$('#hdnTablaRN').val(objrow.tabla);
        //$('#hdnIdRegistroRN').val(objrow.idRegistroRN);
        //$('#hdnIdCuentaAtencion').val(objrow.nroCuenta);
        //$('#hdnIdPaciente').val(objrow.idPaciente);

        LibroNacimiento.IdRegistroRn = objrow.idRegistroRN;
        LibroNacimiento.IdCuentaAtencion = objrow.nroCuenta;
        LibroNacimiento.IdPaciente = objrow.idPaciente;
        LibroNacimiento.Tabla = objrow.tabla;

        $("#btnGuardar").hide();

        /*
        if (objrow.cantEvaluacion > 0) {
            EvaluacionRn.ObtenerEvaluacionRN(objrow.nroCuenta);
        }*/

        LibroNacimiento.SeleccionarRegistroRN(objrow.nroCuenta, objrow.idRegistroRN, objrow.tabla);


    },
    /////////////////////////////////////////////////////////////////////////////

    /*
    function HabilitarControlesPlani() {
        $("#cboConsulta").removeAttr('disabled', 'disabled');
        $("#cboProcedimientoEntrada").removeAttr('disabled', 'disabled');
        $("#txtNroInsumos").removeAttr('disabled', 'disabled');
        $("#cboMetodo").removeAttr('disabled', 'disabled');
        $("#cboProcedimiento").removeAttr('disabled', 'disabled');
        $("#cboEfectoSecundario").removeAttr('disabled', 'disabled');
        $("#btnGuardar").show();
    }
    
    
    
    
    function RegistrarVisita(idCuenta, idPaciente, control) {
    
        var nroHistoria = $(control).parents("tr").find("td")[0].innerHTML;
        var nombre = $(control).parents("tr").find("td")[1].innerHTML;
        var telefono = $(control).parents("tr").find("td")[3].innerHTML;
        $("#txtFechaEvaluacion").val(FechaDia);
        //asignar valores
        $('#txtNroHistoria').val(nroHistoria);
        $('#txtPaciente').val(nombre);
        $('#txtTelefono').val(telefono);
        $('#idPaciente').val(idPaciente);
        $('#idCuenta').val(idCuenta);
        $('#idVisita').val(0);
        $('#modalEvaluacionRN').modal('show');
        $("#btnGuardar").show();
        //$('.chosen-select', this).chosen();
        // $("select").chosen({ width: "inherit" }) 
    }
    */
    CancelarLibroNacimiento() {
        swal({
            title: 'Salir',
            text: '¿Estas seguro de  Salir?',
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#706f6f',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(function () {
            LibroNacimiento.CerrarForm();
            //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
        }).catch(swal.noop);
    },

    CerrarForm() {
        //$('#modalRegistroRN').modal('hide');
        LibroNacimiento.LimpiarForm();
        MostrarAreaLista();
        ReposicionarVista();
    },

    //////////////////////////////////ELIMINAR//////////////////////////////////////////
    EliminarRegistroRN() {
        accion = 'E';
        var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
        var msg = '';

        if (isEmpty(objrow)) {
            alerta(2, "Debe seleccionar un Registro de Nacimiento a eliminar.");
            return false;
        }
        if (objrow.idRegistroRN == 0 || objrow.bActivo == 0) {
            alerta(2, "No se puede Eliminar. No cuenta con un Registro de Nacimiento.");
            return false;
        }

        if (objrow.idEstadoAtencion == 0) {
            alerta(2, "La cuenta se encuentra Anulada.");
            return false;
        }

        if (objrow.idEstadoAtencion == 2) {
            alerta(2, "La cuenta se encuentra cerrada.");
            return false;
        }

        msg = "Estas seguro de eliminar el Registro de Nacimiento <strong style='font-weight: bold;'>" + objrow.paciente + '</strong>';
        if (objrow.nroCuenta > 0) {
            msg = msg + " <br>  <strong style='text-decoration: underline;'>Nro cuenta: " + objrow.nroCuenta + '</strong>';
        }
        msg = msg + ' ?';

        swal({
            title: 'Eliminar',
            text: msg,
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#EF6F6C',
            cancelButtonColor: '#706f6f',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(function () {
            LibroNacimiento.Eliminar(objrow.idRegistroRN, objrow.tabla);
        }).catch(swal.noop);;
    },


    Eliminar(IdRegistroRN, Tabla) {
        //var ListDiagnosticos = DiagnosticosPlani.DevolverDiagnosticosPlani();
        var midata = new FormData();
        midata.append('idRegistroRN', IdRegistroRN);
        midata.append('tabla', Tabla);
        //midata.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
        //midata.append('idAccion', 2);

        $.ajax({
            method: "POST",
            url: "/RecienNacido/EliminarRegistroRn?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.respuesta > 0) {
                    alerta(1, datos.mensaje);
                    LibroNacimiento.cerrarModal();
                    LibroNacimiento.ListarPacientesRegistroRN();
                } else {
                    alerta(2, datos.mensaje);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////REPORTES//////////////////////////////////////////////
    AbrirModalReporte() {
        $("#cboTipoReporte").val(1)
        $('.chzn-select').chosen().trigger("chosen:updated");
        this.TipoReporte_Change();
        $("#modalReporte").modal("show");
    },

    CerrarModalReporte() {
        $("#cboTipoReporte").val(1);
        $("#txtFechaInicioRpt").val("");
        $("#txtFechaFinRpt").val("");
        $("#modalReporte").modal("hide");
    },

    async GenerarReporteRegistroRn() {
        if ($("#cboTipoReporte").val() == 1) {
            if ($("#txtFechaInicioRpt").val() == "") {
                alerta('2', 'Debe ingresar la fecha inicio.');
                return false;
            }

            //var idCuenta = $("#hdnIdCuentaAtencion").val();
            var FechaInicioRpt = $("#txtFechaInicioRpt").val();
            //var splFecIniRpt = FechaInicioRpt.split("/");
            //FechaInicioRpt = splFecIniRpt[1] + "/" + splFecIniRpt[0] + "/" + splFecIniRpt[2];
            await this.GenerarParteDiarioRn(FechaInicioRpt);
        }
        else {
            if ($("#cboTipoReporte").val() == 2) {
                if ($("#txtFechaInicioRpt").val() == "") {
                    alerta('2', 'Debe ingresar la fecha inicio.');
                    return false;
                }

                if ($("#txtFechaFinRpt").val() == "") {
                    alerta('2', 'Debe ingresar la fecha fin.');
                    return false;
                }

                var FechaInicioRpt = $("#txtFechaInicioRpt").val();
                var FechaFinRpt = $("#txtFechaFinRpt").val();
                var splFecIniRpt = FechaInicioRpt.split("/");
                var splFecFinRpt = FechaFinRpt.split("/");

                FechaInicioRpt = splFecIniRpt[1] + "/" + splFecIniRpt[0] + "/" + splFecIniRpt[2];
                FechaFinRpt = splFecFinRpt[1] + "/" + splFecFinRpt[0] + "/" + splFecFinRpt[2];
                var url = "/RecienNacido/ReporteRegistroRn?area=Hospitalizacion&FechaInicio=" + FechaInicioRpt + "&FechaFin=" + FechaFinRpt;
                window.location.href = url;
            }
        }
    },

    TipoReporte_Change() {
        $("#txtFechaInicioRpt").val("");
        $("#txtFechaFinRpt").val("");

        if ($("#cboTipoReporte").val() == 1) {
            $(".FechaFinRpt").hide();
        }
        else {
            if ($("#cboTipoReporte").val() == 2) {
                $(".FechaFinRpt").show();
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    async GenerarParteDiarioRn(fecha) {
        Cargando(1);

        var formData = new FormData();
        formData.append('FechaInicio', fecha);

        var url = "/RecienNacido/GenerarReportePdf?area=Hospitalizacion";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    //a.download = this.response.name || "CE-" + $.now()
                    a.download = "ParteDiarioRN-" + fecha + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    AbrirVisorDocumentoPersonalizado(url, "Parte Diario de Partos y Nacimientos");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);




        ////const data1 = await LibroNacimiento.GenerarParteDiario(idCuenta, fecha);
        //Cargando(1);
        //var url = "/RecienNacido/GenerarReportePdf?area=Emergencia&idCuenta=" + idCuenta + '&fechaInicio=' + fecha;

        //$("#visorDocumento").attr("src", url);
        //$('#modalVisorDocumento').modal('show');

        //Cargando(0);
        ///*var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        //if (EvaluacionEmergencia.ValidarVariablesEvaluacionNeonatal()) {
        //    Cargando(1);
        //    //Triaje.GuardarTriajeHospEmeg(objrow.idAtencion, objrow.idServicioEgreso, 0);
        //    const data1 = await EvaluacionEmergencia.GuardarEvaluacionNeonatal();
        //    const data2 = await EvaluacionEmergencia.GuardarAntecedentes();
        //    const data3 = await EvaluacionEmergencia.GuardarExamenNeonatal();
        //    if (nuevaEvalNeo == true || modificaEvalNeo == true) {
        //        const data4 = await EvaluacionEmergencia.GuardarEvaluacionDetalleNeonatal();
        //    }

        //    AdmisionEmergencia.ListarAtenciones();
        //    EvaluacionEmergencia.CerrarModalNeonatal();
        //    Cargando(0);
        //}*/
    },
    ///////////////////////////////////////////////////////////////////////////////


    /************/

    BloquearControles(bDesactivar) {
        if (bDesactivar == false) {
            $("#cboMetodoTemporal").removeAttr('disabled', 'disabled');
            $("#cboMetodoDefinitivo").removeAttr('disabled', 'disabled');
            $("#cboConsulta").removeAttr('disabled', 'disabled');
            $("#cboProcedimientoEntrada").removeAttr('disabled', 'disabled');
            $("#cboEfectoSecundario").removeAttr('disabled', 'disabled');
            $("#cboProcedimiento").removeAttr('disabled', 'disabled');
            $("#txtNroInsumos").removeAttr('disabled', 'disabled');
            $("#cboMedico").removeAttr('disabled', 'disabled');
        } else {

            $("#cboMetodoTemporal").attr('disabled', 'disabled');
            $("#cboMetodoDefinitivo").attr('disabled', 'disabled');
            $("#cboConsulta").attr('disabled', 'disabled');
            $("#cboProcedimientoEntrada").attr('disabled', 'disabled');
            $("#cboEfectoSecundario").attr('disabled', 'disabled');
            $("#cboProcedimiento").attr('disabled', 'disabled');
            $("#txtNroInsumos").attr('disabled', 'disabled');
            $("#cboMedico").attr('disabled', 'disabled');
        }
        $("#cboMetodoTemporal").trigger("chosen:updated");
        $("#cboMetodoDefinitivo").trigger("chosen:updated");
        $("#cboConsulta").trigger("chosen:updated");
        $("#cboProcedimientoEntrada").trigger("chosen:updated");
        $("#cboEfectoSecundario").trigger("chosen:updated");
        $("#cboProcedimiento").trigger("chosen:updated");
        $("#cboMedico").trigger("chosen:updated");
    },


    /***********/
};


$(document).ready(function () {
    //LibroNacimiento.InicializarComponentesEvaluacionRn();
    LibroNacimiento.LlenarCombos();
    LibroNacimiento.InitPlugin();
    //EvaluacionRn.ListarHospitalizados();    
    LibroNacimiento.Eventos();
    LibroNacimiento.InitDataTableRecienNacidos();
    LibroNacimiento.InitDataTablePacientes();
    //ConsumoServicio.Inicializar();        //COMETNADO POR KHOYOSI - PORQUE SE UTILIZARA EN EL MODULO DE NOTA INGRESO

    //InicializarComponentesEvaluacionRn();
    // LlenarCombos();
    //ListarHospitalizados();
    // Eventos();
    //$(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    //$(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');


});