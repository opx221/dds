import { FIAT_SYMBOL } from '../../../const';

const dropTypesPanel = ({ allDropTypes }) =>
`<h2>Drop types</h2>
<table>
  ${
    allDropTypes
      .map((dropType) =>
        `<tr>
          <td>${dropType.vendor_name}</td>
          <td>${dropType.name}</td>
          <td>
            <form action="/admin/dropTypes/update" method="post" class="table-form">
              <input type="hidden" name="id" value="${dropType.id}">

              <table>
                <tr>
                  <th>
                    <input
                      readonly
                      size="12"
                      value="Split %"
                    >
                  </th>
                  <th>
                    <input
                      readonly
                      size="12"
                      value="Floor price ${FIAT_SYMBOL}"
                    >
                  </th>
                <tr>
                <tr>
                  <td>
                    <input
                      name="split"
                      size="12"
                      value="${dropType.split}"
                    >
                  </td>
                  <td>
                    <input
                      name="floorPrice"
                      size="12"
                      value="${dropType.floor_price}"
                    >
                  </td>
                </tr>
              </table>

              <br>
              <button type="submit">Update</button>
            </form>
          </td>
        </tr>`
      )
      .join('')
  }
</table>

<br>
<pre>
cut = split * ( 1 - floor price / price per unit )
</pre>
`;

export default dropTypesPanel;
