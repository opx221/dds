import dropTypesPanel from './dropTypesPanel';
import dropsPanel from './dropsPanel';
import head from '../head';
import settingsPanel from '../settingsPanel';
import refresher from '../refresher';

const vendorPage = async ({ allDropTypes, allDrops, withdrawAddress }) =>
`<!doctype html>
<html>
<head>
  ${head({ title: 'Vendor panel' })}
  ${refresher()}
</head>
<body>

  <p>Logged in as vendor</p>
  <hr>

  ${dropTypesPanel({ allDropTypes })}
  <hr>

  ${dropsPanel({ allDrops, allDropTypes })}
  <hr>

  ${settingsPanel({ pathPrefix: 'vendor', withdrawAddress })}
  
</body>
</html>`;

export default vendorPage;
