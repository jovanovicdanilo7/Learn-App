import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Input from "../../../components/common/Input/Input";
import Button from "../../../components/common/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Calendar.css"

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
  const [types, setTypes] = useState<TrainingType[]>([]);
  const [filteredTrainerIds, setFilteredTrainerIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    duration: '',
    type: '',
    description: '',
    trainerId: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isStudent = location.pathname.includes("/my-account-student");

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: me }, { data: allTrainers }, { data: users }, { data: types }] = await Promise.all([
        axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/user/me", { withCredentials: true }),
        axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/trainers", { withCredentials: true }),
        axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/user", { withCredentials: true }),
        axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/training-types", { withCredentials: true })
      ]);

      setUser(me);
      setTrainers(allTrainers);
      setTrainerUsers(users);
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
    const student = await axios.get(`https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/students/${user.id}`,
      {
        withCredentials: true
      }
    );

    const selectedTrainer = trainers.find((t) => t.id === formData.trainerId);
    const selectedType = types.find((t) => t.id === formData.type);

    const payload = {
      studentId: student.data.id,
      trainerId: selectedTrainer?.id,
      name: formData.name,
      type: selectedType,
      date: formData.date,
      duration: parseInt(formData.duration, 10),
      description: formData.description,
    };

    try {
      await axios.post("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/trainings", payload,
        {
          withCredentials: true
        }
      );

      navigate("/my-account-student/trainings",
        {
          state: { showToast: true },
        }
      );
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
      <Header />

      <main className="flex-grow px-4 pt-12 pb-20 md:px-20 max-w-7xl mx-auto w-full">
        <div className="mb-4 text-left">
          <Button
            variant="text"
            className="text-purple-600 hover:underline px-0 py-0"
            onClick={() => navigate(isStudent ? "/my-account-student" : "/my-account-trainer")}
          >
            My Account
          </Button>
          <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-400"/>
          <Button
            variant="text"
            className="text-purple-600 hover:underline px-0 py-0"
            onClick={() => navigate("/my-account-student/trainings")}
          >
            Trainings
          </Button>
          <FontAwesomeIcon icon={faAngleRight} className="mx-2 text-gray-400"/>
          <span className="text-gray-600 text-sm font-medium">Add Training</span>
        </div>
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
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  handleChange('date', date?.toISOString().split("T")[0] || "");
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className="bg-gray-100 w-full px-4 py-2 rounded-md pr-10 outline-none border transition"
                calendarClassName="custom-calendar"
              />
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">Duration (in days)</label>
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="Enter duration"
                value={formData.duration}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange('duration', value);
                  }
                }}
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
