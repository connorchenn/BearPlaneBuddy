import { Box, Button, Grid, Text, VStack } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { user, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    await loginWithGoogle();
    navigate('/');
  }

  return (
    <Box textAlign='center' fontSize='xl' color='black'>
      <Grid minH='100vh' p={3}>
        <VStack spacing={8}>
          {user ? (
            <Button onClick={logout}>Logout</Button>
          ) : (
            <Button onClick={handleLogin}>Login</Button>
          )}
          <Text>{user?.displayName}</Text>
        </VStack>
      </Grid>
    </Box>
  );
}
