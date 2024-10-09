const generateQueryForCollection = (collection, relativePath) => {
    const fields = collection.fields.map(field => field.name).join('\n');
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