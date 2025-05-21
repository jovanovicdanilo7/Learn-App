import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header/Header";
import people from "../../images/people.png";
import john from "../../images/john.png";
import sara from "../../images/sara.png";
import jack from "../../images/jack.png";

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-white font-montserrat mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          <p className="text-lg text-gray-500">
            Welcome to the 'About Us' section of Learn Platform, where we aim to
            provide you with a deeper understanding of our philosophy, values, and
            mission. Established in 2023, Learn Platform was born out of a passion
            for learning and a belief in the power of knowledge to transform lives.
          </p>

          <div className="my-10">
            <img src={people} alt="People" className="mx-auto" />
          </div>
        </div>

        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div className="mb-8 md:mb-0 md:w-1/3">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Team</h2>
                <p className="text-gray-500">
                  Aliqua ipsum tempor aliqua eiusmod lorem ad labore culpa aliquip
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-8 md:w-2/3">

                <div className="bg-gray-50 rounded-lg text-center p-6">
                  <img src={john} alt="John Doe" className="mx-auto rounded-full border-4 border-white shadow-sm mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
                  <p className="text-sm text-indigo-600">Professional title</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Pariatur ea consectetur anim qui nisi exerci
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg text-center p-6">
                  <img src={sara} alt="Sara Rose" className="mx-auto rounded-full border-4 border-white shadow-sm mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">Sara Rose</h3>
                  <p className="text-sm text-indigo-600">Professional title</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Laborum officia esse cillum mollit eiusmod
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg text-center p-6">
                  <img src={jack} alt="Jack Black" className="mx-auto rounded-full border-4 border-white shadow-sm mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">Jack Black</h3>
                  <p className="text-sm text-indigo-600">Professional title</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Culpa adipisicing aute sunt velit cupidatat qui a
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;
