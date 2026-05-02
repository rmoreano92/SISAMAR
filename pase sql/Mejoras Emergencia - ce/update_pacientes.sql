
alter table pacientes add prevCondLaboral int
go

alter table Pacientes2207 add prevCondLaboral int
go

--select top 100 isnull(condLaboral,ParentescoPaciente) prevCondLaboral from pacientes
--select top 100 isnull(condLaboral,InfIdParentescoTitular) prevCondLaboral from Pacientes2207

update pacientes set prevCondLaboral = isnull(condLaboral,ParentescoPaciente)
go

update Pacientes2207 set prevCondLaboral = isnull(condLaboral,InfIdParentescoTitular)
go


UPDATE p
SET 
    p.fichaFamiliar = pn.cip,
    p.CondLaboral = pn.Parentesco_naval,
		p.ParentescoPaciente = pn.Parentesco_naval
FROM pacientes p
INNER JOIN pacientenuevo pn
    ON p.nrodocumento = pn.nrodocumento
--where 
	--p.nrodocumento = '07484765' 
	--pn.cip = '02669043';

UPDATE p
SET 
    p.fichaFamiliar = pn.cip,
    p.CondLaboral = pn.Parentesco_naval,
		p.InfIdParentescoTitular = pn.Parentesco_naval
FROM pacientes2207 p
INNER JOIN pacientenuevo pn
    ON p.nrodocumento = pn.nrodocumento
--where 
	--p.nrodocumento = '07484765' 
	--pn.cip = '02669043';



