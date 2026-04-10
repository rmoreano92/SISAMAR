var TriajeRn = {
    idTriajeRn: 0,
    idCuentaMadre: 0,
    idPaciente: 0,
    idCuentaAtencion: 0,
    idRegistroRn: 0,
    idRegistroNacimiento: 0,
    tienePermisoRegistroNacimiento: 0,
    gemelar: [],

    Iniciar() {
        TriajeRn.DataTableBusqueda();
        TriajeRn.DataTableRegistroNacimientos();
        TriajeRn.Eventos();
        TriajeRn.LLenarCombos();

        TriajeRn.Plugins();
        
    },

    Plugins() {
        $('#txtFechaNacimientoBusq, #txtFechaNacimiento, #txtFechaClampaje').datepicker({
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
        $("#txtFechaNacimientoBusq, #txtFechaNacimiento, #txtFechaClampaje").mask("Dd/Mm/abcd"); 

        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        $("#txtFechaNacimientoBusq").datepicker("setDate", FechaDia);


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraNacimiento").mask("Hn:Nn"); 
        $("#txtHoraClampaje").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        
    },

    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await TriajeRn.ListarTriajeRecienNacido();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            TriajeRn.LimpiarCamposBusqueda();
        });


        $('#tblTriajeRn tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_TriajeRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', function () {
            TriajeRn.LimpiarDatosMadre();
            TriajeRn.LimpiarCamposRegistro();
            TriajeRn.DeshabilitarRegistro();
            $("#frmContactoPielaPiel_V2").show();
            MostrarAreaRegistro();
        });

        $('#btnModificar').on('click', async function () {
            TriajeRn.LimpiarDatosMadre();
            TriajeRn.LimpiarCamposRegistro();                
            TriajeRn.DesbloquearRegistro();
            TriajeRn.tienePermisoRegistroNacimiento = await Utilitario.ValidarPermisoUsuario("REGISTRO-NACIMIENTO");
            const resp = await TriajeRn.SeleccionarTriajeRecienNacido();
            if (resp) {                
                MostrarAreaRegistro();
            }            
        });

        $('#btnConsultar').on('click', async function () {
            TriajeRn.LimpiarDatosMadre();
            TriajeRn.LimpiarCamposRegistro();
            TriajeRn.tienePermisoRegistroNacimiento = await Utilitario.ValidarPermisoUsuario("REGISTRO-NACIMIENTO");
            const resp = await TriajeRn.SeleccionarTriajeRecienNacido();
            if (resp) {
                TriajeRn.BloquearRegistro();
                MostrarAreaRegistro();
            }            
        });

        $('#btnEliminar').on('click', function () {
            TriajeRn.LimpiarDatosMadre();
            TriajeRn.LimpiarCamposRegistro();

            let objrow = oTable_TriajeRn.api(true).row('.selected').data();

            swal({
                title: 'ELIMINAR',
                text: "¿Esta seguro de eliminar el registro de triaje?" + '<br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Triaje</th><th class="text-sm-center">' + objrow.idTriajeRn + '</th></tr></table>',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    let resp = await TriajeRn.EliminarTriajeRecienNacido();
                    if (resp) {
                        await TriajeRn.ListarTriajeRecienNacido();
                    }
                }
                
            }, function (dimiss) {

            });
        });

        $('#btnBuscarMadre').on('click', async function () {
            await TriajeRn.BuscarCuentaMadre();
        });

        $('.buscarMadre').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnBuscarMadre").click();
            }
        });

        $('#btnCambiarMadre').on('click', async function () {
            await TriajeRn.LimpiarDatosMadre();
        });

        $('#cboTipoGestacion').on('change', function () {
            TriajeRn.TipoGestacion_Change();
        });        

        $('#txtNroFetos').on('keyup', function () {
            if ($('#txtNroFetos').val() < 0 || $('#txtNroFetos').val() > 10) {
                alerta2("info", "", "El Nro Fetos no puede ser menor a 0 ni mayor a 10.");
                $('#txtNroFetos').val("");
            }
            TriajeRn.Fetos_Change();
        });

        $('#cboCondicion').on('change', function () {
            TriajeRn.Condicion_Change();
        });

        $('input[name=rdbTardio]').on('change', async function () {
            await TriajeRn.ClampajeTardio_Change();
        });

        $('input[name=rdbContactoPiel]').on('change', async function () {
            await TriajeRn.TiempoContactoPielaPiel_Change();
        });
        $('input[name=rdbContactoPielPartoVaginal]').on('change', async function () {
            await TriajeRn.TiempoContactoPielaPielPartoVaginal_Change();
        });
        $('input[name=rdbContactoPielCesarea]').on('change', async function () {
            await TriajeRn.TiempoContactoPielaPielCesarea_Change();
        });

        $('input[name=rdbReanimacion]').on('change', function () {
            TriajeRn.Reanimacion_Change();
        });

        $('input[name=rdbPatNeo]').on('change', function () {
            TriajeRn.PatNeo_Change();
        });

        $('input[name=rdbTransporte]').on('change', function () {
            TriajeRn.Transporte_Change();
        });

        $('#btnGuardarTriajeRn').on('click', async function () {

            if (TriajeRn.idPaciente == 0 && TriajeRn.idCuentaAtencion == 0) {
                let paciente = await FiliacionRn.GuardarFiliacion();
                if (!isEmpty(paciente)) {
                    TriajeRn.idPaciente = paciente.idPaciente;
                    TriajeRn.idCuentaAtencion = paciente.idCuentaAtencion;
                    await TriajeRn.GuardarTriajeRecienNacido();
                }
            } else {
                await TriajeRn.GuardarTriajeRecienNacido();
            }           
            
        });

        $('#btnCancelarTriajeRn').on('click', async function () {
            swal({
                title: 'Salir',
                text: "¿Esta seguro de salir?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function (result) {
                if (result.isConfirmed) {
                    MostrarAreaLista();
                    TriajeRn.LimpiarDatosMadre();
                    TriajeRn.LimpiarCamposRegistro();
                    TriajeRn.ListarTriajeRecienNacido();
                }
                
            }, function (dimiss) {

            });
            
        });

        $('#tblTriajeRn tbody').on('click', '.GenerarBrazalete', async function () {
            let objrow = oTable_TriajeRn.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_TriajeRn.fnGetData(objrow);
            
            Brazalete.idPaciente = 0;
            Brazalete.nroHistoria = 0;
            Brazalete.apellidos = row.apellidosMadre;
            Brazalete.nombres = row.nombresMadre + ' RN' + (row.gemelar == 'PUN' ? '1' : row.gemelar.replace(/\D/g, ""));
            Brazalete.tipoDocumento = '';
            Brazalete.nroDocumento = '';
            Brazalete.fechaNacimiento = row.fechaNacimientoRn;
            Brazalete.horaNacimiento = row.horaNacimientoRn;
            Brazalete.tipoSexo = row.sexoRn;
            Brazalete.gemelar = row.gemelar;

            await Brazalete.GenerarBrazaletePaciente();
            Brazalete.LimpiarBrazalete();

        });

        $('#GenerarBrazalete').on('click', async function () {
            //let idPaciente = $('#txtIdPaciente').val()
            await Brazalete.GenerarBrazaletePaciente();
        });

        $('#tblTriajeRn tbody').on('click', '.GeneraFormatoFiliacionArchivoClinico', async function () {
            let objrow = oTable_TriajeRn.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_TriajeRn.fnGetData(objrow);
                       
            await Utilitario.GenerarFormatoArchivoClinico(row.idPaciente);

        });

        $('#GeneraFormatoFiliacionArchivoClinico').on('click', async function () {
            let objrow = oTable_TriajeRn.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_TriajeRn.fnGetData(objrow);

            var url = "/Citas/ImprimeFormatoFiliacionArchivoClinico?area=ConsultaExterna&idPaciente=" + row.idPaciente + "&idCita=" + 0
            $('#ifrmTicketCita').attr('src', url)

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalTicket").modal('show')
        })

        ////////////////////////REGISTRO DE NACIMIENTOS///////////////////////////////////
        $('.buscarNacimiento').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnBuscarNacimiento").click();
            }
        });

        $('#btnCambiarNacimiento').on('click', async function () {
            await TriajeRn.LimpiarDatosMadre();
        });

        $('#btnBuscarNacimiento').on('click', async function () {
            if (isEmpty($("#txtNroNacimiento").val())) {
                alerta2("info", "", 'Ingrese un número de nacimiento.');
                return false;
            }
            
            TriajeRn.LimpiarDatosMadre();
            TriajeRn.LimpiarCamposRegistro();
            TriajeRn.DeshabilitarRegistro();                 
            const resp = await TriajeRn.SeleccionarRegistroNacimiento($("#txtNroNacimiento").val());
            if (resp) {
                TriajeRn.CargarDatosMadrePorRegistroNacimiento(resp);                
            }
        });

        $('#btnListarRegistroNacimiento').on('click', async function () {
            await TriajeRn.ListarRegistroNacimiento();
            $("#modalRegistroNacimiento").modal("show");
        });

        $('#tblRegistroNacimientos tbody').on('click', 'tr', function () {
            oTable_RegistroNacimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#btnCargarRegistroNacimiento').on('click', async function () {
            let objrowTb = oTable_RegistroNacimientos.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            TriajeRn.LimpiarDatosMadre();
            TriajeRn.LimpiarCamposRegistro();
            TriajeRn.DeshabilitarRegistro();            
            const resp = await TriajeRn.SeleccionarRegistroNacimiento(objrowTb.idRegistroNacimiento);
            if (resp) {
                TriajeRn.CargarDatosMadrePorRegistroNacimiento(resp);
                $("#modalRegistroNacimiento").modal("hide");
            }
        });

        $('#btnCerrarModalRegistroNacimiento').on('click', function () {
            oTable_RegistroNacimientos.fnClearTable();
            $("#modalRegistroNacimiento").modal("hide");
        });


    },
    
    DataTableBusqueda() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    targets: 1,
                    data: "idTriajeRn",
                    visible: false,
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    data: "idCuentaAtencionRn",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (!isEmpty(rowData.idServicioNacimiento)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    targets: 3,
                    data: "nroHistoriaClinicaRn",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 4,
                    data: "nombresRn",
                    width: "18%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 5,
                    data: "fechaNacRn",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "sexoRn",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 7,
                    data: "tipoGestacion",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 8,
                    data: "fetos",
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 9,
                    data: "gemelar",
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 10,
                    data: "condicion",
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 11,
                    data: "fechaHoraApertura",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }, 
                {
                    targets: 12,
                    data: null,
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        btnImprimeBrazalete = '<button type="button" class="btn btn-sm btn-unique GenerarBrazalete"><i class="fa-light fa-rectangle-barcode"></i></button>';
                        $(td).html(btnImprimeBrazalete);
                    }
                },
                {
                    targets: 12,
                    data: null,
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        btnImprimeBrazalete = '<button type="button" class="btn btn-sm btn-teal GeneraFormatoFiliacionArchivoClinico"><i class="fa fi fi-ss-treatment"></i></button>';
                        $(td).html(btnImprimeBrazalete);
                    }
                },
            ]
        }
        
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TriajeRn = $("#tblTriajeRn").dataTable(parms);
    },

    DataTableRegistroNacimientos() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '40vh',
            autoWidth: false,
            columns: [
                {
                    targets: 1,
                    data: "idRegistroNacimiento",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    data: "idCuentaAtencionMadre",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 3,
                    data: "nroHistoriaMadre",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 4,
                    data: "pacienteMadre",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 5,
                    data: "fechaHoraNacimientoRn",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "sexoRn",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 7,
                    data: "tipoGestacion",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 8,
                    data: "fetos",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 9,
                    data: "gemelar",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 10,
                    data: "condicion",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    targets: 11,
                //    data: "fecha",
                //    width: "9%",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_RegistroNacimientos = $("#tblRegistroNacimientos").dataTable(parms);
    },

    LLenarCombos() {        

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoSexo').empty();
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboTipoSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
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
                TriajeRn.gemelar = datos.table;
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

        //$.ajax({
        //    async: false,
        //    cache: false,
        //    url: "/RecienNacido/ListarTiemposClampaje?area=Hospitalizacion",
        //    datatype: "json",
        //    type: "get",
        //    success: function (datos) {
        //        $('#cboTiempoClampaje').empty();
        //        $(datos.table).each(function (i, obj) {
        //            $('#cboTiempoClampaje').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
        //        });
        //    },
        //    error: function (msg) {
        //        setTimeout(function () {
        //            alerta("ERROR", "Error listar condición!", "2");
        //        }, 900)
        //    }
        //});

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
            url: "/RecienNacido/ListarTiemposContactoPielaPiel?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTiempoContactoPiel').empty();
                $('#cboTiempoContactoPielPartoVaginal').empty();
                $('#cboTiempoContactoPielCesarea').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTiempoContactoPiel').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboTiempoContactoPielPartoVaginal').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboTiempoContactoPielCesarea').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar Tiempo Contacto piel a piel!", "2");
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
                    alerta("ERROR", "Error listar tipo procedencia!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposReanimacionRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoReanimacionRn').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoReanimacionRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos reanimacion!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposTransporteRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoTransporteRn').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoTransporteRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos transporte!", "2");
                }, 900)
            }
        });

        var formData = new FormData();
        formData.append('IdTipoServicio', 0);
        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListarServicioPorTipoServicio?area=Comun",
            data: JSON.stringify(formData),
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboServicioNacimiento').empty();
                $('#cboServicioNacimiento').append('<option value=""></option>');

                $('#cboServicioNacimiento').append('<option  value="72">CENTRO OBSTETRICO</option>');
                $('#cboServicioNacimiento').append('<option  value="88">CENTRO QUIRURGICO</option>');
                $(datos.respuesta.table).each(function (i, obj) {
                    if ((obj.idServicio >= 2 && obj.idServicio <= 6) || (obj.idServicio >= 65 && obj.idServicio <= 68)) {
                        $('#cboServicioNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
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
            url: "/RecienNacido/ListarServiciosIngresoRecienNacido?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboServicioIngreso').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboServicioIngreso').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos transporte!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarDiagnosticosIngresoRecienNacido?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboDiagnosticoIngreso').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboDiagnosticoIngreso').append('<option  value="' + obj.valor + '">(' + obj.codigoCIE10 + ') ' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos transporte!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Medicos/ListarMedicosTodos?area=Seguridad",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboMedicoIngreso').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboMedicoIngreso').append('<option  value="' + obj.idMedico + '">' + obj.apNom + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos transporte!", "2");
                }, 900)
            }
        });

    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async ListarTriajeRecienNacido() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if ($("#txtNroCuentaRnBusq").val() == "" && $("#txtNroHistoriaRnBusq").val() == "" && $("#txtNroDocumentoRnBusq").val() == "" && /*$("#txtNroHistoriaBusq").val() == "" &&*/
            $("#txtNroCuentaMadreBusq").val() == "" && $("#txtNroHistoriaMadreBusq").val() == "" && $("#txtNroDocumentoMadreBusq").val() == "" &&
            $("#txtFechaNacimientoBusq").val() == "") {
            alerta2("info", "", "Por favor ingrese algun de los filtros de busqueda.");
            return false;
        }
                
        data.append('NroCuentaRn', $("#txtNroCuentaRnBusq").val());
        data.append('NroHistoriaRn', $("#txtNroHistoriaRnBusq").val());
        data.append('NroDocumentoRn', $("#txtNroDocumentoRnBusq").val());
        data.append('NroCuentaMadre', $("#txtNroCuentaMadreBusq").val());
        data.append('NroHistoriaMadre', $("#txtNroHistoriaMadreBusq").val());
        data.append('NroDocumentoMadre', $("#txtNroDocumentoMadreBusq").val());
        data.append('FechaNacimiento', $("#txtFechaNacimientoBusq").val());


        try {
            Cargando(1);
            oTable_TriajeRn.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TriajeRecienNacido/ListarTriajeRn?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_TriajeRn.fnAddData(datos.respuesta.table);
                oTable_TriajeRn.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarTriajeRecienNacido() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        var objrow = oTable_TriajeRn.api(true).row('.selected').data();
        if (isEmpty(objrow)) {
            alerta2("info", "", "Debe seleccionar un registro de triaje.");
            return false;
        }

        data.append('NroTriajeRn', objrow.idTriajeRn);

        try {
            Cargando(1);            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TriajeRecienNacido/SeleccionarTriajeRn?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                await TriajeRn.CargarDatosAlForm(datos.respuesta.table[0]);
                resp = true;
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    async BuscarCuentaMadre() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCuenta', $("#txtNroCuentaMadre").val());


        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstAtenciones.table.length > 0) {
                resp = datos.lstAtenciones.table[0];
                TriajeRn.CargarDatosMadre(resp);
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async  GuardarTriajeRecienNacido() {

        if (TriajeRn.ValidarCampos() == false) {
            return false;
        }

        let resp = false;
        let obito = '';
        //debugger;
        if ($("#rdbObitoNo").is(":checked") == false && $("#rdbObitoSiMenor").is(":checked") == false && $("#rdbObitoSiMayor").is(":checked") == false) {
            alerta2("info", "", "Debe seleccionar el Óbito.");
        } else {
            if ($("#rdbObitoNo").is(":checked")) { obito = 'No' } else if ($("#rdbObitoSiMenor").is(":checked")) { obito = 'Menor' } else { obito = 'Mayor' }
        }
        
        let midata = new FormData();
        midata.append("idTriajeRn", TriajeRn.idTriajeRn);
        midata.append("idRegistroNacimiento", TriajeRn.idRegistroNacimiento); 
        midata.append("idCuentaAtencionMadre", TriajeRn.idCuentaMadre); 
        midata.append("idCuentaAtencion", TriajeRn.idCuentaAtencion); 
        midata.append("idPaciente", TriajeRn.idPaciente); 
        
        midata.append("FechaNacimiento", $("#txtFechaNacimiento").val());
        midata.append("HoraNacimiento", $("#txtHoraNacimiento").val());
        midata.append("IdTipoSexo", $("#cboTipoSexo").val());
        midata.append("IdTipoGestacion", $("#cboTipoGestacion").val());
        midata.append("Fetos", $("#txtNroFetos").val());
        midata.append("NroGemelar", $("#cboNumeroGemelar").val());
        midata.append("idCondicion", $("#cboCondicion").val());
        midata.append("Obito", obito);

        midata.append("Peso", $("#txtPeso").val());
        midata.append("Talla", $("#txtTalla").val());
        midata.append("PerimetroCefalico", $("#txtPerCefalico").val());
        midata.append("PerimetroToracico", $("#txtPerToracico").val());
        midata.append("EdadGestacional", $("#txtEdadGestacional").val());

        midata.append("ClampadoTardio", $("#rdbTardioSi").is(":checked") == true ? 1 : ($("#rdbTardioNO").is(":checked") == true ? 0 : null));
        midata.append("IdTiempoClampaje", $("#cboTiempoClampaje").val());
        midata.append("FechaClamp", null);
        midata.append("HoraClamp", null);
                
        midata.append("Lactancia1raHora", $("#rdbLacthoraSi").is(":checked") == true ? 1 : ($("#rdbLacthoraNO").is(":checked") == true ? 0 : null));
        midata.append("TiempoLactancia", $("#txtTiempoLactancia").val());

        midata.append("IdContactoPielaPiel", $("#cboContactoPiel").val());
        midata.append("ContactoPielaPiel", $("#rdbContactoPielSi").is(":checked") == true ? 1 : ($("#rdbContactoPielNo").is(":checked") == true ? 0 : null));
        midata.append("IdTiempoContactoPielaPiel", $("#cboTiempoContactoPiel").val());
        midata.append("EfectividadContactoPielaPiel", $("#rdbEfectividadContactoPielSi").is(":checked") == true ? 1 : ($("#rdbEfectividadContactoPielNo").is(":checked") == true ? 0 : null));
        midata.append("DescripcionContactoPielaPiel", $("#txtDescripcionContactoPielaPiel").val());

        // midata.append("IdContactoPielaPielPartoVaginal", $("#cboContactoPiel").val());
        midata.append("ContactoPielaPielPartoVaginal", $("#rdbContactoPielPartoVaginalSi").is(":checked") == true ? 1 : ($("#rdbContactoPielPartoVaginalNo").is(":checked") == true ? 0 : null));
        midata.append("IdTiempoContactoPielaPielPartoVaginal", $("#cboTiempoContactoPielPartoVaginal").val());
        midata.append("EfectividadContactoPielaPielPartoVaginal", $("#rdbEfectividadContactoPielPartoVaginalSi").is(":checked") == true ? 1 : ($("#rdbEfectividadContactoPielPartoVaginalNo").is(":checked") == true ? 0 : null));


        
        midata.append("ContactoPielaPielCesarea", $("#rdbContactoPielCesareaSi").is(":checked") == true ? 1 : ($("#rdbContactoPielCesareaNo").is(":checked") == true ? 0 : null));
        midata.append("IdTiempoContactoPielaPielCesarea", $("#cboTiempoContactoPielCesarea").val());
        midata.append("EfectividadContactoPielaPielCesarea", $("#rdbEfectividadContactoPielCesareaSi").is(":checked") == true ? 1 : ($("#rdbEfectividadContactoPielCesareaNo").is(":checked") == true ? 0 : null));



        midata.append("IdServicioNacimiento", $("#cboServicioNacimiento").val());
        midata.append("IdOtraProcedencia", $("#cboProcedenciaRn").val());

        midata.append("IdServicioIngreso", $("#cboServicioIngreso").val());
        midata.append("IdDiagnosticoIngreso", $("#cboDiagnosticoIngreso").val());
        midata.append("IdMedicoIngreso", $("#cboMedicoIngreso").val());

        midata.append("Inmediato", $("#rdbInmediatoSi").is(":checked") == true ? 1 : ($("#rdbInmediatoNO").is(":checked") == true ? 0 : null));
        midata.append("Reanimacion", $("#rdbReanimacionSi").is(":checked") == true ? 1 : ($("#rdbReanimacionNO").is(":checked") == true ? 0 : null));
        midata.append("IdTipoReanimacion", $("#cboTipoReanimacionRn").val());
        midata.append("AlMinuto", $("#txtMinuto").val());
        midata.append("Alos5Minutos", $("#txt5Minuto").val());
        midata.append("Alos10Minutos", $("#txt10Minuto").val());
        midata.append("Alos15Minutos", $("#txt15Minuto").val());
        midata.append("Alos20Minutos", $("#txt20Minuto").val());
        midata.append("Patologia", $("#rdbPatNeoSi").is(":checked") == true ? 1 : ($("#rdbPatNeoNo").is(":checked") == true ? 0 : null));
        midata.append("Especificar", $('#txtEspecificar').val());
        midata.append("Transporte", $("#rdbTransporteSi").is(":checked") == true ? 1 : ($("#rdbTransporteNO").is(":checked") == true ? 0 : null));
        midata.append("IdTipoTransporte", $("#cboTipoTransporteRn").val());

        midata.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TriajeRecienNacido/GuardarTriajeRecienNacido?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
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
                        MostrarAreaLista();
                        TriajeRn.LimpiarCamposRegistro();
                        TriajeRn.ListarTriajeRecienNacido();
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

    async EliminarTriajeRecienNacido() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        var objrow = oTable_TriajeRn.api(true).row('.selected').data();
        if (isEmpty(objrow)) {
            alerta2("info", "", "Debe seleccionar un registro de triaje.");
            return false;
        }

        data.append('NroTriajeRn', objrow.idTriajeRn);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TriajeRecienNacido/EliminarTriajeRn?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta) {               
                resp = true;
            }
            else {
                resp = false;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    ///////////////////REGISTRO DE NACIMIENTO///////////////////////////////////////////////
    async ListarRegistroNacimiento() {
        let resp = false;
        let midata = new FormData();
        //let lstDiagnosticoRn = '[]';                           

        ////////////////////////NEONATAO/////////////////////////////////       
        //midata.append("idRegistroNacimiento", idRegistroNacimiento);
        //midata.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            oTable_RegistroNacimientos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/ListarRegistroNacimiento?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    //datos = datos.respuesta.table[0];
                    oTable_RegistroNacimientos.fnAddData(datos.respuesta.table);
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarRegistroNacimiento(idRegistroNacimiento) {
        var respuesta;
        var resp = null;
        let datos
        var data = new FormData();

        data.append('idRegistroNacimiento', idRegistroNacimiento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/SeleccionarRegistroNacimiento?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////FUNCIONES/////////////////////////////////////////////////////////////////////
    CargarDatosMadre(datos) {
        //console.log("CANTIDA:" + datos.length);
        if (datos != null) {
            TriajeRn.idCuentaMadre = datos.idCuentaAtencion;
            FiliacionRn.idCuentaAtencionMadre = datos.idCuentaAtencion;
            TriajeRn.idRegistroNacimiento = 0;            
            $("#txtNroHistoriaMadre").val(datos.nroHistoriaClinica);
            $("#txtNombreMadre").val(datos.apellidoPaterno + ' ' + datos.apellidoMaterno + ' ' + datos.nombres);
            $("#txtEdadMadre").val(datos.edad);
            $("#txtTipoDocMadre").val(datos.dTipoDocumento);
            $("#txtNroDocMadre").val(datos.nroDocumento);
            $("#txtEstadoCivilMadre").val(datos.dEstadoCivil);
            $("#txtGradoInstruccionMadre").val(datos.dGradoInstruccion);

            $("#txtFechaNacimiento").datepicker("setDate", datos.fechaNacimientoRn);
            $("#txtHoraNacimiento").val(datos.horaNacimientoRn);
            $("#cboTipoSexo").val(datos.idTipoSexoRn);
            $("#cboTipoSexo").trigger("chosen:updated");
            $("#cboTipoGestacion").val(datos.idTipoGestacionRn);
            $("#cboTipoGestacion").trigger("chosen:updated");
            TriajeRn.TipoGestacion_Change();
            $("#txtNroFetos").val(datos.fetosRn);
            TriajeRn.Fetos_Change();
            $("#cboNumeroGemelar").val(datos.nroGemelarRn);
            $("#cboNumeroGemelar").trigger("chosen:updated");

            $("#frmContactoPielaPiel_V2").show();

            TriajeRn.HabilitarRegistro();
        }        
    },

    CargarDatosMadrePorRegistroNacimiento(datos) {
        //console.log("CANTIDA:" + datos.length);
        if (datos != null) {
            TriajeRn.idCuentaMadre = datos.idCuentaAtencionMadre;
            FiliacionRn.idCuentaAtencionMadre = datos.idCuentaAtencionMadre;
            TriajeRn.idRegistroNacimiento = datos.idRegistroNacimiento;
            $("#txtNroNacimiento").val(datos.idRegistroNacimiento);
            $("#txtNroCuentaAtencionMadre").val(datos.idCuentaAtencionMadre);
            $("#txtNroHistoriaMadre").val(datos.nroHistoriaMadre);
            $("#txtNombreMadre").val(datos.pacienteMadre);
            $("#txtEdadMadre").val(datos.edadMadre);
            $("#txtTipoDocMadre").val(datos.tipoDocMadre);
            $("#txtNroDocMadre").val(datos.nroDocMadre);
            //$("#txtEstadoCivilMadre").val(datos.dEstadoCivil);
            //$("#txtGradoInstruccionMadre").val(datos.dGradoInstruccion);

            $("#txtFechaNacimiento").datepicker("setDate", datos.fechaNacimientoRn);
            $("#txtHoraNacimiento").val(datos.horaNacimientoRn);
            $("#cboTipoSexo").val(datos.idTipoSexo);
            $("#cboTipoSexo").trigger("chosen:updated");
            $("#cboTipoGestacion").val(datos.idTipoGestacion);
            $("#cboTipoGestacion").trigger("chosen:updated");            
            TriajeRn.TipoGestacion_Change();
            $("#txtNroFetos").val(datos.fetos);
            TriajeRn.Fetos_Change();
            $("#cboNumeroGemelar").val(datos.nroGemelar);
            $("#cboNumeroGemelar").trigger("chosen:updated");
            $("#cboCondicion").val(datos.idTipoGestacion);
            TriajeRn.Condicion_Change();
            $("#cboCondicion").trigger("chosen:updated");

            $("#frmContactoPielaPiel_V2").show();            

            TriajeRn.HabilitarRegistro();

            
            $("#txtFechaNacimiento").prop("disabled", true);
            $("#txtHoraNacimiento").prop("disabled", true);
            $("#cboTipoSexo").prop("disabled", true);
            $("#cboTipoGestacion").prop("disabled", true);
            $("#txtNroFetos").prop("disabled", true);
            $("#cboNumeroGemelar").prop("disabled", true);
            $("#cboCondicion").prop("disabled", true);
            $(".rdbObito").prop("disabled", true);
            $('.chzn-select').chosen().trigger("chosen:updated");
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            
            
        }
    },

    LimpiarDatosMadre() {
        TriajeRn.idCuentaMadre = 0;
        TriajeRn.idRegistroNacimiento = 0;
        FiliacionRn.idCuentaAtencionMadre = 0;
        $("#txtNroNacimiento").val('');
        $("#txtNroCuentaAtencionMadre").val('');
        $("#txtNroCuentaMadre").val('');        
        $("#txtNroHistoriaMadre").val('');
        $("#txtNombreMadre").val('');
        $("#txtEdadMadre").val('');
        $("#txtTipoDocMadre").val('');
        $("#txtNroDocMadre").val('');
        $("#txtEstadoCivilMadre").val('');
        $("#txtGradoInstruccionMadre").val('');
        TriajeRn.DeshabilitarRegistro();
    },

    TipoGestacion_Change() {
        $('#cboNumeroGemelar').empty();
        if ($('#cboTipoGestacion').val() == 1) {
            //console.log(medobsenf);
            $(TriajeRn.gemelar).each(function (i, obj) {
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
            if ($('#txtNroFetos').val() == '') {
                $('#txtNroFetos').val('');
                $('#cboNumeroGemelar').val('');
            }            
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
            $(TriajeRn.gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
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
                $(TriajeRn.gemelar).each(function (i, obj) {
                    //console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });

                $('#cboNumeroGemelar').val('0');
            }
        }
                
        $("#cboNumeroGemelar").trigger("chosen:updated");
    },

    Condicion_Change() {  
        $("#ObitoPeso").hide();
        $(".rdbObito").attr('disabled', true);
        if ($("#cboCondicion").val() == 1) {
            $("#ObitoPeso").hide();
            $(".rdbObito").prop('checked', false);
            $('#rdbObitoNo').prop('checked', true);
            $(".rdbObito").attr('disabled', true);
        }
        else if ($("#cboCondicion").val() == 3) {
            //$("#txtEspecificar").val("");
            $("#ObitoPeso").show();
            $(".rdbObito").removeAttr('disabled', 'disabled');
        } 
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

    Reanimacion_Change() {
        if ($("#rdbReanimacionSi").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbReanimacionNO").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").attr('disabled', true);
        } else {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").attr('disabled', true);
        }
        $("#cboTipoReanimacionRn").trigger("chosen:updated");
    },

    Transporte_Change() {
        if ($("#rdbTransporteSi").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbTransporteNO").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").attr('disabled', true);
        } else {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").attr('disabled', true);
        }
        $("#cboTipoTransporteRn").trigger("chosen:updated");
    },

    async ClampajeTardio_Change() {
        let tiempos = await TriajeRn.ListarTiemposClampaje();
        if ($("#rdbTardioSi").is(":checked")) {
            $("#cboTiempoClampaje").val("");
            $("#cboTiempoClampaje").removeAttr('disabled', 'disabled');            
            $(tiempos).each(function (i, obj) {
                if (obj.valor != 4) {
                    $('#cboTiempoClampaje').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }                
            });
        }
        else if ($("#rdbTardioNO").is(":checked")) {
            $("#cboTiempoClampaje").val(4);
            $("#cboTiempoClampaje").attr('disabled', true);
            $(tiempos).each(function (i, obj) {
                if (obj.valor == 4) {
                    $('#cboTiempoClampaje').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
        } else {
            $('#cboTiempoClampaje').empty();
            $("#cboTiempoClampaje").val("");
            $("#cboTiempoClampaje").attr('disabled', true);
        }
        $("#cboTiempoClampaje").trigger("chosen:updated");
    },

    async TiempoContactoPielaPiel_Change() {
        if ($("#rdbContactoPielSi").is(":checked")) {
            $("#cboTiempoContactoPiel").val(4);
            $("#optTiempoContactoPielaPiel").show();
            $("#desContactoPielaPiel").hide();
        }
        else if ($("#rdbContactoPielNo").is(":checked")) {
            $("#cboTiempoContactoPiel").val("");
            $("#optTiempoContactoPielaPiel").hide();
            $("#desContactoPielaPiel").show();
            
        } else {           
            $("#cboTiempoContactoPiel").val("");
            $("#optTiempoContactoPielaPiel").hide();
            $("#desContactoPielaPiel").hide();
        }
        $("#cboTiempoContactoPiel").trigger("chosen:updated");
    },

    async TiempoContactoPielaPielPartoVaginal_Change() {
        if ($("#rdbContactoPielPartoVaginalSi").is(":checked")) {
            $("#cboTiempoContactoPielPartoVaginal").val("");
            $("#optTiempoContactoPielaPielPartoVaginal").show();
        }
        else if ($("#rdbContactoPielPartoVaginalNo").is(":checked")) {
            $("#cboTiempoContactoPielPartoVaginal").val("");
            $("#optTiempoContactoPielaPielPartoVaginal").hide();
            
        } else {           
            $("#cboTiempoContactoPielPartoVaginal").val("");
            $("#optTiempoContactoPielaPielPartoVaginal").hide();
        }
        $("#cboTiempoContactoPielPartoVaginal").trigger("chosen:updated");
    },

    async TiempoContactoPielaPielCesarea_Change() {
        if ($("#rdbContactoPielCesareaSi").is(":checked")) {
            $("#cboTiempoContactoPielCesarea").val("");
            $("#optTiempoContactoPielaPielCesarea").show();
        }
        else if ($("#rdbContactoPielCesareaNo").is(":checked")) {
            $("#cboTiempoContactoPielCesarea").val("");
            $("#optTiempoContactoPielaPielCesarea").hide();
            
        } else {           
            $("#cboTiempoContactoPielCesarea").val("");
            $("#optTiempoContactoPielaPielCesarea").hide();
        }
        $("#cboTiempoContactoPielCesarea").trigger("chosen:updated");
    },

    async ListarTiemposClampaje() {
        let resp = null;
        await $.ajax({
            //async: false,
            cache: false,
            url: "/RecienNacido/ListarTiemposClampaje?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTiempoClampaje').empty();
                resp = datos.table;                
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar condición!", "2");
                }, 900)
            }
        });

        return resp;
    },

    async CargarDatosAlForm(datos) {
        TriajeRn.idTriajeRn = datos.idTriajeRn;        
        TriajeRn.idCuentaMadre = datos.idCuentaMadre;

        TriajeRn.idCuentaAtencion = datos.idCuentaAtencionRn;
        TriajeRn.idPaciente = datos.idPacienteRn;

        //TriajeRn.idRegistroNacimiento = datos.idRegistroNacimiento;

        TriajeRn.idRegistroRn = isNull(datos.idRegistroRn, 0);

        if (TriajeRn.idRegistroRn > 0) {
            $("#GenerarBrazalete").show();
            $("#btnGuardarTriajeRn").hide();
            $("#notaRegistroTriaje").show();
        } else {
            $("#notaRegistroTriaje").hide();
        }

        if (TriajeRn.idTriajeRn > 0) {
            $("#GenerarBrazalete").show();
        } else {
            $("#GenerarBrazalete").hide();
        }

        
        $("#txtNroNacimiento").val(datos.idRegistroNacimiento);
        $("#txtNroCuentaAtencionMadre").val(datos.idCuentaMadre);

        $("#txtNroCuentaMadre").val(datos.idCuentaMadre);
        $("#txtNroHistoriaMadre").val(datos.nroHistoriaClinica);
        $("#txtNombreMadre").val(datos.madre);
        $("#txtEdadMadre").val(datos.edadMadre);
        $("#txtTipoDocMadre").val(datos.tipoDocMadre);
        $("#txtNroDocMadre").val(datos.nroDocMadre);

        $("#txtNroCuentaNeonato").val(datos.idCuentaAtencionRn);
        $("#txtNroHistoriaNeonato").val(datos.nroHistoriaClinicaRn);
        $("#txtNombreNeonato").val(datos.nombresRn);
        let edad = null;
        if (!isEmpty(datos.fechaNacimientoRn)) {
            edad = CalcularEdadAnioMesDia(datos.fechaNacimientoRn);
            $("#txtEdadAnioNeonato").val(edad.años);
            $("#txtEdadMesNeonato").val(edad.meses);
            $("#txtEdadDiaNeonato").val(edad.dias);
        } else {
            edad = CalcularEdadAnioMesDia(datos.fechaNacimientoRn1);
            $("#txtEdadAnioNeonato").val(edad.años);
            $("#txtEdadMesNeonato").val(edad.meses);
            $("#txtEdadDiaNeonato").val(edad.dias);
        }         

        $("#txtFechaNacimiento").datepicker("setDate", datos.fechaNacimientoRn1);
        $("#txtHoraNacimiento").val(datos.horaNacimiento);
        $("#cboTipoSexo").val(datos.idTipoSexo);
        $("#cboTipoSexo").trigger("chosen:updated");
        $("#cboTipoGestacion").val(datos.idTipoGestacion);
        $("#cboTipoGestacion").trigger("chosen:updated");
        TriajeRn.TipoGestacion_Change();
        $("#txtNroFetos").val(datos.fetos);
        TriajeRn.Fetos_Change();
        $("#cboNumeroGemelar").val(datos.nroGemelar);
        $("#cboNumeroGemelar").trigger("chosen:updated");
        $("#cboCondicion").val(datos.idCondicion);
        $("#cboCondicion").trigger("chosen:updated");
        TriajeRn.Condicion_Change();
        if (datos.obito == "No") {
            $('#rdbObitoNo').prop('checked', true);
        } else if (datos.obito == "Menor") {
            $('#rdbObitoSiMenor').prop('checked', true);
        } else if (datos.obito == "Mayor") {
            $('#rdbObitoSiMayor').prop('checked', true);
        }       
        
        $("#txtPeso").val(datos.peso);
        $("#txtTalla").val(datos.talla);
        $("#txtPerCefalico").val(datos.perimetroCefalico);
        $("#txtPerToracico").val(datos.perimetroToracico);
        $("#txtEdadGestacional").val(datos.edadGes);

        if (datos.clampadoTardio == true) {
            $('#rdbTardioSi').prop('checked', true);
        } else if (datos.clampadoTardio == false) {
            $('#rdbTardioNO').prop('checked', true);
        }
        await TriajeRn.ClampajeTardio_Change();

        $("#cboTiempoClampaje").val(datos.idTiempoClampaje);
        $("#cboTiempoClampaje").trigger("chosen:updated");

        if (datos.lactancia1raHora == true) {
            $('#rdbLacthoraSi').prop('checked', true);
        } else if (datos.lactancia1raHora == false) {
            $('#rdbLacthoraNO').prop('checked', true);
        }
        $("#txtTiempoLactancia").val(datos.tiempoLactancia);

        if (datos.idContactoPielaPiel > 0) {
            $("#frmContactoPielaPiel_V1").show();
            $("#cboContactoPiel").val(datos.idContactoPielaPiel);
            $("#cboContactoPiel").trigger("chosen:updated");
        } else {
            $("#frmContactoPielaPiel_V2").show();
            if (datos.contactoPielaPiel == 1) {
                $('#rdbContactoPielSi').prop('checked', true);
            } else if (datos.contactoPielaPiel == 0) {
                $('#rdbContactoPielNo').prop('checked', true);
            }

            if (datos.contactoPielaPielPartoVaginal == 1) {
                $('#rdbContactoPielPartoVaginalSi').prop('checked', true);
            } else if (datos.contactoPielaPielPartoVaginal == 0) {
                $('#rdbContactoPielPartoVaginalNo').prop('checked', true);
            }

            if (datos.contactoPielaPielCesarea == 1) {
                $('#rdbContactoPielCesareaSi').prop('checked', true);
            } else if (datos.contactoPielaPiel == 0) {
                $('#rdbContactoPielCesareaNo').prop('checked', true);
            }

            await TriajeRn.TiempoContactoPielaPiel_Change();
            await TriajeRn.TiempoContactoPielaPielPartoVaginal_Change();
            await TriajeRn.TiempoContactoPielaPielCesarea_Change();

            $("#cboTiempoContactoPiel").val(datos.idTiempoContactoPielaPiel);
            $("#cboTiempoContactoPiel").trigger("chosen:updated");

            $("#cboTiempoContactoPielPartoVaginal").val(datos.idTiempoContactoPielaPielPartoVaginal);
            $("#cboTiempoContactoPielPartoVaginal").trigger("chosen:updated");

            $("#cboTiempoContactoPielCesarea").val(datos.idTiempoContactoPielaPielCesarea);
            $("#cboTiempoContactoPielCesarea").trigger("chosen:updated");

            
            $("#txtDescripcionContactoPielaPiel").val(datos.descripcionContactoPielaPiel);

            if (datos.efectividadContactoPielaPiel == 1) {
                $('#rdbEfectividadContactoPielSi').prop('checked', true);
            } else if (datos.efectividadContactoPielaPiel == 0) {
                $('#rdbEfectividadContactoPielNo').prop('checked', true);
            }

            if (datos.efectividadContactoPielaPielPartoVaginal == 1) {
                $('#rdbEfectividadContactoPielPartoVaginalSi').prop('checked', true);
            } else if (datos.efectividadContactoPielaPielPartoVaginal == 0) {
                $('#rdbEfectividadContactoPielPartoVaginalNo').prop('checked', true);
            }

            if (datos.efectividadContactoPielaPielCesarea == 1) {
                $('#rdbEfectividadContactoPielCesareaSi').prop('checked', true);
            } else if (datos.efectividadContactoPielaPielCesarea == 0) {
                $('#rdbEfectividadContactoPielCesareaNo').prop('checked', true);
            }
        }
                        
        $("#cboServicioNacimiento").val(datos.idServicioNacimiento);
        $("#cboServicioNacimiento").trigger("chosen:updated");
        $("#cboProcedenciaRn").val(datos.idOtraProcedencia); 
        $("#cboProcedenciaRn").trigger("chosen:updated");

        $("#cboServicioIngreso").val(datos.idServicioIngreso);
        $("#cboServicioIngreso").trigger("chosen:updated");
        $("#cboDiagnosticoIngreso").val(datos.idDiagnosticoIngreso);
        $("#cboDiagnosticoIngreso").trigger("chosen:updated");
        $("#cboMedicoIngreso").val(datos.idMedicoIngreso);
        $("#cboMedicoIngreso").trigger("chosen:updated");

        
        $("#txtTipoParto").val(datos.tipoParto);


        $("#cboServicioNacimiento").prop("disabled", true);
        $("#cboProcedenciaRn").prop("disabled", true);
        
        $("#txtTipoParto").prop("disabled", true);
        
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

        //$("#txtFechaClampaje").datepicker("setDate", datos.fechaClampajeRn);
        //$("#txtHoraClampaje").val(datos.horaClampaje);
        
       
        if (datos.inmediato == true) {
            $('#rdbInmediatoSi').prop('checked', true);
        } else if (datos.inmediato == false) {
            $('#rdbInmediatoNO').prop('checked', true);
        }

        if (datos.reanimacion == true) {
            $('#rdbReanimacionSi').prop('checked', true);
        } else if (datos.reanimacion == false) {
            $('#rdbReanimacionNO').prop('checked', true);
        }
        TriajeRn.Reanimacion_Change();
        $("#cboTipoReanimacionRn").val(datos.idTipoReanimacion);
        $("#cboTipoReanimacionRn").trigger("chosen:updated");

        $("#txtMinuto").val(datos.alMinuto);
        $("#txt5Minuto").val(datos.alos5Minutos);
        $("#txt10Minuto").val(datos.alos10Minutos);
        $("#txt15Minuto").val(datos.alos15Minutos);
        $("#txt20Minuto").val(datos.alos20Minutos);
        
        if (datos.patologiaNeonatal == true) {
            $('#rdbPatNeoSi').prop('checked', true);
        } else if (datos.patologiaNeonatal == false) {
            $('#rdbPatNeoNo').prop('checked', true);
        }
        TriajeRn.PatNeo_Change();
        $("#txtEspecificar").val(datos.especificar);        

        if (datos.transporte == true) {
            $('#rdbTransporteSi').prop('checked', true);
        } else if (datos.transporte == false) {
            $('#rdbTransporteNO').prop('checked', true);
        }
        TriajeRn.Transporte_Change();
        $("#cboTipoTransporteRn").val(datos.idTipoTransporte);
        $("#cboTipoTransporteRn").trigger("chosen:updated");

        Brazalete.idPaciente = 0;
        Brazalete.nroHistoria = 0;
        Brazalete.apellidos = datos.apellidosMadre;
        Brazalete.nombres = datos.nombresMadre;
        Brazalete.tipoDocumento = '';
        Brazalete.nroDocumento = '';
        Brazalete.fechaNacimiento = datos.fechaNacimientoRn;
        Brazalete.horaNacimiento = datos.horaNacimientoRn;
        Brazalete.tipoSexo = datos.sexoRn;
        Brazalete.gemelar = datos.gemelar;

        $("#txtFechaNacimiento").prop("disabled", true);
            $("#txtHoraNacimiento").prop("disabled", true);
            $("#cboTipoSexo").prop("disabled", true);
            $("#cboTipoGestacion").prop("disabled", true);
            $("#txtNroFetos").prop("disabled", true);
            $("#cboNumeroGemelar").prop("disabled", true);
            $("#cboDiagnosticoIngreso").prop("disabled", true);
            $("#cboMedicoIngreso").prop("disabled", true);
            // $("#cboNumeroGemelar").prop("disabled", true);

            $('.chzn-select').chosen().trigger("chosen:updated");
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        if (TriajeRn.tienePermisoRegistroNacimiento > 0) {
            $("#txtNroNacimiento").prop("disabled", true);
            $("#btnBuscarNacimiento").hide();
            $("#btnListarRegistroNacimiento").hide();

            $("#txtFechaNacimiento").prop("disabled", true);
            $("#txtHoraNacimiento").prop("disabled", true);
            $("#cboTipoSexo").prop("disabled", true);
            $("#cboTipoGestacion").prop("disabled", true);
            $("#txtNroFetos").prop("disabled", true);
            $("#cboNumeroGemelar").prop("disabled", true);

            $("#cboCondicion").prop("disabled", true);
            $(".rdbObito").prop("disabled", true);
            $('.chzn-select').chosen().trigger("chosen:updated");
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        }

    },

    ValidarCampos() {
        if (TriajeRn.idCuentaMadre == 0) { alerta2("info", "", "Debe ingresar la cuenta de la madre."); $('#nacimiento-tab-link').trigger('click'); $("#txtNroCuentaMadre").focus(); return false; }
        if ($("#txtFechaNacimiento").val() == '') { alerta2("info", "", "Debe ingresar la fecha de nacimiento."); $('#nacimiento-tab-link').trigger('click'); $("#txtFechaNacimiento").focus(); return false; }
        if ($("#txtHoraNacimiento").val() == '') { alerta2("info", "", "Debe ingresar la hora de nacimiento."); $('#nacimiento-tab-link').trigger('click'); $("#txtHoraNacimiento").focus(); return false; }
        if ($("#cboTipoSexo").val() == null) { alerta2("info", "", "Debe seleccionar el Sexo."); $('#nacimiento-tab-link').trigger('click'); $("#cboTipoSexo").focus(); $("#cboTipoSexo_chosen").addClass("chosen-container-active"); return false; } 
        if ($("#cboTipoGestacion").val() == null) { alerta2("info", "",  "Debe seleccionar el Tipo Gestación."); $('#nacimiento-tab-link').trigger('click'); $("#cboTipoGestacion").focus(); $("#cboTipoGestacion_chosen").addClass("chosen-container-active"); return false; }        
        if ($("#txtNroFetos").val() == '') { alerta2("info", "",  "Debe ingresar el Nro Fetos."); $('#nacimiento-tab-link').trigger('click'); $("#txtNroFetos").focus(); return false; }
        if ($("#cboNumeroGemelar").val() == null) { alerta2("info", "",  "Debe seleccionar el Gemelar."); $('#nacimiento-tab-link').trigger('click'); $("#cboNumeroGemelar").focus(); $("#cboNumeroGemelar_chosen").addClass("chosen-container-active"); return false; }
        //if ($("#cboCondicion").val() == null) { alerta2("info", "",  "Debe seleccionar la Condición."); $('#nacimiento-tab-link').trigger('click'); $("#cboCondicion").focus(); $("#cboCondicion_chosen").addClass("chosen-container-active"); return false; }
        //if ($(".rdbObito").is(':checked') == false) { alerta2("info", "",  "Debe seleccionar el Óbito."); $('#nacimiento-tab-link').trigger('click'); $("#rdbObitoNo").focus(); return false; }

        //////////////////SE COMENTO POR INDICACION QUE ESTO NO SEA OBLIGATORIO////////////////////////////////
        //if ($("#txtPeso").val() == '') { alerta2("info", "", "Debe ingresar el Peso."); $('#nacimiento-tab-link').trigger('click'); $("#txtPeso").focus(); return false; } else if ($('#txtPeso').val() < 100 || $('#txtPeso').val() > 6000) { alerta2("info", "", "El Peso no puede ser menor a 100gr ni mayor a 6000gr."); $('#txtPeso').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtPeso').focus(); return false; }
        //if ($("#txtTalla").val() == '') { alerta2("info", "",  "Debe ingresar la Talla."); $('#nacimiento-tab-link').trigger('click'); $("#txtTalla").focus(); return false; } else if ($('#txtTalla').val() < 13 || $('#txtTalla').val() > 60) { alerta2("info", "",  "La talla no puede ser menor a 13cm ni mayor a 60cm."); $('#txtTalla').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtTalla').focus(); return false; }
        //if ($("#txtPerCefalico").val() == '') { alerta2("info", "",  "Debe ingresar el perimetro Cefálico."); $('#nacimiento-tab-link').trigger('click'); $("#txtPerCefalico").focus(); return false; } else if ($('#txtPerCefalico').val() < 14 || $('#txtPerCefalico').val() > 40) { alerta2("info", "",  "El Perimetro Cefálico no puede ser menor a 14cm ni mayor a 40cm."); $('#txtPerCefalico').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtPerCefalico').focus(); return false; }
        //if ($("#txtPerToracico").val() == '') { alerta2("info", "",  "Debe ingresar el perimetro Torácico."); $('#nacimiento-tab-link').trigger('click'); $("#txtPerToracico").focus(); return false; } else if ($('#txtPerToracico').val() < 15 || $('#txtPerToracico').val() > 45) { alerta2("info", "",  "El Perimetro Toráxio no puede ser menor a 15cm ni mayor a 45cm."); $('#txtPerToracico').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtPerToracico').focus(); return false; }
        //if ($("#txtEdadGestacional").val() == '') { alerta2("info", "", "Debe ingresar la Edad Gestacional."); $('#nacimiento-tab-link').trigger('click'); $("#txtEdadGestacional").focus(); return false; } else if ($('#txtEdadGestacional').val() < 17 || $('#txtEdadGestacional').val() > 42) { alerta2("info", "", "La Edad Gestacional no puede ser menor a 17 ni mayor a 42."); $('#txtEdadGestacional').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtEdadGestacional').focus(); return false; }
        //if ($("#cboTiempoClampaje").val() == null) { alerta(2, "Debe seleccionar el Tiempo de Clampaje."); $('#nacimiento-tab-link').trigger('click'); $("#cboTiempoClampaje").focus(); $("#cboTiempoClampaje_chosen").addClass("chosen-container-active"); return false; }

        //if ($(".rdbTardio").is(':checked') == false) { alerta(2, "Debe seleccionar el Clamp Tardio."); $('#nacimiento-tab-link').trigger('click'); $("#rdbTardioSi").focus(); return false; }
        //if ($("#cboContactoPiel").val() == null) { alerta(2, "Debe seleccionar el Contacto Piel a Piel."); $('#nacimiento-tab-link').trigger('click'); $("#cboContactoPiel").focus(); $("#cboContactoPiel_chosen").addClass("chosen-container-active"); return false; }
        //if ($(".rdbLacthora").is(':checked') == false) { alerta(2, "Debe seleccionar la Lact. 1era Hora."); $('#nacimiento-tab-link').trigger('click'); $("#rdbLacthoraSi").focus(); return false; }
        //if ($("#cboServicioNacimiento").val() == null) { alerta(2, "Debe seleccionar el Servicio de Nacimiento."); $('#nacimiento-tab-link').trigger('click'); $("#cboServicioNacimiento").focus(); $("#cboServicioNacimiento_chosen").addClass("chosen-container-active"); return false; }
        //if ($("#cboProcedenciaRn").val() == null) { alerta(2, "Debe seleccionar la Otra Procedencia."); $('#nacimiento-tab-link').trigger('click'); $("#cboProcedenciaRn").focus(); $("#cboProcedenciaRn_chosen").addClass("chosen-container-active"); return false; }

        //if ($(".rdbInmediato").is(':checked') == false) { alerta2("info", "",  "Debe seleccionar Inmediato."); $('#nacimiento-tab-link').trigger('click'); $("#rdbInmediatoSi").focus(); return false; }
        //if ($(".rdbReanimacion").is(':checked') == false) { alerta2("info", "",  "Debe seleccionar Reanimación."); $('#nacimiento-tab-link').trigger('click'); $("#rdbReanimacionSi").focus(); return false; }
        //if ($("#txtMinuto").val() == '') { alerta2("info", "",  "Debe ingresar Apgar al Minuto."); $('#nacimiento-tab-link').trigger('click'); $("#txtMinuto").focus(); return false; } else if ($('#txtMinuto').val() < 0 || $('#txtMinuto').val() > 10) { alerta2("info", "",  "El Apgar 1 min no puede ser menor a 0 ni mayor a 10."); $('#txtMinuto').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtMinuto').focus(); return false; }
        //if ($("#txt5Minuto").val() == '') { alerta2("info", "", "Debe ingresar Apgar a los 5 min."); $('#nacimiento-tab-link').trigger('click'); $("#txt5Minuto").focus(); return false; } else if ($('#txt5Minuto').val() < 0 || $('#txt5Minuto').val() > 10) { alerta2("info", "", "El Apgar 5 min no puede ser menor a 0 ni mayor a 10."); $('#txt5Minuto').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txt5Minuto').focus(); return false; }
        //if ($("#txt10Minuto").val() == '') { alerta2("info", "", "Debe ingresar Apgar a los 10 min."); $('#nacimiento-tab-link').trigger('click'); $("#txt10Minuto").focus(); return false; } else if ($('#txt10Minuto').val() < 0 || $('#txt10Minuto').val() > 10) { alerta2("info", "", "El Apgar 10 min no puede ser menor a 0 ni mayor a 10."); $('#txt10Minuto').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txt10Minuto').focus(); return false; }
        //if ($("#txt15Minuto").val() == '') { alerta2("info", "", "Debe ingresar Apgar a los 15 min."); $('#nacimiento-tab-link').trigger('click'); $("#txt15Minuto").focus(); return false; } else if ($('#txt15Minuto').val() < 0 || $('#txt15Minuto').val() > 10) { alerta2("info", "", "El Apgar 15 min no puede ser menor a 0 ni mayor a 10."); $('#txt15Minuto').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txt15Minuto').focus(); return false; }
        //if ($("#txt20Minuto").val() == '') { alerta2("info", "", "Debe ingresar Apgar a los 20 min."); $('#nacimiento-tab-link').trigger('click'); $("#txt20Minuto").focus(); return false; } else if ($('#txt20Minuto').val() < 0 || $('#txt20Minuto').val() > 10) { alerta2("info", "", "El Apgar 20 min no puede ser menor a 0 ni mayor a 10."); $('#txt20Minuto').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txt20Minuto').focus(); return false; }
        //if ($(".rdbPatNeo").is(':checked') == false) { alerta2("info", "",  "Debe seleccionar la Patología Neonatal."); $('#nacimiento-tab-link').trigger('click'); $("#rdbPatNeoSi").focus(); return false; }
        //if ($("#rdbPatNeoSi").is(":checked") && $("#txtEspecificar").val() == '') { alerta2("info", "",  "Debe ingresar el Especificar"); $('#nacimiento-tab-link').trigger('click'); $("#txtEspecificar").focus(); return false; }

        return true;
    },

    HabilitarRegistro() {
        $(".field").removeAttr("disabled");    
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#txtNroCuentaMadre").attr('disabled', 'disabled');        
        $("#btnCambiarMadre").show();
        $("#btnBuscarMadre").hide();

        $("#txtNroNacimiento").attr('disabled', 'disabled');
        $("#btnCambiarNacimiento").show();
        $("#btnBuscarNacimiento").hide();

        if (TriajeRn.idRegistroRn > 0) {
            $("#btnGuardarTriajeRn").hide();
            $("#notaRegistroTriaje").show();
        } else {
            $("#btnGuardarTriajeRn").show();
            $("#notaRegistroTriaje").hide();
        }
        TriajeRn.TipoGestacion_Change();
        TriajeRn.Fetos_Change();
        TriajeRn.Condicion_Change();
        TriajeRn.PatNeo_Change();
        TriajeRn.Reanimacion_Change();
        TriajeRn.Transporte_Change();
    },

    DeshabilitarRegistro() {
        $(".field").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

        $("#txtNroCuentaMadre").removeAttr("disabled"); 
        $("#btnBuscarMadre").show();
        $("#btnCambiarMadre").hide();

        $("#txtNroNacimiento").removeAttr("disabled"); 
        $("#btnBuscarNacimiento").show();        
        $("#btnCambiarNacimiento").hide();
        $("#btnListarRegistroNacimiento").show();
        if (TriajeRn.idRegistroRn > 0) {
            $("#btnGuardarTriajeRn").hide();
            $("#notaRegistroTriaje").show();
        } else {
            $("#btnGuardarTriajeRn").show();                                 
            $("#notaRegistroTriaje").hide();
        }
    },

    BloquearRegistro() {
        $(".field").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#txtNroCuentaMadre").attr('disabled', 'disabled');
        $("#btnBuscarMadre").hide();
        $("#btnCambiarMadre").hide();

        $("#txtNroNacimiento").attr('disabled', 'disabled');
        $("#btnBuscarNacimiento").hide();
        $("#btnCambiarNacimiento").hide();
        $("#btnGuardarTriajeRn").hide();
                
    },

    DesbloquearRegistro() {
        $(".field").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#txtNroCuentaMadre").removeAttr("disabled"); 
        $("#btnBuscarMadre").hide();
        $("#btnCambiarMadre").hide();
        $("#btnGuardarTriajeRn").show();

        $("#txtNroNacimiento").removeAttr("disabled");         
        $("#btnCambiarMadre").show();
        $("#btnBuscarMadre").hide();
    },

    LimpiarCamposRegistro() {
        $('.field').val('');
        $(".field").prop('checked', false);
        $('.chzn-select').chosen().trigger("chosen:updated");
        
        //$('.buscarMadre').val('');
        //$('.buscarNacimiento').val('');

        $("#txtNroCuentaNeonato").val("");
        $("#txtNroHistoriaNeonato").val("");
        $("#txtNombreNeonato").val("");
        $("#txtEdadAnioNeonato").val("");
        $("#txtEdadMesNeonato").val("");
        $("#txtEdadDiaNeonato").val("");

        $("#frmContactoPielaPiel_V1").hide();
        $("#frmContactoPielaPiel_V2").hide();

        $("#GenerarBrazalete").hide();

        TriajeRn.TipoGestacion_Change();
        TriajeRn.Fetos_Change();
        TriajeRn.Condicion_Change();
        TriajeRn.idTriajeRn = 0;
        TriajeRn.idCuentaMadre = 0;
        TriajeRn.idRegistroRn = 0;
        TriajeRn.idPaciente = 0;
        TriajeRn.idCuentaAtencion = 0;
        TriajeRn.idRegistroNacimiento = 0;

        Brazalete.LimpiarBrazalete();
    },

    LimpiarCamposBusqueda() {
        $('.search').val('');
    },



}

$(document).ready(function () {    
    TriajeRn.Iniciar()
    


});