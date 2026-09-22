/**
 * Gestor del cargador de entrada y la secuencia de inicio de la página.
 */
export class Loader {
  /**
   * Inicializa la instancia del cargador de la interfaz.
   * @param {Function} onCompleteCallback - Función a ejecutar al finalizar la animación de carga.
   */
  constructor(onCompleteCallback) {
    this.loader = document.getElementById('loader');
    this.mark = document.querySelector('.loader-mark');
    this.lineSpan = document.querySelector('.loader-line span');
    this.onCompleteCallback = onCompleteCallback;

    this.runLoaderSequence();
  }

  /**
   * Ejecuta la secuencia de animación del cargador mediante GSAP.
   */
  runLoaderSequence() {
    if (!this.loader) {
      if (this.onCompleteCallback) this.onCompleteCallback();
      return;
    }

    const animation = window.gsap;
    if (!animation || !this.mark || !this.lineSpan) {
      this.loader.classList.add('hide');
      if (this.onCompleteCallback) this.onCompleteCallback();
      return;
    }

    const tl = animation.timeline({
      onComplete: () => {
        animation.set(this.loader, { display: 'none' });
        if (this.onCompleteCallback) this.onCompleteCallback();
      }
    });

    tl.fromTo(
      this.mark,
      { autoAlpha: 0, scale: 0.8, y: 20 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
      .fromTo(
        this.lineSpan,
        { width: '0%' },
        { width: '100%', duration: 0.8, ease: 'power2.inOut' },
        '-=0.2'
      )
      .to(this.mark, { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '+=0.2')
      .to(
        this.loader,
        {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut'
        },
        '-=0.1'
      );
  }
}
