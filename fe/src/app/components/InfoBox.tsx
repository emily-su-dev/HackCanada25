import { Box, Button, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const InfoBox = () => {
  const [email, setEmployeeEmail] = useState('');
  const [name, setEmployeeName] = useState('');
  const [position, setEmployeePosition] = useState('');
  const [accountId, setAccountId] = useState(null); // state to store accountId

  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchAccountId = async () => {
        try {
          const getResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/email/${session.user.email}`,
            { method: 'GET' }
          );
          const getData = await getResponse.json();
          console.log('Account found:', getData.id);
          setAccountId(getData.id);
        } catch (error) {
          console.error('Error checking or creating account:', error);
        }
      };

      fetchAccountId();
    }
  }, [session]);

  const handleSubmit = async () => {
    const data = { email, name, position, accountId };
    try {
      const response = await fetch('/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>
        Info on Configuration setup. Need company setup and employee additions
      </h1>
      <Box display="flex" flexDirection="row" gap={2} p={2}>
        <TextField
          label="Employee Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />
        <TextField
          label="Employee Name"
          variant="outlined"
          value={name}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <TextField
          label="Employee Position"
          variant="outlined"
          value={position}
          onChange={(e) => setEmployeePosition(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>

      <h1>display of database data </h1>
    </div> //Use Material UI to display data
  );
};

export default InfoBox;
