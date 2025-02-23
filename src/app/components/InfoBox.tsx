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
import { Card, CardContent, CardHeader } from '@mui/material';
import styles from './InfoBox.module.css';

interface Employee {
  id: string;
  email: string;
  name: string;
  position: string;
  phoneNumber: string;
  numSmsFails: number;
  numCallFails: number;
  numEmailFails: number;
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
    console.log('Updated Phone Number:', phoneNumber);
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
    const data = { email, name, position, accountId, phoneNumber };
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
      // generate message
      let apiCall;
      if (type === 'call') {
        apiCall = 'aiCall';
      } else {
        apiCall = 'aiSms';
      }
      const response = await fetch(`/api/${apiCall}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeName, employeePosition }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send ${type} alert`);
      }

      // generate api
      const result = await response.json();
      let requestBody;
      if (type === 'email') {
        requestBody = {
          message: result.message,
          subject: 'Alert!',
          email: employeeEmail,
        };
      } else {
        requestBody = {
          body: result.message,
          to: employeePhone,
        };
      }

      await fetch(`/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // get id from email
      const getResponse = await fetch(`/api/account/email/${employeeEmail}`, {
        method: 'GET',
      });
      const getData = await getResponse.json();
      console.log('Account found:', getData.id);

      let updateBody;
      if (type === 'email') {
        updateBody = {
          numEmailLogs: getData.numEmailLogs + 1,
        };
      } else if (type === 'call') {
        updateBody = {
          numCallLogs: getData.numCallLogs + 1,
        };
      } else {
        updateBody = {
          numSmsLogs: getData.numSmsLogs + 1,
        };
      }

      await fetch(`/api/employee/${getData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateBody),
      });

      console.log(`Success: ${type} alert sent`);
    } catch (error) {
      console.error(`Error sending ${type} alert:`, error);
    }
  };

  const calculatePercentage = (fails: number, total: number) => {
    return total > 0 ? ((fails / total) * 100).toFixed(2) + '%' : '0%';
  };

  return (
    <div className="grid grid-cols-1 md:grid-rows-2 gap-6">
      <Card>
        <CardContent>
          <h1 className={styles.cardTitle}>About the Company</h1>
          <Box display="flex" flexDirection="row" gap={2} width="100%">
            <div className={styles.companyName}>
                <p className={styles.cardSubOpt}>Optional: Company Name</p>
                <TextField className={styles.tf}
                  label="My Company"
                  variant="outlined"
                  value={email}
                />
            </div>

            <div className={styles.companyDesc}>
              <p className={styles.cardSubOpt}>Optional: Company Desription</p>
              <TextField className={styles.tf}
                  label="My Company is a..."
                  variant="outlined"
                  value={email}
                />
            </div>

            <div className={styles.btnContainer}>
              <Button className={styles.btnSubmit} variant="contained" color="primary" onClick={handleSubmit}>
                Enter
              </Button>
            </div>
          </Box>          

        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h1 className={styles.cardTitle}>Add Employees</h1>

          <Box display="flex" flexDirection="row" gap={2}>
            <div className={styles.workerEmail}>
              <p className={styles.cardSub}>Employee Email</p>
              <TextField className={styles.tf}
                label="example@gmail.com"
                variant="outlined"
                value={email}
                onChange={(e) => setEmployeeEmail(e.target.value)}
              />
            </div>
            
            <div className={styles.workerName}>
              <p className={styles.cardSub}>Employee Name</p>
              <TextField className={styles.tf}
              label="Jessica Doe"
              variant="outlined"
              value={name}
              onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>

            <div className={styles.workerJob}>
              <p className={styles.cardSubOpt}>Optional: Employee Position</p>
              <TextField className={styles.tf}
              label="Senior Director of Finance"
              variant="outlined"
              value={position}
              onChange={(e) => setEmployeePosition(e.target.value)}
              />
            </div>

            <div className={styles.workerPhone}>
              <p className={styles.cardSubOpt}>Optional: Phone Number</p>
              <TextField className={styles.tf}
              label="+14675550000"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
        
            <div className={styles.btnContainer}>
              <Button className={styles.btnSubmit} variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h1 className={styles.cardTitle}>Employee Data </h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee Email</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Employee Position</TableCell>
                  <TableCell>SMS Fail Percentage</TableCell>
                  <TableCell>Call Fail Percentage</TableCell>
                  <TableCell>Email Fail Percentage</TableCell>
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
                      <TableCell>
                        {calculatePercentage(
                          employee.numSmsFails,
                          employee.numSmsLogs
                        )}
                      </TableCell>
                      <TableCell>
                        {calculatePercentage(
                          employee.numCallFails,
                          employee.numCallLogs
                        )}
                      </TableCell>
                      <TableCell>
                        {calculatePercentage(
                          employee.numEmailFails,
                          employee.numEmailLogs
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleSendAlert(
                              employee.id,
                              employee.email,
                              employee.phoneNumber,
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
                              employee.phoneNumber,
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
                              employee.phoneNumber,
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
                    <TableCell colSpan={7}>No employees available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoBox;
