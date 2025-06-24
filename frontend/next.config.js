const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/tinyurls/:path*',           // Proxy only /items routes
        destination: 'http://backend:5000/tinyurls/:path*'
      }
    ]
  }
}

module.exports = nextConfig;