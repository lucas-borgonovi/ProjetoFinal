using System.Runtime.InteropServices.ComTypes;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Net.Http.Headers;
using Backend.Domains;
using Backend.Repositories;
using Backend.ViewModels;
using Backend.Utils;
using System.Security.Cryptography;

namespace Backend.Controllers {
    [Route("api/[controller]")]
    [ApiController]    
    public class UsuarioController : ControllerBase
    {
        UsuarioRepository _repositorio = new UsuarioRepository();
       //static readonly string securityCode= "mysaltkey";

        /// <summary>
        ///     Lista todos os usuários
        /// </summary>
        /// <returns>Retorna todos os usuários cadastrados</returns>
        // [Authorize(Roles = "Administrador")]
        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> Get(){
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var usuarios = await _repositorio.Listar();

            if(usuarios == null) {
                return NotFound();
            }

            return usuarios;
        }

        /// <summary>
        ///     Lista o usuário pelo Id
        /// </summary>
        /// <param name="id">Id do usuário</param>
        /// <returns>Retorna o usuário referente ao Id passado</returns>
        // [Authorize(Roles = "Administrador")]
        [HttpGet ("{id}")]       
        public async Task<ActionResult<Usuario>> Get(int id) {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var usuario = await _repositorio.BuscarPorID(id);
            
            // System.Security.Cryptography.SHA512Managed sha512 = new System.Security.Cryptography.SHA512Managed();
            // Byte[] EncryptedSHA512 = sha512.ComputeHash(System.Text.Encoding.UTF8.GetBytes(string.Concat(usuario.Senha, securityCode)));
            // sha512.Clear();
            // usuario.Senha = Convert.ToBase64String(EncryptedSHA512);

            if (usuario == null) {
                return NotFound ();
            }

            return usuario;
        }

       
        /// <summary>
        ///   Cadastra o usuário
        /// </summary>
        /// <param name="usuario">Dados do usuário</param>
        /// <returns>Retorna o usuario que foi cadastrado</returns>
        [HttpPost]
        public async Task<ActionResult<Usuario>> Post([FromForm]CadastrarUsuarioViewModel usuario) {
            try {       
                Usuario NovoUsuario = new Usuario();
                var hash = new Hash(SHA512.Create()); 
                
                if (Request.Form.Files.Count > 0) {
                    var caminho = @"C:\Users\fic\Desktop\Coorganicas-Final-master\Coorganicas-pronto\Coorganicas_react\coorganicas\src\Assets";
                    //var caminho = @"C:\Users\AlefW\Desktop\Coorganicas_Backend\assets";
                    var pasta = "Perfil";

                    var file = Request.Form.Files[0];
                    var folderName = Path.Combine(caminho, "images", pasta);
                    // var pathToSave = Directory.Exists(folderName);
                    var fileName = ContentDispositionHeaderValue.Parse (file.ContentDisposition).FileName.Trim ('"');
                    var fullPath = Path.Combine (folderName, fileName);
                    // var dbPath = Path.Combine (folderName, fileName);

                    using (var stream = new FileStream (fullPath, FileMode.Create)) {
                        file.CopyTo (stream);
                    }     
                                        
                
                   NovoUsuario.ImagemUsuario = fullPath;
                   NovoUsuario.Nome = usuario.Nome;  
                   NovoUsuario.Email = usuario.Email;
                   NovoUsuario.Cnpj = FuncoesReutilizar.RetornaCnpjFormatado(usuario.Cnpj);
                   NovoUsuario.Senha = hash.CriptografarSenha(usuario.Senha);
                   NovoUsuario.TipoUsuarioId = Convert.ToInt32(usuario.TipoUsuarioId);

               

                } else {
                    var fileName = string.Empty;

                    if(Request.Form.Files.Count == 0) {                    
                        if(Convert.ToInt32(Request.Form["TipoUsuario"]) == 2) {
                            fileName = "woman.png";
                        } else {
                            
                            fileName = "pessoa.png";
                        }                   
                    }    

                   NovoUsuario.ImagemUsuario = fileName;
                   NovoUsuario.Nome = usuario.Nome;  
                   NovoUsuario.Email = usuario.Email;
                   NovoUsuario.Cnpj =  FuncoesReutilizar.RetornaCnpjFormatado(usuario.Cnpj);
                   NovoUsuario.Senha = hash.CriptografarSenha(usuario.Senha);
                   NovoUsuario.TipoUsuarioId = Convert.ToInt32(usuario.TipoUsuarioId);
                }
                
                if(FuncoesReutilizar.ValidaCNPJ(usuario.Cnpj) == true){                    
                    await _repositorio.Gravar(NovoUsuario);

                    // Após gravar o usuário no banco iremos gravar os dados de enderco e telefone
                    // Aqui iremos chamar um metodo que retorna o ultimo usuario cadastrado que no caso foi o que acabamos de gravar
                    var UsuarioGravado = await _repositorio.RetornarUltimoUsuarioCadastrado();    
                    GravarTelEnd(UsuarioGravado.UsuarioId, usuario);
                    
                    
                    return await _repositorio.BuscarPorID(UsuarioGravado.UsuarioId);
                }
                else{
                    return NotFound(new{
                        Mensagem="CNPJ inválido!",
                        erro=true
                    });
                }

            } catch (DbUpdateConcurrencyException) {
                throw;
            }          
        }
        
        /// <summary>
        ///  Altera os dados do usuário pelo Id e o que foi passado.  
        /// </summary>
        /// <param name="id">Id do usuário</param>
        /// <param name="usuario">Dados do usuário para alteração</param>
        /// <returns>Retorna status Ok com a mensagem de usuário cadastrado com sucesso</returns>
        [HttpPut ("{id}")]
        public async Task<ActionResult> Put (int id,[FromForm] AlterarUsuarioViewModel usuario) {
             bool ok = ValidaForm(usuario);
             
             if(ok == false) {
                 return NoContent();
             }

           // Verifica se existe o usuario no banco através do id passado por parametro
            var ExisteUsuario = await _repositorio.BuscarPorID(id);
            
            TelefoneRepository _tel = new TelefoneRepository();
            var Tel = await _tel.BuscaTelefone(id) != null ? await _tel.BuscaTelefone(id) : null; 

            EnderecoRepository _end = new EnderecoRepository();
            var End = await _end.BuscaEndereco(id) != null ? await _end.BuscaEndereco(id) : null;

            //Se o Id do objeto não existir
            if(ExisteUsuario == null) {
                return NotFound(
                new
                {
                    Mensagem = "Usuário não encontrado.",
                    Erro = true
                });   
            }  

            try {
                var UsuarioAlterado = VerificaAlteracao(ExisteUsuario, usuario);
                var user = await _repositorio.Alterar(UsuarioAlterado);

                if(Tel != null) {
                    var TelefoneAlterado = VerificaAlteracaoTel(Tel, usuario);
                    var tel = await _tel.Alterar(TelefoneAlterado);
                }

                if(End != null) {
                    var EnderecoAlterado = VerificaAlteracaoEndereco(End, usuario);
                    var end = await _end.Alterar(EnderecoAlterado);
                }
               
            } catch (DbUpdateConcurrencyException) {
                //Verificamos se o objeto realmente existe no banco
                var usuario_valido = await _repositorio.BuscarPorID(id);
                
                if (usuario_valido == null) {
                    return NotFound ();
                } else {
                    throw;
                }

            }
          
            return Ok(
                new
                {
                    Mensagem = "Usuário alterado com sucesso.",
                    Erro = false
                }
            );   
        }

        /// <summary>
        ///     Deleta o usuário pelo Id
        /// </summary>
        /// <param name="id">Id do usuário</param>
        /// <returns>Retorna o usuário que foi deletado</returns>
        [Authorize(Roles = "Administrador")]
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Usuario>> Delete (int id) {

            var usuario = await _repositorio.BuscarPorID(id);
            
            if (usuario == null) {
                return NotFound ();
            }
            
            await _repositorio.Excluir(usuario);

            return usuario;
        }
                       
       private Usuario VerificaAlteracao(Usuario usuario, AlterarUsuarioViewModel user) {
            // Iremos verificar se tem alguma alteração dos dados através do viewmodel caso tenha iremos atribuir
            // os valores, com a viewmodel conseguimos fazer as alterações em precisar preencher os campos obrigatórios
                        
            if(usuario.Nome != user.Nome && user.Nome != null) {
                usuario.Nome = user.Nome;
            }

            if(usuario.Cnpj != user.Cnpj && user.Cnpj != null) {
                usuario.Cnpj = user.Cnpj;
            }

            var hash = new Hash(SHA512.Create());            
            var senha = hash.CriptografarSenha(user.Senha);

            if(usuario.Senha != senha && senha != null ) {
                usuario.Senha = senha;
            }

            if(usuario.Email != user.Email && user.Email != null) {
                usuario.Email = user.Email;
            }
            
            if(usuario.TipoUsuarioId != Convert.ToInt32(user.TipoUsuarioId)) {
                if(Convert.ToInt32(user.TipoUsuarioId) > 0 && (Convert.ToInt32(user.TipoUsuarioId) == 2 || Convert.ToInt32(user.TipoUsuarioId) == 3)) {
                    usuario.TipoUsuarioId = Convert.ToInt32(user.TipoUsuarioId);
                }
            }
            // usuario.TipoUsuarioId = 2;

            if(Request.Form.Files.Count > 0) {
                var caminho = @"C:\Users\fic\Desktop\Coorganicas-Final-master\Coorganicas-pronto\Coorganicas_react\coorganicas\src\Assets";
                //var caminho = @"C:\Users\AlefW\Desktop\Coorganicas_Backend\assets";
                var pasta = "Perfil";

                var file = Request.Form.Files[0];
                var folderName = Path.Combine(caminho, "images", pasta);
                // var pathToSave = Directory.Exists(folderName);
                var fileName = ContentDispositionHeaderValue.Parse (file.ContentDisposition).FileName.Trim ('"');
                var fullPath = Path.Combine (folderName, fileName);
                // var dbPath = Path.Combine (folderName, fileName);

                using (var stream = new FileStream (fullPath, FileMode.Create)) {
                    file.CopyTo (stream);
                }

                usuario.ImagemUsuario = fileName;
               
            }
            
           return usuario;
       }

        private Telefone VerificaAlteracaoTel(Telefone telefone, AlterarUsuarioViewModel user) {
                        
            if(telefone.Telefone1 != user.Telefone && user.Telefone != null && telefone != null) {
                telefone.Telefone1 = user.Telefone;
            }

            return telefone;
        }
        private Endereco VerificaAlteracaoEndereco(Endereco endereco, AlterarUsuarioViewModel user) {
                        
            if(endereco.Cidade != user.Cidade && user.Cidade != null && endereco != null) {
                endereco.Cidade = user.Cidade;
            }

            if(endereco.Cep != user.Cep && user.Cep != null && endereco != null) {
                endereco.Cep = user.Cep;
            }

            if(endereco.Endereco1 != user.Endereco && user.Endereco != null && endereco != null) {
                endereco.Endereco1 = user.Endereco;
            }

            if(endereco.Numero != Convert.ToInt32(user.Numero)) {
                if(Convert.ToInt32(user.Numero) > 0) {
                   endereco.Numero = Convert.ToInt32(user.Numero);
                }
            }

            return endereco;
        }

        private async void GravarTelEnd(int Id, CadastrarUsuarioViewModel novousuario) {
            TelefoneRepository _telefone = new TelefoneRepository();
            Telefone NovoTelefone = new Telefone();
            NovoTelefone.Telefone1 = novousuario.Telefone;
            NovoTelefone.UsuarioId = Id;
            await _telefone.Gravar(NovoTelefone);

            EnderecoRepository _endereco = new EnderecoRepository();
            Endereco NovoEndereco = new Endereco();
            NovoEndereco.Cidade = novousuario.Cidade;
            NovoEndereco.Cep = novousuario.Cep;
            NovoEndereco.Endereco1 = novousuario.Endereco;
            NovoEndereco.Numero = novousuario.Numero;
            NovoEndereco.UsuarioId = Id;
            await _endereco.Gravar(NovoEndereco);
        }

        private bool ValidaForm(AlterarUsuarioViewModel usuario) {
            
            if(usuario.Cidade == null && usuario.Cep == null && usuario.Cnpj == null && usuario.Email == null
                && usuario.Endereco == null && usuario.Endereco == null && usuario.Senha == null && usuario.ImagemUsuario == null
                && usuario.Nome == null && usuario.Telefone == null && usuario.Numero == 0 && usuario.TipoUsuarioId == 00
            ) {
                return false;
            }

            return  true;
        }
            
    }
}