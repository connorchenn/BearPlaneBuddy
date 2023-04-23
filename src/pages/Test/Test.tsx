import { Box, Button, Grid, Text, VStack } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';

export default function Test() {
  const { user, loginWithGoogle, logout } = useAuth();
  return (
    <Box textAlign='center' fontSize='xl' color='black'>
      <Grid minH='100vh' p={3}>
        <VStack spacing={8}>
          <Button onClick={loginWithGoogle}>Login</Button>
          <Button onClick={logout}>Logout</Button>
          <Text>{user?.displayName}</Text>
        </VStack>
      </Grid>
    </Box>
  );
}
