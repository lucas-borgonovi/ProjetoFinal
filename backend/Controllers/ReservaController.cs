using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Domains;
using Backend.Utils;
using Backend.ViewModels;
using BackEnd.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrador, Comunidade")]
    public class ReservaController : ControllerBase 
    {
         ReservaRepository _repositorio = new ReservaRepository();

        //GET: api/Reserva
        
        /// <summary>
        ///   Lista todas as reservas
        /// </summary>
        /// <returns>Retorna as reservas cadastradas</returns>
        [HttpGet]
        public async Task<ActionResult<List<Reserva>>> Get(){
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
        var reservas = await _repositorio.Listar();
            if(reservas == null) {
                return NotFound();
            }

            return reservas;
        }
        //GET: api/Reserva/2
        /// <summary>
        ///     Procura Reserva referente ao Id
        /// </summary>
        /// <param name="id">Id da receita</param>
        /// <returns>Retorna a reserva referente ao Id passado</returns>
        [HttpGet ("{id}")]
        public async Task<ActionResult<Reserva>> Get (int id) {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var reserva = await _repositorio.BuscarPorID(id);
            if (reserva == null) {
                return NotFound ();
            }

            return reserva;
        }
        /// <summary>
        ///   Lista as ofertas cadastradas ao usuário logado
        /// </summary>
        /// <returns>Retorna as ofertas do usúario logado</returns>
        [HttpGet("minhasReservas")]
        public async Task<ActionResult<List<Reserva>>> GetOfertasUsuario () {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
           
            var Id = PegarUsuarioLogadoId();

            var reserva = await _repositorio.BuscarPorIDLogado(Id);
            
            if (reserva == null) {
                return NotFound ();
            }

            return reserva;
        }

        //POST api/Reserva 
        /// <summary>
        ///   Cadastra uma reserva
        /// </summary>
        /// <param name="reserva">Dados da reserva a ser cadastrada</param>
        /// <returns>Retorna reserva cadastrada</returns>
        [HttpPost]
        public async Task<ActionResult<Reserva>> Post ([FromBody]CadastrarReservaViewModel reserva) {
            try {

                OfertaRepository _oferta = new OfertaRepository();
                var QtdOferta = await _oferta.BuscarPorID(reserva.OfertaId);
                
                if(QtdOferta.Quantidade < reserva.Quantidade) {
                    return Accepted(new {
                        Mensagem = "Quantidade desejada maior que a ofertada",
                        Erro = true
                    });
                }

                Reserva NovoReserva = new Reserva();
                NovoReserva.DataReserva = DateTime.Now.Date;
                NovoReserva.DataEspera = NovoReserva.DataReserva.AddDays(5);
                NovoReserva.StatusReserva = "Aguardando";
                NovoReserva.UsuarioId = PegarUsuarioLogadoId(); // Quanto fizer a pagina de login volta a função
                NovoReserva.OfertaId = reserva.OfertaId;
                NovoReserva.Quantidade = reserva.Quantidade;               
               
                var RetornoReserva = await _repositorio.Salvar(NovoReserva);

                if(RetornoReserva != null) {
                    QtdOferta.Quantidade = QtdOferta.Quantidade - reserva.Quantidade;
                    var RetornorOferta = await _oferta.Alterar(QtdOferta); 

                    if(RetornorOferta != null) {
                        return Ok(new {
                            Mensagem = "Reserva Cadastrada Com Sucesso",
                            Erro = false
                        });
                    }
                                        
                }

                return NotFound(new {
                    Mensagem = "Não Foi Possível Fazer a Reserva",
                    Erro = true
                });

                 
            } catch (DbUpdateConcurrencyException) {
                throw;
            }

          
        }

        /// <summary>
        ///     Altera reserva cadastrada
        /// </summary>
        /// <param name="id">Id da reserva</param>
        /// <param name="reserva">Dados da reserva a ser alterada</param>
        /// <returns>Retorna reserva alterada</returns>
        [HttpPut ("{id}")]
        public async Task<ActionResult> Put (int id,[FromBody] AlterarReservaViewModel reserva) {
            
            ReservaRepository _reserva = new ReservaRepository();
            var ReservaUsuario = await _reserva.BuscarPorID(id);

            if(ReservaUsuario == null) {
                return NotFound(new {
                    Mensagem = "Reserva não encontrada",
                    Erro = true
                });
            }

            OfertaRepository _oferta = new OfertaRepository();
            var QtdOferta = await _oferta.BuscarPorID(ReservaUsuario.OfertaId.Value);
            
            
            if(QtdOferta != null) {
                QtdOferta.Quantidade = QtdOferta.Quantidade + ReservaUsuario.Quantidade;
                var RetornorOferta = await _oferta.Alterar(QtdOferta);                
            } 

            
            if(QtdOferta.Quantidade < reserva.Quantidade) {
                return NotFound(new {
                    Mensagem = "Atenção! Quantidade desejada maior que a ofertada",
                    Erro = true
                });
            }

            var ReservaAlterada = VerificaAlteracaoReserva(ReservaUsuario, reserva);

            QtdOferta.Quantidade = QtdOferta.Quantidade - ReservaAlterada.Quantidade;

            try {
                await _repositorio.Alterar(ReservaAlterada);
                await _oferta.Alterar(QtdOferta);

                return Ok(new {
                        Mensagem = "Reserva Alterada Com Sucesso",
                        Erro = false
                }); 
            } catch (DbUpdateConcurrencyException) {
                //Verificamos se o objeto realmente existe no banco
                var reserva_valido = await _repositorio.BuscarPorID(id);
                if (reserva_valido == null) {
                    return NotFound ();
                } else {
                    throw;
                }
            }           
        }

        //DELETE api/reserva/id
        /// <summary>
        ///     Deleta reserva cadastrada
        /// </summary>
        /// <param name="id">Id da reserva</param>
        /// <returns>Retorna reserva deletada</returns>
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Reserva>> Delete (int id) {

            var reserva = await _repositorio.BuscarPorID (id);
            
            if (reserva == null) {
                return NotFound ();
            }
            
            OfertaRepository _oferta = new OfertaRepository();
            var oferta = await _oferta.BuscarPorID(reserva.OfertaId.Value);

            if(oferta.Validade.Date > DateTime.Now.Date) {
                oferta.Quantidade = oferta.Quantidade + reserva.Quantidade;
                await _oferta.Alterar(oferta);
            }
            

            await _repositorio.Excluir(reserva);

            return reserva;
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

        private Reserva VerificaAlteracaoReserva(Reserva reserva, AlterarReservaViewModel reservaView) {
            
            if(reserva.Quantidade != reservaView.Quantidade) {
                reserva.Quantidade = reservaView.Quantidade;
            }
            
            return reserva;
        }

    }
}