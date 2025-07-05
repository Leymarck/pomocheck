const dataInput = document.getElementById('data-estudo');
    const titulo = document.getElementById('titulo-dia');
    const form = document.getElementById('form-checkboxes');
    const containerDia = document.getElementById('dia-selecionado');
    const quantidadeInput = document.getElementById('quantidade');
    const infoStatus = document.getElementById('info-status');

    let dataSelecionada = '';
    let storageKey = '';

    dataInput.addEventListener('change', () => {
      dataSelecionada = dataInput.value;
      if (!dataSelecionada) return;

      storageKey = `pomodoros_${dataSelecionada}`;

      const dataFormatada = new Date(dataSelecionada).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });

      titulo.textContent = dataFormatada;
      containerDia.style.display = 'block';

      const dados = JSON.parse(localStorage.getItem(storageKey));
      if (dados) {
        quantidadeInput.value = dados.planejado;
        gerarCheckboxes();
      } else {
        form.innerHTML = '';
        infoStatus.innerText = 'Nenhum pomodoro planejado para este dia.';
      }
    });

    function gerarCheckboxes() {
      const qtd = parseInt(quantidadeInput.value);
      if (!qtd || qtd <= 0) return alert('Informe uma quantidade válida!');

      const progresso = JSON.parse(localStorage.getItem(storageKey)) || {
        planejado: qtd,
        feitos: Array(qtd).fill(false)
      };

      progresso.planejado = qtd;
      progresso.feitos = progresso.feitos.slice(0, qtd);
      while (progresso.feitos.length < qtd) progresso.feitos.push(false);

      form.innerHTML = '';
      progresso.feitos.forEach((feito, i) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = feito;
        checkbox.dataset.index = i;
        checkbox.addEventListener('change', salvarProgresso);
        label.appendChild(checkbox);
        label.append(` Pomodoro ${i + 1}`);
        form.appendChild(label);
      });

      localStorage.setItem(storageKey, JSON.stringify(progresso));
      atualizarStatus(progresso);
    }

    function salvarProgresso() {
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      const progresso = {
        planejado: checkboxes.length,
        feitos: Array.from(checkboxes).map(c => c.checked)
      };
      localStorage.setItem(storageKey, JSON.stringify(progresso));
      atualizarStatus(progresso);
    }

    function atualizarStatus({ planejado, feitos }) {
      const feitosCount = feitos.filter(f => f).length;
      infoStatus.innerText = `Você completou ${feitosCount} de ${planejado} pomodoros.`;
    }