import React from 'react'

const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full bg-gray-900 text-white py-4 px-8 flex flex-col md:flex-row items-center justify-between text-sm">
  <div className="text-center md:text-left mb-2 md:mb-0 ml-[34rem]">
    © 2025 <span className="font-semibold">NodeTalk</span>. All rights reserved. <br />
    <span className="text-gray-400">This app is built by <span className="text-white font-medium">Md Masoom</span>.</span>
  </div>
  
  <div className="flex space-x-4 text-2xl">
    <a href="https://www.linkedin.com/in/mdmasoom459/" target="_blank" rel="noopener noreferrer" className="hover:underline ">
      <i class="ri-linkedin-box-fill"></i>
    </a>
    <a href="http://portfolio-mdmasoom.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline">
      <i class="ri-suitcase-line"></i>
    </a>
    <a href="https://github.com/masoommd" target="_blank" rel="noopener noreferrer" className="hover:underline">
      <i class="ri-github-fill"></i>
    </a>
  </div>
</footer>
  )
}

export default Footer