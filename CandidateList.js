import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/candidates')
      .then((response) => response.json())
      .then((data) => setCandidates(data))
      .catch((error) => console.error('Error fetching candidates:', error));
  }, []);

  return (
    <Grid container justifyContent="center" spacing={4} sx={{ padding: 2 }}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Candidate List
            </Typography>
            <List>
              {candidates.map((candidate) => (
                <React.Fragment key={candidate.id}>
                  <ListItem>
                    <ListItemText
                      primary={candidate.name}
                      secondary={`Email: ${candidate.email} | State: ${candidate.state} | Gender: ${candidate.gender}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CandidateList;
