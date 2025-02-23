import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

const InfoBox = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [employeePosition, setEmployeePosition] = useState('');

  const handleSubmit = async () => {
    const data = { employeeName, companyName, employeePosition };
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
          label="Employee Name"
          variant="outlined"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <TextField
          label="Company Name"
          variant="outlined"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <TextField
          label="Employee Position"
          variant="outlined"
          value={employeePosition}
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
