import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [user, setUser] = useState<any>(null);
  const [trainerName, setTrainerName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trainings, setTrainings] = useState<Training[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const isStudent = location.pathname.includes("/my-account-student");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get("http://localhost:8000/user/me", { withCredentials: true });
      setUser(data);
    };
    fetchUser();
  }, []);

  const fetchTrainings = async () => {
    const params: any = {};
    if (isStudent) {
      if (trainerName) params.trainerName = trainerName;
      if (specialization) params.specialization = specialization;
    } else {
      if (trainerName) params.studentName = trainerName; // trainer uses student name
    }

    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const { data } = await axios.get("http://localhost:8000/trainings/search", { params });

    // If student, only show their trainings
    const filtered = isStudent
      ? data.filter((t: Training) => t.studentId === user?.id)
      : data;

    setTrainings(filtered);
  };

  useEffect(() => {
    if (user) fetchTrainings();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header user={user ?? undefined} />

      <main className="flex-grow px-4 pt-10 pb-20 md:px-20 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-center mb-12">Trainings</h1>

        {isStudent && (
          <div className="mb-10">
            <Button
              variant="text"
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={() => navigate("/my-account-student/add-training")}
            >
              Add training
            </Button>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-start mb-10 gap-6">
          <div className="flex flex-col gap-4">
            {isStudent ? (
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">Trainer name</label>
                  <Input
                    type="text"
                    placeholder="First name"
                    value={trainerName}
                    onChange={(e) => setTrainerName(e.target.value)}
                    className="border px-4 py-2 rounded-md bg-gray-100"
                  />
                </div>
              
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">Specialization</label>
                  <Input
                    type="text"
                    placeholder="First name"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="border px-4 py-2 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2">Student name</label>
                <Input
                  type="text"
                  placeholder="Name"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  className="border px-4 py-2 rounded-md bg-gray-100"
                />
              </div>
            )}

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

        <h2 className="text-2xl font-bold mb-4">
          {isStudent ? "My passed trainings" : "Results"}
        </h2>

        <div className="overflow-hidden rounded-lg shadow-sm border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Training Name</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">
                  {isStudent ? "Trainer Name" : "Student Name"}
                </th>
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
                    {(isStudent ? training.trainerName : training.studentName) ?? "Unknown"}
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
