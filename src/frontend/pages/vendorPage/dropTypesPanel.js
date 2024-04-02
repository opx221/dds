import numberToTextInput from '../../utils/numberToTextInput';
import { FIAT_SYMBOL } from '../../../const';

const amountPricePairs = ({ amount_price_pairs }) => (
  Array(8).fill().map((_, i) =>
    `<tr>
      <td>
        <input
          name="amountPricePairs[${i}][0]"
          placeholder="Units"
          value="${numberToTextInput(amount_price_pairs[i]?.[0])}"
        >
      </td>
      <td>
        <input
          name="amountPricePairs[${i}][1]"
          placeholder="Unit price"
          value="${numberToTextInput(amount_price_pairs[i]?.[1])}"
        >
      </td>
    </tr>`
  )
  .join('')
);

const dropTypesRows = ({ allDropTypes }) => (
  allDropTypes
    .map((dropType) =>
      `<tr>
        <td>${dropType.name}</td>
        <td>
          <pre>${dropType.descr}</pre>
          <a href="/vendor/dropTypes/photos?id=${dropType.id}">photos</a>
        </td>
        <td>
          <form action="/vendor/dropTypes/update" method="post" class="table-form">
            <input type="hidden" name="id" value="${dropType.id}">

            <table>
              <tr>
                <th>
                  <input
                    readonly
                    value="${dropType.unit}"
                  >
                </th>
                <th>
                  <input
                    readonly
                    value="${FIAT_SYMBOL}"
                  >
                </th>
              <tr>
              ${
                amountPricePairs({
                  amount_price_pairs: dropType.amount_price_pairs,
                })
              }
            </table>

            <br>
            <button type="submit">Update</button>
          </form>
        </td>
        <td>
          <form action="/vendor/dropTypes/delete" method="post">
            <input type="hidden" name="id" value="${dropType.id}">
            <button type="submit">Delete</button>
          </form>
        </td>
      </tr>`
    )
    .join('')
);

const dropTypesPanel = ({ allDropTypes }) =>
`<h2>Drop types</h2>
<table>
  ${dropTypesRows({ allDropTypes })}
</table>

<h2>Add drop type</h2>
<form action="/vendor/dropTypes/create" method="post" enctype="multipart/form-data">
  <input name="name" placeholder="Name" required>
  <input name="unit" placeholder="Unit name" required>
  <br>
  <br>

  <textarea
    name="descr"
    rows="6"
    cols="40"
    placeholder="Description"
  ></textarea>
  <br>

  <input type="file" name="photos" accept="image/*" multiple>
  <br>
  <br>

  <button type="submit">Add</button>
</form>`;

export default dropTypesPanel;
