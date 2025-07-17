import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import {
  Card,
  CardContent,
  Typography,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Grid
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import {
  ConfirmedPasswordStatus,
  EnableTwoFactor,
  DisableTwoFactor,
  ConfirmPassword,
  GetQrCode,
  GetRecovoryCodes,
  RegenerateRecoveryCodes
} from 'src/apis/setting'
import { get } from 'lodash'
import { getUser } from 'src/apis/auth'

export default function TwoFactorAuthentication() {
  const { enqueueSnackbar } = useSnackbar()
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openQrDialog, setOpenQrDialog] = useState(false)
  const [openRecoveryCodesDialog, setOpenRecoveryCodesDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [openEnableSuccessDialog, setOpenEnableSuccessDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [twoFactorSetupData, setTwoFactorSetupData] = useState(null)
  const [recoveryCodes, setRecoveryCodes] = useState([])
  const [passwordAction, setPasswordAction] = useState('')

  useEffect(() => {
    checkTwoFactorStatus()
  }, [])

  const checkTwoFactorStatus = async () => {
    try {
      const response = await getUser()
      setIs2FAEnabled(response.data.has2FA)
    } catch (error) {
      console.error('Error checking 2FA status:', error)
      enqueueSnackbar('Failed to check 2FA status', { variant: 'error' })
    }
  }

  const getAndSetQrCode = async () => {
    const response = await GetQrCode()
    setTwoFactorSetupData(response.data)
  }

  const getAndSetRecoveryCodes = async () => {
    const response = await GetRecovoryCodes()
    setRecoveryCodes(response.data)
  }

  // Updated handlePasswordSubmit function
  const handlePasswordSubmit = async () => {
    setIsLoading(true)
    try {
      await ConfirmPassword({ password })
      switch (passwordAction) {
        case 'toggle':
          if (is2FAEnabled) {
            await DisableTwoFactor()
            setIs2FAEnabled(false)
            enqueueSnackbar('Two-factor authentication disabled', {
              variant: 'success'
            })
          } else {
            await EnableTwoFactor()
            await getAndSetQrCode()
            await getAndSetRecoveryCodes()
            setOpenEnableSuccessDialog(true)
            setIs2FAEnabled(true)
          }
          break
        case 'regenerate':
          await RegenerateRecoveryCodes()
          await getAndSetRecoveryCodes()
          setOpenRecoveryCodesDialog(true)
          enqueueSnackbar('Recovery codes regenerated', { variant: 'success' })
          break
        case 'viewQr':
          await getAndSetQrCode()
          setOpenQrDialog(true)
          break
      }
      setOpenPasswordDialog(false)
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Invalid password', {
        variant: 'error'
      })
    } finally {
      setIsLoading(false)
      setPassword('')
      setPasswordAction('')
    }
  }

  // Updated handleTwoFactorToggle function
  const handleTwoFactorToggle = () => {
    setPasswordAction('toggle')
    setOpenPasswordDialog(true)
  }

  // Updated handleRegenerateRecoveryCodes function
  const handleRegenerateRecoveryCodes = () => {
    setPasswordAction('regenerate')
    setOpenPasswordDialog(true)
  }

  // Updated handleViewQrCode function
  const handleViewQrCode = () => {
    setPasswordAction('viewQr')
    setOpenPasswordDialog(true)
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Two-Factor Authentication (2FA)
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2
            }}
          >
            <Typography>
              {is2FAEnabled ? 'Disable' : 'Enable'} two-factor authentication
            </Typography>
            <Switch
              checked={is2FAEnabled}
              onChange={handleTwoFactorToggle}
              disabled={isLoading}
            />
          </Box>
          {is2FAEnabled && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    onClick={handleRegenerateRecoveryCodes}
                    fullWidth
                  >
                    Regenerate Recovery Codes
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    onClick={handleViewQrCode}
                    fullWidth
                  >
                    View QR Code
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Two-factor authentication adds an extra layer of security to your
          account. When enabled, you'll need to enter a code from your
          authentication app in addition to your password when logging in.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Recommended authentication apps:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Google Authenticator" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Authy" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Microsoft Authenticator" />
          </ListItem>
        </List>
      </Alert>

      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Important:</strong> Recovery codes are crucial for regaining
          access to your account if you lose your 2FA device. Store them
          securely and separately from your primary device. Each code can only
          be used once. If you run out of codes, you may lose access to your
          account permanently.
        </Typography>
      </Alert>

      <Dialog
        open={openPasswordDialog}
        onClose={() => {
          setOpenPasswordDialog(false)
          setPasswordAction('')
        }}
      >
        <DialogTitle>Verify Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenPasswordDialog(false)
              setPasswordAction('')
            }}
          >
            Cancel
          </Button>
          <LoadingButton onClick={handlePasswordSubmit} loading={isLoading}>
            Verify
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openQrDialog}
        onClose={() => setOpenQrDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Two-Factor Authentication QR Code</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Scan this QR code with your authenticator app:
          </Typography>
          {twoFactorSetupData && (
            <Box
              sx={{
                width: '100%',
                maxWidth: '200px',
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                mb: 2
              }}
              dangerouslySetInnerHTML={{ __html: twoFactorSetupData.svg }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQrDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRecoveryCodesDialog}
        onClose={() => setOpenRecoveryCodesDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Recovery Codes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Save these recovery codes in a secure location. They can be used to
            recover access to your account if you lose your 2FA device. Each
            code can only be used once.
          </Typography>
          <Grid container spacing={1}>
            {recoveryCodes.map((code, index) => (
              <Grid item xs={6} key={index}>
                <Typography variant="body2" fontFamily="monospace">
                  {code}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRecoveryCodesDialog(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEnableSuccessDialog}
        onClose={() => setOpenEnableSuccessDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Two-Factor Authentication Enabled</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                QR Code
              </Typography>
              <Typography variant="body2" paragraph>
                Scan this QR code with your authenticator app:
              </Typography>
              {twoFactorSetupData && (
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '200px',
                    margin: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2
                  }}
                  dangerouslySetInnerHTML={{ __html: twoFactorSetupData.svg }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Recovery Codes
              </Typography>
              <Typography variant="body2" paragraph>
                Save these recovery codes in a secure location. They can be used
                to recover access to your account if you lose your 2FA device.
                Each code can only be used once.
              </Typography>
              <Grid container spacing={1}>
                {recoveryCodes.map((code, index) => (
                  <Grid item xs={6} key={index}>
                    <Typography variant="body2" fontFamily="monospace">
                      {code}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEnableSuccessDialog(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
