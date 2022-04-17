/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    JWT_SECRET:"jwt_secret",
    NEXTAUTH_URL:"http://localhost:3000/api/auth"
  }
}

module.exports = nextConfig
