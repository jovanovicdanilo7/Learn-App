import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header/Header";
import Button from "../../components/common/Button/Button";
import avatar from "../../images/avatar.png";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  photo?: string;
}

interface Trainer {
  id: string;
  userId: string;
  specializationId: string;
}

interface Student {
  id: string;
  userId: string;
  address?: string;
}

interface TrainerToStudent {
  trainerId: string;
  studentId: string;
}

function MyAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [students, setStudents] = useState<
    { name: string; status: boolean }[]
  >([]);
  const [specializations, setSpecializations] = useState<
    { id: string; specialization: string }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: user } = await axios.get("http://localhost:8000/user/me", {
          withCredentials: true,
        });
        setUser(user);

        const { data: trainer } = await axios.get(
          `http://localhost:8000/trainers/${user.id}`
        );
        setTrainer(trainer);

        const [specializationsRes, linksRes, studentsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:8000/specializations"),
          axios.get("http://localhost:8000/trainer-to-student"),
          axios.get("http://localhost:8000/students"),
          axios.get("http://localhost:8000/user"),
        ]);

        setSpecializations(specializationsRes.data);
        const links: TrainerToStudent[] = linksRes.data;
        const studentsMap: Student[] = studentsRes.data;
        const users: User[] = usersRes.data;

        const currentTrainerStudents = links
          .filter((link) => link.trainerId === trainer.id)
          .map((link) => {
            const student = studentsMap.find((s) => s.id === link.studentId);
            const studentUser = users.find((u) => u.id === student?.userId);
            return {
              name: `${studentUser?.firstName ?? "Unknown"} ${
                studentUser?.lastName ?? ""
              }`,
              status: studentUser?.isActive ?? false,
            };
          });

        setStudents(currentTrainerStudents);
      } catch (err) {
        console.error("Failed to load account data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header user={user ?? undefined} />

        <main className="flex-grow px-4 pt-4 pb-10 md:px-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">My Account</h1>
        
        <div className="grid md:grid-cols-[1fr_2fr] gap-x-60 items-start">
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6">My profile</h2>

            <div className="flex items-start gap-10 mb-6">
              <img
                src={user?.photo || avatar}
                alt="avatar"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <div className="text-sm text-gray-600 font-semibold">Status</div>
                <div
                  className={`font-medium text-sm flex items-center ${
                    user?.isActive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ✔ {user?.isActive ? "Active" : "Not Active"}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-600">First Name</span>
                <div>{user?.firstName}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Last Name</span>
                <div>{user?.lastName}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">User Name</span>
                <div>{user?.username}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Specialization</span>
                <div>
                    {trainer
                    ? specializations.find((s) => s.id === trainer.specializationId)?.specialization || "-"
                    : "-"}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Email</span>
                <div>{user?.email}</div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <Button variant="primary" onClick={() => navigate("/my-account/edit")}>Edit profile</Button>
              <Button
                variant="text"
                className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                onClick={() => navigate("/my-account/change-password")}
              >
                Change Password
              </Button>
            </div>
          </div>

          <div className="mt-9">
            <h2 className="text-2xl font-semibold mb-6">My Students</h2>

            <div className="overflow-hidden rounded-lg shadow-sm border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4">{s.name}</td>
                      <td className="p-4 font-medium">
                        <span
                          className={s.status ? "text-green-500" : "text-red-500"}
                        >
                          {s.status ? "ACTIVE" : "NOT ACTIVE"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <section className="text-center px-4 pb-20">
        <h2 className="text-3xl font-bold mb-4">My Trainings</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-10">
            The Training Section is interactive, allowing you to engage with trainers and fellow learners,
            participate in quizzes, and track your progress. All our courses are flexible and adaptable
            to your schedule and learning speed.
        </p>
        <Button variant="primary" onClick={() => navigate("/my-account/trainings")}>View trainings</Button>
      </section>

      <Footer />
    </div>
  );
}

export default MyAccount;
