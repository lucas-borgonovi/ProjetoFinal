using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
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
    public class ProdutoController : ControllerBase
    {
       ProdutoRepository _repositorio = new ProdutoRepository();

        //GET: api/Produto
        /// <summary>
        ///   Lista todos os produtos cadastrados
        /// </summary>
        /// <returns>Retorna todos os produtos</returns>
        [HttpGet]
        public async Task<ActionResult<List<Produto>>> Get(){
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var produtos = await _repositorio.Listar();
            if(produtos == null) {
                return NotFound();
            }

            return produtos;
        }

        [HttpGet("paginacao/{skip}/{take}")]
        public async Task<ActionResult<List<Produto>>> Paginacao(int skip, int take){            
            var produtos = await _repositorio.Paginacao(skip, take);

            if(produtos == null) {
                return NotFound();
            }

            return produtos;
        }

        //GET: api/Produto/2
        /// <summary>
        ///   Procura produtos referente ao Id
        /// </summary>
        /// <param name="id">Id do Produto</param>
        /// <returns>Retorna a oferta referente ao Id passado</returns>
        [HttpGet ("{id}")]
        public async Task<ActionResult<Produto>> Get (int id) {
            //FindAsync = procurar algo especifico no banco
            //await espera acontecer 
            var Produto = await _repositorio.BuscarPorID (id);
            if (Produto == null) {
                return NotFound ();
            }

            return Produto;
        }

        //POST api/Produto
        /// <summary>
        ///    Cadastra um novo produto
        /// </summary>
        /// <param name="produto">Dados do produto</param>
        /// <returns>Retorna o produto cadastrado</returns>
        [Authorize(Roles = "Administrador")]
        [HttpPost]
        public async Task<ActionResult<Produto>> Post ([FromForm]Produto produto) {
            try {
                 if (Request.Form.Files.Count > 0) {
                    //var caminho = "C:\\Users\\fic\\Desktop\\Coorganicas_Backend\\assets";
                    var caminho = @"C:\Users\fic\Desktop\Coorganicas-Final-master\Coorganicas-pronto\Coorganicas_react\coorganicas\src\Assets";
                    var pasta = "produtos";

                    var file = Request.Form.Files[0];
                    var folderName = Path.Combine(caminho, "images", pasta);
                    // var pathToSave = Directory.Exists(folderName);
                    var fileName = ContentDispositionHeaderValue.Parse (file.ContentDisposition).FileName.Trim ('"');
                    var fullPath = Path.Combine (folderName, fileName);
                    // var dbPath = Path.Combine (folderName, fileName);
                    using (var stream = new FileStream (fullPath, FileMode.Create)) {
                        file.CopyTo (stream);
                    }                    

                    
                   produto.ImagemProduto = fileName;
                   produto.Nome = Request.Form["Nome"];

                } else {
                   return NotFound(
                    new
                    {
                        Mensagem = "Atenção a imagem não foi selecionada!",
                        Erro = true
                    });        
                }          

                await _repositorio.Salvar(produto);             

            } catch (DbUpdateConcurrencyException) {
                throw;
            }

            return produto;
        }

        /// <summary>
        ///   Altera algum produto cadastrado
        /// </summary>
        /// <param name="id">Id do produto</param>
        /// <param name="produto">Dados do produto a ser alterado</param>
        /// <returns>Retorna o Produto alterado</returns>
        [Authorize(Roles = "Administrador")]
        [HttpPut ("{id}")]
        public async Task<ActionResult> Put (int id,[FromForm]AlteraProdutoViewModel produto){

            //Se o Id do objeto não existir 
            //ele retorna o erro 400

            // if (id != produto.ProdutoId) {
            //     return BadRequest ();
            // }

            if(produto.Nome==null && produto.ImagemProduto==null){
                return NoContent();
            }

            var produtoid=await _repositorio.BuscarPorID(id);
            //Comparamos os atributos que foram modificados atraves do EF
            if (produtoid == null) {
                return NotFound(
                    new {
                        Mensagem = "Produto Não Encontrada",
                        Erro = true
                    }
                );
            }
            var ProdutoAlterado =VerificaAlteracaoProduto(produtoid,produto);
            try {

                // await _repositorio.Alterar(produto);
                 var ret = await _repositorio.Alterar(ProdutoAlterado);
                return Ok(
                    new{
                      Mensagem = "Produto alterado com sucesso",
                      Erro = false
                    }
                );

            } catch (DbUpdateConcurrencyException) {
                //Verificamos se o objeto realmente existe no banco
                var produto_valido = await _repositorio.BuscarPorID(id);
                if (produto_valido == null) {
                    return NotFound ();
                } else {
                    throw;
                }
            }
            // NoContent = retorna o erro 204, sem nada
            // return NoContent ();
        }

        //DELETE api/produto/id

        /// <summary>
        ///   Deleta um produto cadastrado
        /// </summary>
        /// <param name="id">Id do produto</param>
        /// <returns>retorna o produto cadastrado</returns>
        [Authorize(Roles = "Administrador")]
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Produto>> Delete (int id) {

            var produto = await _repositorio.BuscarPorID(id);
            if (produto == null) {
                return NotFound ();
            }
            await _repositorio.Excluir(produto);
            return produto;
        }

        private Produto VerificaAlteracaoProduto(Produto produto, AlteraProdutoViewModel produtoView) {
                        
            if(produto.Nome != produtoView.Nome && produtoView.Nome != null && produtoView != null) {
                produto.Nome = produtoView.Nome;
            }

            if(Request.Form.Files.Count > 0) {
                    
                    var caminho = @"C:\Users\fic\Desktop\Coorganicas-Final-master\Coorganicas-pronto\Coorganicas_react\coorganicas\src\Assets";
                    var pasta = "produtos";
                    var file = Request.Form.Files[0];
                    var folderName = Path.Combine(caminho, "images", pasta);
                    // var pathToSave = Directory.Exists(folderName);
                    var fileName = ContentDispositionHeaderValue.Parse (file.ContentDisposition).FileName.Trim ('"');
                    var fullPath = Path.Combine (folderName, fileName);
                    // var dbPath = Path.Combine (folderName, fileName);

                    using (var stream = new FileStream (fullPath, FileMode.Create)) {
                        file.CopyTo (stream);
                    } 

                produto.ImagemProduto = fileName;
            }

            return produto;
        }
    }
}