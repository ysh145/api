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

      query product($solution: String!) {
        products: productMany(filter: {solution: $solution}) {
          _id
          title
        }
      }
      `,variables: JSON.stringify({
        "solution": "OA"
      }),
    },
  ]
};
