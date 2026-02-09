// pages/history.js
import { useEffect, useState } from "react";
import {
  RiChat1Fill,
  RiUser2Fill,
  RiTimeFill,
  RiPencilFill,
  RiPhoneFill,
  RiMailFill,
} from "react-icons/ri";
import { FaDotCircle } from "react-icons/fa";
import { getQueriesByTypeAndNumberOrEmail } from "@/services/QueryService";
import QueryDetailView from "@/components/QueryDetailView";
import moment from "moment";
import { Query } from "@/types/Query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogDescription,
} from "@/components/ui/dialog";

interface HistoryProps {
  params?: Record<string, unknown>;
  type: string;
  numberOrEmail: string;
}

export default function History({ type, numberOrEmail }: HistoryProps) {
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [histories, setHistories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const openModal = (query: Query) => {
    setSelectedQuery(query);
    setOpen(true);
  };

  useEffect(() => {
    numberOrEmail &&
      getQueriesByTypeAndNumberOrEmail(type, numberOrEmail).then((response) => {
        setHistories(response.data);
      });
  }, [type, numberOrEmail]);

  const getPriorityIndicator = (priority: string) => {
    const baseClasses = "w-3 h-3 rounded-full p-1 text-white text-xs";
    switch (priority) {
      case "HIGH":
        return `${baseClasses} bg-red-500`;
      case "MEDIUM":
        return `${baseClasses} bg-orange-400`;
      case "LOW":
        return `${baseClasses} bg-gray-400`;
      default:
        return `${baseClasses} bg-gray-400`;
    }
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="mx-auto max-w-full">
        <p className="mb-8 text-gray-600">Recent customer interactions</p>
        {numberOrEmail && histories.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

            {histories.map((enquiry, index) => (
              <div key={index} className="group relative pb-8 pl-8">
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 bg-white transition-colors group-hover:bg-blue-50">
                  <span className="text-sm">
                    <FaDotCircle color=" green" />
                  </span>
                </div>

                {/* Card */}
                <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {enquiry.query}{" "}
                      </p>
                      <p className="mt-2 flex items-center text-xs text-gray-600">
                        <RiUser2Fill color="green" className="mr-1" />{" "}
                        {enquiry.name}{" "}
                      </p>
                      <p className="text-xs text-gray-600">
                        <RiPencilFill color="red" className="ml-2 mr-2" />
                        <b>Handle By : </b> {enquiry.assigned_to?.first_name}{" "}
                        {enquiry.assigned_to?.last_name}
                        <b className="ml-2 mr-2"> Via : </b>{" "}
                        {enquiry.type == "CALL" ? (
                          <RiPhoneFill color="blue" size={18} />
                        ) : (
                          <RiMailFill color="blue" size={18} />
                        )}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        enquiry.status?.name === "Completed"
                          ? "bg-green-100 text-green-800"
                          : enquiry.status?.name === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {enquiry.status?.name}
                    </span>
                  </div>

                  <p className="mt-2 text-justify text-xs text-gray-700">
                    {enquiry.remarks ? (
                      enquiry.remarks
                    ) : (
                      <span className="text-gray-400">No remarks</span>
                    )}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span className='items-center" flex'>
                      <RiTimeFill className="mr-1" />{" "}
                      {moment(enquiry.date).fromNow()} • {enquiry.end_time}
                    </span>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openModal(enquiry)}
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No interactions found for this {type}.
          </p>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogOverlay className="bg-black/50" />
          <DialogContent className="w-full max-w-[90vw] rounded-lg bg-background shadow-xl sm:max-w-4xl">
            <DialogHeader className="sticky top-0 z-10 border-b bg-background pb-4">
              <DialogTitle>Query Details</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto px-6 py-2">
              {selectedQuery && <QueryDetailView query={selectedQuery} />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
