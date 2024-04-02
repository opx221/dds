import head from './head';

const messenger = ({ message }) => (
  message
    ? `<p>${message}</p> <hr>`
    : ''
);

const loginPage = ({
  action, message, title, captcha, form
}) =>
`<!doctype html>
<html>
<head>
  ${head({ title: `${title} login` })}
</head>
<body>
  ${messenger({ message })}

  <h1>${title} login</h1>
  <form action="${action}" method="post">
    <input
      name="name"
      placeholder="Name"
      value="${form?.name ?? ''}"
      required
    >
    <br>
    <input
      name="token"
      placeholder="Token"
      value="${form?.token ?? ''}"
      required
    >
    <br>
    <input
      type="hidden"
      name="captcha.id"
      value="${captcha.id}"
    >
    <img
      src="${captcha.image}"
      class="captcha"
    >
    <br>
    <input
      name="captcha.solution"
      placeholder="Captcha"
      required
    >
    <br><br>
    <button type="submit">Enter</button>
  </form>

</body>
</html>`;

export default loginPage;
