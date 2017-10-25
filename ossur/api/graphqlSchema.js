import { ProductTC,ProductListResolver } from './models/product';

// SINGLE SCHEMA ON SERVER
// import { GQC } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// create new GQC from ComposeStorage
import { ComposeStorage } from 'graphql-compose';
const GQC = new ComposeStorage();

// create GraphQL Schema with all available resolvers for Product Type
GQC.rootQuery().addFields({
  productById: ProductTC.getResolver('findById'),
  productByIds: ProductTC.getResolver('findByIds'),
  productOne: ProductTC.getResolver('findOne'),
  productMany: ProductTC.getResolver('findMany'),
  productTotal: ProductTC.getResolver('count'),
  productConnection: ProductTC.getResolver('connection'),
});

GQC.rootMutation().addFields({
  productCreate: ProductTC.getResolver('createOne'),
  productUpdateById: ProductTC.getResolver('updateById'),
  productUpdateOne: ProductTC.getResolver('updateOne'),
  productUpdateMany: ProductTC.getResolver('updateMany'),
  productRemoveById: ProductTC.getResolver('removeById'),
  productRemoveOne: ProductTC.getResolver('removeOne'),
  productRemoveMany: ProductTC.getResolver('removeMany'),
  ...adminAccess({
    
  }),
});

function adminAccess(resolvers) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve(next => (rp) => {
      if (!rp.context.admin) {
        throw new Error('You should be admin, to have access to this action.');
      }
      return next(rp);
    });
  });
  return resolvers;
}

const graphqlSchema = GQC.buildSchema();
export default graphqlSchema;
