import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Button from "../../../components/common/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface Trainer {
  id: string;
  userId: string;
  specializationId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  photo?: string;
}

interface Specialization {
  id: string;
  specialization: string;
}

interface TrainerToStudent {
  trainerId: string;
  studentId: string;
}

function AddTrainer() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [trainerUsers, setTrainerUsers] = useState<User[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [trainerLinks, setTrainerLinks] = useState<TrainerToStudent[]>([]);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState<Set<string>>(new Set());

  const location = useLocation();
  const navigate = useNavigate();
  const isStudent = location.pathname.includes("/my-account-student");

  useEffect(() => {
    const fetchData = async () => {
      const { data: me } = await axios.get("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/user/me",
        {
          withCredentials: true,
        }
      );
      const [studentRes, trainersRes, usersRes, specsRes, linksRes] = await Promise.all([
        axios.get(`https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/students/${me.id}`,
          {
            withCredentials: true
          }
        ),
        axios.get("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/trainers",
          {
            withCredentials: true
          }
        ),
        axios.get("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/user",
          {
            withCredentials: true
          }
        ),
        axios.get("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/specializations"),
        axios.get("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/trainer-to-student",
          {
            withCredentials: true
          }
        ),
      ]);

      setStudentId(studentRes.data.id);
      setTrainers(trainersRes.data);
      setTrainerUsers(usersRes.data);
      setSpecializations(specsRes.data);
      setTrainerLinks(linksRes.data);
    };

    fetchData();
  }, []);

  const alreadyAddedTrainerIds = trainerLinks
    .filter((link) => link.studentId === studentId)
    .map((link) => link.trainerId);

  const toggleSelect = (trainerId: string) => {
    setSelectedTrainerIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(trainerId) ? newSet.delete(trainerId) : newSet.add(trainerId);
      return newSet;
    });
  };

  const handleAdd = async () => {
    try {
      const newLinks = Array.from(selectedTrainerIds).filter(
        (id) => !alreadyAddedTrainerIds.includes(id)
      );

      await Promise.all(
        newLinks.map((trainerId) =>
          axios.post("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/trainer-to-student",
            {
              trainerId,
              studentId,
            },
            {
              withCredentials: true
            }
          )
        )
      );

      navigate("/my-account-student");
    } catch (err) {
      console.error("Failed to add trainers", err);
    }
  };

  const getTrainerName = (userId: string) => {
    const u = trainerUsers.find((u) => u.id === userId);
    return u ? `${u.firstName} ${u.lastName}` : "Unknown";
  };

  const getSpecialization = (id: string) =>
    specializations.find((s) => s.id === id)?.specialization ?? "-";

  return (
    <div className="font-montserrat min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-4 text-left">
          <Button
            variant="text"
            className="text-purple-600 hover:underline px-0 py-0"
            onClick={() => navigate(isStudent ? "/my-account-student" : "/my-account-trainer")}
          >
            My Account
          </Button>
          <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-400"/>
          <span className="text-gray-600 text-sm font-medium">Add Trainer</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">Add trainer</h1>
        <p className="text-sm text-gray-600 mb-10">
          Please select trainers for adding them into your trainers list
          <br />
          <span className="text-xs text-gray-500">
            * - There is no possibility to remove the trainer.
          </span>
        </p>

        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Trainers</h2>
            <div className="overflow-hidden rounded-lg shadow-sm border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                  <th className="p-4"></th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers
                  .filter((trainer) => !alreadyAddedTrainerIds.includes(trainer.id))
                  .map((trainer) => (
                    <tr key={trainer.id} className="border-t">
                    <td className="p-4">
                        <input
                        type="checkbox"
                        checked={selectedTrainerIds.has(trainer.id)}
                        onChange={() => toggleSelect(trainer.id)}
                        />
                    </td>
                    <td className="p-4 font-semibold">{getTrainerName(trainer.userId)}</td>
                    <td className="p-4">{getSpecialization(trainer.specializationId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button className="bg-purple-600 text-white hover:bg-purple-700 mt-5" onClick={handleAdd}>
              Add
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">My Trainers</h2>
            <div className="overflow-hidden rounded-lg shadow-sm border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers
                    .filter((t) => alreadyAddedTrainerIds.includes(t.id))
                    .map((trainer) => (
                      <tr key={trainer.id} className="border-t">
                        <td className="p-4 font-semibold">{getTrainerName(trainer.userId)}</td>
                        <td className="p-4">{getSpecialization(trainer.specializationId)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddTrainer;
