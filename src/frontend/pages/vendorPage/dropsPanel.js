import groupBy from 'object.groupby';
import { FIAT_SYMBOL } from '../../../const';

const AMOUNT_NOT_FOUND = (
  `<p class="important">
    UNIT PRICE MISSING
  </p>`
);

const dropPrice = ({
  amountPriceMap,
  amount,
}) => {
  const price = amountPriceMap[amount];
  return price ? `${price * amount}${FIAT_SYMBOL}` : AMOUNT_NOT_FOUND;
};

const dropsGroup = ({ filteredDrops, dropType }) =>
`<h3>${dropType.name}</h3>
<table>
  ${
    filteredDrops
      .map((drop) =>
        `<tr>
          <td>${drop.amount}${dropType.unit}</td>
          <td>
            ${
              dropPrice({
                amountPriceMap: dropType.amountPriceMap,
                amount: drop.amount,
              })
            }
          </td>
          <td>
            <pre>${drop.descr}</pre>
            <a href="/vendor/drops/photos?id=${drop.id}">photos</a>
          </td>
          <td>
            ${
              drop.buyer_id
                ? `bought by @${drop.buyer_username ?? 'NOT/SET'}
                  <details>
                    <summary>split TXID</summary>
                    ${drop.txid}
                  </details>`
                : 'available'
            }
          </td>
          <td>
            <form action="/vendor/drops/delete" method="post">
              <input type="hidden" name="id" value="${drop.id}">
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>`
      )
      .join('')
  }
</table>`;

const dropsGroups = ({ allDrops, allDropTypes }) => {
  const allDropTypesMap = Object.fromEntries(
    allDropTypes
      .map((dropType) => [dropType.id, dropType]),
  );

  return (
    Object
      .entries(
        groupBy(
          allDrops,
          (drop) => drop.drop_type_id,
        )
      )
      .map(([dropTypeId, allDropsGroup]) => {
        const dropType = allDropTypesMap[dropTypeId];
        const amountPriceMap = Object.fromEntries(
          allDropTypesMap[dropTypeId].amount_price_pairs
        );

        return dropsGroup({
          filteredDrops: allDropsGroup,
          dropType: {
            ...dropType,
            amountPriceMap,
          }
        });
      })
      .join('')
  );
};

const dropsPanel = ({ allDrops, allDropTypes }) =>
`<h2>Drops</h2>
${dropsGroups({ allDropTypes, allDrops })}

<h2>Add drop</h2>
<form action="/vendor/drops/create" method="post" enctype="multipart/form-data">
  <select name="dropTypeId">
    ${
      allDropTypes
        .map(({ id, name }) => `<option value=${id}>${name}</option>`)
        .join('')
    }
  </select>
  <input name="amount" placeholder="Units" required>
  <br>
  <br>

  <textarea
    name="descr"
    rows="6"
    cols="40"
    placeholder="Description"
    required
  ></textarea>
  <br>

  <input type="file" name="photos" accept="image/*" multiple>
  <br>
  <br>

  <button type="submit">Add</button>
</form>`;

export default dropsPanel;
