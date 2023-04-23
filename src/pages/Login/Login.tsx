import { Box, Button, Grid, Text, VStack } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  return (
    <Box textAlign='center' fontSize='xl' color='black'>
      <Grid minH='100vh' p={3}>
        <VStack spacing={8}>
          <Button onClick={loginWithGoogle}>Login</Button>
          <Text>{user?.displayName}</Text>
        </VStack>
      </Grid>
    </Box>
  );
}
