import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";

interface Training {
  id: string;
  name: string;
  date: string;
  duration: number;
  description: string;
  studentId: string;
  trainerId: string;
  type: {
    trainingType: string;
    id: string;
  };

  studentName?: string;
  trainerName?: string;
  specialization?: string;
}


function Trainings() {
  const [user, setUser] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get("http://localhost:8000/user/me", { withCredentials: true });
      setUser(data);
    };
    fetchUser();
  }, []);

  const fetchTrainings = async () => {
    const params: any = {};
    if (studentName) params.studentName = studentName;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const { data } = await axios.get("http://localhost:8000/trainings/search", { params });
    setTrainings(data);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header user={user ?? undefined} />

      <main className="flex-grow px-4 pt-10 pb-20 md:px-20 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-center mb-12">Trainings</h1>

        <div className="flex flex-wrap justify-between items-start mb-10 gap-6">
          <div className="flex flex-col gap-4">
              <div>
              <label className="block text-sm font-semibold mb-2">Student name</label>
              <Input
                  type="text"
                  placeholder="Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="border px-4 py-2 rounded-md bg-gray-100"
              />
              </div>
  
              <div>
              <Button variant="primary" onClick={fetchTrainings}>
                  Search
              </Button>
              </div>
          </div>
  
          <div className="flex gap-6 items-start">
              <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2">From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-purple-600 px-4 py-2 rounded-md"
                />
              </div>
  
              <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2">To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-purple-600 px-4 py-2 rounded-md"
                />
              </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <div className="overflow-hidden rounded-lg shadow-sm border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Training Name</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((training, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-4">{training.date}</td>
                  <td className="p-4 font-semibold">{training.name}</td>
                  <td className="p-4">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {training.type.trainingType}
                    </span>
                  </td>
                  <td className="p-4">
                    {training.studentName
                      ? training.studentName
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                      : "Unknown"}
                  </td>                  
                  <td className="p-4">{training.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Trainings;
