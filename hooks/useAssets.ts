import { gql } from "graphql-request";
import { useGraphQL } from "./useGraphQL";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

const MY_ASSETS = gql`
  query assets {
    me {
      tokens {
        balance
        contract
        decimals
        symbol
        name
        usdPrice
        cmcUsdPrice
        imageUrl
      }
    }
  }
`

export default function useAssets() {
  const { data, isLoading, refetch } =
    useGraphQL(MY_ASSETS as unknown as TypedDocumentNode, undefined, {
      queryKey: ['myassets']
    });

  return {
    data,
    isLoading,
    refetch
  }
}