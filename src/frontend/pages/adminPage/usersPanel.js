import Role from '../../../backend/Users/Role';
import totpKeyToDataURL from '../../utils/totpKeyToDataURL';

const addTotpKeyDataURLs = (creator) => async (params) => (
  creator({
    ...params,
    allUsers: await Promise.all(
      params.allUsers.map(async (user) => ({
        ...user,
        totpKeyDataURL: await totpKeyToDataURL(user.totp_key),
      }))
    ),
  })
);

const usersPanel = ({ allUsers }) =>
`<h2>Users</h2>
<table>
  ${
    allUsers
      .map((user) =>
        `<tr>
          <td>${user.name}</td>
          <td>
            <details>
              <summary>TOTP Key</summary>
              <img src="${user.totpKeyDataURL}" class="qr">
              <br>
              ${user.totp_key}
            </details>
          </td>
          <td>
            <form action="/admin/users/delete" method="post">
              <input type="hidden" name="id" value="${user.id}">
              <button
                type="submit"
                ${user.name === 'admin' ? 'disabled' : ''}
              >Delete</button>
            </form>
          </td>
        </tr>`
      )
      .join('')
  }
</table>

<h2>Add user</h2>
<form action="/admin/users/create" method="post">
  <input name="name" placeholder="Name" required>
  <select name="role">
    ${
      Object
        .entries(Role)
        .map(([k, v]) => `<option value=${v}>${k}</option>`)
        .join('')
    }
  </select>
  <br>
  <br>

  <button type="submit">Add</button>
</form>`;

export default addTotpKeyDataURLs(usersPanel);
