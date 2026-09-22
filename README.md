# Javier Dibujos — Web

Landing page responsive inspirada en la referencia entregada.

## Archivos
- index.html — estructura y contenido
- styles.css — diseño responsive + animaciones
- script.js — menú móvil accesible, reveal, parallax, cursor, magnetic buttons, tilt, navegación activa, carrusel horizontal, galería ampliable y formulario conectado
- assets HD/ — imágenes HD de retratos, tatuajes y proceso

## Uso
Abre `index.html` en cualquier navegador moderno.

## Producción
Puedes reemplazar las imágenes de `assets HD/` por archivos originales manteniendo sus nombres y rutas.

El formulario está conectado a Formspree mediante el endpoint configurado en `index.html`. Si cambias de cuenta o servicio, sustituye el atributo `action` del formulario por el endpoint correspondiente.


## Versión Three.js / WebGL

La versión actual incorpora:
- Fondo de estudio premium con degradados oscuros, focos suaves y grano cinematográfico.
- Animación CSS de iluminación ambiental de bajo consumo.
- `prefers-reduced-motion` para reducir animaciones en usuarios que lo soliciten.
- Fallback seguro cuando GSAP o Three.js no están disponibles.
- Galería con `<dialog>` nativo para ampliar las obras sin instalar otra librería.
- Pausa de la escena WebGL cuando la pestaña no está visible para ahorrar recursos.
- Hero editorial con marco visual, tarjeta de información y brillo interactivo siguiendo el cursor.
- La escena WebGL experimental y el fondo de tinta se mantienen en el código como referencia, pero no se cargan en la experiencia actual para priorizar un fondo más limpio y ligero.
- La sección `OBRAS DESTACADAS` funciona como carrusel horizontal con rueda, arrastre de mouse, gesto táctil y teclado. Usa un desplazamiento continuo sin ajuste automático de tarjetas y una inercia breve para la rueda. Durante el movimiento aplica una difusión visual suave que desaparece al detenerse. Las obras nuevas se añaden como tarjetas dentro de `.works-grid`.

## Configuración antes de publicar

- Reemplaza los enlaces genéricos de Instagram, TikTok, YouTube y WhatsApp en `index.html` por los perfiles reales.
- El formulario valida los datos básicos del navegador y envía las consultas a Formspree. Comprueba en el panel de Formspree que el correo de destino y la activación del formulario sean correctos antes de publicar.
- Para usar la galería, cada obra debe conservar su enlace a la imagen y sus atributos `data-lightbox-title` y `data-lightbox-price`.
