import fs from 'fs';
import getExifData from './getExifData';

const fileWithExifData = fs.readFileSync('src/backend/utils/exif/res/Lake-min.jpg');

test('getExifData', async () => {
  expect(await getExifData(
    fileWithExifData,
  )).toBeTruthy();
});
