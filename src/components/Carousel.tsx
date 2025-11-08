export default function Carousel(){
  return (
    <div id="hero" className="carousel slide mb-4" data-bs-ride="carousel">
      <div className="carousel-inner rounded-3 overflow-hidden">
        <div className="carousel-item active">
          <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop" className="d-block w-100" alt="Gaming setup"/>
          <div className="carousel-caption d-none d-md-block">
            <h5>Consolas de última generación</h5>
            <p>Potencia y rendimiento para tu experiencia gamer.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="https://images.unsplash.com/photo-1605901309584-818e25960a8b?q=80&w=1600&auto=format&fit=crop" className="d-block w-100" alt="Periféricos"/>
          <div className="carousel-caption d-none d-md-block">
            <h5>Periféricos de alto desempeño</h5>
            <p>Teclados, mouse y más con precisión y estilo.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="https://images.unsplash.com/photo-1606813907291-76a360ef9d14?q=80&w=1600&auto=format&fit=crop" className="d-block w-100" alt="PS5"/>
          <div className="carousel-caption d-none d-md-block">
            <h5>Juegos imperdibles</h5>
            <p>Lleva tus aventuras al siguiente nivel.</p>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#hero" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#hero" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
