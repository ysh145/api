import express from 'express';
import GraphqlSchema from './graphqlSchema';

export default {
  uri: '/api',
  schema: GraphqlSchema,
  title: 'ossur api',
  description: 'api samples for developer to get start quickly',
  queries: [
    
    {
      title: 'product',
      query: `
query product($subSolution: String!) {
  products: caseMany(filter: {subSolution: $subSolution}) {
    _id
    title
    images
  }
}

      `,variables: JSON.stringify({
        "subSolution":"OA"
      }),
    },
  ]
};
