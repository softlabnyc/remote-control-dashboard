import { useToast } from '@chakra-ui/react';
import { TRPCClientErrorLike } from '@trpc/react';
import { useEffect } from 'react';

export const useErrorToast = (error: TRPCClientErrorLike<any> | null) => {
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: error.message,
        status: 'error',
        isClosable: true,
      });
    }
  }, [toast, error]);
};
