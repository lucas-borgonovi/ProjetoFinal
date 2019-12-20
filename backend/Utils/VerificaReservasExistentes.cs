using System;
using Backend.Domains;
using BackEnd.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Backend.Utils
{
    public class VerificaReservasExistentes
    {   
        /// <summary>
        ///     Rotina para excluir reservas expiradas e ofertas vencidas
        /// </summary>
        /// <returns></returns>
        public static async void RotinaReservaExistente()
        {
            using(CoorganicasContext _contexto = new CoorganicasContext()){

                OfertaRepository _oferta = new OfertaRepository(); 
                ReservaRepository _reserva = new ReservaRepository();   

                var Reservas = await _contexto.Reserva.Include("Oferta").ToListAsync();

                var Ofertas =  await _contexto.Oferta.ToListAsync();

                if(Ofertas != null) {
                    foreach(var reserva in Reservas) {
                        
                        if(reserva.DataEspera <= DateTime.Now.Date) {
                            var qtd = reserva.Quantidade;   

                            foreach(var oferta in Ofertas) {
                                
                                if(oferta.OfertaId == reserva.Oferta.OfertaId) {
                                    oferta.Quantidade = oferta.Quantidade + qtd;
                                    await _oferta.Alterar(oferta);
                                    await _reserva.Excluir(reserva);

                                    if(oferta.Validade.Date <= DateTime.Now.Date) {
                                        await _oferta.Excluir(oferta);
                                    }                                 
                                }
                            }
                        }                        
                    
                    }

                    RotinaOfertaExpirada();
                }

             }
            
        }
        private static async void RotinaOfertaExpirada()
        {
            using(CoorganicasContext _contexto = new CoorganicasContext()){

                OfertaRepository _oferta = new OfertaRepository();

                var Ofertas =  await _oferta.Listar();

                foreach(var oferta in Ofertas) {
                    
                    if(oferta.Validade.Date <= DateTime.Now.Date) {
                       var Ret = await _oferta.Excluir(oferta);                        
                    }
                   
                }
            }
            
        }
    }
}