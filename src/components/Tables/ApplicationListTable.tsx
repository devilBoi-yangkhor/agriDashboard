"use client";
import { useState } from "react";
import { BsTrash, BsPencil } from "react-icons/bs"; // Removed BsEye
import Swal from "sweetalert2";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";
import Switcher from "../Inputs/Switcher";
import FileInput from "../Inputs/FileInput";
import { Formik, Form, FormikState } from "formik";

function ApplicationListTable() {
  const [applicationsList, setApplicationsList] = useState([
    {
      cid: "12345",
      name: "Equipment 1",
      address: "Thimphu, Bhutan",
      contactNumber: "123456789",
      email: "email@example.com",
      typeEquipment: "Medical Instrument",
      manufacturer: "XYZ Corp",
      model: "Model123",
      range: "100-500",
      quantity: "10",
      rateAmount: "500",
      moreDetails: "Details about the equipment",
      specificDocument: "document.pdf",
    },
    {
      cid: "12346",
      name: "Equipment 2",
      address: "Paro, Bhutan",
      contactNumber: "987654321",
      email: "email2@example.com",
      typeEquipment: "Technical Instrument",
      manufacturer: "ABC Ltd",
      model: "Model456",
      range: "200-1000",
      quantity: "5",
      rateAmount: "300",
      moreDetails: "Details about the equipment",
      specificDocument: "document2.pdf",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingData, setCurrentEditingData] = useState<any>(null);

  const handleDelete = (index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCloseButton: true,
      showConfirmButton: true,
      width: 450,
    }).then((result) => {
      const newList = [...applicationsList];
      newList.splice(index, 1);
      setApplicationsList(newList);
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleEdit = (index: number) => {
    const applicationToEdit = applicationsList[index];
    setCurrentEditingData(applicationToEdit);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setCurrentEditingData(null);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedList = applicationsList.map((application, index) => index === applicationsList.findIndex(app => app.cid === currentEditingData.cid) ? currentEditingData : application
    );
    setApplicationsList(updatedList);
    handleModalClose();
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex max-w-full justify-between items-center mb-5">
        <h1 className="dark:text-white">Application List</h1>
      </div>

      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[30px] px-4 py-4 font-medium text-black dark:text-white">SL</th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">CID</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Name</th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">Address</th>
              <th className="min-w-[050px] px-4 py-4 font-medium text-black dark:text-white">Contact Number</th>
              <th className="min-w-[110px] px-4 py-4 font-medium text-black dark:text-white">Email ID</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationsList.map((application, key) => (
              <tr key={key}>
                <td className="border-b border-[#fff] px-4 py-5 dark:border-strokedark text-black dark:text-white">{key + 1}</td>
                <td className="border-b border-[#fff] px-4 py-5 dark:border-strokedark text-black dark:text-white">{application.cid}</td>
                <td className="border-b border-[#fff] px-4 py-5 dark:border-strokedark text-black dark:text-white">{application.name}</td>
                <td className="border-b border-[#fff] px-4 py-5 dark:border-strokedark text-black dark:text-white">{application.address}</td>
                <td className="border-b border-[#fff] px-4 py-5 dark:border-strokedark text-black dark:text-white">{application.contactNumber}</td>
                <td className="border-b border-[#fff] px-4 py-5 dark:border-strokedark text-black dark:text-white">{application.email}</td>
                <td className="border-b border-[#fff] px-4 py-5 dark:border-strokedark text-black dark:text-white">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary" onClick={() => handleDelete(key)}>
                      <BsTrash className="fill-current" size={18} />
                    </button>
                    <button className="hover:text-primary" onClick={() => handleEdit(key)}>
                      <BsPencil className="fill-current" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (

        <div className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100`}>
          <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
            {/* <Formik> */}
              <form onSubmit={handleFormSubmit} className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Application
                  </h3>
                  <button type="button" onClick={handleModalClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
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
                        <Input label={"CID"} type={"text"} name="cid" value={currentEditingData?.cid} />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <Input label={"Full Name"} type={"text"} name="name" value={currentEditingData?.name} />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input label={"Address"} type={"text"} name="address" value={currentEditingData?.address} />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input label={"Contact Number"} type={"number"} name="contact_no" value={currentEditingData?.contactNumber} />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input label={"Email Address"} type={"email"} name="email" value={currentEditingData?.email} />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Select
                        onValueChange={()=>{}}
                         label="Select Type Equipment/Instrument" name="equipment" options={[{ value: "", text: "Select Type Equipment/Instrument" }, { value: "Machine", text: "Machine" }, { value: "Gadget", text: "Gadget" }]} />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input label={"Manufacturer/Type/Brand"} type={"text"} name="manufacturer" value={currentEditingData?.manufacturer} />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input label={"Model/Seriel Number,Range"} type={"text"} name="model" value={currentEditingData?.range} />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input label={"Quantity Of Equipment"} type={"text"} name="quantity" value={currentEditingData?.quantity} />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input label={"Rate/Amount"} type={"number"} name="amount" value={currentEditingData?.rateAmount} />
                      </div>
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                      Addtional Information
                    </h3>
                    <hr className="text-sm font-semibold text-gray-900 dark:text-white" />
                    <div className="mb-4 5">
                      <FileInput label="Optional Document" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-black rounded-md"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Save Changes
                  </button>
                </div>
              </form>
            {/* </Formik> */}
          </div>
        </div>
      )}

    </div>
  );
}

export default ApplicationListTable;
