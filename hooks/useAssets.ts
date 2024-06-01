import { gql } from "graphql-request";
import { useGraphQL } from "./useGraphQL";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useAtomValue } from "jotai";
import { passkeyAtom } from "@/atoms";

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
  const authInfo = useAtomValue(passkeyAtom);
  const { data, isLoading, refetch } =
    useGraphQL(MY_ASSETS as unknown as TypedDocumentNode, undefined, {
      queryKey: ['myassets'],
      enabled: Boolean(authInfo)
    });

  return {
    data,
    isLoading,
    refetch
  }
}