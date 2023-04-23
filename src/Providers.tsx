import { ChakraProvider, theme } from '@chakra-ui/react';
import AuthProvider from 'contexts/Auth/AuthProvider';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Providers = ({ children }: Props) => (
  <ChakraProvider theme={theme}>
    <AuthProvider>{children}</AuthProvider>
  </ChakraProvider>
);
