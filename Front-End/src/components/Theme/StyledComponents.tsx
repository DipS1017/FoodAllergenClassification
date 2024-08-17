
// StyledComponents.tsx
import { styled } from '@mui/material/styles';
import { Typography, TableCell } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '1rem',
  [theme.breakpoints.up('xs')]: {
    fontSize: '0.8rem',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.4rem',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1.6rem',
  },
}));

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.4rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.6rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.8rem',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '2rem',
  },
}));

export { StyledTableCell, ResponsiveTypography };

