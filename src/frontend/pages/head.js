const head = ({ title }) =>
`<title>${title}</title>
<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  html {
    font-family: sans-serif;
  }

  table {
    border-collapse: collapse;
  }

  td, th {
    border: 1px solid #888;
    padding: 20px;
  }

  button {
    padding: 5px 10px;
  }

  select {
    padding: 5px 10px;
  }

  input, textarea {
    padding: 5px;
  }
  input[type=file] {
    padding: 0;
  }

  ul {
    padding-left: 16px;
  }

  pre {
    margin: 0;
  }

  .qr {
    margin: 20px 0;
  }
  
  .important {
    color: red;
    background: yellow;
    width: max-content;
  }

  .captcha {
    filter: invert(1);
    width: 320px;
  }

  .table-form th input {
    background: #eee;
  }
  .table-form input {
    border: 0;
    outline-offset: -1px;
  }
  .table-form td {
    padding: 0;
  }
  .table-form th {
    padding: 0;
  }
</style>`;

export default head;
