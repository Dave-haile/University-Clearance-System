// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { useToast } from "../../hooks/use-toast";
// import { User } from "../../../../types/user";
// import axiosClient from "../../../../services/axiosBackend";
// import { generateAvatar } from "../../utils/avatarGenerator";

// interface EditUserDialogProps {
//   open: boolean;
//   user: User | null;
//   onClose: () => void;
// }

// const EditUserDialog: React.FC<EditUserDialogProps> = ({
//   open,
//   user,
//   onClose,
// }) => {
//   const { toast } = useToast();
//   const [isResetting, setIsResetting] = useState(false);
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState("");
//   const userId = user?.id;

//   if (!user) return null;

//   const handleResetAccount = () => {
//     setIsResetting(true);
//   };

//   const handleSaveReset = async () => {
//     console.log(username, password);
//     try {
//       const response = await axiosClient.post(
//         `/api/admin/users/${userId}/reset-password`,
//         {
//           new_password: password,
//         }
//       );
//       // setMessage('Password reset successfully.');
//       console.log(response.data);
//     } catch (err) {
//       console.log(err);
//       // setMessage('Failed to reset password.');
//     }
//     toast({
//       title: "Account reset",
//       description: `${user.name}'s account has been reset successfully.`,
//     });

//     setIsResetting(false);
//     setUsername("");
//     setPassword("");
//     onClose();
//   };

//   const handleClose = () => {
//     setIsResetting(false);
//     setUsername("");
//     setPassword("");
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-md">
//         <DialogHeader>
//           <DialogTitle className="text-center text-xl">
//             Edit User: {user.name}
//           </DialogTitle>
//           <DialogDescription className="text-center">
//             View and edit user details or reset their account.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex items-center space-x-2">
//           <img
//             src={
//               user.profile_image ||
//               generateAvatar(user.name) ||
//               user.name.charAt(0)
//             }
//             alt={`${user.name.charAt(0)}`}
//             className="w-14 h-14 rounded-full mr-3"
//           />
//           <span className="text-2xl whitespace-nowrap">{user.name}</span>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//           <div className="space-y-4">
//             <p className="flex text-xl items-center space-x-2">
//               <span className="text-base mt-1 font-bold">
//                 {user.username ? "Username: " : "Email: "}
//               </span>{" "}
//               <span className="capitalize ">
//                 {" "}
//                 {user.username || user.email}
//               </span>
//             </p>
//             <p className="flex items-center space-x-2 text-sm">
//               <span className="mt-1 text-base font-bold">Role: </span>{" "}
//               <span className="capitalize text-xl">
//                 {" "}
//                 {user.role
//                   .replace(/\b\w/g, (c) => c.toUpperCase())
//                   .replace("_", " ")}
//               </span>
//             </p>
//             {user.role === "department_head" && (
//               <p className="flex items-center space-x-2 text-sm">
//                 <span className="font-bold text-base mt-1">Deparment: </span>{" "}
//                 <span className="capitalize text-xl  whitespace-nowrap">
//                   {user.staff?.department?.department}
//                 </span>
//               </p>
//             )}
//             <div className="text-sm text-gray-500">
//               {user.student?.year || "-"}
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name
//               </Label>
//               <div className="col-span-3">
//                 <Input id="name" defaultValue={user.name} readOnly />
//               </div>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="role" className="text-right">
//                 Role
//               </Label>
//               <div className="col-span-3">
//                 <Input id="role" defaultValue={user.role} readOnly />
//               </div>
//             </div>
//             {user.email && (
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="email" className="text-right">
//                   Email
//                 </Label>
//                 <div className="col-span-3">
//                   <Input id="email" defaultValue={user.email} readOnly />
//                 </div>
//               </div>
//             )}
//             {user.username && (
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="username" className="text-right">
//                   Username
//                 </Label>
//                 <div className="col-span-3">
//                   <Input id="username" defaultValue={user.username} readOnly />
//                 </div>
//               </div>
//             )}
//             <div className="pt-4">
//               <Button
//                 onClick={handleResetAccount}
//                 variant="outline"
//                 className="w-full"
//               >
//                 Reset Account Credentials
//               </Button>
//             </div>
//           </div>
//         </div>
//         <div className="space-y-4 py-4">
//           {!isResetting ? (
//             <div className="space-y-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="name" className="text-right">
//                   Name
//                 </Label>
//                 <div className="col-span-3">
//                   <Input id="name" defaultValue={user.name} readOnly />
//                 </div>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="role" className="text-right">
//                   Role
//                 </Label>
//                 <div className="col-span-3">
//                   <Input id="role" defaultValue={user.role} readOnly />
//                 </div>
//               </div>
//               {user.email && (
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="email" className="text-right">
//                     Email
//                   </Label>
//                   <div className="col-span-3">
//                     <Input id="email" defaultValue={user.email} readOnly />
//                   </div>
//                 </div>
//               )}
//               {user.username && (
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="username" className="text-right">
//                     Username
//                   </Label>
//                   <div className="col-span-3">
//                     <Input
//                       id="username"
//                       defaultValue={user.username}
//                       readOnly
//                     />
//                   </div>
//                 </div>
//               )}
//               <div className="pt-4">
//                 <Button
//                   onClick={handleResetAccount}
//                   variant="outline"
//                   className="w-full"
//                 >
//                   Reset Account Credentials
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="new-username" className="text-right">
//                   {[
//                     "department_head",
//                     "library",
//                     "proctor",
//                     "registrar",
//                     "cafeteria",
//                   ].includes(user.role)
//                     ? "Email"
//                     : "Username"}
//                 </Label>
//                 <div className="col-span-3">
//                   <Input
//                     id="new-username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     placeholder={
//                       [
//                         "department_head",
//                         "library",
//                         "proctor",
//                         "registrar",
//                         "cafeteria",
//                       ].includes(user.role)
//                         ? "New email"
//                         : "New username"
//                     }
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="new-password" className="text-right">
//                   Password
//                 </Label>
//                 <div className="col-span-3">
//                   <Input
//                     id="new-password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="New password"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           {isResetting && (
//             <Button onClick={handleSaveReset} disabled={!username || !password}>
//               Save Changes
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditUserDialog;
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import UserDetailsDisplay from "./UserDetailsDisplay";
import ResetAccountForm from "./ResetAccountForm";
import { User } from "../../../../types/user";

interface EditUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, user, onClose }) => {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!user) return null;

  const handleResetAccount = () => {
    setIsResetting(true);
  };

  const handleSaveReset = () => {
    // In a real app, you would call an API to update the credentials
    toast({
      title: "Account reset",
      description: `${user.name}'s account has been reset successfully.`,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setIsResetting(false);
    setUsername("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User: {user.name}</DialogTitle>
          <DialogDescription>
            View and edit user details or reset their account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isResetting ? (
            <>
              <UserDetailsDisplay user={user} />
              <div className="pt-4">
                <Button onClick={handleResetAccount} variant="outline" className="w-full">
                  Reset Account Credentials
                </Button>
              </div>
            </>
          ) : (
            <ResetAccountForm
              user={user}
              username={username}
              password={password}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {isResetting && (
            <Button onClick={handleSaveReset} disabled={!username || !password}>
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
