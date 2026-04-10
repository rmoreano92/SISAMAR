
using CapaDatos;
using CapaEntidades;
using Microsoft.IdentityModel.Tokens;
using SiHospCrypKey;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace WebAppMaternidad
{
    public class TokenProvider
    {
        public async Task<Tuple<String,Empleado>> LoginUser(string UserID, string Password)
        {
            try {
                //Get user details for the user who is trying to login - JRozario

                DalEmpleado _dalEmpleado = new DalEmpleado();
                Empleado objEmpleado = null;

                var objEncriptador = new Encriptar();

                // objcripkey.DecryptString(Password);

                objEmpleado = await _dalEmpleado.VerificarAcceso(UserID, Password);
                //var user = UserList.SingleOrDefault(x => x.USERID == UserID);
                //Authenticate User, Check if its a registered user in DB  - JRozario
                if (objEmpleado == null)
                    return null;

                //
                if (Password != objEncriptador.DesencriptarCadena(objEmpleado.ClaveVWeb))
                //if (Password != objEmpleado.ClaveVWeb)
                {
                    throw new Exception("Contraseña Incorrecta");
                }
                //If its registered user, check user password stored in DB - JRozario
                //For demo, password is not hashed. Its just a string comparison - JRozario
                //In reality, password would be hashed and stored in DB. Before comparing, hash the password - JRozario
                if (objEmpleado != null)
                {
                    //Authentication successful, Issue Token with user credentials - JRozario
                    //Provide the security key which was given in the JWToken configuration in Startup.cs - JRozario
                    var key = Encoding.ASCII.GetBytes("YourKey-2374-OFFKDI940NG7:56753253-tyuw-5769-0921-kfirox29zoxv");
                    //Generate Token for user - JRozario
                    var JWToken = new JwtSecurityToken(
                        issuer: "http://localhost:45092/",
                        audience: "http://localhost:45092/",
                        claims: GetUserClaims(objEmpleado),
                        notBefore: new DateTimeOffset(DateTime.Now).DateTime,
                        expires: new DateTimeOffset(DateTime.Now.AddDays(1)).DateTime,
                        //Using HS256 Algorithm to encrypt Token - JRozario
                        signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                    );
                    var token = new JwtSecurityTokenHandler().WriteToken(JWToken);
                    var rsp = Tuple.Create<String, Empleado>(token.ToString(), objEmpleado);
                    return rsp;
                }
                else
                {
                    return null;
                }

            } catch( Exception  ex) {

                throw new Exception(ex.Message, ex);
            }

            
        }

          private IEnumerable<Claim> GetUserClaims(Empleado objEmpleado)
        {
            List<Claim> claims = new List<Claim>();
            Claim _claim;
            _claim = new Claim(ClaimTypes.Name, objEmpleado.NombreCompleto2());
            claims.Add(_claim);
            _claim = new Claim("USERID", objEmpleado.IdEmpleado.ToString());
            claims.Add(_claim);
            _claim = new Claim("DNI", (objEmpleado.DNI??""));
            claims.Add(_claim);
            //_claim = new Claim("idSupervisor", objEmpleado.idSupervisor.ToString());
            //claims.Add(_claim);
            return claims.AsEnumerable<Claim>();
        }


      

    }
}
