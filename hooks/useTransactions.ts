import { gql } from "graphql-request";
import { useGraphQL } from "./useGraphQL";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useAtomValue } from "jotai";
import { passkeyAtom } from "@/atoms";

const MY_TRANSACTIONS = gql`
  query transactions {
  me {
    transactions(first: 24, after: "") {
      list {
        txHash
        chainId
        name
        status
        timestamp
        asset {
          amount
          changeType
          assetType
          toAddress
          asset {
            ... on Token {
              symbol
              imageUrl
            }
          }
        }
        interactParty {
          action
          icon
          address
          addressAlias
        }
      }
    }
  }
}
`

export default function useTransactions() {
  const authInfo = useAtomValue(passkeyAtom);
  const { data, isLoading, refetch } =
    useGraphQL(MY_TRANSACTIONS as unknown as TypedDocumentNode, undefined, {
      queryKey: ['mytransactions'],
      enabled: Boolean(authInfo)
    });

  return {
    data,
    isLoading,
    refetch
  }
}