const settingsPanel = ({ pathPrefix, withdrawAddress }) =>
`<h2>Settings</h2>
<form action="/${pathPrefix}/settings/withdrawAddress" method="post">
  Your withdraw address:<br><br>
  <input
    style="font-family: monospace;"
    name="withdrawAddress"
    placeholder="Address"
    size="100"
    value=${withdrawAddress ?? ''}
  >
  <br>
  <br>
  <button type="submit">Update</button>

  <br>
  <br>
  <pre>withdraw fee is 0.0016xmr</pre>
</form>`;

export default settingsPanel;
