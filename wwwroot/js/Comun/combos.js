function cargarCombo(url, comboId, textoDefault, valueField, textField, params = {}, valorSeleccionado = null) {
    $.ajax({
        url: url,
        type: 'POST',       // 👈 IMPORTANTE: usar POST
        data: params,       // 👈 aquí van los parámetros
        dataType: 'json',
        success: function (data) {
            var $combo = $("#" + comboId);
            $combo.empty();




            // 👇 CORRECCIÓN SIMPLE - Extraer array si viene en formato {table: Array}



            // opción por defecto
            if (textoDefault) {
                $combo.append('<option value="0">' + textoDefault + '</option>');
            }

            //// llenar con datos del backend
            //$.each(data, function (i, item) {
            //    $combo.append($('<option>', {
            //        value: item[valueField],
            //        text: item[textField]
            //    }));
            //});






            let contieneTable = false;
            let ubicacionTable = '';

            // Verificar en primer nivel
            if (data.table && Array.isArray(data.table)) {
                contieneTable = true;
                ubicacionTable = 'primer nivel';
                datosArray = data.table;
            }
            // Verificar en segundo nivel
            else if (data && typeof data === 'object') {
                for (let propiedad in data) {
                    if (data[propiedad] && data[propiedad].table && Array.isArray(data[propiedad].table)) {
                        contieneTable = true;
                        ubicacionTable = `${propiedad}.table`;
                        datosArray = data[propiedad].table;
                        break;
                    }
                }
            }




            if (contieneTable) {

                let datos = [];
                for (const key in data) {
                    // Caso 1: array directo
                    if (Array.isArray(data[key])) {
                        datos = data[key];
                        break;
                    }

                    // Caso 2: array dentro de "table"
                    if (data[key] && Array.isArray(data[key].table)) {
                        datos = data[key].table;
                        break;
                    }
                }



                $.each(datos, function (i, item) {
                    $combo.append($('<option>', {
                        value: item[valueField],
                        text: item[textField]
                    }));
                });
            } else {
                console.log(`✅ Formato detectado: Array directo`);
                // Llenar combo
                $.each(data, function (i, item) {
                    $combo.append($('<option>', {
                        value: item[valueField],
                        text: item[textField]
                    }));
                });

            }

            //$combo.val(2);
            // POSICIONAR en el valor especificado (si se proporciona)
            if (valorSeleccionado !== null && valorSeleccionado !== '') {
                $combo.val(valorSeleccionado);
                console.log(`✅ Combo ${comboId} posicionado en valor: ${valorSeleccionado}`);
            }



            // refrescar chosen si aplica   
            $combo.trigger("chosen:updated");
        },
        error: function (xhr) {
            console.error("Error al cargar combo (" + comboId + "):", xhr.responseText);
        }
    });
}
function cargarComboD(comboId, textoDefault, data, valorSeleccionado = null) {
    var $combo = $("#" + comboId);
    $combo.empty();

    // opción por defecto
    if (textoDefault) {
        $combo.append('<option value="">' + textoDefault + '</option>');
    }

    // llenar con datos del array (usa id y nombre)
    $.each(data, function (i, item) {
        $combo.append($('<option>', {
            value: item.id ?? item.Id,   // acepta id o Id
            text: item.nombre ?? item.Nombre
        }));
    });

    // POSICIONAR en el valor especificado (si se proporciona)
    if (valorSeleccionado !== null && valorSeleccionado !== '') {
        $combo.val(valorSeleccionado);
        console.log(`✅ Combo ${comboId} posicionado en valor: ${valorSeleccionado}`);
    }

    // refrescar chosen si aplica
    $combo.trigger("chosen:updated");
    $combo.trigger('change');

    //APLICA
    //const lista = [
    //    { id: 0, nombre: "Ninguno" },
    //    { id: 1, nombre: "Trabaja sólo Particulares" },
    //    { id: 2, nombre: "Trabaja sólo Seguro SIS" },
    //    { id: 3, nombre: "Trabaja sólo Seguro SOAT" },
    //    { id: 4, nombre: "Trabaja sólo Seguros Convenios" }
    //];
    //cargarComboD('cboEstadoCuenta', 'Seleccione una opción', lista, '');
}
function TablaHelper(respuesta, config) {
    const {
        idTablaBody,
        campos, // Array de objetos: { nombre: 'Id', campo: 'Id' }
        acciones, // Función que retorna HTML de acciones
        mensajeVacio = 'No se encontraron registros'
    } = config;

    const tbody = document.getElementById(idTablaBody);
    if (!tbody) return false;

    tbody.innerHTML = '';

    // Validar datos
    const datos = respuesta?.data?.table || respuesta?.table || respuesta;
    if (!datos || !Array.isArray(datos) || datos.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="${campos.length + (acciones ? 1 : 0)}" class="text-center text-muted">
                        ${mensajeVacio}
                    </td>
                </tr>
            `;
        return false;
    }

    // Llenar tabla
    datos.forEach(fila => {
        const tr = document.createElement('tr');

        // Campos de datos
        campos.forEach(col => {
            const td = document.createElement('td');
            td.textContent = fila[col.campo] || '';
            if (col.clase) td.className = col.clase;
            tr.appendChild(td);
        });

        // Acciones
        if (acciones) {
            const tdAcciones = document.createElement('td');
            tdAcciones.innerHTML = acciones(fila);
            tr.appendChild(tdAcciones);
        }

        tbody.appendChild(tr);
    });

    return true;



    //// Uso más elegante
    //if (res.data.table) {
    //    TablaHelper.llenar(res, {
    //        idTablaBody: 'tbodyTarifarios',
    //        campos: [
    //            { nombre: 'ID', campo: 'Id' },
    //            { nombre: 'Descripción', campo: 'Descripcion' },
    //            { nombre: 'Estado', campo: 'Estado', clase: 'text-center' }
    //        ],
    //        acciones: (fila) => `
    //        <button class="btn btn-info btn-sm" onclick="editar(${fila.Id})">
    //            <i class="bi bi-pencil"></i>
    //        </button>
    //        <button class="btn btn-danger btn-sm" onclick="eliminar(${fila.Id})">
    //            <i class="bi bi-trash"></i>
    //        </button>
    //    `,
    //        mensajeVacio: 'No hay tarifarios disponibles'
    //    });

}




// Función global para generar reportes imprimibles
function generarVistaPreviaDesdeTabla(tableOrSelector, config = {}) {
    // --- configuración por defecto ---
    const cfg = {
        titulo: config.titulo || "Reporte",
        subtitulo: config.subtitulo || "",
        tamañoFuente: config.tamañoFuente || "12px",
        colorHeader: config.colorHeader || "#004aad",
        colorTextoHeader: config.colorTextoHeader || "#ffffff",
        orientacion: (config.orientacion === "landscape") ? "landscape" : "portrait",
        margenIzqDer: config.margenIzqDer || "5mm"
    };

    // --- obtener instancia DataTable API de forma segura ---
    let dtApi = null;
    try {
        if (!tableOrSelector) throw new Error("Parametro tabla vacío");
        // Si ya es API (DataTables 1.10+)
        if (typeof tableOrSelector === "object" && typeof tableOrSelector.rows === "function" && typeof tableOrSelector.columns === "function") {
            dtApi = tableOrSelector;
        } else {
            // si es selector o jquery element
            const $el = (typeof tableOrSelector === "string") ? $(tableOrSelector) : tableOrSelector;
            if ($el && $el instanceof jQuery && $.fn.dataTable && $.fn.dataTable.isDataTable($el[0])) {
                dtApi = $el.DataTable(); // API moderna
            } else if (tableOrSelector && typeof tableOrSelector.api === "function") {
                // legacy .dataTable() devuelve objeto con .api()
                dtApi = tableOrSelector.api();
            } else {
                throw new Error("No se pudo detectar instancia DataTable. Pasa la instancia o selector correcto.");
            }
        }
    } catch (err) {
        console.error("Error obteniendo DataTable API:", err);
        alert("Error interno: no se detectó la tabla DataTable.");
        return;
    }

    // --- extraer columnas (títulos y clave mData si existe) ---
    const settings = dtApi.settings ? dtApi.settings()[0] : (dtApi.context ? dtApi.context[0] : null);
    const aoColumns = (settings && settings.aoColumns) ? settings.aoColumns : null;

    // encabezados (texto visible)
    const headerNodes = dtApi.columns().header().toArray();
    const columnTitles = headerNodes.map(h => (h && h.innerText) ? h.innerText.trim() : "");

    // columna keys (mData / data) para extraer desde objetos row si están definidos
    let columnKeys = [];
    if (aoColumns) {
        columnKeys = aoColumns.map(c => {
            // intentar mData, data, mDataProp, name, title
            return (c.mData !== undefined && c.mData !== null && c.mData !== "")
                ? c.mData
                : (c.data !== undefined && c.data !== null && c.data !== "" ? c.data : null);
        });
    } else {
        // fallback: nulls (usaremos índice)
        columnKeys = new Array(columnTitles.length).fill(null);
    }

    // --- extraer datos (filas aplicadas por el filtro) ---
    const rowsData = dtApi.rows({ search: 'applied' }).data().toArray(); // array de objects o arrays

    if (!rowsData || rowsData.length === 0) {
        alert("No hay datos para generar el reporte.");
        return;
    }

    // --- construir HTML de la tabla ---
    const headerHtml = columnTitles.map(t => `<th style="border:1px solid #ddd; padding:6px; font-weight:600;">${t}</th>`).join("");

    // construir body; soporta fila tipo array o objeto
    const bodyHtml = rowsData.map(row => {
        // si es array
        if (Array.isArray(row)) {
            return `<tr>${row.map(cell => `<td style="border:1px solid #ddd; padding:6px; text-align:left;">${escapeHtml(cell)}</td>`).join("")}</tr>`;
        } else if (typeof row === "object" && row !== null) {
            // si hay columnKeys con nombres, usar esos; si no, intentar usar columnTitles como claves (lowercase) -> fallback a empty
            return `<tr>${columnKeys.map((key, idx) => {
                let val = "";
                if (key) {
                    // si key es función (mData puede ser function) o string
                    try {
                        if (typeof key === "function") {
                            val = key(row);
                        } else {
                            val = row[key];
                        }
                    } catch (e) { val = ""; }
                } else {
                    // fallback: intentar usar propiedad por título (normalizado), o por índice si existe
                    const titleKey = normalize(columnTitles[idx]);
                    val = row[titleKey] !== undefined ? row[titleKey] : (row[idx] !== undefined ? row[idx] : "");
                }
                return `<td style="border:1px solid #ddd; padding:6px; text-align:left;">${escapeHtml(val)}</td>`;
            }).join("")}</tr>`;
        } else {
            // otro tipo, convertir a string
            return `<tr><td colspan="${columnTitles.length}" style="padding:6px;">${escapeHtml(String(row))}</td></tr>`;
        }
    }).join("");

    // --- HTML completo de preview ---
    const html = `
        <div style="text-align:center; margin-bottom:10px;">
            <h2 style="margin:0;">${escapeHtml(cfg.titulo)}</h2>
            <div style="margin-top:6px; color:#333;">${escapeHtml(cfg.subtitulo)}</div>
        </div>

        <div style="overflow:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:${cfg.tamañoFuente};">
                <thead>
                    <tr style="background:${cfg.colorHeader}; color:${cfg.colorTextoHeader};">
                        ${headerHtml}
                    </tr>
                </thead>
                <tbody>
                    ${bodyHtml}
                </tbody>
            </table>
        </div>
    `;

    // --- crear overlay de preview (sobrepuesto) ---
    const overlay = document.createElement("div");
    overlay.className = "overlay-print";
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        padding: 12px;
    `;

    const contenido = document.createElement("div");
    contenido.style.cssText = `
        background: #fff;
        width: 96%;
        height: 92%;
        border-radius: 8px;
        overflow: auto;
        padding: 18px;
        box-shadow: 0 6px 30px rgba(0,0,0,0.3);
    `;

    // botones y contenido
    const accionesHtml = `
        <div style="display:flex; gap:8px; position:sticky; top:8px; background:transparent; z-index:2; margin-bottom:8px;">
            <button id="btnPrintPreview" style="padding:8px 12px; background:#28a745; color:#fff; border:none; border-radius:4px; cursor:pointer;">🖨 Imprimir</button>
            <button id="btnClosePreview" style="padding:8px 12px; background:#dc3545; color:#fff; border:none; border-radius:4px; cursor:pointer;">✖ Cerrar</button>
        </div>
    `;

    contenido.innerHTML = accionesHtml + html;
    overlay.appendChild(contenido);
    document.body.appendChild(overlay);

    // cerrar
    contenido.querySelector('#btnClosePreview').addEventListener('click', () => overlay.remove());

    // imprimir
    contenido.querySelector('#btnPrintPreview').addEventListener('click', () => {
        // abrir nueva ventana para impresión (mejor que intentar imprimir overlay directo)
        const printWindow = window.open("", "_blank");
        const cssPrint = `
            <style>
                @page { size: ${cfg.orientacion}; margin-left: ${cfg.margenIzqDer}; margin-right: ${cfg.margenIzqDer}; margin-top:6mm; margin-bottom:6mm; }
                body { font-family: Arial, sans-serif; margin:0; padding:8px; color:#222; }
                table { width:100%; border-collapse: collapse; font-size:${cfg.tamañoFuente}; }
                thead th { background:${cfg.colorHeader}; color:${cfg.colorTextoHeader}; padding:6px; border:1px solid #ddd; }
                tbody td { padding:6px; border:1px solid #ddd; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
                tr { page-break-inside: avoid; }
            </style>
        `;

        printWindow.document.open();
        printWindow.document.write(`<html><head><title>${escapeHtml(cfg.titulo)}</title>${cssPrint}</head><body>${html}</body></html>`);
        printWindow.document.close();

        // permitir carga y luego imprimir
        printWindow.onload = function () {
            // pequeño retardo para asegurar renderizado
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                //printWindow.close(); // opcional: cerrar ventana luego de imprimir
            }, 250);
        };
    });

    // --- helpers ---
    function escapeHtml(input) {
        if (input === null || input === undefined) return "";
        return String(input)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    function normalize(text) {
        if (!text) return text;
        return String(text).trim().replace(/\s+/g, '').toLowerCase();
    }
}












