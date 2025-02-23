
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Employee {
  id: string;
  email: string;
  name: string;
  position: string;
  phoneNumber: string;
  numSmsFails: number;
  numCallFails: number;
  numEmailFail: number;
  numSmsLogs: number;
  numCallLogs: number;
  numEmailLogs: number;
}

const InfoBox = () => {
  const [email, setEmployeeEmail] = useState<string>('');
  const [name, setEmployeeName] = useState<string>('');
  const [position, setEmployeePosition] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [accountId, setAccountId] = useState<string | null>(null); // state to store accountId
  const [employees, setEmployees] = useState<Employee[]>([]);

  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchAccountId = async () => {
        try {
          const getResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/email/${session?.user?.email}`,
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

  useEffect(() => {
    if (accountId) {
      fetchEmployees();
    }
  }, [accountId]);

  useEffect(() => {
    console.log("Updated Phone Number:", phoneNumber);
  }, [phoneNumber]);
  

  const fetchEmployees = async () => {
    if (!accountId) return;

    try {
      const response = await fetch(`/api/employee?accountId=${accountId}`, {
        method: 'GET',
      });
      const responseData = await response.json();
      setEmployees(responseData);

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      } else {
        console.log('Response data:', JSON.stringify(responseData));
      }
    } catch (error) {
      console.error('Error fetching employees!', error);
    }
  };

  const handleSubmit = async () => {
    const data = { email, name, position, accountId, phoneNumber};
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

  const handleSendAlert = async (
    employeeId: string,
    employeeEmail: string,
    employeePhone: string,
    employeeName: string,
    employeePosition: string,
    type: string
  ) => {
    try {
      const response = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeName, employeePosition }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send ${type} alert`);
      }

      const result = await response.json();
      let requestBody;
      if (type === 'email') {
        requestBody = {
          body: result,
          subject: 'Alert!',
          to: employeeEmail,
        };
      } else {
        requestBody = {
          body: result,
          to: employeePhone,
        };
      }

      const send = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const alertResult = await response.json();

      console.log(`Success: ${type} alert sent`, alertResult);
    } catch (error) {
      console.error(`Error sending ${type} alert:`, error);
    }
  };

  return (
    <div>
      <h1>Insert Employees</h1>
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
        <TextField
          label="Phone Number"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>

      <h1>Employee Data </h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Email</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee Position</TableCell>
              <TableCell>Failed SMS Tests</TableCell>
              <TableCell>Failed Call Tests</TableCell>
              <TableCell>Total SMS Received</TableCell>
              <TableCell>Total Calls Received</TableCell>
              <TableCell>Send Alert</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.numSmsFails}</TableCell>
                  <TableCell>{employee.numCallFails}</TableCell>
                  <TableCell>{employee.numSmsLogs}</TableCell>
                  <TableCell>{employee.numCallLogs}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        handleSendAlert(
                          employee.id,
                          employee.email,
                          employee.phone,
                          employee.name,
                          employee.position,
                          'call'
                        )
                      }
                    >
                      <CallIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleSendAlert(
                          employee.id,
                          employee.email,
                          employee.phone,
                          employee.name,
                          employee.position,
                          'sms'
                        )
                      }
                    >
                      <SmsIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleSendAlert(
                          employee.id,
                          employee.email,
                          employee.phone,
                          employee.name,
                          employee.position,
                          'email'
                        )
                      }
                    >
                      <EmailIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No employees available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div> //Use Material UI to display data
  );
};

export default InfoBox;
