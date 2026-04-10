let Renhice = {

    DataTablePacientes: function () {
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
                    width: "3%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "birthDate",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "gender",
                    width: "3%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "name",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "type",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "document",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "establecimiento",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "bundle",
                    width: "3%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "3%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        $(td).html(`<button class="btn btn-info btn-sm" onclick="Renhice.CompletaDatosBundle(${rowData.bundle})"><i class="fa fa-eye"></i></button>`)
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TablePacientes = $("#tblPacientes").dataTable(parms);
    },

    ConsultaPacientes: async function (idPaciente) {

        let formData = new FormData();
        formData.append('id', idPaciente);

        let res = await HttpClient.Post('/Renhice/ConsultaPacienteById', formData);

        if (isEmpty(res)) {
            alerta2('warning', '', 'No existen datos para el id consultado')
            Cargando(0)
            return
        }

        if (res.data.procesado == 'false') {
            alerta2('warning', '', res.data.mensaje)
            Cargando(0)
            return
        }


        const bundle = res.data;

        return bundle
    },
    ServicioDocumentReference: async function () {

        let formData = new FormData()

        formData.append('id', $('#txtNroDocumentoPacienteBusq').val())

        let res = await HttpClient.Post('/Renhice/ServicioDocumentReference', formData)

        //console.log('ServicioDocumentReference', res.data.entry)

        return res
        
    },

    BuildJson: async function (atencion, paciente) {

        let jsonPaciente = await Renhice.JsonPaciente(paciente)

        let json = {
            "resourceType": "Bundle",
            "id": "f404389a-c362-4e9e-8f8f-ecdda938d297",
            "meta": {
                "profile": [
                    "https://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Minimal.ProvideBundle"
                ],
                "security": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                        "code": "HTEST"
                    }
                ]
            },
            "type": "transaction",
            "timestamp": "2025-05-08T13:50:50-05:00",
            "entry": [
                {
                    "fullUrl": "urn:uuid:5eac3f2c-504a-47dd-b8b6-94691a0f4dd6",
                    "resource": {
                        "resourceType": "List",
                        "id": "5eac3f2c-504a-47dd-b8b6-94691a0f4dd6",
                        "meta": {
                            "profile": [
                                "https://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Minimal.SubmissionSet"
                            ],
                            "security": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                                    "code": "HTEST"
                                }
                            ]
                        },
                        "text": {
                            "status": "extensions",
                            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">SubmissionSet with Patient</div>"
                        },
                        "extension": [
                            {
                                "url": "https://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-sourceId",
                                "valueIdentifier": {
                                    "value": "urn:oid:1.2.3.4"
                                }
                            }
                        ],
                        "identifier": [
                            {
                                "use": "usual",
                                "system": "urn:ietf:rfc:3986",
                                "value": "urn:oid:1.2.840.113556.1.8000.2554.58783.21864.3474.19410.44358.58254.41281.46343"
                            }
                        ],
                        "status": "current",
                        "mode": "working",
                        "code": {
                            "coding": [
                                {
                                    "system": "https://profiles.ihe.net/ITI/MHD/CodeSystem/MHDlistTypes",
                                    "code": "submissionset"
                                }
                            ]
                        },
                        "subject": {
                            "reference": `urn:uuid:P-${paciente.idPaciente}`
                        },
                        "date": "2004-10-25T23:50:50-05:00",
                        "entry": [
                            {
                                "item": {
                                    "reference": "urn:uuid:987f3197-b863-4c0d-9a0d-75b0ee08d761"
                                }
                            }
                        ]
                    },
                    "request": {
                        "method": "POST",
                        "url": "List"
                    }
                },
                {
                    "fullUrl": "urn:uuid:987f3197-b863-4c0d-9a0d-75b0ee08d761",
                    "resource": {
                        "resourceType": "DocumentReference",
                        "id": "987f3197-b863-4c0d-9a0d-75b0ee08d761",
                        "meta": {
                            "profile": [
                                "https://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Minimal.DocumentReference"
                            ],
                            "security": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                                    "code": "HTEST"
                                }
                            ]
                        },
                        "text": {
                            "status": "generated",
                            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative: DocumentReference</b><a name=\"987f3197-b863-4c0d-9a0d-75b0ee08d761\"> </a></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource DocumentReference &quot;987f3197-b863-4c0d-9a0d-75b0ee08d761&quot; </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"StructureDefinition-IHE.MHD.Minimal.DocumentReference.html\">MHD DocumentReference Minimal</a></p><p style=\"margin-bottom: 0px\">Security Labels: <span title=\"{http://terminology.hl7.org/CodeSystem/v3-ActReason http://terminology.hl7.org/CodeSystem/v3-ActReason}\">http://terminology.hl7.org/CodeSystem/v3-ActReason</span></p></div><p><b>masterIdentifier</b>: id: urn:oid:1.2.840.113556.1.8000.2554.53432.348.12973.17740.34205.4355.50220.62012</p><p><b>status</b>: current</p><p><b>subject</b>: <a href=\"#Patient_P-144104\">See above (urn:uuid:P-144104)</a></p><blockquote><p><b>content</b></p><h3>Attachments</h3><table class=\"grid\"><tr><td style=\"display: none\">-</td><td><b>ContentType</b></td><td><b>Url</b></td><td><b>Size</b></td><td><b>Hash</b></td></tr><tr><td style=\"display: none\">*</td><td>text/plain</td><td><code>urn:uuid:5c8ecb2a-8660-4e2c-960e-55998bcfff46</code></td><td>11</td><td>(base64 data - 40 bytes)</td></tr></table><p><b>format</b>: ITI XDS-SD TEXT (Details: http://ihe.net/fhir/ihe.formatcode.fhir/CodeSystem/formatcode code urn:ihe:iti:xds-sd:text:2008 = 'ITI XDS-SD TEXT', stated as 'null')</p></blockquote></div>"
                        },
                        "masterIdentifier": {
                            "system": "urn:ietf:rfc:3986",
                            "value": "urn:oid:1.2.840.113556.1.8000.2554.53432.348.12973.17740.34205.4355.50220.62012"
                        },
                        "status": "current",
                        "subject": {
                            "reference": `urn:uuid:P-${paciente.idPaciente}`
                        },
                        "content": [
                            {
                                "attachment": {
                                    "contentType": "text/plain",
                                    "url": "urn:uuid:5c8ecb2a-8660-4e2c-960e-55998bcfff46",
                                    "size": 11,
                                    "hash": "MGE0ZDU1YThkNzc4ZTUwMjJmYWI3MDE5NzdjNWQ4NDBiYmM0ODZkMA=="
                                },
                                "format": {
                                    "system": "http://ihe.net/fhir/ihe.formatcode.fhir/CodeSystem/formatcode",
                                    "code": "urn:ihe:iti:xds-sd:text:2008"
                                }
                            }
                        ]
                    },
                    "request": {
                        "method": "POST",
                        "url": "DocumentReference"
                    }
                },
                {
                    "fullUrl": "urn:uuid:5c8ecb2a-8660-4e2c-960e-55998bcfff46",
                    "resource": {
                        "resourceType": "Bundle",
                        "id": "5c8ecb2a-8660-4e2c-960e-55998bcfff46",
                        "identifier": {
                            "system": "urn:ietf:rfc:4122",
                            "value": "f50a5146-7d08-4f4d-b7a9-eb8a05d513a0"
                        },
                        "type": "document",
                        "timestamp": "2023-01-15T17:26:43.023+00:00",
                        "entry": [
                            {
                                "fullUrl": "urn:uuid:428e9bed-1f16-4595-91b9-80ae6ac12421",
                                "resource": {
                                    "resourceType": "Composition",
                                    "status": "final",
                                    "type": {
                                        "coding": [
                                            {
                                                "system": "http://loinc.org",
                                                "code": "60591-5",
                                                "display": "Patient Summary Document"
                                            }
                                        ]
                                    },
                                    "subject": {
                                        "reference": `Patient/P-${paciente.idPaciente}`
                                    },
                                    "date": "2023-01-15T17:26:43+00:00",
                                    "author": [
                                        {
                                            "reference": "Organization/Organizacion-1"
                                        }
                                    ],
                                    "title": "Patient Summary as of 01/15/2023",
                                    "confidentiality": "N",
                                    "custodian": {
                                        "reference": "Organization/Organizacion-1"
                                    },
                                    "section": [
                                        {
                                            "title": "Active Problems",
                                            "code": {
                                                "coding": [
                                                    {
                                                        "system": "http://loinc.org",
                                                        "code": "11450-4",
                                                        "display": "Problem list Reported"
                                                    }
                                                ]
                                            },
                                            "entry": [
                                                {
                                                    "reference": "Condition/Condicion-1"
                                                }
                                            ]
                                        },
                                        {
                                            "title": "Medication",
                                            "code": {
                                                "coding": [
                                                    {
                                                        "system": "http://loinc.org",
                                                        "code": "10160-0",
                                                        "display": "History of Medication use Narrative"
                                                    }
                                                ]
                                            },
                                            "entry": [
                                                {
                                                    "reference": "MedicationStatement/30375d1f-ee56-4303-bbe0-097cfa5f2f78"
                                                }
                                            ]
                                        },
                                        {
                                            "title": "Allergies and Intolerances",
                                            "code": {
                                                "coding": [
                                                    {
                                                        "system": "http://loinc.org",
                                                        "code": "48765-2",
                                                        "display": "Allergies and adverse reactions Document"
                                                    }
                                                ]
                                            },
                                            "entry": [
                                                {
                                                    "reference": "AllergyIntolerance/520fcaa1-1234-40c8-b03f-58ef77c40b13"
                                                }
                                            ]
                                        },
                                        {
                                            "title": "History of Immunizations",
                                            "code": {
                                                "coding": [
                                                    {
                                                        "system": "http://loinc.org",
                                                        "code": "11369-6",
                                                        "display": "History of Immunization Narrative"
                                                    }
                                                ]
                                            },
                                            "text": {
                                                "status": "generated",
                                                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">To be populated at future time</div>"
                                            },
                                            "entry": [
                                                {
                                                    "reference": "Immunization/Inmunizacion-1"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            },
                            jsonPaciente,
                            {
                                "fullUrl": "urn:uuid:Inmunizacion-1",
                                "resource": {
                                    "resourceType": "Immunization",
                                    "id": "Inmunizacion-1",
                                    "meta": {
                                        "profile": [
                                            "http://worldhealthorganization.github.io/ddcc/StructureDefinition/DDCCImmunization"
                                        ]
                                    },
                                    "extension": [
                                        {
                                            "url": "http://worldhealthorganization.github.io/ddcc/StructureDefinition/DDCCEventBrand",
                                            "valueCoding": {
                                                "system": "http://worldhealthorganization.github.io/ddcc/CodeSystem/DDCC-Example-Test-CodeSystem",
                                                "code": "XM4YL8"
                                            }
                                        },
                                        {
                                            "url": "http://worldhealthorganization.github.io/ddcc/StructureDefinition/DDCCVaccineMarketAuthorization",
                                            "valueCoding": {
                                                "system": "http://worldhealthorganization.github.io/ddcc/CodeSystem/DDCC-Example-Test-CodeSystem",
                                                "code": "TEST"
                                            }
                                        },
                                        {
                                            "url": "http://worldhealthorganization.github.io/ddcc/StructureDefinition/DDCCCountryOfEvent",
                                            "valueCode": "PE"
                                        }
                                    ],
                                    "status": "completed",
                                    "vaccineCode": {
                                        "coding": [
                                            {
                                                "system": "http://id.who.int/icd11/mms",
                                                "code": "XM9QW8",
                                                "display": "COVID-19 vaccine, non-replicating viral vector"
                                            }
                                        ]
                                    },
                                    "lotNumber": "A1234",
                                    "patient": {
                                        "reference": `Patient/P-${paciente.idPaciente}`
                                    },
                                    "occurrenceDateTime": "2020-11-15",
                                    "protocolApplied": [
                                        {
                                            "doseNumberPositiveInt": 1
                                        }
                                    ]
                                }
                            },
                            {
                                "fullUrl": "urn:uuid:Condicion-1",
                                "resource": {
                                    "resourceType": "Condition",
                                    "id": "Condicion-1",
                                    "clinicalStatus": {
                                        "coding": [
                                            {
                                                "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                                "code": "active"
                                            }
                                        ]
                                    },
                                    "verificationStatus": {
                                        "coding": [
                                            {
                                                "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                                                "code": "confirmed"
                                            }
                                        ]
                                    },
                                    "category": [
                                        {
                                            "coding": [
                                                {
                                                    "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                                                    "code": "problem-list-item",
                                                    "display": "Problem List Item"
                                                }
                                            ]
                                        }
                                    ],
                                    "severity": {
                                        "coding": [
                                            {
                                                "system": "http://loinc.org",
                                                "code": "LA6752-5",
                                                "display": "Severe"
                                            }
                                        ]
                                    },
                                    "code": {
                                        "coding": [
                                            {
                                                "system": "http://hl7.org/fhir/sid/icd-10",
                                                "code": "E11",
                                                "display": "Type 2 diabetes mellitus"
                                            }
                                        ]
                                    },
                                    "subject": {
                                        "reference": `Patient/P-${paciente.idPaciente}`
                                    },
                                    "onsetDateTime": "2019-03-01",
                                    "recordedDate": "2019-03-10"
                                }
                            },


                            {
                                "fullUrl": "urn:uuid:codigo-medicamento-reemplazar",
                                "resource": {
                                    "resourceType": "Medication",
                                    "id": "codigo-medicamento-reemplazar",
                                    "code": {
                                        "coding": [
                                            {
                                                "system": "http://snomed.info/sct",
                                                "code": "108774000",
                                                "display": "Product containing anastrozole (medicinal product)"
                                            },
                                            {
                                                "system": "urn:oid:2.16.840.1.113883.2.4.4.1",
                                                "code": "99872",
                                                "display": "ANASTROZOL 1MG TABLET"
                                            },
                                            {
                                                "system": "urn:oid:2.16.840.1.113883.2.4.4.7",
                                                "code": "2076667",
                                                "display": "ANASTROZOL CF TABLET FILMOMHULD 1MG"
                                            },
                                            {
                                                "system": "http://www.whocc.no/atc",
                                                "code": "L02BG03",
                                                "display": "anastrozole"
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                "fullUrl": "urn:uuid:30375d1f-ee56-4303-bbe0-097cfa5f2f78",
                                "resource": {
                                    "resourceType": "MedicationStatement",
                                    "id": "30375d1f-ee56-4303-bbe0-097cfa5f2f78",
                                    "status": "active",
                                    "medicationReference": {
                                        "reference": "Medication/codigo-medicamento-reemplazar"
                                    },
                                    "subject": {
                                        "reference": `Patient/P-${paciente.idPaciente}`
                                    },
                                    "effectivePeriod": {
                                        "start": "2015-03"
                                    },
                                    "dosage": [
                                        {
                                            "timing": {
                                                "repeat": {
                                                    "count": 1,
                                                    "periodUnit": "d"
                                                }
                                            },
                                            "route": {
                                                "coding": [
                                                    {
                                                        "system": "http://standardterms.edqm.eu",
                                                        "code": "20053000",
                                                        "display": "Oral use"
                                                    }
                                                ]
                                            },
                                            "doseAndRate": [
                                                {
                                                    "type": {
                                                        "coding": [
                                                            {
                                                                "system": "http://terminology.hl7.org/CodeSystem/dose-rate-type",
                                                                "code": "ordered",
                                                                "display": "Ordered"
                                                            }
                                                        ]
                                                    },
                                                    "doseQuantity": {
                                                        "value": 1,
                                                        "unit": "tablet",
                                                        "system": "http://unitsofmeasure.org",
                                                        "code": "1"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                "fullUrl": "urn:uuid:520fcaa1-1234-40c8-b03f-58ef77c40b13",
                                "resource": {
                                    "resourceType": "AllergyIntolerance",
                                    "id": "520fcaa1-1234-40c8-b03f-58ef77c40b13",
                                    "clinicalStatus": {
                                        "coding": [
                                            {
                                                "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
                                                "code": "active"
                                            }
                                        ]
                                    },
                                    "verificationStatus": {
                                        "coding": [
                                            {
                                                "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
                                                "code": "confirmed"
                                            }
                                        ]
                                    },
                                    "type": "allergy",
                                    "category": [
                                        "medication"
                                    ],
                                    "criticality": "high",
                                    "code": {
                                        "coding": [
                                            {
                                                "system": "http://snomed.info/sct",
                                                "code": "373270004",
                                                "display": "Substance with penicillin structure and antibacterial mechanism of action (substance)"
                                            }
                                        ]
                                    },
                                    "patient": {
                                        "reference": `Patient/P-${paciente.idPaciente}`
                                    },
                                    "onsetDateTime": "2010"
                                }
                            },
                            {
                                "fullUrl": "urn:uuid:Organizacion-1",
                                "resource": {
                                    "resourceType": "Organization",
                                    "id": "Organizacion-1",
                                    "name": "Instituto Nacional Materno Perinatal",
                                    //"name": "Hospital Santa Rosa",
                                    "address": [
                                        {
                                            "text": "Jr. Santa Rosa",
                                            "country": "PE"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "request": {
                        "method": "POST",
                        "url": "Bundle"
                    }
                },
                jsonPaciente
            ]
        }

        return json
    },

    JsonPaciente: function (paciente) {
        return {
            "fullUrl": `urn:uuid:P-${paciente.idPaciente}`,
            "resource": {
                "resourceType": "Patient",
                "id": `P-${paciente.idPaciente}`,
                "meta": {
                    "security": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                            "code": "HTEST"
                        }
                    ]
                },
                "identifier": [
                    {
                        "system": "urn:oid:2.16.840.1.113883.3.9143.2.1.5",
                        "type": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": paciente.tipoDocIdentidad
                                }
                            ]
                        },
                        "value": paciente.nroDocumento
                    }
                ],
                "active": true,
                "name": [
                    {
                        "use": "official",
                        "text": paciente.apellidoPaterno + ' ' + paciente.apellidoMaterno + ' ' + paciente.primerNombre,
                        "family": paciente.apellidoPaterno + ' ' + paciente.apellidoMaterno,
                        "given": [
                            paciente.primerNombre
                        ]
                    }
                ],
                "gender": paciente.tipoSexo,
                "birthDate": paciente.fechaNacimientoPaciente
            },
            "request": {
                "method": "PUT",
                "url": `Patient/P-${paciente.idPaciente}`
            }
        }
    },


    ConsultarDatosPaciente: async function (historia, documento) {

        let formData = new FormData()

        formData.append('nroHistoria', historia);
        formData.append('nroDocumento', documento);

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/PacienteBuscarPorFiltro?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lsPacientes.table.length > 0) {
                return datos.lsPacientes.table[0]
            }

            return null

        } catch (error) {
            return null
        }
    },

    CompletaDatosBundle: async function (idPaciente) {
        Cargando(1)
        let bundle = await Renhice.ConsultaPacientes(idPaciente)

        console.log('bundle', bundle)

        const patient = bundle.entry.find(e => e.resource.resourceType === "Patient")?.resource;
        const condition = bundle.entry.find(e => e.resource.resourceType === "Condition")?.resource;
        const medicationStatement = bundle.entry.find(e => e.resource.resourceType === "MedicationStatement")?.resource;
        const medication = bundle.entry.find(e => e.resource.resourceType === "Medication")?.resource;
        const allergy = bundle.entry.find(e => e.resource.resourceType === "AllergyIntolerance")?.resource;
        const immunization = bundle.entry.find(e => e.resource.resourceType === "Immunization")?.resource;
        const organization = bundle.entry.find(e => e.resource.resourceType === "Organization")?.resource;

        $("#fhirTable tbody").html('')

        // Datos del paciente
        addRow("Paciente", patient?.name?.[0]?.text ?? '');
        addRow("Género", patient?.gender ?? '');
        addRow("Nacimiento", patient?.birthDate ?? '');
        addRow("Identificador", patient?.identifier?.[0]?.value ?? '');

        // Condición
        addRow("Condición", condition?.code?.coding?.[0]?.display ?? '');
        addRow("Severidad", condition?.severity?.coding?.[0]?.display ?? '');
        addRow("Inicio", condition?.onsetDateTime ?? '');

        // Medicamento
        const medDisplay = medication?.code?.coding?.find(c => c.display?.includes("anastrozole"))?.display;
        addRow("Medicamento", medDisplay ?? '');
        addRow("Dosis", `${medicationStatement?.dosage?.[0]?.doseAndRate?.[0]?.doseQuantity?.value ?? ''} ${medicationStatement?.dosage?.[0]?.doseAndRate?.[0]?.doseQuantity?.unit ?? ''}`.trim());
        addRow("Frecuencia", `Cada ${medicationStatement?.dosage?.[0]?.timing?.repeat?.periodUnit ?? ''}`);

        // Alergia
        addRow("Alergia", allergy?.code?.coding?.[0]?.display ?? '');
        addRow("Crítico", allergy?.criticality ?? '');

        // Inmunización
        addRow("Vacuna", immunization?.vaccineCode?.coding?.[0]?.display ?? '');
        addRow("Fecha de vacunación", immunization?.occurrenceDateTime ?? '');
        addRow("Lote", immunization?.lotNumber ?? '');

        // Organización
        addRow("IPRESS", organization?.name ?? '');
        addRow("Direccion", organization?.address?.[0]?.text ?? '');

        $('#modalDatosPaciente').modal('show')

        Cargando(0)
    },

    Events: function () {
        $('#btnPacienteBusq').on('click', async function () {

            let idPaciente = $('#txtIdPaciente').val()
            let bundle = await Renhice.CompletaDatosBundle(idPaciente)

        })
        $('#btnNroDocumentoPacienteBusq').on('click', async function () {

            Cargando(1)

            let res = await Renhice.ServicioDocumentReference()

            oTable_TablePacientes.fnClearTable()

            if (res.data.entry == 'undefined' || res.data.entry == undefined) {
                alerta2('error', '', 'No se encontro informacion')
                Cargando(0)
                return
            } 
            for (let obj of res.data.entry) {

                let documentReference = obj?.resource?.content[0]?.attachment?.url.split('/')

                let bundle = await Renhice.ConsultaPacientes(documentReference[1])

                const patient = bundle.entry.find(e => e.resource.resourceType === "Patient")?.resource;
                const organization = bundle.entry.find(e => e.resource.resourceType === "Organization")?.resource;

                console.log('patient', patient)

                let row = {
                    id: patient?.identifier?.[0]?.value ?? '',
                    birthDate: patient?.birthDate ?? '',
                    gender: patient?.gender ?? '',
                    name: patient?.name?.[0]?.text ?? '',
                    type: patient?.identifier[0]?.type?.coding[0]?.code,
                    document: patient?.identifier[0]?.value,
                    establecimiento: organization?.name ?? '',
                    bundle: documentReference[1]
                }

                oTable_TablePacientes.fnAddData(row)
                
            }

            Cargando(0)
            

        })
        $('#btnMigrarAtencion').on('click', async function () {
            let objRow = oTable_cuentas.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Debe seleccionar un registro')
                return
            }


            let datosPaciente = await Renhice.ConsultarDatosPaciente('', $('#txtNroDocumento').val())
            console.log('objRow', objRow)
            console.log('datosPaciente', datosPaciente)


            let json = await Renhice.BuildJson(objRow, datosPaciente)


            console.log('json', json)

            let data = new FormData();

            data.append('data', JSON.stringify(json))

            const res2 = await $.ajax({
                method: "POST",
                url: "/Renhice/RegistrarAtencionRenhice?area=Comun",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                async: true,
            });

            console.log('res2', res2)

            if (res2?.msj == 'correcto') {
                let response = res2.data.entry[2].response

                alerta2('success', '', 'Registro exitoso')
            } else {
                alerta2('error', '', 'Algo salio mal')
            }


        })
        $('#btnCerrarModal').on('click', async function () {
            
            $('#modalDatosPaciente').modal('hide')
        })
    }

}

function addRow(section, detail) {
    $("#fhirTable tbody").append(`<tr><td>${section}</td><td>${detail}</td></tr>`);
}

$(document).ready(function () {
    Renhice.DataTablePacientes()

    Renhice.Events()
})