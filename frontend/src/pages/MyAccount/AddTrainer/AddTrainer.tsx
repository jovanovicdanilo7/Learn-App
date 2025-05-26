import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Button from "../../../components/common/Button/Button";

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
  const [user, setUser] = useState<User | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [trainerUsers, setTrainerUsers] = useState<User[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [trainerLinks, setTrainerLinks] = useState<TrainerToStudent[]>([]);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: me } = await axios.get("http://localhost:8000/user/me", {
        withCredentials: true,
      });
      setUser(me);

      const [studentRes, trainersRes, usersRes, specsRes, linksRes] = await Promise.all([
        axios.get(`http://localhost:8000/students/${me.id}`),
        axios.get("http://localhost:8000/trainers"),
        axios.get("http://localhost:8000/user"),
        axios.get("http://localhost:8000/specializations"),
        axios.get("http://localhost:8000/trainer-to-student"),
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
          axios.post("http://localhost:8000/trainer-to-student", {
            trainerId,
            studentId,
          })
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
      <Header user={user ?? undefined} />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
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
                    ))}
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
