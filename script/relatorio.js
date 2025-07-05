let semanaOffset = 0;

    function getDomingoDaSemana(offset) {
      const hoje = new Date();
      const dia = hoje.getDay(); // 0 = domingo
      const domingo = new Date(hoje);
      domingo.setDate(domingo.getDate() - dia + (offset * 7));
      domingo.setHours(0, 0, 0, 0);
      return domingo;
    }

    function gerarRelatorio(offset) {
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const container = document.getElementById('diasDaSemana');
      container.innerHTML = '';

      let feitosTotal = 0;
      let planejadoTotal = 0;

      const domingo = getDomingoDaSemana(offset);
      const status = [];

      for (let i = 0; i < 7; i++) {
        const dia = new Date(domingo);
        dia.setDate(dia.getDate() + i);
        const dataStr = dia.toISOString().split('T')[0];
        const dados = JSON.parse(localStorage.getItem(`pomodoros_${dataStr}`));
        let emoji = '🏖️';

        if (dados) {
          const feitos = dados.feitos.filter(v => v).length;
          const planejado = dados.planejado || 0;
          feitosTotal += feitos;
          planejadoTotal += planejado;

          if (planejado === 0) emoji = '🏖️';
          else if (feitos === 0) emoji = '😭';
          else if (feitos >= planejado) emoji = '🔥';
          else emoji = '🥺';
        }

        status.push({ nomeDia: diasSemana[dia.getDay()], emoji });
      }

      status.forEach(d => {
        const span = document.createElement('span');
        span.className = 'dia';
        span.innerHTML = `<div>${d.emoji}</div><div>${d.nomeDia}</div>`;
        container.appendChild(span);
      });

      const percentual = planejadoTotal > 0
        ? Math.round((feitosTotal / planejadoTotal) * 100)
        : 0;

      document.getElementById('percent').innerText = percentual + '%';
      document.getElementById('pomodoros').innerText = `${feitosTotal} / ${planejadoTotal} pomodoros`;

      const circle = document.querySelector('.progress-bar');
      const raio = 65;
      const circunferencia = 2 * Math.PI * raio;
      const dashoffset = circunferencia * (1 - percentual / 100);
      circle.style.strokeDasharray = circunferencia;
      circle.style.strokeDashoffset = dashoffset;
    }

    function mudarSemana(valor) {
      if (valor === 0) {
        semanaOffset = 0;
      } else {
        semanaOffset += valor;
      }
      gerarRelatorio(semanaOffset);
    }

    window.onload = () => gerarRelatorio(semanaOffset);