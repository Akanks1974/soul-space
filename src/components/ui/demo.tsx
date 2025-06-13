import { Auth } from "@/components/ui/auth-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/auth";
import { useState } from "react";

function Component() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAuthSuccess = () => {
    setIsDialogOpen(false);
  };

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-100 dark:border-purple-700">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign in</Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Account Access</DialogTitle>
        </DialogHeader>
        <Auth onSuccess={handleAuthSuccess} />
      </DialogContent>
    </Dialog>
  );
}

export { Component };