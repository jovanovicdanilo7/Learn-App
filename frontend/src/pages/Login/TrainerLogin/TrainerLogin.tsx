import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../../components/common/Footer/Footer";
import Header from "../../../components/common/Header/Header";

import article1 from "../../../images/article1.png";
import article2 from "../../../images/article2.png";
import article3 from "../../../images/article3.png";
import Button from "../../../components/common/Button/Button";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
}

const articles = [
  {
    title: "Aliqua Irure Tempor Lorem Occaecat Volup",
    tag: "Do consectetur",
    image: article1,
    date: "Dec 24, 2022",
    readTime: "5 mins read",
  },
  {
    title: "Commodo Deserunt Ipsum Occaecat Qui",
    tag: "Consequat labore",
    image: article2,
    date: "Dec 12, 2022",
    readTime: "10 mins read",
  },
  {
    title: "Deserunt Cccaecat Qui Amet Tempor Dolore",
    tag: "Laboris nulla",
    image: article3,
    date: "Nov 20, 2022",
    readTime: "3 mins read",
  },
];

function TrainerLogin() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  axios
    .get("http://localhost:8000/user/me", { withCredentials: true })
    .then((res) => setUser(res.data))
    .catch((err) => console.error("Failed to fetch user:", err));
  }, []);


  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header user={user ?? undefined} />

      <main className="flex-grow px-4 py-10 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Hi, {user?.firstName ?? "John"}!</h1>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Welcome to Learn Platform – where every day is a day to learn. Dive into the vast ocean of knowledge
            and empower yourself with the tools for a successful tomorrow. Happy learning!
          </p>

          <h2 className="text-3xl font-bold mb-2">What's new?</h2>
          <p className="text-gray-600 mb-10">
            Do consectetur proident proident id eiusmod deserunt consequat pariatur ad ex velit do Lorem reprehenderit.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article, idx) => (
              <div key={idx} className="rounded-xl shadow-sm overflow-hidden bg-white text-left">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <p className="text-sm text-purple-600 font-semibold mb-2">{article.tag}</p>
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span>{article.date}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button variant="primary">Read more articles</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TrainerLogin;
