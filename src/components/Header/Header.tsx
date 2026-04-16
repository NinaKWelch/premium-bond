import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const Header = () => (
  <AppBar position="static" className="print-hide">
    <Toolbar sx={{ py: 2 }}>
      <Container maxWidth="md" disableGutters sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography variant="h4" component="h1">
          Premium Bonds Interest Tracker
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          Track your NS&amp;I Premium Bond investments and prizes to see the effective annual return
          you are actually earning.
        </Typography>
      </Container>
    </Toolbar>
  </AppBar>
)

export default Header
