import { FC } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

export type GraphQLProviderProps = {
    children?: React.ReactNode;
};

const GraphQLProvider: FC<GraphQLProviderProps> = (props) => {
    const client = new ApolloClient({
        uri: 'http://localhost:8080/graphql',
        cache: new InMemoryCache(),
    });
    return(
        <ApolloProvider client={client}>{props.children}</ApolloProvider>
    ); 
};

export default GraphQLProvider;