// Lógica de la interfaz del pomodoro: cuenta regresiva + anillo de progreso.
// Sin librerías externas, solo JavaScript básico.

const MINUTOS_ENFOQUE = 25;
const MINUTOS_DESCANSO = 5;

const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const timeDisplay = document.getElementById('timeDisplay');
const modeLabel = document.getElementById('modeLabel');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const ringProgress = document.getElementById('ringProgress');

const circunferencia = ringProgress.getTotalLength();
ringProgress.style.strokeDasharray = `${circunferencia} ${circunferencia}`;
ringProgress.style.strokeDashoffset = circunferencia;

let modo = 'enfoque'; // 'enfoque' o 'descanso'
let totalSegundos = MINUTOS_ENFOQUE * 60;
let segundosRestantes = totalSegundos;
let intervalo = null;
let corriendo = false;

function formatearTiempo(segundos) {
  const min = Math.floor(segundos / 60).toString().padStart(2, '0');
  const seg = (segundos % 60).toString().padStart(2, '0');
  return `${min}:${seg}`;
}

function actualizarAnillo() {
  const fraccionTranscurrida = (totalSegundos - segundosRestantes) / totalSegundos;
  ringProgress.style.strokeDashoffset = circunferencia * fraccionTranscurrida;
}

function actualizarPantalla() {
  timeDisplay.textContent = formatearTiempo(segundosRestantes);
  actualizarAnillo();
}

function mostrarIconoPausa() {
  playIcon.innerHTML = '<rect x="6" y="5" width="4" height="14" fill="#FFFFFF"/><rect x="14" y="5" width="4" height="14" fill="#FFFFFF"/>';
}

function mostrarIconoPlay() {
  playIcon.innerHTML = '<path d="M8 5v14l11-7z" fill="#FFFFFF"/>';
}

function aplicarModo() {
  const esDescanso = modo === 'descanso';
  modeLabel.textContent = esDescanso ? 'Descanso' : 'Enfoque';
  modeLabel.classList.toggle('descanso', esDescanso);
  ringProgress.classList.toggle('descanso', esDescanso);
  totalSegundos = (esDescanso ? MINUTOS_DESCANSO : MINUTOS_ENFOQUE) * 60;
  segundosRestantes = totalSegundos;
  actualizarPantalla();
}

function iniciar() {
  corriendo = true;
  playBtn.setAttribute('aria-pressed', 'true');
  mostrarIconoPausa();

  intervalo = setInterval(() => {
    segundosRestantes--;
    actualizarPantalla();

    if (segundosRestantes <= 0) {
      clearInterval(intervalo);
      corriendo = false;
      playBtn.setAttribute('aria-pressed', 'false');
      mostrarIconoPlay();
      const terminoDescanso = modo === 'descanso';
      modo = terminoDescanso ? 'enfoque' : 'descanso';
      aplicarModo();
      alert(terminoDescanso ? '¡Descanso terminado! A enfocarse de nuevo 🍅' : '¡Pomodoro terminado! Tómate un descanso 🍅');
    }
  }, 1000);
}

function pausar() {
  clearInterval(intervalo);
  corriendo = false;
  playBtn.setAttribute('aria-pressed', 'false');
  mostrarIconoPlay();
}

playBtn.addEventListener('click', () => {
  if (corriendo) {
    pausar();
  } else {
    iniciar();
  }
});

resetBtn.addEventListener('click', () => {
  pausar();
  segundosRestantes = totalSegundos;
  actualizarPantalla();
});

skipBtn.addEventListener('click', () => {
  pausar();
  modo = modo === 'enfoque' ? 'descanso' : 'enfoque';
  aplicarModo();
});

actualizarPantalla();