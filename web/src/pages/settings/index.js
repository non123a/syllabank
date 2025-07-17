import { capitalCase } from 'change-case'
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
import useTabs from 'src/hooks/useTabs'
import useSettings from 'src/hooks/useSettings'
// _mock_
import {
  _userPayment,
  _userAddressBook,
  _userInvoices,
  _userAbout
} from 'src/_mock'
// layouts
import Layout from 'src/layouts'
// components
import Page from 'src/components/Page'
import Iconify from 'src/components/Iconify'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
// sections
import AccountChangePassword from 'src/sections/@dashboard/settings/AccountChangePassword'
import AccountTwoFactorAuthentication from 'src/sections/@dashboard/settings/AccountTwoFactorAuthentication'

// ----------------------------------------------------------------------

Settings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

const ACCOUNT_TABS = [
  {
    value: 'change_password',
    icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
    component: <AccountChangePassword />
  },
  {
    value: 'two_factor_authentication',
    icon: <Iconify icon={'ic:sharp-verified-user'} width={20} height={20} />,
    component: <AccountTwoFactorAuthentication />
  }
]

export default function Settings() {
  const { themeStretch } = useSettings()

  const { currentTab, onChangeTab } = useTabs('change_password')

  return (
    <Page title="Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Settings"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            { name: 'Settings' }
          ]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab
          return isMatched && <Box key={tab.value}>{tab.component}</Box>
        })}
      </Container>
    </Page>
  )
}
