import getFile from '../../utils/getFile';

export default async (ctx) => {
  const { fileName } = ctx.request.query;

  ctx.body = await getFile(fileName);
};
