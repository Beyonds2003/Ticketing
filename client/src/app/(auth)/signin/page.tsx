import UserForm from "@/components/form/UserForm";
import React from "react";

const SignIn = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <UserForm formType="signin" />
    </div>
  );
};

export default SignIn;
