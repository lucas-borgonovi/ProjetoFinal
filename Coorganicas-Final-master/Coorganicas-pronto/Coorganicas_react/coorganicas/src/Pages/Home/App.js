import React from 'react';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBView, MDBContainer } from
  "mdbreact";


import img_home from '../../Assets/images/1.png'
import img_home2 from '../../Assets/images/2.png'
import img_home3 from '../../Assets/images/3.png'
// import img_home4 from '../../images/agri.png'
import img_home5 from '../../Assets/images/banner.jpg'
import img_home6 from '../../Assets/images/receita15.jpg'
import img_home7 from '../../Assets/images/receita16.jpg'
import img_home8 from '../../Assets/images/receita17.jpg'
import img_marmita from '../../Assets/images/marmita.jpg'
import img_marmita2 from '../../Assets/images/marmita2.jpg'
import img_coop from '../../Assets/images/coope.jpg'
import img_coop2 from '../../Assets/images/coope2.jpg'
import img_coop3 from '../../Assets/images/coope4.jpg'
import Header from '../../Componentes/Header/Header';
import Footer from '../../Componentes/Footer/Footer';


function App() {
  return (
    // <div className="fixed">
    <div>
      <Header />
      <div className="App">
        <div className="BannerEcard">
          <section id="banner">
            <div className="container_column">

              <div className="banner_options">
                <div className="banner1">
                  <div className="banner_title">O que é o projeto?</div>
                  <div className="banner_desc">
                    "Somos uma cooperativa sem fins lucrativos que promove
                    o acesso a produtos orgânicos e geração de renda por meio de maneira transparente e sustentável.
                    Conectando mulheres de baixa renda com produtores agrícolas orgânicos."
                    </div>
                  <div className="saiba_mais">
                    <a href="http://localhost:3000/quemsomos">Saiba Mais</a>
                  </div>

                </div>

              </div>
            </div>
          </section>
        </div>
        <main>
          <section className="procedencias">
            <div className="container_">
              <div className="procedenciasInt">
                <div className="icone">
                  <img src={img_home} alt="mão com terra" />
                </div>
                <h2 className="title_procedencia">Procedência</h2>
                <p>
                  Os nossos alimentos são produzidos livres de fertilizante e agrotóxicos por produtores que se
                  importam com a qualidade e com o impacto ambiental de suas plantações,
                  promovendo uma dieta saudável e equilibrada.
                    </p>
              </div>
              <div className="procedenciasInt">
                <div className="icone">
                  <img src={img_home2} alt="icone de felicidade" />
                </div>
                <h2 className="title_procedencia">Benefícios</h2>
                <p>
                  Os alimentos são mais saudáveis, pois são livres de agrotóxicos, hormônios e outros produtos
                  químicos.
                  São mais saborosos, sua produção respeita o meio ambiente, evitando a contaminação de solo, água
                  e vegetação.
                  A produção usa de sistemas de resposanbilidade social.
                    </p>
              </div>
              <div className="procedenciasInt">
                <div className="icone">
                  <img src={img_home3} alt="icone de interrogação" />
                </div>
                <h2 className="title_procedencia">Mitos</h2>
                <p>
                  Conforme dito anteriormente, os métodos de plantio naturais e livres de químicas sintéticas não
                  prejudicam o alimento e suas propriedades de qualquer forma.
                  Só por terem sido cultivados com exposições a eventuais pragas,
                  não significa de maneira alguma que você irá consumir alimentos podres ou estragados.
                    </p>
              </div>
            </div>
          </section>
          <section className="conteudo_principal">
            <div className="container_">
              <div className="widget">
                <div className="widget_title">
                  <div className="widget_title_text">Cooperativa</div>
                  <div className="widget_title_bar"></div>
                </div>

                <div className="sumir_aparecer">

                <article>
                            
                                
                                <div class="news_img">
                                    <img src={img_coop}
                                        alt="Imagem de uma mão pegando um fruto da terra"/>
                                </div>
                                <div class="news_title">
                                    Orgânicos
                                </div>
                                <div class="news_t">
                                    Procuramos trabalhar com fornecedores, grandes ou pequenos de produtos diversos e
                                    livre de agrotóxicos,
                                    para garantir uma grande e saudável disposição de produtos para nossa comunidade.
                                </div>
                            
                        </article>
                        <article>
                            
                                
                                <div class="news_img">
                                    <img src={img_marmita} alt="Imagem com três marmitas"/>
                                </div>
                                <div class="news_title">
                                    Marmitas
                                </div>
                                <div class="news_t">
                                    As marmitas são produzidas pelas mulheres da nossa comunidade,
                                    que encontram uma maneira fácil e ágil de se comunicar com os produtores e encontrar
                                    os produtos desejados para a geração de renda.
                                </div>
                            
                        </article>

                </div>

                <div className="widget_bodyflex">
                  <article>
                    <a href="">
                      {/* <!-- <div className="news_data">
                                    <div className="news_posted_at">12 DEC 12</div>
                                    <div className="news_comments">2</div>
                                </div> --> */}
                      <div className="TodosCarrousel">
                        <div className="news_thumbnail">
                          <MDBContainer className="Carrousel">
                            <MDBCarousel
                              activeItem={1}
                              length={3}
                              showControls={false}
                              showIndicators={false}
                              className="z-depth-1"
                              slide
                            >
                              <MDBCarouselInner >
                                <MDBCarouselItem itemId="1">
                                  <MDBView>
                                    <img
                                      className="d-block w-100"
                                      src={img_coop3}
                                      alt="First slide"
                                    />
                                  </MDBView>
                                </MDBCarouselItem>
                                <MDBCarouselItem itemId="2">
                                  <MDBView>
                                    <img
                                      className="d-block w-100"
                                      src={img_coop}
                                      alt="Second slide"
                                    />
                                  </MDBView>
                                </MDBCarouselItem>
                                <MDBCarouselItem itemId="3">
                                  <MDBView>
                                    <img
                                      className="d-block w-100"
                                      src={img_coop2}
                                      alt="Third slide"
                                    />
                                  </MDBView>
                                </MDBCarouselItem>
                              </MDBCarouselInner>
                            </MDBCarousel>
                          </MDBContainer>

                        </div>
                      </div>
                      <div className="news_title">
                        Orgânicos
                                </div>
                      <div className="news_resume">
                        Procuramos trabalhar com fornecedores, grandes ou pequenos de produtos diversos e
                        livre de agrotóxicos,
                        para garantir uma grande e saudável disposição de produtos para nossa comunidade.
                                </div>
                    </a>
                  </article>
                  <article>


                    <a href="">
                      {/* <!-- <div className="news_data">
                                    <div className="news_posted_at">12 DEC 12</div>
                                    <div className="news_comments">2</div>
                                </div> --> */}

                      <div className="TodosCarrousel">
                        <div className="news_thumbnail">
                          <MDBContainer className="Carrousel">
                            <MDBCarousel
                              activeItem={1}
                              length={3}
                              showControls={false}
                              showIndicators={false}
                              className="z-depth-1"
                              slide
                            >
                              <MDBCarouselInner>
                                <MDBCarouselItem itemId="1">
                                  <MDBView>
                                    <img
                                      className="d-block w-100"

                                      src={img_home5}
                                      alt="First slide"
                                    />
                                  </MDBView>
                                </MDBCarouselItem>
                                <MDBCarouselItem itemId="2">
                                  <MDBView>
                                    <img
                                      className="d-block w-100"
                                      src={img_marmita2}
                                      alt="Second slide"
                                    />
                                  </MDBView>
                                </MDBCarouselItem>
                                <MDBCarouselItem itemId="3">
                                  <MDBView>
                                    <img
                                      className="d-block w-100"
                                      src={img_marmita}
                                      alt="Third slide"
                                    />
                                  </MDBView>
                                </MDBCarouselItem>
                              </MDBCarouselInner>
                            </MDBCarousel>
                          </MDBContainer>
                        </div>
                      </div>
                      <div className="news_title">
                        Marmitas
                                </div>
                      <div className="news_resume">
                        As marmitas são produzidas pelas mulheres da nossa comunidade,
                        que encontram uma maneira fácil e ágil de se comunicar com os produtores e encontrar
                        os produtos desejados para a geração de renda.
                                </div>
                    </a>
                  </article>
                </div>
              </div>
            </div>
          </section>


        </main>



      </div>

      <div className="receita_home">
        <div className="postscontainer">
          <h1 className="tituloposts">Receitas</h1>
          <div className="flexposts">
            <div className="cardcestas posts">
              <a href="Omelete de Espinafre Queijo e Alho Poro" title="Omelete de Espinafre Queijo e Alho Poro"
                className="link block">
                <img src={img_home6} alt="Omelete de Espinafre Queijo e Alho Poro" className="imgcestas" />

                <h3 className="titulocestas">Omelete de Espinafre Queijo e Alho Poro</h3>

              </a>
            </div>

            <div className="cardcestas posts">
              <a href="Strogonoff de frango" title="Strogonoff de frango" className="link block">
                <img src={img_home7} alt="Strogonoff de frango" className="imgcestas" />
                <h3 className="titulocestas">Strogonoff de frango</h3>

              </a>
            </div>

            <div className="cardcestas posts">
              <a href="Sopa de Legumes com Pão Ralado e Salsa" title="Sopa de Legumes com Pão Ralado e Salsa"
                className="link block">
                <img src={img_home8} alt="Sopa de Legumes com Pão Ralado e Salsa" className="imgcestas" />

                <h3 className="titulocestas">Sopa de Legumes com Pão Ralado e Salsa</h3>

              </a>
            </div>

          </div>
          <a href="http://localhost:3000/receitas" className="btnmercado">Ver todas as receitas</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;