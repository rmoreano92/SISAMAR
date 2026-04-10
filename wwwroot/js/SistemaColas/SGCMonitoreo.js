var SGCMonitoreo = {

    Iniciar() {
        SGCMonitoreo.Plugins();
        SGCMonitoreo.Eventos();
        SGCMonitoreo.ListarVentanillas();
        SGCMonitoreo.DataTableBusqueda();
    },

    Plugins() {
        $('#txtFechaBusq').datepicker({
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
        $("#txtFechaBusq").mask("Dd/Mm/abcd");

        //$.mask.definitions['H'] = '[012]';
        //$.mask.definitions['N'] = '[012345]';
        //$.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraNacimiento").mask("Hn:Nn");
        //$("#txtHoraClampaje").mask("Hn:Nn");

        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        //$('#txtFechaFiltro').val(FechaDia);
        //$("#txtFechaFiltro").datepicker("setDate", FechaDia);

        $("#txtFechaBusq").datepicker("setDate", FechaDia);

        $(".chzn-select").chosen({ allow_single_deselect: true });
    },

    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await SGCMonitoreo.CargarTurnosPorVentanilla();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        ///////////////////////KHOYOSI REPORTE MONITOREO COLAS//////////////////////////////////////////////////////////
        $('#btnReporteMonitoreoColas').on('click', async () => {
            let FechaHora = await FechaHoraServidor();
            let FechaDia = FechaHora.substring(0, 10);

            $("#cboRptVentanilla").val("999");
            $("#txtRptFechaInicio").datepicker("setDate", FechaDia);
            //$("#txtHoraInicioPsicotropicos").val("00:00");
            $("#txtRptFechaFin").datepicker("setDate", FechaDia);
            //$("#txtHoraFinPsicotropicos").val("23:59");
            $('.chzn-select').chosen().trigger("chosen:updated");

            $("#modalReporteMonitoreoColas").modal("show");
        });

        $('#btnGenerarReporteMonitoreoColas').on('click', () => {

            if (isEmpty($("#cboRptVentanilla").val())) {
                alerta2('info', '', 'Selecciona la ventanilla.');
                return false
            }
                       
            if (isEmpty($('#txtRptFechaInicio').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.');
                return false
            }

            if (isEmpty($('#txtRptFechaFin').val())) {
                alerta2('info', '', 'Ingresa la fecha final.');
                return false
            }

            if ($('#txtRptFechaInicio').val() > $('#txtRptFechaFin').val()) {
                alerta2('info', '', 'La fecha de inicio debe ser menor o igual a la fecha final.');
                return false
            }

            //if ($('#txtFechaInicioAntimicrobianos').val() > $('#txtFechaFinAntimicrobianos').val()) {
            //    alerta2('info', '', 'La hora de inicio debe ser menor o igual a la hora final.');
            //    return false
            //}

            let formData = new FormData()
            formData.append('idVentanilla', $('#cboRptVentanilla').val());           
            formData.append('fechaInicio', $("#txtRptFechaInicio").val());
            formData.append('fechaFin', $("#txtRptFechaFin").val());
            formData.append('ventanilla', $('#cboRptVentanilla option:selected').text());
            
            Cargando(1)

            fetch('/SGCMonitoreo/ReporteMonitoreoColas?area=SistemaColas', {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (response.status === 204) {
                        alerta2('info', '', 'No existen datos para descargar.');
                        Cargando(0);
                        return;
                    }
                    return response.blob();
                })
                .then(blob => {
                    if (isEmpty(blob) == false) {
                        var url = window.URL.createObjectURL(blob)
                        var a = document.createElement('a')
                        a.href = url
                        a.download = "ReporteMonitoreoColas.xlsx"
                        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                        a.click();
                        a.remove();  //afterwards we remove the element again
                        alerta2('success', '', 'La descarga se realizo con exito.')
                        Cargando(0)
                    }

                })
                .catch((e) => {
                    alerta2('danger', '', 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        });

        $('#btnCerrarReporteMonitoreoColas').on('click', async () => {
            let FechaHora = await FechaHoraServidor();
            let FechaDia = FechaHora.substring(0, 10);

            $("#cboRptVentanilla").val("999");
            $("#txtRptFechaInicio").datepicker("setDate", FechaDia);
            //$("#txtHoraInicioPsicotropicos").val("00:00");
            $("#txtRptFechaFin").datepicker("setDate", FechaDia);
            //$("#txtHoraFinPsicotropicos").val("23:59");
            $('.chzn-select').chosen().trigger("chosen:updated");

            $("#modalReporteMonitoreoColas").modal("hide");
        });
                
        ////////////////////////////////////////////////////////////////////////////////////////////////


    },

    DataTableBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "id",
                    width: '3%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "turno",
                    width: '5%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "ventanilla",
                    width: '7%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "nroDocumento",
                    width: '6%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "solicitante",
                    width: '14',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: null,
                    width: '8%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        $(td).html("<span class='chip " + SGCMonitoreo.ObtenerColorEstaAtencionCola(rowData.idEstadoAtencion) + "'>" + rowData.estadoAtencion + "</span>")
                    }
                },
                {
                    data: "fechaSolicitud",
                    width: '9%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "fechaLlamada",
                    width: '9%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "fechaAtencion",
                    width: '9%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "fechaFinalizacion",
                    width: '9%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: null,
                    width: '7%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let tiempoLlamado = rowData.tiempoLlamado.substring(rowData.tiempoLlamado.indexOf("D") + 1);
                        $(td).html(tiempoLlamado);
                    }
                },
                {
                    data: null,
                    width: '7%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let tiempoAtencion = rowData.tiempoAtencion.substring(rowData.tiempoAtencion.indexOf("D") + 1);
                        $(td).html(tiempoAtencion);
                    }
                },
                {
                    data: null,
                    width: '7%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let tiempoTotal = rowData.tiempoTotal.substring(rowData.tiempoTotal.indexOf("D") + 1);
                        $(td).html(tiempoTotal);
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Monitoreo = $("#tblMonitoreo").dataTable(parms);
    },

    async ListarVentanillas() {
        var resp = false;
        let datos;
        //var data = new FormData();
        //data.append('tv', tv);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SGCConfiguracion/ListarVentanillas",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            $('#cboVentanillasBusq').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboVentanillasBusq').append('<option  value="' + obj.idVentanilla + '">' + obj.nombre + '</option>');
            });
            $("#cboVentanillasBusq").trigger("chosen:updated");

            $('#cboRptVentanilla').empty();
            $('#cboRptVentanilla').append('<option  value="999">Todos</option>');
            $(datos.table).each(function (i, obj) {
                $('#cboRptVentanilla').append('<option  value="' + obj.idVentanilla + '">' + obj.nombre + '</option>');
            });            
            $("#cboRptVentanilla").trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            alert(error);
        }
        //return resp;
    },

    async CargarTurnosPorVentanilla() {
        var midata = new FormData();
        midata.append('idVentanilla', $('#cboVentanillasBusq').val());
        midata.append('fecha', $('#txtFechaBusq').val());

        let datos;
        try {
            Cargando(1);
            oTable_Monitoreo.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SGCMonitoreo/ListaTurnosPorVentanilla?area=SistemaColas",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            //console.log(datos.respuesta.table);            
            if (datos.respuesta.table.length > 0) {
                oTable_Monitoreo.fnAddData(datos.respuesta.table);                
            }
            
            return true;

            //console.log(datos);
        } catch (error) {
            //Cargando(0);
            console.error(error)
            alerta2("error", "", JSON.stringify(error));
            return false;
        }
    },

    ObtenerColorEstaAtencionCola(idEstado) {
        if (idEstado == 1) { return "orange"; }
        if (idEstado == 2) { return "success"; }
        if (idEstado == 3) { return "primary"; }
        if (idEstado == 4) { return "secondary"; }
    },

}

$(document).ready(function () {
    //$("#MenuConfiguracion").addClass("active");
    SGCMonitoreo.Iniciar();
    //Admision.Redimenzionar();
    //ConsultaExterna.ListarFlujoAtencionConsultaExterna();
    //setInterval("ConsultaExterna.ListarFlujoAtencionConsultaExterna()", 5000);
});