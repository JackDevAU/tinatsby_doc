import { Collection } from 'tinacms';

const generateFieldSelection = (field: any) => {
    switch (field.type) {
        case 'object':
            if (field.fields) {
                const subfields = field.fields.map(generateFieldSelection).join('\n');
                return `${field.name} {
                  ${subfields}
                }`;
            }
            break;
        case 'string':
        case 'number':
        case 'boolean':
        case 'datetime':
        case 'image':
        case 'reference':
            return field.name;
        case 'list':
            if (field.of) {
                const subfields = field.of.map(generateFieldSelection).join('\n');
                return `${field.name} {
                  ${subfields}
                }`;
            }
            break;
        default:
            return field.name;
    }
};

const generateQueryForCollection = (collection: Collection, relativePath: any) => {
    if (collection && collection.fields) {
        const fields = collection.fields.map(generateFieldSelection).join('\n');
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
    }
};

export default generateQueryForCollection;
