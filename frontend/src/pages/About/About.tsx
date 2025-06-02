import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header/Header";
import people from "../../images/people.png";
import john from "../../images/john.png";
import sara from "../../images/sara.png";
import jack from "../../images/jack.png";
import WelcomeMessage from "../../components/common/WelcomeMessage/WelcomeMessage";
import TestimonialCard from "../../components/common/TestimonialCard/TestimonialCard";

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-white font-montserrat mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <WelcomeMessage
            title="About Us"
            description="Welcome to the 'About Us' section of Learn Platform, where we aim to
            provide you with a deeper understanding of our philosophy, values, and
            mission. Established in 2023, Learn Platform was born out of a passion
            for learning and a belief in the power of knowledge to transform lives."
          />

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
                <TestimonialCard
                  image={john}
                  name="John Doe"
                  title="Professional title"
                  description="Pariatur ea consectetur anim qui nisi exerci"
                />
                <TestimonialCard
                  image={sara}
                  name="Sara Rose"
                  title="Professional title"
                  description="Laborum officia esse cillum mollit eiusmod"
                />
                <TestimonialCard
                  image={jack}
                  name="Jack Black"
                  title="Professional title"
                  description="Culpa adipisicing aute sunt velit cupidatat qui a"
                />
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
