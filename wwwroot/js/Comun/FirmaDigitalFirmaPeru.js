var FirmaPeruDigital = {
    async Iniciar() {
        const proceso = await FirmaPeruDigital.ProcesoFirmaModificar(1);
        if (!proceso) {
            $('#EstadoServicio').text("Error al iniciar el proceso de firma ...");
            return;
        }

        try {
            await FirmaPeruDigital.FirmarConInvoker();
            $('#EstadoServicio').text("Documento firmado con éxito.");
            await FirmaPeruDigital.ProcesoFirmaModificar(2);
            FirmaPeruDigital.CerrarFlujo();
        } catch (error) {
            console.error(error);
            $('#EstadoServicio').text("Error en el proceso de firma.");
            alert(error.message || error);
        }
    },

    async FirmarConInvoker() {
        $('#EstadoServicio').text("Iniciando servicio ...");

        const pdfs = JSON.parse(document.getElementById("pdfsJson").textContent || "[]");
        const firmaParam = JSON.parse(document.getElementById("firmaParamJson").textContent || "{}");
        const urlInvoker = (document.getElementById("urlInvoker").textContent || "").trim();

        if (!urlInvoker) {
            throw new Error("No se configuró la URL del invoker de Firma Perú.");
        }
        if (!Array.isArray(pdfs) || pdfs.length === 0) {
            throw new Error("No se encontraron documentos para firmar.");
        }

        const token = await FirmaPeruDigital.ObtenerToken();
        const module = await import('/lib/firmaperu.js');
        const firma = new module.FirmaPeru(urlInvoker);

        $('#EstadoServicio').text("Esperando su firma ...");
        const urlBase = await firma.ejecutar(pdfs, firmaParam, token);

        const signedUrls = pdfs.map((doc) => ({
            documento: doc.name,
            url: `${urlBase}/${encodeURIComponent(doc.name)}/${encodeURIComponent(token)}`
        }));
        console.table(signedUrls);

        try {
            await Promise.race([
                FirmaPeruDigital.SubirFirmados(signedUrls),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout subiendo PDF firmado.")), 12000))
            ]);
        } catch (error) {
            console.warn(error);
        }
    },

    async ObtenerToken() {
        const response = await fetch('/FirmaDigital/ObtenerTokenFirmaPeru?area=Comun', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener token de firma.");
        }

        const json = await response.json();
        if (!json.ok || !json.token) {
            throw new Error(json.msg || "Token inválido.");
        }

        return json.token;
    },

    async FinalizarServicioFirma() {
        const proceso = await FirmaPeruDigital.ProcesoFirmaModificar(2);
        if (!proceso) {
            $('#EstadoServicio').text("Error al finalizar el proceso de firma ...");
        }
    },

    async SubirFirmados(signedUrls) {
        const idFirma = (document.getElementById("nroFirma").textContent || "").trim();
        const codeFirma = (document.getElementById("codigoFirma").textContent || "").trim();
        if (!idFirma || !Array.isArray(signedUrls) || signedUrls.length === 0) {
            return;
        }

        const first = signedUrls[0];
        const pdfResponse = await fetch(first.url, { method: 'GET' });
        if (!pdfResponse.ok) {
            throw new Error(`No se pudo descargar PDF firmado (${pdfResponse.status}).`);
        }

        const pdfBlob = await pdfResponse.blob();
        const formData = new FormData();
        formData.append('signed_file', pdfBlob, `${first.documento}.pdf`);
        formData.append('codeFirma', codeFirma);

        const uploadResponse = await fetch(`/api/UploadFileFirmaPeru/${encodeURIComponent(idFirma)}`, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error(`No se pudo subir PDF firmado al backend (${uploadResponse.status}).`);
        }

        const guardado = await uploadResponse.json();
        if (guardado !== true) {
            throw new Error("El backend no confirmó el guardado del PDF firmado.");
        }
    },

    CerrarFlujo() {
        setTimeout(() => {
            window.location.href = "/FirmaDigital/FinFirmaDigitalFirmaPeru?area=Comun";
        }, 800);
    },

    async ProcesoFirmaModificar(estado) {
        const formData = new FormData();
        let resp = false;

        const nrofirma = $("#nroFirma").text();
        const codigoFirma = $("#codigoFirma").text();

        formData.append('idFirma', nrofirma);
        formData.append('codeFirma', codigoFirma);
        formData.append('estado', estado);
        try {
            const datos = await $.ajax({
                method: "POST",
                url: "/Utilitario/ProcesoFirmaModificar?area=Comun",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            if (datos.session) {
                resp = datos.lsProceso;
            } else {
                alert("La sesion ya expiro se volvera a recargar la pagina");
                location.reload();
            }
        } catch (error) {
            console.error(error);
        }

        return resp;
    }
};
