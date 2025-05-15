"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SimpleLoginModal } from "./simple-login-modal"
import { SimpleRegisterModal } from "./simple-register-modal"

export function AuthTest() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  
  const openLoginModal = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }
  
  const openRegisterModal = () => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => setLoginOpen(true)}>Login</Button>
      <Button className="bg-[#5A9A3D] hover:bg-[#5A9A3D]/90 text-white" onClick={() => setRegisterOpen(true)}>Register</Button>
      
      <SimpleLoginModal 
        open={loginOpen} 
        onOpenChange={setLoginOpen} 
        onOpenRegister={openRegisterModal}
      />
      <SimpleRegisterModal 
        open={registerOpen} 
        onOpenChange={setRegisterOpen}
        onOpenLogin={openLoginModal}
      />
    </div>
  )
}
