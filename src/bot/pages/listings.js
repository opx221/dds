import groupBy from 'object.groupby';

const lstingsPage = ({ allDropTypes }) =>
`Available listings

${
  Object
    .entries(
      groupBy(
        allDropTypes.map((o, i) => ({ ...o, i })),
        (dropType) => dropType.vendor_name
      )
    )
    .map(([vendor_name, allDropTypesGroup]) => {
      const listings = (
        allDropTypesGroup
          .map(({ name, i }) => `/${i + 1} ${name}`)
          .join('\n')
      );

      return `By ${vendor_name}\n${listings}`;
    })
    .join('\n\n')
}

Select listing number to view available amounts`;

export default lstingsPage;
