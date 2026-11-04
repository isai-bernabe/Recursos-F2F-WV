/**
 * LÓGICA DE INTERFAZ - EQUIPO F2F WORLD VISION
 * Autor: Isaí Barrera
 */

document.addEventListener('DOMContentLoaded', () => {
  initClipboardButtons();
  initCopyAllInvoice();
  initLocalVideoLoader();
  initLogoFallbacks();
  initActiveNavigation();
  setCurrentYear();
});

/**
 * Muestra una notificación temporal en pantalla (compatible con Android/iOS/PC)
 * @param {string} message - Mensaje a mostrar
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/**
 * Copia texto al portapapeles usando la API moderna con respaldo para móviles
 * @param {string} text - Texto a copiar
 * @param {string} label - Etiqueta descriptiva para la notificación
 */
async function copyTextToClipboard(text, label = 'Dato') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Respaldo para contextos locales o navegadores móviles antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showToast(`✓ ${label} copiado: ${text}`);
  } catch (err) {
    showToast('No se pudo copiar automáticamente');
    console.error('Error al copiar:', err);
  }
}

/**
 * Inicializa todos los botones con el atributo [data-copy]
 */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const valueToCopy = button.getAttribute('data-copy');
      const label = button.getAttribute('data-label') || 'Dato';
      copyTextToClipboard(valueToCopy, label);
    });
  });
}

/**
 * Copia todos los datos de facturación juntos en un solo bloque listo para WhatsApp o correo
 */
function initCopyAllInvoice() {
  const btnCopyAll = document.getElementById('btn-copy-all-invoice');
  if (!btnCopyAll) return;

  btnCopyAll.addEventListener('click', () => {
    const invoiceBlock = [
      'DATOS DE FACTURACIÓN - VIAJES WV',
      'Cédula / RUC: 1726760828',
      'Nombre: Miguel Andrés Castillo Quevedo',
      'Correo: miguel_castillo_quevedo@wvi.org',
      'Teléfono: 0998163186'
    ].join('\n');

    copyTextToClipboard(invoiceBlock, 'Bloque completo de facturación');
  });
}

/**
 * Permite seleccionar y previsualizar el video local desde el dispositivo sin recargar
 */
function initLocalVideoLoader() {
  const fileInput = document.getElementById('video-file-input');
  const videoPlayer = document.getElementById('caravanas-video');
  const videoStatus = document.getElementById('video-status-text');

  if (!fileInput || !videoPlayer) return;

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Por favor selecciona un archivo de video válido (.mp4)');
      return;
    }

    const fileURL = URL.createObjectURL(file);
    videoPlayer.src = fileURL;
    videoPlayer.load();
    videoPlayer.play().catch(() => {
      // Algunos móviles requieren toque directo en el reproductor
    });

    if (videoStatus) {
      videoStatus.textContent = `Reproduciendo: ${file.name}`;
    }
    showToast('✓ Video cargado correctamente');
  });
}

/**
 * Si una imagen de logo aún no se encuentra en la carpeta img/, muestra una insignia limpia
 */
function initLogoFallbacks() {
  const logos = document.querySelectorAll('img[data-fallback]');
  logos.forEach((img) => {
    img.addEventListener('error', () => {
      const fallbackText = img.getAttribute('data-fallback');
      const fallbackEl = document.createElement('div');
      fallbackEl.className = img.classList.contains('brand-logo')
        ? 'brand-fallback'
        : 'entity-fallback';
      fallbackEl.textContent = fallbackText;
      img.replaceWith(fallbackEl);
    });
  });
}

/**
 * Resalta la sección activa en la barra de navegación al desplazarse
 */
function initActiveNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/**
 * Actualiza el año actual en la sección de derechos reservados
 */
function setCurrentYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}