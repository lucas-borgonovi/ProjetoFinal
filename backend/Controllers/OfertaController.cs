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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Administrador, Agricultor")]
    public class OfertaController : ControllerBase 
    {
        OfertaRepository _repositorio = new OfertaRepository();

        //GET: api/Oferta
        /// <summary>
        ///  Lista as ofertas cadastradas   
        /// </summary>
        /// <returns>Retorna as ofertas cadastradas pelos agricultores</returns>
        
        [HttpGet]
        public async Task<ActionResult<List<Oferta>>> Get(){
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var Ofertas = await _repositorio.Listar();
            if(Ofertas == null) {
                return NotFound();
            }

            return Ofertas;
        }
        
        //GET: api/Oferta/2
        /// <summary>
        ///   Procura Ofertas referente ao Id
        /// </summary>
        /// <param name="id">Id da Oferta</param>
        /// <returns>Retorna a Oferta referente ao Id passado</returns>
        // [Authorize(Roles = "Administrador, Agricultor")]
        [HttpGet ("{id}")]
        public async Task<ActionResult<Oferta>> Get (int id) {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var Oferta = await _repositorio.BuscarPorID(id);
            if (Oferta == null) {
                return NotFound ();
            }

            return Oferta;
        }

        /// <summary>
        ///   Lista as ofertas cadastradas ao usuário logado
        /// </summary>
        /// <returns>Retorna as ofertas do usúario logado</returns>
        [HttpGet("meusprodutos")]
        public async Task<ActionResult<List<Oferta>>> GetOfertasUsuario () {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
           
            var Id = PegarUsuarioLogadoId();

            var oferta = await _repositorio.BuscarPorIDLogado(Id);
            
            if (oferta == null) {
                return NotFound ();
            }

            return oferta;
        }

        /// <summary>
        ///   Cadastra uma oferta
        /// </summary>
        /// <param name="oferta">Dados da oferta</param>
        /// <returns>Retorna Oferta cadastrada</returns>

        [Authorize(Roles = "Administrador, Agricultor")]
        [HttpPost]
        public async Task<ActionResult<Oferta>> Post([FromBody]CadastrarOfertaViewModel oferta) {
            try {

                if(Convert.ToDateTime(oferta.Validade).Date < DateTime.Now.Date.AddDays(5)) {
                    return NotFound(new {
                        Mensagem = "Atenção! O produto ofertado deve ter a data de vencimento no mínimo de 5 dias.",
                        Erro  = true
                    });
                }

                int Id = PegarUsuarioLogadoId();

                Oferta NovaOferta = new Oferta();

                NovaOferta.Preco = Convert.ToDecimal(oferta.preco);
                NovaOferta.Cidade = oferta.Cidade;
                NovaOferta.Validade = Convert.ToDateTime(oferta.Validade).Date;
                NovaOferta.Quantidade = oferta.Quantidade;
                NovaOferta.Regiao = oferta.Regiao;
                NovaOferta.UsuarioId = Id;
                NovaOferta.ProdutoId = oferta.ProdutoId;
                NovaOferta.Descricao = oferta.Descricao;
    
                
                var ret = await _repositorio.Salvar(NovaOferta);
              

               if(ret != null) {
                    
                    return Ok(new {
                        Mensagem = "Oferta Cadastrada com sucesso",
                        Erro = false
                    });

               }else {
                    return NotFound(new {
                        Mensagem = "Erro ao cadastrar a oferta",
                        Erro = false
                    });
               }

            } catch (DbUpdateConcurrencyException) {
                throw;
            }            
        }

        /// <summary>
        ///  Altera alguma Oferta cadastrada
        /// </summary>
        /// <param name="id">Id da oferta</param>
        /// <param name="oferta">Dados a serem alterados</param>
        /// <returns>Retorna a oferta alterada</returns>
        
        [Authorize(Roles = "Administrador, Agricultor")]
        [HttpPut ("{id}")]
        public async Task<ActionResult> Put (int id, [FromForm]AlterarOfertaViewModel oferta) {

            //Se o Id do objeto não existir 
            //ele retorna o erro 400
            if(oferta.Cidade == null && oferta.preco == 0 && oferta.Regiao == null && oferta.Quantidade == 0 && oferta.Descricao == null && oferta.Validade == null) {
                return NoContent();
            }

            var ofertaUsuario = await _repositorio.BuscarPorID(id);

            if (ofertaUsuario == null) {
                return NotFound (
                    new {
                        Mensagem = "Oferta Não Encontrada",
                        Erro = true
                    }
                );
            }

            var OfertaAlterada =  VerificaAlteracaoOferta(ofertaUsuario, oferta);            

            try {
                await _repositorio.Alterar(OfertaAlterada);
                 return Ok(
                    new{
                      Mensagem = "Oferta alterada com sucesso",
                      Erro = false
                    }
                );

            } catch (DbUpdateConcurrencyException) {
                //Verificamos se o objeto realmente existe no banco
                var Oferta_valido = await _repositorio.BuscarPorID(id);
                
                if (Oferta_valido == null) {
                    return NoContent ();
                } else {
                    throw;
                }

            }
           
        }

        //DELETE api/Oferta/id
        /// <summary>
        ///   Deleta Oferta Cadastrada
        /// </summary>
        /// <param name="id">Id da oferta</param>
        /// <returns>Retorna a Oferta Deletada</returns>
        [Authorize(Roles = "Administrador, Agricultor")]
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Oferta>> Delete (int id) {

            var Oferta = await _repositorio.BuscarPorID(id);
            if (Oferta == null) {
                return NoContent();
            }
           
            await _repositorio.Excluir(Oferta);

            return Oferta;
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

            var UsuarioLogadoId = Convert.ToInt32((idClaim.Value));

            return UsuarioLogadoId;
                    
        }
        private Oferta VerificaAlteracaoOferta(Oferta oferta, AlterarOfertaViewModel OfertaView) {
                        
            if( OfertaView.Cidade!= oferta.Cidade && OfertaView.Cidade != null && OfertaView != null) {
                oferta.Cidade = OfertaView.Cidade;
            }

            if(Convert.ToDecimal(OfertaView.preco) != oferta.Preco && OfertaView.preco != 0 && OfertaView != null) {
                oferta.Preco = Convert.ToDecimal(OfertaView.preco);
            }

            if(Convert.ToDateTime(OfertaView.Validade).Date != oferta.Validade && OfertaView.Validade != null && OfertaView != null) {
                oferta.Validade = Convert.ToDateTime(OfertaView.Validade).Date;
            }

            if(OfertaView.Quantidade != oferta.Quantidade && OfertaView.Quantidade != 0 && OfertaView != null){
                oferta.Quantidade = OfertaView.Quantidade;
            }

            if(OfertaView.Regiao != oferta.Regiao && OfertaView.Regiao != null && OfertaView != null){
                oferta.Regiao = OfertaView.Regiao;
            }

            if(OfertaView.Descricao != oferta.Descricao && OfertaView.Descricao != null && OfertaView != null){
                oferta.Descricao=OfertaView.Descricao;
            }
            if(OfertaView.ProdutoId != oferta.ProdutoId && OfertaView.ProdutoId != 0 && OfertaView != null){
                oferta.ProdutoId=OfertaView.ProdutoId;
            }


            return oferta;
        }
    }
}