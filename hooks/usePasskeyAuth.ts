import { gql } from 'graphql-request';
import { useGraphQLMutation } from "@/hooks/useGraphQL";
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

const REGISTER_PASSKEY = gql`
  mutation registerPasskey($input: RegisterPasskeyInput!) {
    registerPasskey(input: $input) {
      status
      message
      data {
        address
        accessToken
        cyberAccount
        passkeyUser {
          userId
          userName
          publicKey
        }
      }
    }
  }
`;

const LOGIN_WITH_PASSKEY = gql`
  mutation loginWithPasskey($input: LoginWithPasskeyInput!) {
    loginWithPasskey(input: $input) {
      status
      message
      data {
        cyberAccount
        address
        accessToken
        passkeyUser {
          userId
          userName
          publicKey
        }
      }
    }
  }
`

export default function usePasskeyAuth({
  onLoginSuccess,
  onRegisterSuccess,
}: {
  onLoginSuccess: (data: any) => void,
  onRegisterSuccess: (data: any) => void
}) {
  const registerPasskeyMutation = useGraphQLMutation(
    REGISTER_PASSKEY as unknown as TypedDocumentNode,
    {
      onSuccess: onRegisterSuccess
    }
  );
  const loginWithPasskeyMutation = useGraphQLMutation(
    LOGIN_WITH_PASSKEY as unknown as TypedDocumentNode,
    {
      onSuccess: onLoginSuccess
    }
  )
  const { isPending: registerLoading, mutate: registerPasskey } = registerPasskeyMutation;
  const { isPending: loginLoading, mutate: loginWithPasskey } = loginWithPasskeyMutation;

  return {
    loginLoading,
    loginWithPasskey,
    registerLoading,
    registerPasskey,
  }

}