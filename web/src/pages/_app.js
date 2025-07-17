// i18n
import '../locales/i18n'

// highlight
import '../utils/highlight'

// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

// slick-carousel
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'react-lazy-load-image-component/src/effects/black-and-white.css'

import PropTypes from 'prop-types'
// next
import Head from 'next/head'
// @mui
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// contexts
import { SettingsProvider } from '../contexts/SettingsContext'
import { CollapseDrawerProvider } from '../contexts/CollapseDrawerContext'
// theme
import ThemeProvider from '../theme'
// components
import { ChartStyle } from '../components/chart'
import ProgressBar from '../components/ProgressBar'
import ThemeColorPresets from '../components/ThemeColorPresets'
import NotistackProvider from '../components/NotistackProvider'
import MotionLazyContainer from '../components/animate/MotionLazyContainer'

import { AuthProvider } from '../contexts/SanctumAuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ----------------------------------------------------------------------

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  settings: PropTypes.object
}

const queryClient = new QueryClient()

export default function MyApp(props) {
  const { Component, pageProps } = props

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CollapseDrawerProvider>
              <SettingsProvider>
                <ThemeProvider>
                  <NotistackProvider>
                    <MotionLazyContainer>
                      <ThemeColorPresets>
                        <ChartStyle />
                        <ProgressBar />
                        {getLayout(<Component {...pageProps} />)}
                      </ThemeColorPresets>
                    </MotionLazyContainer>
                  </NotistackProvider>
                </ThemeProvider>
              </SettingsProvider>
            </CollapseDrawerProvider>
          </LocalizationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

// ----------------------------------------------------------------------
