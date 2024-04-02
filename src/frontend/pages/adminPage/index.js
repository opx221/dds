import head from '../head';
import usersPanel from './usersPanel';
import tgUsersPanel from './tgUsersPanel';
import settingsPanel from '../settingsPanel';
import refresher from '../refresher';
import dropTypesPanel from './dropTypesPanel';
import logsPanel from './logsPanel';

const adminPage = async ({
  allUsers, allTgUsers, withdrawAddress, allDropTypes
}) =>
`<!doctype html>
<html>
<head>
  ${head({ title: 'Admin panel' })}
  ${refresher()}
</head>
<body>
  <p>Logged in as admin</p>
  <hr>

  ${await usersPanel({ allUsers })}
  <hr>

  ${await tgUsersPanel({ allTgUsers })}
  <hr>

  ${dropTypesPanel({ allDropTypes })}
  <hr>

  ${settingsPanel({ pathPrefix: 'admin', withdrawAddress })}
  <hr>

  ${logsPanel()}

</body>
</html>`;

export default adminPage;
