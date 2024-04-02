import fs from 'fs';
import getExifData from './getExifData';
import purgeExifData from './purgeExifData';

const fileWithExifData = fs.readFileSync('src/backend/utils/exif/res/Lake-min.jpg');
const fileWithoutExifData = fs.readFileSync('src/backend/utils/exif/res/Lake-min-purged.jpg');

test('purgeExifData has no exif data', async () => {
  expect(
    await getExifData(await purgeExifData(fileWithExifData)),
  ).toBe('');
});

test('purgeExifData returns file without exif data', async () => {
  expect(
    await purgeExifData(fileWithExifData),
  ).toEqual(fileWithoutExifData);
});

test('purgeExifData throws on invalid data', async () => {
  expect(
    purgeExifData(Buffer.from('invalid data')),
  ).rejects.toThrow(
    "purgeExifData failed with 1 and 'Error: Writing of this type of file is not supported - -'",
  );
});

test('purgeExifData throws on no data', async () => {
  expect(
    purgeExifData(Buffer.from('')),
  ).rejects.toThrow(
    "purgeExifData failed with 1 and 'Error: Nothing written - -'",
  );
});
