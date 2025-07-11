import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header/Header";
import Button from "../../components/common/Button/Button";
import avatar from "../../images/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
  dateOfBirth?: string;
}

interface TrainerToStudent {
  trainerId: string;
  studentId: string;
}

interface Specialization {
  id: string;
  specialization: string;
}

function MyAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [students, setStudents] = useState<{ name: string; status: boolean }[]>([]);
  const [trainers, setTrainersList] = useState<{ name: string; specialization: string }[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isStudentAccount = location.pathname.includes("/my-account-student");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/user/me",
          {
            withCredentials: true,
          }
        );
        setUser(userData);

        const [trainerRes, studentRes] = await Promise.allSettled([
          axios.get(`https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/trainers/${userData.id}`,
            {
              withCredentials: true
            }
          ),
          axios.get(`https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/students/${userData.id}`,
            {
              withCredentials: true
            }
          ),
        ]);

        if (trainerRes.status === "fulfilled") {
          const trainerData = trainerRes.value.data;
          setTrainer(trainerData);

          const [specializationsRes, linksRes, studentsRes, usersRes] = await Promise.all([
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/specializations"),
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/trainer-to-student",
              {
                withCredentials: true
              }
            ),
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/students",
              {
                withCredentials: true
              }
            ),
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/user",
              {
                withCredentials: true
              }
            ),
          ]);
          setSpecializations(specializationsRes.data);

          const links: TrainerToStudent[] = linksRes.data;
          const studentsMap: Student[] = studentsRes.data;
          const users: User[] = usersRes.data;

          const currentTrainerStudents = links
            .filter((link) => link.trainerId === trainerData.id)
            .map((link) => {
              const student = studentsMap.find((s) => s.id === link.studentId);
              const studentUser = users.find((u) => u.id === student?.userId);

              return {
                name: `${studentUser?.firstName ?? "Unknown"} ${studentUser?.lastName ?? ""}`,
                status: studentUser?.isActive ?? false,
              };
            });

          setStudents(currentTrainerStudents);
        }

        if (studentRes.status === "fulfilled") {
          const studentData = studentRes.value.data;
          setStudent(studentData);

          const [linksRes, trainersRes, specsRes, usersRes] = await Promise.all([
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/trainer-to-student",
              {
                withCredentials: true
              }
            ),
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/trainers",
              {
                withCredentials: true
              }
            ),
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/specializations"),
            axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/user",
              {
                withCredentials: true
              }
            ),
          ]);

          const links: TrainerToStudent[] = linksRes.data;
          const allTrainers: Trainer[] = trainersRes.data;
          const allSpecs = specsRes.data;
          const allUsers: User[] = usersRes.data;

          const relatedTrainers = links
            .filter((l) => l.studentId === studentData.id)
            .map((link) => {
              const trainer = allTrainers.find((t) => t.id === link.trainerId);
              const trainerUser = allUsers.find((u) => u.id === trainer?.userId);
              const specName = allSpecs.find((s: any) => s.id === trainer?.specializationId)?.specialization ?? "-";

              return {
                name: `${trainerUser?.firstName ?? "Unknown"} ${trainerUser?.lastName ?? ""}`,
                specialization: specName,
              };
            });

          setTrainersList(relatedTrainers);
        }
      } catch (err) {
        console.error("Failed to load account data", err);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async () => {
    try {
      await axios.delete("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/user/me",
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (err) {
      console.error("Failed to delete profile", err);
      alert("Something went wrong while deleting your profile.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header/>

      <main className="flex-grow px-4 pt-4 pb-10 md:px-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">My Account</h1>

        <div className="relative grid md:grid-cols-[1fr_2fr] gap-x-60 items-start">
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
                <div className={`font-medium text-sm flex items-center ${user?.isActive ? "text-green-500" : "text-red-500"}`}>
                  <FontAwesomeIcon icon={faCheck} size="1x"/> {user?.isActive ? "Active" : "Not Active"}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div><span className="font-semibold text-gray-600">First Name</span><div>{user?.firstName}</div></div>
              <div><span className="font-semibold text-gray-600">Last Name</span><div>{user?.lastName}</div></div>
              <div><span className="font-semibold text-gray-600">User Name</span><div>{user?.username}</div></div>
              {isStudentAccount ? (
                <>
                  <div>
                    <span className="font-semibold text-gray-600">Date of Birth</span>
                    <div>{student?.dateOfBirth?.trim() ? student.dateOfBirth : "-"}</div>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-600">Address</span>
                    <div>{student?.address?.trim() ? student.address : "-"}</div>
                  </div>
                </>
              ) : (
                <div>
                  <span className="font-semibold text-gray-600">Specialization</span>
                  <div>{trainer ? specializations.find((s) => s.id === trainer.specializationId)?.specialization || "-" : "-"}</div>
                </div>
              )}
              <div><span className="font-semibold text-gray-600">Email</span><div>{user?.email}</div></div>
            </div>

            <div className="flex gap-4 mt-10">
              <Button
                variant="primary"
                onClick={() => {
                  isStudentAccount ?
                  navigate("/my-account-student/edit") :
                  navigate("/my-account-trainer/edit")
                }}>
                Edit profile
              </Button>
              <Button
                variant="text"
                className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                onClick={() => {
                  isStudentAccount ?
                  navigate("/my-account-student/change-password") :
                  navigate("/my-account-trainer/change-password")
                }}>
                Change Password
              </Button>
            </div>
          </div>

          <div className="mt-9">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {isStudentAccount ? "My Trainers" : "My Students"}
              </h2>
              {isStudentAccount && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/my-account-student/add-trainer")}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  Add trainer
                </Button>
              )}
            </div>

            <div className="overflow-hidden rounded-lg shadow-sm border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">
                      {isStudentAccount ? "Specialization" : "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(isStudentAccount ? trainers : students).map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4 font-semibold">{entry.name}</td>
                      <td className="p-4 font-medium">
                        {"specialization" in entry ? (
                          entry.specialization ?? "-"
                        ) : (
                          <span className={entry.status ? "text-green-500" : "text-red-500"}>
                            {entry.status ? "ACTIVE" : "NOT ACTIVE"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isStudentAccount && (
            <div className="mt-10 md:absolute md:bottom-0 md:right-0 md:pr-4 md:pb-4">
              <Button
                variant="text"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete profile
              </Button>
            </div>
          )}
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Profile Deletion Confirmation</h2>
            <p className="text-sm text-gray-700 mb-4">
              We're truly sorry to see you go. Before you proceed with deleting your profile,
              we want you to know that this action is permanent and irreversible. You'll lose access
              to all your account information, course progress, certificates, and any learning communities you're a part of.
            </p>
            <p className="text-sm text-gray-700 mb-4">
              If there's anything we can do to improve your experience or if you need assistance,
              please reach out to our support team. We're always here to help.
            </p>
            <p className="text-sm text-gray-700 mb-6">
              If you still wish to delete your account, please click on the 'Confirm' button below.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-black font-medium"
              >
                Cancel
              </Button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="text-center px-4 pb-20">
        <h2 className="text-3xl font-bold mb-4">My Trainings</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-10">
            The Training Section is interactive, allowing you to engage with trainers and fellow learners,
            participate in quizzes, and track your progress. All our courses are flexible and adaptable
            to your schedule and learning speed.
        </p>
        <Button
          variant="primary"
          onClick={() => {
            isStudentAccount ?
            navigate("/my-account-student/trainings") :
            navigate("/my-account-trainer/trainings")
          }}>
          View trainings
        </Button>
      </section>

      <Footer />
    </div>
  );
}

export default MyAccount;
