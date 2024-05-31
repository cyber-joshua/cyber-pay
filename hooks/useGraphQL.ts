import request, { Variables } from 'graphql-request';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type QueryOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { passkeyAtom } from '@/atoms';

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables extends Record<string, never> ? [] : TVariables,
  options?: QueryOptions & {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    isFromCyberWallet?: boolean;
  },
): UseQueryResult<TResult> {

  return useQuery({
    queryKey: [(document.definitions[0] as any).name.value, variables],
    queryFn: async () => {
      try {
        const token = localStorage.getItem(
          'passkeyInfo',
        );
        const accessToken = token ? JSON.parse(token).accessToken : '';
        return await request(
          'https://api.stg.cyberconnect.dev/wallet/',
          document,
          variables ? variables : undefined,
          { Authorization: accessToken },
        );
      } catch (error) {
        // handle error
      }
    },
    ...options,
  });
}

export function useGraphQLMutation<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  callback?: {
    onError?: (err?: any) => void;
    onSuccess?: (data: TResult) => void;
  },
): UseMutationResult<TResult> {

  const passkeyInfo = useAtomValue(passkeyAtom);

  return useMutation({
    mutationFn: (variables) =>
      request(
        'https://api.stg.cyberconnect.dev/wallet/',
        document,
        variables ? (variables as Variables) : undefined,
        { Authorization: passkeyInfo?.accessToken ?? '' },
      ),
    onError: (error, variables, context) => {
      callback?.onError?.();
    },
    onSuccess: (data, variables, context) => {
      callback?.onSuccess?.(data);
    },
  });
}