/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  /* config options here */
}
 
module.exports = withPWA(nextConfig)