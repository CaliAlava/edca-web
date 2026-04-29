# Contexto del Proyecto: EDCA Web

Este archivo sirve como sistema de memoria y referencia técnica para el proyecto web "EDCA". Debe mantenerse actualizado durante cualquier sesión de desarrollo o intervención de agentes de Inteligencia Artificial para evitar la necesidad de reanalizar el repositorio.

## 1. Visión General
- **Tipo de Proyecto:** Landing page estática orientada a la marca.
- **Estética:** *Skate-zine*, estilo editorial, alto contraste, tipografías de tipo bold/display, efecto visual de "grano de película" y comportamiento dinámico mediante animaciones y scroll.
- **Estado Actual:** Listo para producción y despliegue (ej. Netlify). Los estilos y lógica JS están modularizados en carpetas respectivas.

## 2. Arquitectura de Archivos y Código
- `index.html`: Archivo principal.
  - Estructurado en secciones lógicas: `#hero`, `#marquee`, `#categorias`, `#drops`, `#about`, `#skate`, `#visita`.
  - Todas las imágenes están extraídas en la carpeta `images/` y se cargan usando `loading="lazy"` para optimizar el rendimiento.
- `css/style.css`: Estilos Vanilla CSS.
  - **Variables CSS:** Utilizadas extensamente en `:root` (ej. `--bg`, `--ink`, `--accent`) para el tema global, facilitando el cambio rápido de colores y fuentes.
  - **Animaciones:** Define `@keyframes` para la animación de marquesinas (marquee).
  - Enfoque *Mobile-First*.
- `js/main.js`: Lógica de interactividad Vanilla JS.
  - **IntersectionObserver API:** Controla las animaciones de entrada (`.reveal` -> `.active`) al scrollear.
  - **Scroll Parallax:** Efecto de perspectiva en la imagen del `#hero`.
  - **Mapa de Tiendas:** Lógica para vincular pines de mapa (`.city-pin`) con el contenido de las tiendas (`.city-col`) vía `activateCity()`.
  - Funcionalidad de Smooth Scrolling y Toggle para el menú móvil.
- `images/`: Carpeta que contiene todos los activos de imagen optimizados.

## 3. Guía Rápida para Cambios Frecuentes
- **Cambiar la paleta de colores o fuentes:** Editar el bloque `:root` en las primeras líneas de `css/style.css`.
- **Modificar o agregar un producto (Drop):** Buscar el contenedor `<div class="drops-grid">` en `index.html` y duplicar/modificar un elemento `<article class="drop">`.
- **Añadir/Editar Tiendas en el Mapa:** Modificar las etiquetas `<div class="city-pin">` indicando su posición (`top`, `left`) e integrarlas secuencialmente en el contenedor `<div class="cities-grid">` asociándolas con la misma función JS `activateCity(index)`.

## 4. Entorno de Desarrollo Local
Para previsualizar y ejecutar este proyecto localmente, al ser un sitio web completamente estático, se utiliza un servidor HTTP de Python en el puerto 8000.

## 5. Registro de Sesión (Changelog de la IA)
*Las actualizaciones técnicas realizadas en la sesión actual deben quedar documentadas aquí.*

- **[2026-04-29]**: 
  - Auditoría técnica completa del repositorio.
  - Generación de `CONTEXT.md` (este archivo) para mantener la comprensión estructurada del estado y directrices del proyecto.
  - Ajuste de los filtros CSS (`contrast` y `grayscale`) en `.ecuador-map` (`css/style.css`) para eliminar el fondo cuadriculado gris residual de la imagen original.
  - Corrección final del fondo negro de la imagen `.ecuador-map` mediante un script de Python usando Pillow para hacer el fondo auténticamente transparente y reemplazar la imagen por `images/ecuador_map_fixed.png`. Actualización del HTML y eliminación de `mix-blend-mode` en CSS.
  - Aumento del grosor de las líneas y letras del mapa mediante dilatación de imagen con un filtro MaxFilter en Python para mejorar su visibilidad sobre el fondo.
  - Implementación de nueva textura de fondo y paleta de colores. Se generó mediante IA una textura basada en brochazos de color carmesí/rojo oscuro (referencia Black Friday), que se guardó en `images/bg_texture.png`. Además, se actualizaron las variables CSS (rojos más profundos y textos en blanco puro `#ffffff`).
  - Refinamiento de la textura para lograr un estilo *streetwear* más sutil: Se movió la textura a un pseudo-elemento `body::after` con opacidad reducida (`0.15`) y `mix-blend-mode: multiply`, permitiendo que el color base predomine mientras la textura actúa como un ruido suave de fondo.
  - **Optimización para Producción**: 
    - Extracción de todas las imágenes Base64 de `index.html` hacia archivos individuales en la carpeta `images/` para reducir peso, mejorar cacheo y tiempos de carga.
    - Implementación de carga diferida (`loading="lazy"`) en imágenes secundarias.
    - Revisión y limpieza exhaustiva del código fuente. Se añadieron comentarios detallados en HTML, CSS y JS explicando las decisiones técnicas clave (como el uso de `IntersectionObserver` y pseudo-elementos).
