const tempos = document.querySelectorAll('.tempos div');
    const timerEl = document.getElementById('timer');
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
          fimAudio.play();
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



    // Inicial
    atualizarTimer();
    Notification.requestPermission();

    function registrarPomodoroConcluido() {
  const hoje = new Date();
  const dataStr = hoje.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const storageKey = `pomodoros_${dataStr}`;
  const registro = JSON.parse(localStorage.getItem(storageKey));

  if (registro) {
    const feitos = registro.feitos;
    const proxIndex = feitos.findIndex(v => v === false);
    if (proxIndex !== -1) {
      feitos[proxIndex] = true;
    } else {
      // Todos marcados, adiciona novo pomodoro automaticamente
      feitos.push(true);
      registro.planejado += 1;
    }
    localStorage.setItem(storageKey, JSON.stringify({
      planejado: registro.planejado,
      feitos
    }));
  } else {
    // Nenhum registro ainda hoje, cria com 1 pomodoro concluído
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
  // Ignora se o usuário estiver digitando em um input ou textarea
  const alvo = document.activeElement;
  if (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') return;

  // T: alternar tema
  if (e.key.toLowerCase() === 't') {
    btnTema.click(); // Simula clique no botão
  }

  // Espaço: iniciar/parar pomodoro
  if (e.code === 'Space') {
    e.preventDefault(); // Evita rolagem
    if (btnStartStop) btnStartStop.click();
  }
});
