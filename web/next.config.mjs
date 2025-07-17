import withTM from 'next-transpile-modules'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false
}

const wrapper = withTM([
  //   '@fullcalendar/common',
  //   '@fullcalendar/daygrid',
  //   '@fullcalendar/interaction',
  //   '@fullcalendar/list',
  //   '@fullcalendar/react',
  //   '@fullcalendar/timegrid',
  //   '@fullcalendar/timeline'
  'react-pdf'
])

// module.exports = {
//   webpack: (config) => {
//     config.resolve.alias.canvas = false
//     return config
//   }
// }

export default wrapper(nextConfig)
