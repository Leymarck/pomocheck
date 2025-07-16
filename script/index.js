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

      const [ano, mes, dia] = dataSelecionada.split('-');
const dataLocal = new Date(ano, mes - 1, dia);
const dataFormatada = dataLocal.toLocaleDateString('pt-BR', {
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


    const btnAnterior = document.getElementById('anterior');
const btnProximo = document.getElementById('proximo');

function atualizarData(offsetDias) {
  if (!dataSelecionada) return;

  const [ano, mes, dia] = dataSelecionada.split('-');
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + offsetDias);

  const novaDataISO = data.toISOString().split('T')[0];
  dataInput.value = novaDataISO;

  // Dispara o evento change manualmente
  const evento = new Event('change');
  dataInput.dispatchEvent(evento);
}

btnAnterior.addEventListener('click', () => atualizarData(-1));
btnProximo.addEventListener('click', () => atualizarData(1));


// Acrescentando uma pequena alteração na página inicial!

window.addEventListener('DOMContentLoaded', () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  const hojeStr = `${ano}-${mes}-${dia}`;

  dataInput.value = hojeStr;
  dataInput.dispatchEvent(new Event('change'));
});