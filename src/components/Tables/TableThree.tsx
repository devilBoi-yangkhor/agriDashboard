"use client";
// import { Package } from "@/types/package";
// import Link from "next/link";
import { BiUserPlus } from "react-icons/bi";
import { BsEye, BsTrash } from "react-icons/bs";
import { useState } from "react";
import { Formik, Form, FormikState } from "formik";
import * as Yup from 'yup';
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";
import Switcher from "../Inputs/Switcher";
import Swal from 'sweetalert2';
import FileInput from "../Inputs/FileInput";

const TableThree = () => {

  const [showModal, setShowModal] = useState('hidden');
  const [usersList, setUsersList] = useState([{
    name: "Jigme Choeling",
    role: "Super Admin",
    invoiceDate: `Jan 13,2023`,
    status: "Active",
  },
  {
    name: "Deepak Kumar",
    role: "Lab Tech.",
    invoiceDate: `Jan 13,2023`,
    status: "Active",
  },
  {
    name: "Ugyen Dendup",
    role: "Director",
    invoiceDate: `Jan 13,2023`,
    status: "Banned",
  },
  {
    name: "Dorji Wangmo",
    role: "User",
    invoiceDate: `Jan 13,2023`,
    status: "Not Virified",
  }]);

  const showModalHandler = () => {

    showModal === 'hidden' ? setShowModal('block') : setShowModal('hidden');

  }

  const handleSubmit = (values: { username?: string; first_name: any; last_name: any; email?: string; phone_number?: string; role: any; dob?: string; status?: any; },
    resetForm: { (nextState?: Partial<FormikState<{ username: string; first_name: string; last_name: string; email: string; phone_number: string; role: string; dob: string; }>> | undefined): void; (): void; }) => {
    setUsersList([...usersList, {
      name: values.first_name + " " + values.last_name,
      role: values.role,
      invoiceDate: `Jan 13,2024`,
      status: values.status ? "Active" : "Not Verified"
    }]);
    resetForm();
    showModalHandler();
  }

  const handleDelete = (index: number) => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCloseButton: true,
      showConfirmButton: true,
      width: 450
    }).then((result) => {
      const newList = [...usersList];
      newList.splice(index, 1);
      setUsersList(newList);
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    });
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex max-w-full justify-between items-center mb-5 ">
        <h1 className="dark:text-white">User List</h1>
        <button
          onClick={showModalHandler}
          className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-4"
        >
          <span>
            <BiUserPlus className="text-white" size={20} />
          </span>
          Add User
        </button>
      </div>
      <div aria-hidden="false" className={`${showModal} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100`}>
        <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
          <Formik
            initialValues={{
              username: '',
              first_name: '',
              last_name: '',
              email: '',
              phone_number: '',
              role: '',
              dob: ''
            }}
            validationSchema={Yup.object({
              username: Yup.string()
                .required('Username is required')
                .min(3, 'Must be at least 3 characters'),
              first_name: Yup.string()
                .required('First Name is required')
                .min(3, 'Must be at least 3 characters'),
              email: Yup.string()
                .required('Email address is required')
                .email('Invalid email address'),
              phone_number: Yup.number().required("Phone number must be a number").min(8, 'Phone number must be atleast 8 numbers.'),
              role: Yup.string().required("Role is required"),
            })}
            onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
          >
            <Form>
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create New User
                  </h3>
                  <button type="button" onClick={showModalHandler} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input label={"First Name"} type={"text"} placeholder="Enter your first name" name="first_name" />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <Input label={"Last Name"} type={"text"} placeholder="Enter your last name" name="last_name" />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input label={"Username"} type={"text"} placeholder="Enter username" name="username" />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input label={"Email"} type={"email"} placeholder="Enter email address" name="email" />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input label={"Phone Number"} type={"text"} placeholder="Enter phone number" name="phone_number" />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Select onValueChange={()=>{}} label="Role" name="role" options={[{ value: "", text: "Select Role" }, { value: "Super Admin", text: "Super Admin" }, { value: "Director", text: "Director" }]} />
                      </div>
                    </div>
                    <div className="mb-4.5">
                      <Switcher label="Verified" name="status" checked={true}/>
                    </div>
                    <div className="mb-4 5">
                      <FileInput label="Upload Profile Picture" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                  <button type="button" onClick={showModalHandler} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Close</button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                SL
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Full Name
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Role
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Created Date
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {key + 1}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {user.name}
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.role}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${user.status === "Active"
                      ? "bg-success text-success"
                      : user.status === "Banned"
                        ? "bg-danger text-danger"
                        : "bg-warning text-warning"
                      }`}
                  >
                    {user.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.invoiceDate}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <BsEye className="fill-current" size={20} />
                    </button>
                    <button className="hover:text-primary" onClick={() => handleDelete(key)}>
                      <BsTrash className="fill-current" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
