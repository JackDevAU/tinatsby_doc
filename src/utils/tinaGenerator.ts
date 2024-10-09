const generateQueryForCollection = (collection: any, relativePath: any) => {
    console.log('collection', collection);
    console.log('relativePath', relativePath);

    const fields = collection.fields.map((field: any) => field.name).join('\n');
    return `
      query {
        ${collection.name}(relativePath: "${relativePath}") {
          id
          ${fields}
          _sys {
            filename
            basename
            breadcrumbs
            path
            relativePath
            extension
          }
        }
      }
    `;
};

export default generateQueryForCollection;
