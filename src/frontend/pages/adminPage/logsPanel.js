const logsPanel = () =>
`<h2>Logs</h2>

<ul>
  <li>
    Deposit listener
    <a href="/admin/logs?fileName=.pm2/logs/deposit-listener-out.log" target="_blank">out</a>
    <a href="/admin/logs?fileName=.pm2/logs/deposit-listener-error.log" target="_blank">error</a>
  </li>
  <li>
    Bot
    <a href="/admin/logs?fileName=.pm2/logs/bot-out.log" target="_blank">out</a>
    <a href="/admin/logs?fileName=.pm2/logs/bot-error.log" target="_blank">error</a>
  </li>
  <li>
    Frontend
    <a href="/admin/logs?fileName=.pm2/logs/frontend-out.log" target="_blank">out</a>
    <a href="/admin/logs?fileName=.pm2/logs/frontend-error.log" target="_blank">error</a>
  </li>
</ul>
`;

export default logsPanel;
