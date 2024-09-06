import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Comments = () => {
  const comments = [
    { client: 'Client 1', comment: 'Great service!', date: '2024-09-01' },
    { client: 'Client 2', comment: 'Very professional.', date: '2024-09-03' },
  ];

  return (
    <div>
      <h2>Comments</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((comment, index) => (
              <TableRow key={index}>
                <TableCell>{comment.client}</TableCell>
                <TableCell>{comment.comment}</TableCell>
                <TableCell>{comment.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Comments;
