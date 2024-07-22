
import React, { useState, useEffect } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Grid, TextField, Typography, FormControlLabel, Checkbox, Button, Box, Alert, InputLabel, MenuItem, 
  Select, FormControl, FormLabel, RadioGroup, Radio, FormGroup, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Avatar, Card, CardContent, CardHeader, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Pagination, IconButton 
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useSaveProfileMutation, useGetResumeProfileQuery } from './services/candidateProfileApi';
import { format } from 'date-fns';
import emailjs from 'emailjs-com';



function App() {
  const Input = styled('input')({
    display: 'none',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(null);
  const [st, setSt] = useState('');
  const [gender, setGender] = useState('');
  const [pjl, setPjl] = useState([]);
  const [pimage, setPimage] = useState('');
  const [rdoc, setRdoc] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: ""
  });
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getPjl = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setPjl([...pjl, value]);
    } else {
      setPjl(pjl.filter((e) => e !== value));
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setDob(null);
    setSt('');
    setGender('');
    setPjl([]);
    setPimage('');
    setRdoc('');
    setFeedback('');
    document.getElementById('resume-form').reset();
  };

  const [saveProfile] = useSaveProfileMutation();
  const { data, isSuccess } = useGetResumeProfileQuery();
  
  useEffect(() => {
    if (data && isSuccess) {
      setCandidates(data.candidates);
    }
  }, [data, isSuccess]);
  const sendEmail = (toEmail) => {
    const serviceId = 'service_scsqem4';
    const templateId = 'template_x9kxgsl';
    const userId = 'G4GlwOy8PlTZr5aU4';

    emailjs.send(serviceId, templateId, {
      to_email: toEmail,
      from_email: 'mohanapriya.r2022cse@sece.ac.in',
      message: 'Your resume has been uploaded successfully.',
    }, userId)
    .then((response) => {
      console.log('Email sent successfully:', response);
    })
    .catch((error) => {
      console.error('Email send failed:', error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('dob', dob);
    data.append('st', st);
    data.append('gender', gender);
    data.append('pjl', pjl);
    data.append('pimage', pimage);
    data.append('rdoc', rdoc);
    data.append('feedback', feedback);
    if (name && email) {
      const res = await saveProfile(data);
      if (res.data.status === "success") {
        setError({ status: true, msg: "Resume Uploaded Successfully", type: 'success' });
        sendEmail(email);  // Send email notification
        resetForm();
      } else if (res.data.status === "failed") {
        setError({ status: true, msg: res.data.message, type: 'error' });
      }
    } else {
      setError({ status: true, msg: "All Fields are Required", type: 'error' });
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Define light mode and dark mode themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <>
        

        <Box display="flex" justifyContent="center" sx={{ background: 'linear-gradient(to right, #00c6ff, #0072ff)', padding: 2 }}>
        <Typography 
          variant='h2' 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'white', 
            padding: '10px',
            borderRadius: '10px',
            textTransform: 'uppercase',
            textAlign: 'center',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: '2rem',
            letterSpacing: '0.02em'
          }}
        >
          RESUME UPLOADER
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end" sx={{ p: 1 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
      
      
      <Grid container justifyContent="center" spacing={4} sx={{ padding: 1 }}>
        <Grid item xs={2} md={5}>
          <Card>
            <CardHeader title="Enter Your Details" sx={{ backgroundColor: '#00c6ff', color: 'white' }} />
            <CardContent>
              
              <Box component="form" sx={{ p: 2 }} noValidate id="resume-form" onSubmit={handleSubmit}>
                <TextField id="name" name="name" required fullWidth margin='normal' label='Name' onChange={(e) => setName(e.target.value)} />
                <TextField id="email" email="email" required fullWidth margin='normal' label='Email' onChange={(e) => setEmail(e.target.value)} />
                <Box mt={2}>
                  <TextField 
                    id="dob" 
                    type="date" 
                    required 
                    fullWidth 
                    margin='normal' 
                    label='Date of Birth' 
                    InputLabelProps={{ shrink: true }} 
                    onChange={(e) => setDob(e.target.value)} 
                  />
                </Box>
                <FormControl fullWidth margin='normal'>
                  <InputLabel id="state-select-label">State</InputLabel>
                  <Select labelId='state-select-label' id='state-select' value={st} label='st' onChange={(e) => { setSt(e.target.value); }}>
                  <MenuItem value="Andhra Pradesh">Andhra Pradesh</MenuItem>
                    <MenuItem value="Arunachal Pradesh">Arunachal Pradesh</MenuItem>
                    <MenuItem value="Assam">Assam</MenuItem>
                    <MenuItem value="Bihar">Bihar</MenuItem>
                    <MenuItem value="Chhattisgarh">Chhattisgarh</MenuItem>
                    <MenuItem value="Goa">Goa</MenuItem>
                     <MenuItem value="Gujarat">Gujarat</MenuItem>
                     <MenuItem value="Haryana">Haryana</MenuItem>
                    <MenuItem value="Himachal Pradesh">Himachal Pradesh</MenuItem>
                    <MenuItem value="Jharkhand">Jharkhand</MenuItem>
                     <MenuItem value="Karnataka">Karnataka</MenuItem>
                    <MenuItem value="Kerala">Kerala</MenuItem>
                    <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                     <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                     <MenuItem value="Manipur">Manipur</MenuItem>
                     <MenuItem value="Meghalaya">Meghalaya</MenuItem>
                    <MenuItem value="Mizoram">Mizoram</MenuItem>
                    <MenuItem value="Nagaland">Nagaland</MenuItem>
                     <MenuItem value="Odisha">Odisha</MenuItem>
                    <MenuItem value="Punjab">Punjab</MenuItem>
                     <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                     <MenuItem value="Sikkim">Sikkim</MenuItem>
                     <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                    <MenuItem value="Telangana">Telangana</MenuItem>
                       <MenuItem value="Tripura">Tripura</MenuItem>
                    <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                    <MenuItem value="Uttarakhand">Uttarakhand</MenuItem>
                     <MenuItem value="West Bengal">West Bengal</MenuItem>
                    <MenuItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</MenuItem>
                    <MenuItem value="Chandigarh">Chandigarh</MenuItem>
                    <MenuItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Lakshadweep">Lakshadweep</MenuItem>
                    <MenuItem value="Puducherry">Puducherry</MenuItem>
                    <MenuItem value="Ladakh">Ladakh</MenuItem>
                    <MenuItem value="Jammu and Kashmir">Jammu and Kashmir</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin='normal'>
                  <FormLabel id="gender-radio" sx={{ fontWeight: 'bold' }}>Gender</FormLabel>
                  <RadioGroup row name="gender" aria-labelledby="gender-radio">
                    <FormControlLabel value="male" control={<Radio />} label='Male' onChange={(e) => setGender(e.target.value)} />
                    <FormControlLabel value="female" control={<Radio />} label='Female' onChange={(e) => setGender(e.target.value)} />
                    <FormControlLabel value="other" control={<Radio />} label='Other' onChange={(e) => setGender(e.target.value)} />
                  </RadioGroup>
                </FormControl>
                
                <FormControl component='fieldset' fullWidth margin='normal'>
                  <FormLabel component='legend' sx={{ fontWeight: 'bold' }}>Preferred Job Location:</FormLabel>
                  <FormGroup row>
                    <FormControlLabel control={<Checkbox />} label="Hyderabad" value="Hyderabad" onChange={(e) => getPjl(e)} />
                    <FormControlLabel control={<Checkbox />} label="Mumbai" value="Mumbai" onChange={(e) => getPjl(e)} />
                    <FormControlLabel control={<Checkbox />} label="Bangalore" value="Bangalore" onChange={(e) => getPjl(e)} />
                    <FormControlLabel control={<Checkbox />} label="Chennai" value="Chennai" onChange={(e) => getPjl(e)} />
                  </FormGroup>
                </FormControl>
                
                <Stack direction="row" alignItems="center" spacing={4} >
                  <label htmlFor='profile-photo'>
                    <Input accept="image/*" id="profile-photo" type="file" onChange={(e) => { setPimage(e.target.files[0]); }} />
                    <Button variant='contained' component='span'>Upload Photo</Button>
                  </label>
                  <label htmlFor="resume-file">
                    <Input accept="application/pdf" id="resume-file" type="file" onChange={(e) => { setRdoc(e.target.files[0]); }} />
                    <Button variant="contained" component="span">Upload File</Button>
                  </label>
                </Stack>

                <TextField 
                  id="feedback" 
                  label="Feedback" 
                  multiline 
                  rows={4} 
                  fullWidth 
                  margin="normal" 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)} 
                />
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button type="button" variant="outlined" color="primary" onClick={handleOpenModal}>Preview</Button>
                  <Button type='submit' variant='contained' color="success">Submit</Button>
                </Stack>
                {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ''}
              </Box>
            </CardContent>
          </Card>
        </Grid>
               
        <Grid item xs={1000} md={20}>
          <Card>
            <CardHeader title="List of Candidates" sx={{ backgroundColor: '#0072ff', color: 'white' }} />
            <CardContent>
              <TextField
                fullWidth
                label="Search by Name"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>DOB</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>State</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avatar</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Resume</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCandidates.length > 0 ? (
                      paginatedCandidates.map((candidate, i) => (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center">{candidate.name}</TableCell>
                          <TableCell align="center">{candidate.email}</TableCell>
                          <TableCell align="center">{format(new Date(candidate.dob), 'dd-MM-yyyy')}</TableCell>
                          <TableCell align="center">{candidate.state}</TableCell>
                          <TableCell align="center">{candidate.gender}</TableCell>
                          <TableCell align="center">{candidate.location}</TableCell>
                          <TableCell align="center"><Avatar src={`http://127.0.0.1:8000/${candidate.pimage}`} /></TableCell>
                          <TableCell align="center">
                          <a href="https://drive.google.com/file/d/1L1wzwF9tEq5SKIiKlT9rzXnpoI7ivs3X/view?usp=drive_link" target="_blank" rel="noopener noreferrer">View Resume</a>

                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={8}>No results found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Profile Preview</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h6">Name: {name}</Typography>
            <Typography variant="h6">Email: {email}</Typography>
            <Typography variant="h6">Date of Birth: {dob}</Typography>
            <Typography variant="h6">State: {st}</Typography>
            <Typography variant="h6">Gender: {gender}</Typography>
            <Typography variant="h6">Preferred Job Locations: {pjl.join(', ')}</Typography>
            {pimage && <img src={URL.createObjectURL(pimage)} alt="Profile" style={{ width: '100px', height: '100px' }} />}
            {rdoc && <Typography variant="h6">Resume Uploaded</Typography>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      </>
    </ThemeProvider>
  );
}

export default App;
