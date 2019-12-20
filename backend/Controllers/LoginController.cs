using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Backend.Domains;
using Backend.Repositories;
using Backend.Utils;
using Backend.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Backend_Cooganicas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {   
        // Chamamos nosso contexto da base de dados
        LoginRepository _repositorio = new LoginRepository();

        public static int UsuarioLogado { get; private set;}

        // Definimos uma variavel para percorrer nossos métodos com as configurações obtidas no appsetting.json
        private IConfiguration _config;

        // Definimos um metodo construtor para poder acessar estas configs ^
        
        public LoginController(IConfiguration config){
            _config = config;
        }   


        // Chamamos nosso método para validar o usuário na aplicação, verificando se ele existe em nosso banco de dados
        private Usuario ValidaUsuario(LoginViewModel login) {
            var usuario = _repositorio.Logar(login);           

            if(usuario != null) {
                UsuarioLogado = usuario.UsuarioId;
                return usuario;
            }
            return null;
        }

        // Geramos o Token
        private string GerarToken(Usuario userInfo) {
            
            // Definimos a criptografia do nosso Token
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Definimos nossas Claims (dados da sessão)
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.NameId, userInfo.Nome),
                new Claim(JwtRegisteredClaimNames.Email, userInfo.Email),
                new Claim(ClaimTypes.Role,userInfo.TipoUsuario.Tipo),
                new Claim("Role",userInfo.TipoUsuario.Tipo),
                new Claim("Id", userInfo.UsuarioId.ToString()),                    
                new Claim(ClaimTypes.PrimarySid, userInfo.UsuarioId.ToString()),                    
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // Configuramos nosso Token e seu tempo de vida
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires : DateTime.Now.AddMinutes(120),
                signingCredentials : credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Usa essa anotação para ignorar a autenticação nesse método
        /// <summary>
        ///   Loga o usuario e gera token de acesso  
        /// </summary>
        /// <param name="login">Email e senha de login do usuario</param>
        /// <returns>Retorna O token de acesso</returns>
        [HttpPost]
        [AllowAnonymous]
        public IActionResult Login([FromForm]LoginViewModel login) {           
          
            IActionResult response = Unauthorized();

            var user = ValidaUsuario(login);

            if(user != null) {
                var tokenString = GerarToken(user);
                response = Ok(new {token = tokenString});
            } else {
                 response = Ok(new {Mensagem = "Email ou Senha Incorreto!", Erro = true});
            }
            

            if(user.TipoUsuarioId == 1) {
                VerificaReservasExistentes.RotinaReservaExistente();
            }


            return response;
        }

                

    }

}