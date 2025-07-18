const tempos = document.querySelectorAll('.tempos div');
let timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');
const btn = document.getElementById('btn');
const clickAudio = document.getElementById('som-click');
const fimAudio = document.getElementById('som-fim');

let tempoTotal = 1500;
let tempoRestante = 1500;
let intervalo = null;
let rodando = false;

function formatar(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function atualizarTimer() {
  timerEl.textContent = formatar(tempoRestante);
  document.title = formatar(tempoRestante) + ' - Pomodoro';
  const progresso = ((tempoTotal - tempoRestante) / tempoTotal) * 100;
  progressEl.style.width = `${progresso}%`;
}

function iniciarContagem() {
  intervalo = setInterval(() => {
    if (tempoRestante > 0) {
      tempoRestante--;
      atualizarTimer();
    } else {
      pararContagem();

      // Toca o pocoto.mp3
      fimAudio.currentTime = 0;
      fimAudio.play();

      // Depois que o áudio tocar a página será recarregada.
      fimAudio.onended = () => {
        location.reload();
      }

      mostrarNotificacao("⏰ Tempo esgotado!", "Seu tempo de Pomodoro acabou.");
      registrarPomodoroConcluido();

    }
  }, 1000);
}

function pararContagem() {
  clearInterval(intervalo);
  intervalo = null;
  rodando = false;
  btn.textContent = 'Start';
}

btn.addEventListener('click', () => {
  clickAudio.play();
  if (rodando) {
    pararContagem();
  } else {
    rodando = true;
    iniciarContagem();
    btn.textContent = 'Stop';
  }
});

tempos.forEach(t => {
  t.addEventListener('click', () => {
    tempos.forEach(div => div.classList.remove('ativo'));
    t.classList.add('ativo');
    tempoTotal = tempoRestante = parseInt(t.dataset.tempo);
    atualizarTimer();
    pararContagem();
  });
});

function mostrarNotificacao(titulo, corpo) {
  if (Notification.permission === 'granted') {
    new Notification(titulo, { body: corpo });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        new Notification(titulo, { body: corpo });
      }
    });
  }
}

function registrarPomodoroConcluido() {
  const hoje = new Date();
  const dataStr = hoje.toISOString().split('T')[0];
  const storageKey = `pomodoros_${dataStr}`;
  const registro = JSON.parse(localStorage.getItem(storageKey));

  if (registro) {
    const feitos = registro.feitos;
    const proxIndex = feitos.findIndex(v => v === false);
    if (proxIndex !== -1) {
      feitos[proxIndex] = true;
    } else {
      feitos.push(true);
      registro.planejado += 1;
    }
    localStorage.setItem(storageKey, JSON.stringify({
      planejado: registro.planejado,
      feitos
    }));
  } else {
    localStorage.setItem(storageKey, JSON.stringify({
      planejado: 1,
      feitos: [true]
    }));
  }
  mostrarMensagemPomodoro();
}

function mostrarMensagemPomodoro() {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR');
  const div = document.getElementById('notificacao');
  div.textContent = `✔️ Pomodoro registrado no dia ${dataFormatada}`;
  div.style.display = 'block';
  div.style.opacity = '1';

  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.style.display = 'none', 400);
  }, 3000);
}

document.addEventListener('keydown', (e) => {
  const alvo = document.activeElement;
  if (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') return;

  if (e.key.toLowerCase() === 't') {
    const btnTema = document.getElementById('toggle-tema');
    if (btnTema) btnTema.click();
  }

  if (e.code === 'Space') {
    e.preventDefault();
    if (btn) btn.click();
  }
});

function formatarEntradaParaSegundos(valor) {
  const partes = valor.split(':');
  if (partes.length !== 2) return null;
  const min = parseInt(partes[0], 10);
  const seg = parseInt(partes[1], 10);
  if (isNaN(min) || isNaN(seg) || seg >= 60 || min < 0 || seg < 0) return null;
  return min * 60 + seg;
}

function ativarEdicao() {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = formatar(tempoTotal);
  input.className = 'timer';
  input.style.border = 'none';
  input.style.outline = 'none';
  input.style.width = '120px';
  input.style.fontSize = '48px';
  input.style.textAlign = 'center';
  input.style.color = '#002d5f';
  input.style.background = 'transparent';

  timerEl.replaceWith(input);
  input.focus();

  input.addEventListener('blur', () => aplicarNovoTempo(input));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') aplicarNovoTempo(input);
    if (e.key === 'Escape') cancelarEdicao(input);
  });
}

function aplicarNovoTempo(input) {
  const novo = formatarEntradaParaSegundos(input.value);
  const container = input.parentElement;

  timerEl = document.createElement('div');
  timerEl.id = 'timer';
  timerEl.className = 'timer';

  if (novo !== null) {
    tempoTotal = tempoRestante = novo;
  }

  timerEl.textContent = formatar(tempoRestante);
  container.replaceChild(timerEl, input);
  timerEl.addEventListener('click', ativarEdicao);
  atualizarTimer();
}

function cancelarEdicao(input) {
  const container = input.parentElement;
  timerEl = document.createElement('div');
  timerEl.id = 'timer';
  timerEl.className = 'timer';
  timerEl.textContent = formatar(tempoRestante);
  container.replaceChild(timerEl, input);
  timerEl.addEventListener('click', ativarEdicao);
}

timerEl.addEventListener('click', ativarEdicao);

atualizarTimer();
Notification.requestPermission();
