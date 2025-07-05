# Pomocheck
Esta aplicação web se trata de um registrador de pomodoros, um projeto pessoal que criei para registrar e acompanhar sessões de estudos no método Pomodoro. O usuário pode planejar a quantidade de pomodoros que pretende realizar em um dia, marcar os pomodoros concluídos e acompanhar o progresso semanal por meio de um relatório visual.

## Funcionalidades
Calendário para seleção do dia: permite escolher um dia específico para registrar os pomodoros.
Planejamento diário: o usuário informa quantos pomodoros pretende fazer naquele dia.
Checkbox para marcar pomodoros realizados: após o planejamento, surgem checkboxes para registrar cada pomodoro cumprido.
Relatório semanal: exibe um gráfico com a porcentagem de pomodoros realizados sobre os planejados na semana.

### Indicadores diários com emojis:
- 🔥 para dias em que a meta foi atingida,
- 🥺 para dias com pomodoros feitos, mas abaixo da meta,
- 😭 para dias sem pomodoros realizados.

### Persistência local: todos os dados são salvos no localStorage do navegador.

## Como usar
1. Selecione o dia desejado no calendário.
2. Informe a quantidade de pomodoros planejados para esse dia.
3. Marque cada pomodoro conforme for realizando.
4. Acesse a aba de relatório semanal para visualizar seu progresso.

## Estrutura e Boas Práticas (Na médida do possível, diante dos meus conhecimentos)
Princípio da Responsabilidade Única (SRP): cada função realiza uma única tarefa clara.
Modularização: código organizado em módulos ou objetos para melhor manutenção e reutilização.
Separação de lógica e visual: a lógica da aplicação está desacoplada dos componentes de interface, mantendo o código limpo e fácil de entender.
Uso de localStorage para salvar dados sem necessidade de backend.
Design simples e intuitivo para facilitar o uso e a navegação.

## Tecnologias utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)

## Próximos passos / melhorias futuras
Implementar backend para sincronização entre dispositivos.
Adicionar notificações para pomodoros.
Melhorar o gráfico semanal com mais detalhes.
Possibilidade de editar ou excluir registros.

## Licença
MIT License - sinta-se livre para usar e modificar.
