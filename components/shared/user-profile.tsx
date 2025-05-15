"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SimpleLoginModal } from "@/components/auth/simple-login-modal";
import { SimpleRegisterModal } from "@/components/auth/simple-register-modal";

export function UserProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/auth/login";

    switch (user.role) {
      case "admin":
        return "/admin";
      case "seller":
        return "/seller";
      case "buyer":
        return "/buyer";
      default:
        return "/marketplace";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const openLoginModal = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const openRegisterModal = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  if (!user) {

    return (
      <div className="flex items-center gap-2" data-testid="auth-buttons">
        <Button variant="outline" onClick={() => setLoginOpen(true)} data-testid="login-button">Login</Button>
        <Button className="bg-[#5A9A3D] hover:bg-[#5A9A3D]/90 text-white" onClick={() => setRegisterOpen(true)} data-testid="register-button">Register</Button>

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
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger data-testid="user-menu">
        <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-profile">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount data-testid="user-menu-content">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1" data-testid="user-info">
            <p className="text-sm font-medium leading-none" data-testid="user-name">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground" data-testid="user-email">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={getDashboardLink()}>
            <DropdownMenuItem data-testid="dashboard-link">
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem data-testid="settings-link">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
