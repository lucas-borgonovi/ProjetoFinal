using System.Runtime.Intrinsics.X86;
using System.Collections.Specialized;
using System.Text;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Backend.Domains;
using Backend.Repositories;
using Backend.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{   
    [Route("api/[controller]")]
    [ApiController]
    public class FiltroController : ControllerBase
    {
       //CoorganicasContext _contexto = new CoorganicasContext();  
       //Fazer algumas alterações
       // Quando retornar os registro do banco não esquecer de por tolower case para comparar 
       // item.Quantidade > 0 && item.Validade.Date >= data.Date não esquecer de acerta a validade dos produtos
       // Testar se ficaria viavel que ao usuario filtrar os produtos ele abrir o modal com as ofertas q foi filtrada
       FiltroRepository _repositorio = new FiltroRepository();

       /// <summary>
       ///  Lista todas as ofertas existentes
       /// </summary>
       /// <param name="oferta">Dados da oferta a ser filtrada</param>
       /// <returns>Retorna as ofertaa filtradas</returns>    
       [HttpPost]
       public async Task<ActionResult<List<Oferta>>> Post([FromBody]FiltroViewModel oferta){
            var Cidade = oferta.Cidade != null && oferta.Cidade != "" ? oferta.Cidade : null;
            var Regiao = oferta.Regiao != null && oferta.Regiao != "" ? oferta.Regiao : null;
            var Validade = oferta.Validade != null && oferta.Validade != "" ? oferta.Validade : null;
            var Produto = oferta.Produto != null && oferta.Produto != "" ? oferta.Produto : null;
            
            DateTime DataAtual = DateTime.Now.AddDays(Convert.ToInt32(Validade));                      

            //var prod = await _contexto.Produto.Where(x => x.Nome.StartsWith(oferta.Produto)).ToListAsync();

            if(Produto == null) {

                if(Cidade != null && Regiao != null && Validade == null) {                
                    return await CidadeRegiao(oferta);
                }
                else if(Cidade != null && Validade == null && Regiao == null) {
                    return await RetornaCidade(oferta);
                }
                else if (Regiao != null && Cidade == null && Validade == null) {
                    return await RetornaRegiao(oferta);
                }
                else if (Validade != null && Cidade == null && Regiao == null) {
                    return await RetornaValidade(oferta, DataAtual);
                }
                else if (Cidade != null && Regiao != null && Validade != null) {
                    return await FiltrarCidadeRegiaoValidade(oferta, DataAtual);
                }   
                else if(Cidade != null && Regiao == null && Validade != null) {
                    return await CidadeValidade(oferta, DataAtual);
                }
                else if(Cidade == null && Regiao != null && Validade != null) {
                    return await RegiaoValidade(oferta, DataAtual);
                }
                else {
                    return NotFound(
                        new
                        {
                            Mensagem = "Produto não encontrado",
                            Erro = true
                        });     
                }       

            } else {

                if(Cidade != null && Regiao != null && Validade != null && Produto != null) {
                    return await FiltrarTodos(oferta, DataAtual);
                }
                else if(Cidade != null && Regiao == null && Validade == null && Produto != null){
                    return await FiltrarProdutoCidade(oferta);
                }
                else if(Cidade == null && Regiao != null && Validade == null && Produto != null){
                    return await FiltrarProdutoRegiao(oferta);
                }
                else if(Cidade != null && Regiao != null && Validade == null && Produto != null){
                    return await FiltrarProdutoCidadeRegiao(oferta);
                }   
                else if(Cidade == null && Regiao == null && Validade != null && Produto != null) {
                    return await FiltrarProdutoValidade(oferta,DataAtual); 
                }
                else if(Produto != null && Cidade == null && Regiao == null && Validade == null){
                    var retorno = await _repositorio.BuscarPorNome(oferta.Produto);

                    if(retorno.Count != 0) {
                        return retorno;
                    } else {
                        return Accepted(new {
                            Mensagem = "Produto não encontrado.",
                            Erro = true
                        });
                    }
                }        
                else {
                     return NotFound(
                        new
                        {
                            Mensagem = "Produto não encontrado",
                            Erro = true
                        });   
                }

            }



       }
       private async Task<ActionResult<List<Oferta>>> FiltrarProdutoRegiao(FiltroViewModel oferta){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.BuscarPorNome(oferta.Produto);           
            
            foreach(var item in ofertas) {

                if(item.Quantidade > 0 && item.Regiao.ToLower() == oferta.Regiao.ToLower() ) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                    return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

          

            return produtos;
        }
       private async Task<ActionResult<List<Oferta>>> FiltrarProdutoValidade(FiltroViewModel oferta, DateTime data){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.BuscarPorNome(oferta.Produto);           
            
            foreach(var item in ofertas) {
                if(item.Quantidade > 0 && item.Validade.Date >= data.Date) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                    return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

          

            return produtos;
        }
       private async Task<ActionResult<List<Oferta>>> FiltrarProdutoCidadeRegiao(FiltroViewModel oferta){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.BuscarPorNome(oferta.Produto);           
            
            foreach(var item in ofertas) {

                if(item.Cidade.ToLower() == oferta.Cidade.ToLower() && item.Quantidade > 0 && item.Regiao.ToLower() == oferta.Regiao.ToLower() ) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                    return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

          

            return produtos;
        }

         private async Task<ActionResult<List<Oferta>>> FiltrarProdutoCidade(FiltroViewModel oferta){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.BuscarPorNome(oferta.Produto);           
            
            foreach(var item in ofertas) {

                if(item.Cidade.ToLower() == oferta.Cidade.ToLower() && item.Quantidade > 0) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                    return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

          

            return produtos;
        }
        private async Task<ActionResult<List<Oferta>>> FiltrarTodos(FiltroViewModel oferta, DateTime data){
            List<Oferta> produtos = new List<Oferta>();
            
            var ofertas = await _repositorio.BuscarPorNome(oferta.Produto);           
            
            foreach(var item in ofertas) {
                if(item.Cidade.ToLower() == oferta.Cidade.ToLower() && item.Regiao.ToLower() == oferta.Regiao.ToLower() && item.Quantidade > 0 && item.Validade.Date >= data.Date) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                    return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

          

            return produtos;
        }
        private async Task<ActionResult<List<Oferta>>> FiltrarCidadeRegiaoValidade(FiltroViewModel oferta, DateTime data){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.Listar();
           

            foreach(var item in ofertas) {
                if(item.Cidade.ToLower() == oferta.Cidade.ToLower() && item.Regiao.ToLower() == oferta.Regiao.ToLower() && item.Quantidade > 0 && item.Validade.Date >= data.Date) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                    return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

            return produtos;
        }
       private async Task<ActionResult<List<Oferta>>> CidadeRegiao(FiltroViewModel oferta){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.Listar();

            foreach(var item in ofertas) {
                
                if(item.Cidade.ToLower() == oferta.Cidade.ToLower() && item.Regiao.ToLower() == oferta.Regiao.ToLower() && item.Quantidade > 0) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                 return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

            return produtos;
       }

        private async Task<ActionResult<List<Oferta>>> RegiaoValidade(FiltroViewModel oferta, DateTime data){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.Listar();

            foreach(var item in ofertas) {
                
                if(item.Regiao.ToLower() == oferta.Regiao.ToLower() && item.Quantidade > 0 && item.Validade.Date >= data.Date) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                 return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

            return produtos;
       }
    
         private async Task<ActionResult<List<Oferta>>> CidadeValidade(FiltroViewModel oferta, DateTime data){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.Listar();

            foreach(var item in ofertas) {
                
                if(item.Cidade.ToLower() == oferta.Cidade.ToLower() && item.Quantidade > 0 && item.Validade.Date >= data.Date) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                 return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

            return produtos;
       }

       private async Task<ActionResult<List<Oferta>>> RetornaCidade(FiltroViewModel oferta){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.Listar();

            foreach(var item in ofertas) {
                
                if(item.Cidade.ToLower() == oferta.Cidade.ToLower() && item.Quantidade > 0) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                 return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

            return produtos;
       }

        private async Task<ActionResult<List<Oferta>>> RetornaRegiao(FiltroViewModel oferta){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.Listar();

            foreach(var item in ofertas) {
                
                if(item.Regiao.ToLower() == oferta.Regiao.ToLower() && item.Quantidade > 0) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                 return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

            return produtos;
       }

       private async Task<ActionResult<List<Oferta>>> RetornaValidade(FiltroViewModel oferta, DateTime data){
            List<Oferta> produtos = new List<Oferta>();

            var ofertas = await _repositorio.Listar();

            foreach(var item in ofertas) {
                
                if(item.Quantidade > 0 && item.Validade.Date >= data.Date) {
                    produtos.Add(item);
                }
            }

            if(ofertas == null || produtos.Count == 0) {
                 return NotFound(
                    new
                    {
                        Mensagem = "Produto não encontrado",
                        Erro = true
                    });     
            }

            return produtos;
       }

    }
}