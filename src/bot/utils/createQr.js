import QRCode from 'qrcode';
import { PassThrough } from 'node:stream';

export default (content) => {
  const stream = new PassThrough();

  QRCode.toFileStream(stream, content, {
    errorCorrectionLevel: 'L',
  });

  return stream;
};
