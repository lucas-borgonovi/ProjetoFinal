using System.Linq;
using System.Security.Cryptography;
using Backend.Domains;
using Backend.Interfaces;
using Backend.Utils;
using Backend.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class LoginRepository : ILogin
    {
        public Usuario Logar(LoginViewModel login)
        {   
            using(CoorganicasContext _contexto = new CoorganicasContext()){
                var hash = new Hash(SHA512.Create());
              
                // var usuario = _contexto.Usuario.Include("TipoUsuario").FirstOrDefault(
                //     u => u.Email == login.Email && u.Senha == login.Senha
                // );

                var senha = hash.CriptografarSenha(login.Senha);

                var usuario = _contexto.Usuario.Include("TipoUsuario").FirstOrDefault(
                    u => u.Email == login.Email && u.Senha == senha
                );                 
                                
                return usuario;
                                
            }
        }


    }
}