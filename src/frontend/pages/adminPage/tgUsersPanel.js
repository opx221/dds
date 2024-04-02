import getXmrAddress from '../../../utils/getXmrAddress';
import formatPiconero from '../../../utils/formatPiconero';

const addXmrAddresses = (creator) => async (params) => (
  creator({
    ...params,
    allTgUsers: await Promise.all(
      params.allTgUsers.map(async (tgUser) => ({
        ...tgUser,
        address: await getXmrAddress(tgUser.payment_id),
      }))
    ),
  })
);

const tgUsersPanel = ({ allTgUsers }) =>
`<h2>Telegram users</h2>
<table>
  ${
    allTgUsers
      .map((tgUser) =>
        `<tr>
          <td>${tgUser.username ?? 'NOT/SET'}</td>
          <td style="white-space: nowrap;">
            ${
              tgUser
                .balance
                .map((b) => formatPiconero(BigInt(b)))
                .map((fb) => `${fb} XMR`)
                .join('<br>')
            }
          </td>
          <td>
            <details>
              <summary>Address</summary>
              <pre>${tgUser.address}</pre>
            </details>
          </td>
        </tr>`
      )
      .join('')
  }
</table>`;

export default addXmrAddresses(tgUsersPanel);
