# Portafolio – Pablo Andrés Muñoz

Portafolio profesional estático construido con HTML, CSS y JavaScript puro.

## Estructura

```
.
├── index.html          ← Página principal
├── css/
│   └── styles.css      ← Estilos (dark theme, glassmorphism, animaciones)
├── js/
│   └── main.js         ← Lógica (typing, scroll reveal, render dinámico)
├── data/
│   └── projects.json   ← Datos de experiencia, proyectos, skills, formación
├── assets/
│   └── images/         ← Imágenes y capturas de proyectos
├── .gitattributes      ← Fija finales de línea en LF
└── README.md
```

> El sitio vive en la raíz del repositorio porque GitHub Pages solo publica
> desde la raíz o desde `/docs`.

## Desarrollo local

`index.html` carga los datos con `fetch`, que el navegador bloquea bajo el
protocolo `file://`. Abrirlo con doble clic deja las secciones dinámicas
vacías: hay que servirlo por HTTP.

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Personalización

### 1. Datos personales
Edita `data/projects.json` para actualizar experiencia, proyectos, habilidades y formación.

### 2. Foto de perfil
La foto actual es `assets/images/perfilpablo.jpg` (400×400). Para cambiarla, reemplaza
el archivo o actualiza el `src` en `index.html` dentro de `.hero__photo-placeholder`.
Usa una imagen cuadrada: el marco es de 280px con `object-fit: cover`.

### 3. Enlaces
Actualiza los enlaces de LinkedIn, GitHub y correo en `index.html`.

### 4. Formulario de contacto
Crea un formulario en [Formspree](https://formspree.io) y pega su ID en la
constante `FORMSPREE_ID`, al inicio de `js/main.js`:

```js
const FORMSPREE_ID = 'mabcdefg';
```

Mientras esté vacía, el formulario aparece desactivado con un aviso que
remite al correo y a WhatsApp. Es deliberado: un formulario que acepta
mensajes y los pierde es peor que uno que avisa que no está listo.

Con el ID puesto, el envío ocurre sin recargar la página y muestra el
resultado en el mismo formulario.

### 5. CV descargable
Hoy el botón de la barra superior enlaza al perfil de LinkedIn. Para ofrecer
un PDF, coloca el archivo en `assets/` y apunta ahí el `href` de `#btnProfile`
en `index.html`, agregando el atributo `download`.

### 6. Capturas de proyectos
Agrega imágenes en `assets/images/` y referéncialas en `projects.json` si deseas añadir un campo `image`.

## Deploy

### GitHub Pages
1. Sube el contenido a un repositorio.
2. Ve a Settings → Pages → Source: Deploy from a branch → `master` / `(root)`.
   Ojo: el desplegable trae `main` por defecto y esta rama se llama `master`.
3. Tu sitio estará en `https://pabandres85.github.io/portfoliov2/`.

### Netlify / Vercel
Arrastra la carpeta o conecta el repo. No requiere build.

## Stack
- **HTML5** semántico
- **CSS3** con custom properties, glassmorphism, grid/flexbox
- **JavaScript** vanilla (ES6+)
- **Google Fonts**: Space Grotesk + Inter
- **Lucide Icons** vía CDN
- **Formspree** para el formulario de contacto

## Performance
- ~50KB total (sin imágenes)
- Carga en < 1 segundo
- SEO friendly sin SSR
- Mobile-first responsive
- Respeta `prefers-reduced-motion`
