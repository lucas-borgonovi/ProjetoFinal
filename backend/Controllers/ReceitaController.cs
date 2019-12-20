using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Domains;
using Backend.ViewModels;
using BackEnd.Repositories;
using Backend_Cooganicas.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Administrador, Comunidade")]

    public class ReceitaController : ControllerBase 
    {
        ReceitaRepository _repositorio = new ReceitaRepository();

        //GET: api/Receita

        /// <summary>
        ///   Lista todas as receitas cadastradas
        /// </summary>
        /// <returns>Retorna as receitas cadastradas</returns>
        [HttpGet]
        public async Task<ActionResult<List<Receita>>> Get(){
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var Receitas = await _repositorio.Listar();
            if(Receitas == null) {
                return NoContent();
            }

            return Receitas;
        }
        //GET: api/Receita/2
        /// <summary>
        ///   Procura Receitas referente ao Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Retorna a receita referente ao Id passado</returns>
        
        [Authorize(Roles = "Administrador, Comunidade")]
        [HttpGet ("{id}")]
        public async Task<ActionResult<Receita>> Get (int id) {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var Receita = await _repositorio.BuscarPorID(id);
            if (Receita == null) {
                return NoContent();
            }

            return Receita;
        }
        
        /// <summary>
        ///   Lista as receitas cadastradas pelo usuário logado
        /// </summary>
        /// <returns>Receita cadastrada</returns>
        [HttpGet("minhasreceitas")]
        public async Task<ActionResult<List<Receita>>> GetReceitasUsuario () {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
           
            var Id = PegarUsuarioLogadoId();

            var receita = await _repositorio.BuscarPorIDLogado(Id);
            
            if (receita == null) {
                return NoContent();
            }

            return receita;
        }

        //POST api/Receita
        /// <summary>
        ///   Cadastra uma receita
        /// </summary>
        /// <param name="receita">Dados da receita a ser cadastrada</param>
        /// <returns>Retorna Receita cadastrada</returns>
        
        [Authorize(Roles = "Administrador, Comunidade")]
        [HttpPost]
        public async Task<ActionResult<Receita>> Post ([FromForm]CadastrarReceitaViewModel receita) {
            try {
                Receita NovaReceita = new Receita();

                if (Request.Form.Files.Count > 0) {
                    
                    var caminho = @"C:\Users\fic\Desktop\Coorganicas-Final-master\Coorganicas-pronto\Coorganicas_react\coorganicas\src\Assets";
                    var pasta = "receitas";
                    var file = Request.Form.Files[0];
                    var folderName = Path.Combine(caminho, "images", pasta);
                    // var pathToSave = Directory.Exists(folderName);
                    var fileName = ContentDispositionHeaderValue.Parse (file.ContentDisposition).FileName.Trim ('"');
                    var fullPath = Path.Combine (folderName, fileName);
                    // var dbPath = Path.Combine (folderName, fileName);

                    using (var stream = new FileStream (fullPath, FileMode.Create)) {
                        file.CopyTo (stream);
                    }                               
    
                    NovaReceita.UsuarioId = PegarUsuarioLogadoId();                 
                    NovaReceita.Titulo = receita.Titulo;
                    NovaReceita.Conteudo = receita.Conteudo.Trim();
                    NovaReceita.ImagemReceita = fileName;


                } else {
                   return NotFound(
                    new
                    {
                        Mensagem = "Atenção a imagem não foi selecionada!",
                        Erro = true
                    });        
                }          
                
                //Tratamos contra ataques de SQL Injection
                await _repositorio.Salvar(NovaReceita);
                
            } catch (DbUpdateConcurrencyException) {
                throw;
            }

            return Ok(new{
                Mensagem = "Receita cadastrada com sucesso",
                Erro = false
            });
        }

        /// <summary>
        ///   Altera uma receita cadastrada
        /// </summary>
        /// <param name="id">Id da receita</param>
        /// <param name="receita">Dados da receita a ser alterada</param>
        /// <returns>Retorna a receita alterada</returns>
        [HttpPut ("{id}")]
        public async Task<ActionResult> Put (int id,[FromForm] AlterarReceitaViewModel receita) {
            
            if(receita.Conteudo == null && receita.Titulo == null && receita.Imagem_Receita == null) {
                return NoContent();
            }

            var receitaUsuario = await _repositorio.BuscarPorID(id);

            if (receitaUsuario == null) {
                return NotFound(
                    new {
                        Mensagem = "Receita Não Encontrada",
                        Erro = true
                    }
                );
            }

            var ReceitaAlterada =  VerificaAlteracaoReceita(receitaUsuario, receita);

            //Comparamos os atributos que foram modificados atraves do EF

            try {
                var ret = await _repositorio.Alterar(ReceitaAlterada);
                return Ok(
                    new{
                      Mensagem = "Receita alterada com sucesso",
                      Erro = false
                    }
                );
                
            } catch (DbUpdateConcurrencyException) {
                //Verificamos se o objeto realmente existe no banco
                var receita_valido = await _repositorio.BuscarPorID(id);
                if (receita_valido == null) {
                    return NoContent ();
                } else {
                    throw;
                }
            }      
        }


        private Receita VerificaAlteracaoReceita(Receita receita, AlterarReceitaViewModel receitaView) {
                        
            if(receita.Titulo != receitaView.Titulo && receitaView.Titulo != null && receitaView != null) {
                receita.Titulo = receitaView.Titulo;
            }

            if(receita.Conteudo != receitaView.Conteudo && receitaView.Conteudo != null && receitaView != null) {
                receita.Conteudo = receitaView.Conteudo;
            }

            if(Request.Form.Files.Count > 0) {
                    
                    var caminho = @"C:\Users\fic\Desktop\Coorganicas-Final-master\Coorganicas-pronto\Coorganicas_react\coorganicas\src\Assets";
                    var pasta = "receitas";
                    var file = Request.Form.Files[0];
                    var folderName = Path.Combine(caminho, "images", pasta);
                    // var pathToSave = Directory.Exists(folderName);
                    var fileName = ContentDispositionHeaderValue.Parse (file.ContentDisposition).FileName.Trim ('"');
                    var fullPath = Path.Combine (folderName, fileName);
                    // var dbPath = Path.Combine (folderName, fileName);

                    using (var stream = new FileStream (fullPath, FileMode.Create)) {
                        file.CopyTo (stream);
                    } 

                receita.ImagemReceita = fileName;
            }

            return receita;
        }

        //DELETE api/Receita/id
        /// <summary>
        ///   Deleta receita cadastrada
        /// </summary>
        /// <param name="id">Id da receita</param>
        /// <returns>Rertorna Receita deletada</returns>
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Receita>> Delete (int id) {

            var receita = await _repositorio.BuscarPorID (id);
            if (receita == null) {
                return NoContent();
            }
            
            await _repositorio.Excluir(receita);

            return receita;
        }

        private int PegarUsuarioLogadoId(){
            // Cast to ClaimsIdentity.
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            // Gets list of claims.
            IEnumerable<Claim> claim = identity.Claims; 

            // Gets name from claims. Generally it's an email address.
            var idClaim = claim
                .Where(x => x.Type == ClaimTypes.PrimarySid)
                .FirstOrDefault();
            var UsuarioLogadoId=Convert.ToInt32((idClaim.Value));

            return UsuarioLogadoId;
                    
        }
    }
}