import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Paper,
} from '@mui/material';

// Define the data structure for IV forum posts
interface ForumPost {
  id: string;
  title: string;
  author: string;
  date: string; // ISO string format for simplicity
  content: string;
}

// Create dummy data for the IV forum
const dummyPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Welcome to the IV Forum!',
    author: 'Admin',
    date: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    content: 'This is the first post in the IV forum. Feel free to discuss various topics here. We encourage open communication and knowledge sharing.',
  },
  {
    id: '2',
    title: 'How to improve project engagement?',
    author: 'Jane Doe',
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    content: 'Looking for ideas on how to make our project discussions more engaging for everyone involved. Any suggestions on tools or techniques that have worked well for your teams?',
  },
  {
    id: '3',
    title: 'Tech Talk Thursdays - Next Topic Poll',
    author: 'John Smith',
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    content: 'We are planning our next Tech Talk Thursday. Please vote for your preferred topic: AI in Software Development, Advanced React Patterns, or Cloud Native Architectures. Poll closes next Monday!',
  },
  {
    id: '4',
    title: 'Feedback on the new UI design for Project X',
    author: 'Alice Brown',
    date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    content: 'The design team has released the first mockups for Project X\'s new UI. Please take a look and provide your valuable feedback in the shared document by EOD Friday.',
  },
];

const cardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 2, // Add some margin between cards
};

const cardHeaderStyle = {
  backgroundColor: 'primary.main', // Using theme's primary color
  color: 'primary.contrastText', // Using theme's contrast text color for primary
  padding: '12px 16px', // Adjust padding
};

const cardContentStyle = {
  flexGrow: 1,
  overflowY: 'auto',
};

export default function IVForumPage() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        IV Forum
      </Typography>

      <Grid container spacing={3}>
        {dummyPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card variant="outlined" sx={cardStyle}>
              <CardHeader
                title={<Typography variant="h6" component="div">{post.title}</Typography>}
                subheader={
                  <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    By {post.author} on {new Date(post.date).toLocaleDateString()}
                  </Typography>
                }
                // sx={cardHeaderStyle} // Optional: Apply custom header style
              />
              <CardContent sx={cardContentStyle}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {post.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Example of a List for categories or recent posts - can be expanded later */}
      {/* <Paper elevation={1} sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Forum Categories
        </Typography>
        <List component="nav" aria-label="forum categories">
          <ListItem button>
            <ListItemText primary="General Discussion" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Technical Support" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Announcements" />
          </ListItem>
          <Divider sx={{ marginY: 1 }}/>
          <ListItem>
            <ListItemText primaryTypographyProps={{variant: "subtitle2", color: "textSecondary"}} primary="More coming soon..." />
          </ListItem>
        </List>
      </Paper> */}
    </Box>
  );
}
