import React, { Component } from 'react';
import ReactCardCarousel from 'react-card-carousel';

class MyCarousel extends Component {

  static get CARD_STYLE() {
    return {
      // height: '267px',
      // width: '477px',
     
      textAlign: 'center',
      background: 'white',
        
      fontSize: '12px',
      borderRadius: '10px',
      paddingbottom: '500px',
      // maxHeight: '267px',
      // maxWidth: "477px",
     
      padding: "10px"
      
    };
    
  }
  // static get CARD_STYLE2() {
  //   return {
  //   //  padding:'10px'
  //   };
    
  // }

  render() {
    return (
      <ReactCardCarousel ClassName="tudocarrouseltudo"autoplay={ false} Onclick={ 0 }>
        
        <div  style={ MyCarousel.CARD_STYLE }>
          <h5>Comunidade</h5>
          <p className="textoresponsa"> 
                  Com a coorgnicas eu tive uma visão diferente do mundo.
          </p>
          <div className="amanda">
              - Renata Pires.
          </div>
        </div>


        <div style={ MyCarousel.CARD_STYLE }>
          <h5>Comunidade</h5>
          <p className="textoresponsa">
              Com a coorgnicas eu tenho uma alimentação melhor.
          </p>
          <div className="amanda">
              - Isabela Santos.
          </div>
        </div>
   
        <div style={ MyCarousel.CARD_STYLE }>
          <h5>Comunidade</h5>
          <p className="textoresponsa">
              Com a coorgnicas eu melhorei minha vida financeira.
          </p>
          <div className="amanda">
              - Carla De Jesus.
          </div>
        </div>
      </ReactCardCarousel>
    );
  }
}

export default MyCarousel;
