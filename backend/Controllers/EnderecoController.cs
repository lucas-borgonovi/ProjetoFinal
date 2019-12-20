using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domains;
using Backend.Repositories;
using BackEnd.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class EnderecoController : ControllerBase 
    {
       EnderecoRepository _repositorio = new EnderecoRepository();

        //GET: api/Endereco 
        /// <summary>
        ///   Lista todos os endereços
        /// </summary>
        /// <returns>Todos os endereços cadastrados</returns>
        [HttpGet]
        public async Task<ActionResult<List<Endereco>>> Get() {

           var Enderecos = await _repositorio.Listar();
            if (Enderecos == null) {
                return NotFound();
            }

            return Enderecos;
        }

        //GET: api/Endereco2
        /// <summary>
        ///   Lista o endereço pelo Id
        /// </summary>
        /// <param name="id">Id do endereço</param>
        /// <returns>Retorna o endereço referente ao Id passado </returns>
        [HttpGet ("{id}")]
        public async Task<ActionResult<Endereco>> Get (int id) {
            
            var Endereco = await _repositorio.BuscaEndereco(id);
            if (Endereco == null) {
                return NotFound ();
            }

            return Endereco;
        }

        //POST api/Endereco
        /// <summary>
        ///   Cadastra o endereço
        /// </summary>
        /// <param name="Endereco">Dados do endereço</param>
        /// <returns>Retorna o endereço cadastrado</returns>
        [HttpPost]
        public async Task<ActionResult<Endereco>> Post (Endereco Endereco) {
            try {
               
                await _repositorio.Gravar(Endereco);
                

            } catch (DbUpdateConcurrencyException) {
                throw;
            }
            return Endereco;
        }

        /// <summary>
        ///   Altera o endereço pelo Id passado
        /// </summary>
        /// <param name="id">Id do Endereço</param>
        /// <param name="endereco">Dado do endereço a ser alterado</param>
        /// <returns></returns>
        [HttpPut ("{id}")]
        public async Task<ActionResult> Put (int id, Endereco endereco) {

            if (id != endereco.EnderecoId) {
                return BadRequest ();
            }

            try {
                await _repositorio.Alterar(endereco);
            } catch (DbUpdateConcurrencyException) {

                var Endereco_valido = await _repositorio.BuscaEndereco(id);
                if (Endereco_valido == null) {
                    return NotFound ();
                } else {
                    throw;
                }

            }
            
            return NoContent ();
        }

        //DELETE api/Endereco/id
        /// <summary>
        ///   Deleta endereço cadastrado
        /// </summary>
        /// <param name="id">Id do endereço</param>
        /// <returns>Retorna o endereço deletado</returns>
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Endereco>> Delete (int id) {

            var endereco = await _repositorio.BuscaEndereco (id);
            if (endereco == null) {
                return NotFound ();
            }
            await _repositorio.Excluir (endereco);

            return endereco;
        }
    }
}