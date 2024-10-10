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

const generateQueryForCollection = (collection: Collection) => {
  if (collection && collection.fields) {
    const collectionName = collection.name;
    const uppercaseCollectionNAame = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
    const partsName = uppercaseCollectionNAame + "Parts";

    const fields = collection.fields.map(generateFieldSelection).join('\n');
    return `
      query ${collectionName}($relativePath: String!) {
            ${collectionName}(relativePath: $relativePath) {
              ...${partsName}
            }
          }

      fragment ${partsName} on ${uppercaseCollectionNAame} {
        __typename
              ${fields}
        ... on Document {
          _sys {
            filename
            basename
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
      }
    `;
  }
};

export default generateQueryForCollection;
