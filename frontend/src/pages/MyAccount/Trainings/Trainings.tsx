import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "./Trainings.css"

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
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const itemsPerPage = 5;
  const currentTrainings = trainings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(trainings.length / itemsPerPage);

  const location = useLocation();
  const navigate = useNavigate();
  const isStudent = location.pathname.includes("/my-account-student");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get("http://localhost:8000/user/me",
        {
          withCredentials: true
        }
      );
      setUser(data);
    };
    fetchUser();
  }, []);

  const fetchTrainings = async () => {
    const params: any = {};
    if (isStudent) {
      if (name) params.trainerName = name;
      if (specialization) params.specialization = specialization;
    } else {
      if (name) params.studentName = name;
    }

    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const { data } = await axios.get("http://localhost:8000/trainings/search", {
      params,
      withCredentials: true
    });
    console.log("Data from search route: ", data);
    let filtered: Training[] = [];

    if (isStudent) {
      console.log("Current user id: ", user.id);
      const student = await axios.get(`http://localhost:8000/students/${user.id}`, {
        withCredentials: true
      });
      console.log("Student: ", student);
      filtered = data.filter((t: Training) => t.studentId === student.data.id);
    } else {
      const trainer = await axios.get(`http://localhost:8000/trainers/${user.id}`, {
        withCredentials: true
      });
      filtered = data.filter((t: Training) => t.trainerId === trainer.data.id);
    }
    console.log("Filtered data: ", filtered);
    const enriched = await Promise.all(
      filtered.map(async (training) => {
        try {
          if (isStudent) {
            console.log("Current trainings trainer id: ", training.trainerId);
            const trainer = await axios.get(`http://localhost:8000/trainers/id/${training.trainerId}`, {
              withCredentials: true
            });
            console.log("Trainer: ", trainer);
            const trainerUser = await axios.get(`http://localhost:8000/user/${trainer.data.userId}`, {
              withCredentials: true
            });
            console.log("User trainer: ", trainerUser);
            return {
              ...training,
              trainerName: `${trainerUser.data.firstName} ${trainerUser.data.lastName}`,
            };
          } else {
            const student = await axios.get(`http://localhost:8000/students/id/${training.studentId}`, {
              withCredentials: true
            });

            const studentUser = await axios.get(`http://localhost:8000/user/${student.data.userId}`, {
              withCredentials: true
            });

            return {
              ...training,
              studentName: `${studentUser.data.firstName} ${studentUser.data.lastName}`,
            };
          }
        } catch (err) {
          console.error("Failed to enrich training:", err);
          return training;
        }
      })
    );

    setTrainings(enriched);
  };

  useEffect(() => {
    if (user) fetchTrainings();
  }, [user]);

  useEffect(() => {
    if (!name && !specialization && !dateFrom && !dateTo && user) {
      fetchTrainings();
    }
  }, [name, specialization, dateFrom, dateTo, user]);

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header />

      <main className="flex-grow px-4 pt-10 pb-20 md:px-20 max-w-7xl mx-auto w-full">
        <div className="mb-4 text-left">
          <Button
            variant="text"
            className="text-purple-600 hover:underline px-0 py-0"
            onClick={() => navigate(isStudent ? "/my-account-student" : "/my-account-trainer")}
          >
            My Account
          </Button>
          <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-400"/>
          <span className="text-gray-600 text-sm font-medium">Trainings</span>
        </div>

        <h1 className="text-4xl font-bold text-center mb-12">Trainings</h1>

        {isStudent && (
          <div className="mb-10">
            <Button
              variant="text"
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={() => navigate("/my-account-student/trainings/add-training")}
            >
              Add training
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-6 mb-10">
          {isStudent ? (
            <>
              <div className="flex-1 min-w-[200px] flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Trainer name</label>
                  <Input
                    type="text"
                    placeholder="First name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-4 py-2 rounded-md bg-gray-100"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={fetchTrainings}
                  className="bg-purple-600 text-white px-4 py-2 self-start"
                >
                  Search
                </Button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold mb-2">Specialization</label>
                <Input
                  type="text"
                  placeholder="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full border px-4 py-2 rounded-md bg-gray-100"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 min-w-[200px] flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Student name</label>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-4 py-2 rounded-md bg-gray-100"
                />
              </div>
              <Button variant="primary" onClick={fetchTrainings} className="bg-purple-600 text-white px-4 py-2 self-start">
                Search
              </Button>
            </div>
          )}

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">From</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => {
                setStartDate(date);
                setDateFrom(date?.toISOString().split("T")[0] || "");
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
              className="w-full border border-purple-600 px-4 py-2 rounded-md bg-white"
              calendarClassName="custom-calendar"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">To</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => {
                setEndDate(date);
                setDateTo(date?.toISOString().split("T")[0] || "");
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
              className="w-full border border-purple-600 px-4 py-2 rounded-md bg-white"
              calendarClassName="custom-calendar"
            />
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
              {currentTrainings.map((training, idx) => (
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
                  <td className="p-4">{training.duration}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {trainings.length > 0 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-purple-600 hover:text-white"
            >
              <FontAwesomeIcon icon={faAngleLeft}/>
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`cursor-pointer px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-purple-600 hover:text-white"
            >
              <FontAwesomeIcon icon={faAngleRight}/>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Trainings;
