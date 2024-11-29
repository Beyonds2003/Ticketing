import UserForm from "@/components/form/UserForm";
import React from "react";

const SignUp = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <UserForm formType={"signup"} />
    </div>
  );
};

export default SignUp;
