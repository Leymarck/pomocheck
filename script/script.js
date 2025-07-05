const btnTema = document.getElementById('toggle-tema');

function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem('tema') || 'claro';
  if (temaSalvo === 'escuro') {
    document.body.classList.add('dark-mode');
    btnTema.textContent = '☀️ Modo Claro';
  } else {
    document.body.classList.remove('dark-mode');
    btnTema.textContent = '🌙 Modo Escuro';
  }
}

btnTema.addEventListener('click', () => {
  const modoEscuroAtivo = document.body.classList.toggle('dark-mode');
  localStorage.setItem('tema', modoEscuroAtivo ? 'escuro' : 'claro');
  btnTema.textContent = modoEscuroAtivo ? '☀️ Modo Claro' : '🌙 Modo Escuro';
});

aplicarTemaSalvo(); // Aplicar ao carregar
