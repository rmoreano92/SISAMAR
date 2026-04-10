
var citas = function () {
    var idMedico = ""
    var clickedRef = 0;
    var url = "./Citas/listaProgramacion/?idprogramacion=0"
    var fecha = "21/21/1900";
    var fechaAuxilar = "1900-12-12";
    var plugins = function () {


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#tblAnexos').DataTable({
            //            "scrollX": true,
            "searching": false,
            "lengthChange": false,
            "paging": false
        });




    }
    var calendario = function () {
        //        alert(fecha);
        var ubicateEn = String(fecha).split('/');

        //        alert((ubicateEn[1] - 1));
        $('#idCalendarioWeb').fullCalendar('destroy');
        $('#idCalendarioWeb').fullCalendar('removeEvents');
        $("#idCalendarioWeb").fullCalendar({
            locale: 'es',
            defaultDate: new Date(ubicateEn[2], (ubicateEn[1] - 1), ubicateEn[0]),
            events: {
                url: url //+ idMedico
                //                  url:"./Citas/listaProgramacion/?idprogramacion="+idMedico
            },
            eventRender: function (event, eventElement) {
                eventElement.find("div.fc-content").prepend("<i class='fa fa-user'></i>");
                //                if (event.imageurl) {
                ////                    eventElement.find("div.fc-content").prepend("<i class='fa fa-user'></i>");
                //                    element.find(".fc-event-time").after($("<span class=\"fc-event-icons\"></span>").html("Whatever you want the content of the span to be"));
                //                }
            },
            dayRender: function (date, cell) {

                //                console.log(fecha)
                var dateNew = fecha.split("/").reverse().join("-");


                var today = dateNew;
                fechaAuxilar = today;
                if (date.isSame(today, "day")) {
                    console.log('today')
                    cell.css("background-color", "#abb3d4");
                }
            },
            header: {
                left: "today,prev,next",
                center: "title",
                right: "year,month,basicWeek,basicDay"
            },
            dayClick: function (date, jsEvent, view) {
                //                alert('Date: ' + date.format());
                $('#lblFechaCupo').html("Fecha seleccionada: " + ' ' + date.format("DD/MM/YYYY"));
                $('#idCalendarioWeb').fullCalendar('removeEvents');
                fecha = date.format("DD/MM/YYYY");
                ListaCitasByFecha(date.format("DD/MM/YYYY"), 0)
                //                $('#idCalendarioWeb').fullCalendar('removeEvents');
                url = "./Citas/listaProgramacion/?idprogramacion=0"
                $('#lblMedico').html("Medico: ");
                $('#lblDispo').html(0)
                $('#lblPag').html(0)
                $('#lblRes').html(0)
                calendario();
                //                $('.fc-body').css("background-color", "white");
                //                alert(idMedico)
                //                $(this).parent().parent().css('background-color', 'white');
                //                $(this).css('background-color', '#00cc99');
                //                $('.fc-day fc-widget-content fc-thu fc-future').css('background-color', 'white');

            }
        });
    }

    var listaMedicos = function () {

        $.ajax({
            async: false,
            cache: false,
            url: "./Citas/ListaMedicos/",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboMedicos').empty();
                $(datos).each(function (i, obj) {
                    $('#cboMedicos').append('<option  value="' + obj.Idmedico + '">' + obj.Nombre + '</option>');

                });
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar medicos!", "2");
                }, 900)
            }
        });
    }
    /*
    var ListaSolicitudes = function () {
        Cargando(1)
        oTable_solicitudes.fnClearTable();
        $.ajax({
            async: false,
            cache: false,
            url: "./Citas/listadeSolicitudes/",
            datatype: "json",
            type: "post",
            data: {
                historia: $('#historia').val()


            },
            success: function (datos) {
                Cargando(0)
                oTable_solicitudes.fnClearTable();

                if (!isEmpty(datos)) {
                    oTable_solicitudes.fnAddData(datos);
                }

            },
            error: function (msg) {

                Cargando(0)
                Alerta("ERROR", "Error listar solicitudes!", "2");
            }
        });


    };
        */
    var ListaCitasByFecha = function ($fecha, $idmedico) {
        Cargando(1)
        oTable_citas.fnClearTable();
        $.ajax({
            async: false,
            cache: false,
            url: "./Citas/ListaCitasByFecha/",
            datatype: "json",
            type: "post",
            data: {
                fecha: $fecha,
                idmedico: $idmedico

            },
            success: function (datos) {
                Cargando(0)
                oTable_citas.fnClearTable();

                if (!isEmpty(datos)) {
                    oTable_citas.fnAddData(datos);
                }

            },
            error: function (msg) {
                Cargando(0)
                Alerta("ERROR", "Error listar citas por fecha!", "2");
            }
        });


    };
    var listarInformeByReporte = function ($cuenta) {

        //        $(location).attr('href', "Citas/ImprimeReporte/" + $cuenta);
        window.open("Citas/ImprimeReporte/" + $cuenta, '_blank');

    }

    var imprimeRecetaFarmacia = function ($idReceta) {
        window.open("Citas/ImprimeRecetaFarmacia/" + $idReceta, '_blank');

    }


    var listaOrdenes = function ($cuenta) {
        Cargando(1)
        oTable_ordenes.fnClearTable();
        $.ajax({
            async: false,
            cache: false,
            url: "./Citas/listadeOrdenes/",
            datatype: "json",
            type: "post",
            data: {
                cuenta: $cuenta

            },
            success: function (datos) {
                Cargando(0)
                oTable_ordenes.fnClearTable();

                if (!isEmpty(datos)) {
                    oTable_ordenes.fnAddData(datos);
                }

            },
            error: function (msg) {
                Cargando(0)
                Alerta("ERROR", "Error listar ordenes!", "2");
            }
        });


    };

    var listadeRecetasFarmaciaOrdenes = function ($cuenta) {
        Cargando(1)
        //        oTable_recetas.fnClearTable();
        $.ajax({
            async: false,
            cache: false,
            url: "./Citas/listadeRecetasFarmaciaOrdenes/",
            datatype: "json",
            type: "post",
            data: {
                cuenta: $cuenta

            },
            success: function (datos) {
                Cargando(0)
                oTable_recetas.fnClearTable();

                if (!isEmpty(datos)) {
                    oTable_recetas.fnAddData(datos);
                }

            },
            error: function (msg) {
                Cargando(0)
                Alerta("ERROR", "Error listar recetas y ordenes!", "2");
            }
        });


    };

    var listaCitasDePaciente = function ($historia, $cuenta) {
        Cargando(1)
        oTable_cupos.fnClearTable();
        $.ajax({
            async: false,
            cache: false,
            url: "./Citas/listaCitasDePaciente/",
            datatype: "json",
            type: "post",
            data: {
                historia: $historia,
                cuenta: $cuenta

            },
            success: function (datos) {
                Cargando(0)
                oTable_citasDePaciente.fnClearTable();

                if (!isEmpty(datos)) {
                    oTable_citasDePaciente.fnAddData(datos);
                }

            },
            error: function (msg) {
                Cargando(0)
                alerta("ERROR", "Error listar citas de paciente!", "2");
            }
        });


    };
    var ListaCupos = function (idprogramacion) {
        Cargando(1)
        $.ajax({
            async: false,
            cache: false,
            url: "./Citas/ListaCuposByIdProgramacion/",
            datatype: "json",
            type: "post",
            data: {
                idprogramacion: idprogramacion
            },
            success: function (datos) {
                Cargando(0)
                oTable_cupos.fnClearTable();
                var Disp = 0
                var Pag = 0
                var Res = 0
                if (!isEmpty(datos)) {
                    oTable_cupos.fnAddData(datos);
                    $(oTable_cupos.fnGetData()).each(function (index, item) {
                        //                        if (oTable_Data.idEstadoCita == item.idEstadoCita) {
                        //                            alerta_metronic("#div_msg", "Expositor ya está en la lista.", "danger", "warning");
                        //                            error = true;
                        //                        }
                        if (item.idEstadoCita) {
                            if (item.idEstadoCita == "1") {
                                Res = Res + 1

                            }
                            if (item.idEstadoCita == "4") {
                                Pag = Pag + 1

                            }
                            if (item.idEstadoCita == "0") {
                                Disp = Disp + 1

                            }
                        }

                    });
                    $('#lblDispo').html(Disp)
                    $('#lblPag').html(Pag)
                    $('#lblRes').html(Res)
                }

            },
            error: function (msg) {
                Cargando(0)
                Alerta("ERROR", "Error listar cupos!", "2");
            }
        });


    };
    var initDatablesCitasDePaciente = function () {


        var parms = {
            destroy: true,
            //responsive: true,      
            dom: 'Bflr<"table-responsive"t>ip',
            buttons: [],
            "lengthChange": false,
            columns: [
                {
                    data: "IdCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "FechaCita",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "HoraInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "Medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "DesFuente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "DesEstadoAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (isEmpty(rowData.FechaEgreso)) {
                            $(td).html('Pendiente')

                        }
                        else {
                            $(td).html('Atendido')

                        }

                    }
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')

                        if (isEmpty(rowData.FechaEgreso)) {
                            $(td).html('\n\
                                     <button data-toggle="tooltip" data-placement="top" title="Imprime solicitud de cita" class="imprimirSoli btn btn-info glow_button"><i class="fa fa-print"></i></button>\n\
                                     ')
                            $(td).parent().css('background', '#4fb7fe');
                            $(td).parent().css('color', 'white');
                            $(td).parent().css('font-weight', 'bold')
                            //                            $(this).parent()
                        }
                        else {
                            $(td).html('\n\
                                     <button data-toggle="tooltip" data-placement="top" title="Imprime orden y receta medica" class="imprimirReceta btn btn-warning glow_button"><i class="fa  fa-file-text"></i></button>\n\
                                     ')
                        }





                    }
                }



            ]

        }

        var tableWrapper = $('#tblCitasDePaciente'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_citasDePaciente = $("#tblCitasDePaciente").dataTable(parms);



    };

    var initDatablesSolicitudes = function () {


        var parms = {
            destroy: true,
            //responsive: true,      
            dom: 'Bflr<"table-responsive"t>ip',
            buttons: [],
            "lengthChange": false,
            columns: [
                {
                    data: "fechaCita",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

                ,
                {
                    data: "Telefono",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "ObservacionesCallCenter",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "estadoDes",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        valor = ""
                        if (rowData.estado == 0) {
                            valor = '<span class="tag tag-pill tag-warning new_tag">' + rowData.estadoDes + '</span>'
                        }
                        if (rowData.estado == 1) {
                            valor = '<span class="tag tag-pill tag-success new_tag">' + rowData.estadoDes + '</span>'
                        }
                        if (rowData.estado == 2) {
                            valor = '<span class="tag tag-pill tag-danger new_tag">Eliminada por Usuario</span>'
                        }
                        if (rowData.estado == 9) {
                            valor = '<span class="tag tag-pill tag-danger new_tag">' + rowData.estadoDes + '</span>'
                        }
                        $(td).html(valor)


                    }
                },
                {
                    data: "fechaSolicitud",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (rowData.estado == 0) {
                            $(td).html('\n\
                                     <button data-toggle="tooltip" data-placement="top" title="elimina solicitud de cita" class="eliminaSoli btn btn-danger glow_button"><i class="fa fa-close"></i></button>\n\
                                     ')


                        }
                        else {
                            $(td).html('');
                        }



                    }
                }



            ]

        }

        var tableWrapper = $('#tblSolicitudes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_solicitudes = $("#tblSolicitudes").dataTable(parms);


    };
    var initDatables = function () {


        var parms = {
            //            dom: 'Bflr<"table-responsive"t>ip',
            data: null,
            info: false,
            bFilter: false,
            paging: false,
            ordering: false,
            scrollY: '70vh',
            scrollCollapse: true,
            columns: [
                {
                    data: "IdProgramacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "Medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "Servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }


            ]

        }

        var tableWrapper = $('#tblCitas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_citas = $("#tblCitas").dataTable(parms);


    };
    var initDatablesCupos = function () {


        var parms = {
            //            dom: 'Bflr<"table-responsive"t>ip',
            data: null,
            info: false,
            bFilter: false,
            paging: false,
            ordering: false,
            scrollY: '70vh',
            scrollCollapse: true,
            columns: [
                {
                    data: "id",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var info = ""
                        var estado = ""
                        var boton = ""
                        info = 'Hora Incio: ' + rowData.turnoHoraInicio + '  &nbsp;   &nbsp;   &nbsp;  &nbsp; Hora Fin: ' + rowData.turnoHoraFin
                        if (rowData.idEstadoCita == "1") {
                            estado = "SEPARADO"
                            $(td).css('background', '#dc81ec');


                        }
                        if (rowData.idEstadoCita == "4") {
                            estado = "PAGADO"
                            $(td).css('background', '#D6E8F8');

                        }
                        if (rowData.idEstadoCita == "0") {
                            estado = "DISPONIBLE"
                            if (rowData.valorSolicitado > 0) {
                                boton = " &nbsp; &nbsp; &nbsp; &nbsp;&nbsp <B><label id='lblFechaCupo' style='color: RED' for='' class='control-label'>CITA EN SOLICITUD WEB</label></B>"
                            }
                            else {
                                boton = " &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; \n\
                                            <button data-toggle='tooltip' data-placement='top' title='Solicitar cita' class='solicCita btn btn-info glow_button'><i class='fa fa-file-text'></i>&nbsp; Solicitar Cita</button>"
                            }
                            $(td).css('background', '#6ae68b');

                        }

                        $(td).html("<b>" + info + ' <BR> ' + estado + "</b>" + boton)
                    }
                }


            ]

        }

        var tableWrapper = $('#tblCupos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_cupos = $("#tblCupos").dataTable(parms);


    };


    var initDatablesRecetas = function () {


        var parms = {
            data: null,
            info: false,
            bFilter: false,
            paging: false,
            ordering: false,
            //            rowReorder: {
            //                selector: 'td:nth-child(2)'
            //            },
            //            responsive: true,
            //            scrollY: true,
            //            scrollX: true,
            scrollCollapse: true,
            columns: [
                {
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "FechaReceta",
                    createdCell: function (td, cellData, rowData, row, col) {


                    }
                },
                {
                    data: "PuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {


                    }
                }
                ,
                {
                    data: "NombreMedico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        if (rowData.estadoReceta == 0) {
                            $(td).html('\n\
                                     <div class="col-sm-6 col-lg-4 col-xl-3 col-xs-12 fa-icon"><i class="fa fa-close"></i></div>\n\\n\
                                     ')
                        }
                        if (rowData.estadoReceta == 1) {
                            $(td).html('\n\
                                     <button data-toggle="tooltip" data-placement="top" title="Imprime Receta" class="imprimeRecetaById btn btn-success glow_button"><i class="fa fa-print"></i></button>\n\
                                     ')
                        }
                        if (rowData.estadoReceta == 2) {
                            $(td).html('\n\
                                       <div class="col-sm-6 col-lg-4 col-xl-3 col-xs-12 fa-icon"><i class="fa fa-check"></i></div>\n\
                                     ')
                        }
                        if (rowData.estadoReceta == 3) {
                            $(td).html('<div class="col-sm-6 col-lg-4 col-xl-3 col-xs-12 fa-icon"><i class="fa-file-text"></i></div>')
                        }


                    }
                }



            ]

        }

        var tableWrapper = $('#tblRecetas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_recetas = $("#tblRecetas").dataTable(parms);


    };

    var initDatablesOrdenes = function () {


        var parms = {
            "searching": false,
            "lengthChange": false,
            "paging": false,
            order: [[0, "desc"]],
            scrollY: '40vh',
            columns: [
                {
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "FechaReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "Servicio",
                    createdCell: function (td, cellData, rowData, row, col) {


                    }
                }
                ,
                {
                    data: "NombreMedico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {

                        $(td).html('\n\
                                     <button data-toggle="tooltip" data-placement="top" title="Imprime Receta" class="imprimeOrdenesById btn btn-success glow_button"><i class="fa fa-print"></i></button>\n\
                                     ')
                    }
                }



            ]

        }

        var tableWrapper = $('#tblOrdenes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ordenes = $("#tblOrdenes").dataTable(parms);


    };

    var validaPlan = function () {
        if ($("#cboPlan").val() == "3") {
            $("#txtReferencia").attr('disabled', false);
            $("#txtInterCon").attr('disabled', false);
        }
        else {
            $("#txtReferencia").attr('disabled', true);
            $("#txtInterCon").attr('disabled', true);
            $("#txtReferencia").val("");
            $("#txtInterCon").val("");
        }
    }

    var validaCantidad = function () {

        cantidadCta = false;

        $.ajax({
            type: "POST",
            url: "./Citas/cantidadCitaporDia",
            cache: false,
            async: false,
            data: {
                historia: $('#historia').val(),
                fecha: fecha
            },
            success: function (data) {

                if (data[0]['cantidad'] > 0) {
                    cantidadCta = true

                    //                        listarProcedimiento();


                }
                else {
                    cantidadCta = false

                }



            },
            error: function () {
                alerta('3', 'Ocurrio un error al validar cita');
                cantidadCta = false

            }
        });

        return cantidadCta

    }

    var validaCupoReserAcep = function (hora) {

        valCupo = false;

        $.ajax({
            type: "POST",
            url: "./Citas/validaCupoReserAcep",
            cache: false,
            async: false,
            data: {
                idProgramacion: $('#hdIdProgramacion').html(),
                hora: hora
            },
            success: function (data) {

                if (data[0]['cantidad'] > 0) {
                    valCupo = true

                }
                else {
                    valCupo = false

                }
            },
            error: function () {
                alerta('3', 'Ocurrio un error al validar cita');
                valCupo = false

            }
        });

        return valCupo

    }
    var eliminar = function (ideliminar) {
        $.ajax({
            type: "POST",
            url: "./Citas/eliminarSolicitud",
            cache: false,
            async: false,
            data: {
                id: ideliminar
            },
            success: function (data) {

                if (data) {
                    alerta('1', 'Solicitud eliminada correctamente');
                    ListaSolicitudes();



                }
                else {
                    alerta('3', 'Ocurrio un error al eliminar solictud');

                }


            },
            error: function () {
                alerta('3', 'Ocurrio un error al eliminar solictud');

            }
        });
    }
    var eventos = function () {

        $('#tblCitasDePaciente tbody').on('click', '.imprimirReceta', function () {
            var pos = oTable_citasDePaciente.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_citasDePaciente.fnGetData(pos);

            var idCuentaAtencion = row.IdCuentaAtencion.toString();

            $('#lblCuentaRecta').html('Cuenta:' + idCuentaAtencion)
            listadeRecetasFarmaciaOrdenes(idCuentaAtencion)
            $(".dataTables_scrollBody").css('width', '102%');
            $('#modalRecetas').modal('show');

        });

        $('#btnLimpiar').on('click', function () {
            $('#cboMedicos').val('').trigger('chosen:updated');
            $('#lblMedico').html("Medico: ");
            oTable_citas.fnClearTable();
            oTable_cupos.fnClearTable();
            ListaCitasByFecha(fecha, 0);
            $('#idCalendarioWeb').fullCalendar('removeEvents');

        })

        $('#tblSolicitudes tbody').on('click', '.eliminaSoli', function () {
            var pos = oTable_solicitudes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_solicitudes.fnGetData(pos);


            var id = row.id.toString();


            swal({
                title: 'Eliminar',
                text: 'Estas seguro de eliminar la solicitud?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            }).then(function () {

                eliminar(id)
                ListaCupos($('#hdIdProgramacion').html())
            });
            return false;
        });

        $('#btnguardar').on('click', function () {

            valorReseAcpet2 = validaCupoReserAcep($('#hdHora').html());
            if (valorReseAcpet2 > 0) {
                swal({
                    title: 'Validacion de Solicitud!',
                    text: 'Este cita ya tiene solicitud web para  la fecha',
                    type: 'info',
                    //                    confirmButtonColor: '#ff9933'
                }).done();
                ListaCupos($('#hdIdProgramacion').html())
                return
            }


            if ($("#txtCelular").val() == "" || $('#txtCelular').val().length !== 9) {
                alerta('2', 'Ingrese un numero correcto de celular');
                return false;
            }


            if ($("#cboPlan").val() == 3) {
                if ($("#txtReferencia").val() == "") {
                    alerta('2', 'Seleccionar PDF/Imagen en ADJUNTA HOJA DE REFERENCIA');
                    return false;
                }

                if ($("#txtInterCon").val() == "") {
                    alerta('2', 'Seleccionar PDF/Imagen en ADJUNTA INTERCONSULTA');
                    return false;
                }
            }

            var formData = new FormData();
            var $Referencia = $("#txtReferencia");
            var $InterCoinsulta = $("#txtInterCon");
            var archivos = $Referencia[0].files;
            var archivosInterconsulta = $InterCoinsulta[0].files;
            var refe = archivos[0];
            var inter = archivosInterconsulta[0];

            formData.append('idProgramacion', $('#hdIdProgramacion').html());
            formData.append('nroHistoria', $('#historia').val());
            formData.append('hora', $('#hdHora').html());
            formData.append('celular', $('#txtCelular').val());
            formData.append('fecha', fecha);
            formData.append('cboPlan', $('#cboPlan').val());
            formData.append('referencia', refe);
            formData.append('interconsulta', inter);

            Cargando(1);
            $.ajax({
                type: 'POST',
                url: './Citas/insertaSolicitud',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (datos) {
                    Cargando(0);
                    if (datos) {

                        alerta('1', 'Se  registro correctamente la solictud de cita');
                        ListaCupos($('#hdIdProgramacion').html())
                        ListaSolicitudes();
                        return false
                    } else {
                        alerta('2', 'Ocurrio un error al registrar la solicitud de cita,Error ');
                    }
                    return false;
                },
                error: function (result) {
                    Cargando(0);
                    alerta('3', 'Ocurrio un error al registrar la solicitud de cita,Error ');
                    return false;
                }
            });
        })

        $("#cboPlan").on("change", function () {
            validaPlan();
        });
        $('#tblCitasDePaciente tbody').on('click', '.imprimirSoli', function () {
            var pos = oTable_citasDePaciente.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_citasDePaciente.fnGetData(pos);

            var idCuentass = row.IdCuentaAtencion.toString();
            listarInformeByReporte(idCuentass);

        });

        $('#tblRecetas tbody').on('click', '.imprimeRecetaById', function () {
            var pos = oTable_recetas.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_recetas.fnGetData(pos);

            var idReceta = row.idReceta;
            imprimeRecetaFarmacia(idReceta);

        });

        $('#tblCupos tbody').on('click', '.solicCita', function () {
            var pos = oTable_cupos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_cupos.fnGetData(pos);

            //            fechaDia = moment().format("DD/MM/YYYY");
            //            alert(fechaDia);
            //            alert(fecha);
            //            if (fechaDia < fecha)
            //            {
            //
            //            }
            //            else
            //            {
            //                swal({
            //                    title: 'Validacion de Solicitud!',
            //                    text: 'No puede solicitar una cita menor a la fecha actual o el mismo dia',
            //                    type: 'warning',
            //                    confirmButtonColor: '#ff9933'
            //                }).done();
            //
            //                return
            //            }

            valorReseAcpet = validaCupoReserAcep(row.turnoHoraInicio.toString());
            if (valorReseAcpet > 0) {
                swal({
                    title: 'Validacion de Solicitud!',
                    text: 'Este cita ya tiene solicitud web para  la fecha',
                    type: 'info',
                    //                    confirmButtonColor: '#ff9933'
                }).done();
                ListaCupos($('#hdIdProgramacion').html())

                return
            }
            //            alert(valorReseAcpet);
            valorcita = validaCantidad();
            //            alert(valorcita);
            if (valorcita) {
                swal({
                    title: 'Validacion de Solicitud!',
                    text: 'Usted ya tiene solicitud de cita para la fecha:<b> ' + fecha + '</b>, solo se puede solicitar una cita por dia',
                    type: 'warning',
                    confirmButtonColor: '#ff9933'
                }).done();

                return
            }
            else {



                $('#lblFecha').html(fecha + ' Hora:' + row.turnoHoraInicio.toString());
                $('#hdHora').html(row.turnoHoraInicio.toString());
                $('#txtCelular').val('');
                $('#modalCita').modal('show');
            }
            //
            //            var idCuentass = row.IdCuentaAtencion.toString();
            //            listarInformeByReporte(idCuentass);

        });

        $('#cboMedicos').on('change', function () {
            limpiar2();
            ListaCitasByFecha(fecha, $('#cboMedicos').val());
            $('#idCalendarioWeb').fullCalendar('removeEvents');
            url = "./Citas/listaProgramacion/?idprogramacion=" + $('#cboMedicos').val();
            calendario()

        });
        $('#tblCitas tbody').on('click', 'tr', function () {
            //            alert('1');
            $('#tblCitas tbody tr').removeClass("over");
            $(this).addClass("over");

            var pos = oTable_citas.api(true).row($(this)).index();
            var row = oTable_citas.fnGetData(pos);

            var IdProgramacion = row.IdProgramacion.toString();
            $('#lblMedico').html("Medico: " + ' ' + row.Medico.toString());
            $('#hdServicio').html(row.Servicio.toString());
            $('#lblConsultorio').html(row.Servicio.toString())
            $('#lblMedicoSolicitud').html(row.Medico.toString());
            $('#hdIdProgramacion').html(IdProgramacion);
            //            alert(row.IdMedico.toString())
            ListaCupos(IdProgramacion)
            idMedico = row.IdMedico.toString()
            //            alert(idMedico)
            //            alert(url)
            url = "./Citas/listaProgramacion/?idprogramacion=" + idMedico


            //            alert(url)
            //          $('#idCalendarioWeb').fullCalendar('refetchEvents');
            //            $('#idCalendarioWeb').fullCalendar('updateEvent', event);
            //            $("#idCalendarioWeb").fullCalendar('render');
            calendario();

        });



        $('#btnCrearUsuario').on('click', function () {
            crearUsuario($('#lblDNICLAVE').html());
        });


    }


    var CargaInicial = function () {

        $("#MenuIdCita").addClass("active");

    }

    var limpiar = function () {

        $('#cboMedicos').val('').trigger('chosen:updated');
        $('#lblMedico').html("Medico: ");
        oTable_citas.fnClearTable();
        oTable_cupos.fnClearTable();
        ListaCitasByFecha(fecha, 0);
        $('#idCalendarioWeb').fullCalendar('removeEvents');
    }
    var limpiar2 = function () {
        oTable_citas.fnClearTable();
        oTable_cupos.fnClearTable();
        ListaCitasByFecha(fecha, 0);
        $('#idCalendarioWeb').fullCalendar('removeEvents');
    }


    return {
        init: function () {

            fecha = moment().format("DD/MM/YYYY");

            $('#lblFechaCupo').html("Fecha seleccionada: " + ' ' + fecha);
            plugins();
            CargaInicial();
            calendario();
            initDatables();
            initDatablesCupos();
            initDatablesCitasDePaciente();
            initDatablesSolicitudes();
            initDatablesRecetas();

            eventos();
            listaMedicos();
            ListaCitasByFecha(fecha, 0);
            ListaCupos(0);
            ListaSolicitudes();
            listaCitasDePaciente($('#historia').val(), 0);
            validaPlan();



        }
    };
}();



