import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Input from "../../../components/common/Input/Input";
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

interface TrainingType {
  id: string;
  trainingType: string;
}

function AddTraining() {
  const [user, setUser] = useState<User | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [trainerUsers, setTrainerUsers] = useState<User[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [types, setTypes] = useState<TrainingType[]>([]);
  const [filteredTrainerIds, setFilteredTrainerIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    duration: '',
    type: '',
    description: '',
    trainerId: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: me }, { data: allTrainers }, { data: users }, { data: specs }, { data: types }] = await Promise.all([
        axios.get("http://localhost:8000/user/me", { withCredentials: true }),
        axios.get("http://localhost:8000/trainers"),
        axios.get("http://localhost:8000/user"),
        axios.get("http://localhost:8000/specializations"),
        axios.get("http://localhost:8000/training-types")
      ]);

      setUser(me);
      setTrainers(allTrainers);
      setTrainerUsers(users);
      setSpecializations(specs);
      setTypes(types);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const matching = trainerUsers
      .filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(lower))
      .map((u) => trainers.find((t) => t.userId === u.id)?.id)
      .filter(Boolean) as string[];

    setFilteredTrainerIds(matching);
  }, [searchTerm, trainerUsers, trainers]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user || !formData.trainerId) return;

    const selectedTrainer = trainers.find((t) => t.id === formData.trainerId);
    const selectedType = types.find((t) => t.id === formData.type);

    const payload = {
      studentId: user.id,
      trainerId: selectedTrainer?.id,
      name: formData.name,
      type: selectedType,
      date: formData.date,
      duration: parseInt(formData.duration, 10),
      description: formData.description,
    };

    try {
      await axios.post("http://localhost:8000/trainings", payload, { withCredentials: true });
      navigate("/my-account-student/trainings");
    } catch (err) {
      console.error("Failed to add training", err);
    }
  };

  const getTrainerName = (userId: string) => {
    const u = trainerUsers.find((u) => u.id === userId);
    return u ? `${u.firstName} ${u.lastName}` : "Unknown";
  };

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header user={user ?? undefined} />

      <main className="flex-grow px-4 pt-12 pb-20 md:px-20 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-center mb-12">Add passed training</h1>

        <div className="grid md:grid-cols-2 gap-20">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block font-semibold text-sm mb-1">Name</label>
              <Input
                placeholder="Enter item name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">Training start date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">Duration (in days)</label>
              <Input
                type="number"
                placeholder="Enter duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full border px-4 py-2 rounded-md bg-gray-100"
              >
                <option value="">Please select</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.trainingType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">Description</label>
              <textarea
                placeholder="Enter item description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full border px-4 py-2 rounded-md bg-gray-100 h-28 resize-none"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <Button variant="text" className="text-gray-500" onClick={() => navigate("/my-account-student/trainings")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add</Button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-sm mb-2">Add trainers</label>
            <Input
              placeholder="Search trainer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="mt-4 bg-white rounded-md border">
              {trainers
                .filter((t) => filteredTrainerIds.includes(t.id))
                .map((t) => (
                  <div key={t.id} className="px-4 py-2 flex items-center gap-2 border-t">
                    <input
                      type="radio"
                      name="trainer"
                      value={t.id}
                      checked={formData.trainerId === t.id}
                      onChange={(e) => handleChange("trainerId", e.target.value)}
                    />
                    <label>{getTrainerName(t.userId)}</label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddTraining;
