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
        <div>
        <h1 style = {{color: 'white', fontSize: '80px', marginTop: '60px', fontWeight: 'bold'}}>Welcome To BearPlaneBuddy!</h1>
        <h1 style = {{color: 'white', fontSize: '60px', marginTop: '60px', fontWeight: 'bold'}}>Never Travel Alone</h1>
        </div>
        <VStack spacing={8}>
          {user ? (
            <Button onClick={logout} colorScheme = 'facebook'>Logout</Button>
          ) : (
            <Button onClick={handleLogin} colorScheme = 'facebook'>Login</Button>
          )}
          <Text>{user?.displayName}</Text>
        </VStack>
      </Grid>
    </Box>
  );
}
