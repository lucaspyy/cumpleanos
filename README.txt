# 🎂 Para vos — Página interactiva de cumpleaños

Esta carpeta contiene una página web completa. No necesitás cambiar el código para poner tus fotos y video.

## 1. Fotos

Entrá a la carpeta `images` y reemplazá/añadí archivos usando EXACTAMENTE estos nombres:

- hero.jpg → foto principal de la portada
- age14.jpg → foto de ella a los 14
- age15.jpg → foto de ella a los 15
- age16.jpg → foto de ella a los 16
- age17.jpg → foto de ella a los 17
- age18.jpg → foto actual
- together-01.jpg → foto de ustedes para el capítulo de conexión
- together-02.jpg → otra foto de ustedes
- together-03.jpg → foto de ustedes para Partners in Crime
- playlist-cover.jpg → portada que querás usar para el playlist
- memory-01.jpg → dinosaurios
- memory-02.jpg → brunch/desayuno
- memory-03.jpg → sopa azteca
- memory-04.jpg → Zoé/León Larregui/música
- memory-05.jpg → BMW
- memory-06.jpg → comida/orden de ella

Podés usar JPG, PNG o WEBP, pero si cambiás la extensión/nombre tenés que cambiar también el nombre dentro de `index.html`.

## 2. Video

Poné tu video final en:

`video/video-final.mp4`

No cambiés ese nombre si querés que funcione automáticamente.

## 3. Playlist

Abrí `index.html` con Bloc de notas/VS Code y buscá:

`https://open.spotify.com/`

Reemplazalo por el link real de tu playlist.

## 4. Probarlo

La forma más fácil:

- Abrí `index.html` haciendo doble clic.
- La página debería abrir en el navegador.
- Probá botones, fotos y video.

Si el navegador bloquea alguna cosa al abrirlo directamente, usá VS Code + Live Server.

## 5. Publicarlo gratis

La opción recomendada es GitHub Pages.

1. Creá una cuenta en GitHub.
2. Creá un repositorio nuevo, por ejemplo `cumpleanos`.
3. Subí TODO el contenido de esta carpeta, respetando las carpetas `images` y `video`.
4. En el repositorio: Settings → Pages.
5. En "Build and deployment", seleccioná "Deploy from a branch".
6. Elegí `main` y carpeta `/root`.
7. Guardá.
8. GitHub te dará un enlace parecido a:
   `https://TUUSUARIO.github.io/cumpleanos/`

Ese es el enlace que después convertís en QR.

## 6. QR

Cuando tengas el enlace final, generá un QR con cualquier generador de QR confiable y probalo desde otro teléfono antes de entregárselo.

## Importante

No movás `style.css`, `script.js`, `images` ni `video` fuera de la carpeta principal.

La estructura debe quedar:

cumple_interactivo/
├── index.html
├── style.css
├── script.js
├── images/
└── video/

## Personalización rápida

Si querés cambiar textos, casi todo el contenido está directamente en `index.html`.

Si querés cambiar colores/estilo, está en `style.css`.

Si querés cambiar el comportamiento de botones/animaciones, está en `script.js`.

## 7. Efectos cinematográficos (nuevo)

La página ahora tiene:

- Zoom lento en las fotos grandes (tipo documental).
- El texto de cada capítulo aparece con un fade suave.
- Partículas flotando y un grano de película muy sutil encima de todo.
- Dos pantallas negras antes del video, para generar expectativa.
- Un sonido "pop" en cada mensaje de "pspsps" (no necesita ningún archivo, se genera solo).

## 8. Música por capítulo (opcional)

Ahora mismo toda la página usa `audio/ambient.mp3`, pero solo le sube/baja
el volumen según el momento (más suave en las partes emotivas).

Si en algún momento querés que la música realmente CAMBIE de canción entre
capítulos (como una mini película), agregá estos archivos a la carpeta `audio/`:

- audio/intro.mp3      → algo ligero y juguetón (capítulos 1-2)
- audio/memories.mp3   → algo nostálgico (fotos y recuerdos)
- audio/emotional.mp3  → algo más suave (miedos, ansiedad, apoyo)
- audio/ending.mp3     → algo que genere expectativa (antes del video)

No hace falta tocar el código: si el archivo existe, la página lo detecta
sola y hace un crossfade automático entre pistas. Si no existe, sigue
funcionando igual que ahora con `ambient.mp3`.
