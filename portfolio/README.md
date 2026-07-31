# Portafolio – Pablo Andrés Muñoz

Portafolio profesional estático construido con HTML, CSS y JavaScript puro.

## Estructura

```
portfolio/
├── index.html          ← Página principal
├── css/
│   └── styles.css      ← Estilos (dark theme, glassmorphism, animaciones)
├── js/
│   └── main.js         ← Lógica (typing, scroll reveal, render dinámico)
├── data/
│   └── projects.json   ← Datos de experiencia, proyectos, skills, formación
├── assets/
│   └── images/         ← Imágenes y capturas de proyectos
└── README.md
```

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
Registra tu formulario en [Formspree](https://formspree.io) y reemplaza `TU_ID` en el action del form.

### 5. CV descargable
Coloca tu CV en `assets/` y actualiza el enlace del botón `#btnDownloadCV`.

### 6. Capturas de proyectos
Agrega imágenes en `assets/images/` y referéncialas en `projects.json` si deseas añadir un campo `image`.

## Deploy

### GitHub Pages
1. Sube el contenido a un repositorio.
2. Ve a Settings → Pages → Source: main branch.
3. Tu sitio estará en `https://tuusuario.github.io/portfolio/`.

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
